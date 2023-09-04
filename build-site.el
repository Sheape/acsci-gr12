;; Set the package installation directory so that packages aren't stored in the
;; ~/.emacs.d/elpa path.
(message "%s" (emacs-version))
(require 'package)
(setq package-user-dir (expand-file-name "./.packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))

;; Initialize the package system
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

;; Install dependencies
(package-install 'htmlize)
(package-install 'org-roam)
(package-install 's)
(package-install 'dash)

;; Load the publishing system
(require 'ox-publish)
(require 'ox-html)
(require 'org)
(require 'org-roam)
(require 'org-roam-export)
(require 's)
(require 'dash)

(setq root-project-directory (locate-dominating-file default-directory ".dir-locals.el"))
(setq org-roam-directory (expand-file-name "./content" root-project-directory))
(setq org-roam-db-location (expand-file-name "./org-roam.db" root-project-directory))
;; (setq stylesheet-location (expand-file-name "./content/styles.css" root-project-directory))

(org-roam-db-clear-all)
(org-roam-db-sync)
(org-roam-update-org-id-locations)

;; (setq org-html-use-infojs 2)
;; (setq org-html-infojs-options '((path . "./content/js/org-info.js")
;;                                 (view . "showall")
;;                                 (toc . :with-toc)
;;                                 ))

;; Customize the HTML output
(setq org-use-sub-superscripts nil
      org-export-with-sub-superscripts nil
      org-html-validation-link nil            ;; Don't show validation link
      org-html-head-include-scripts nil       ;; Use our own scripts
      org-html-head-include-default-style nil ;; Use our own styles
      org-html-head
      (concat "<link rel=\"stylesheet\" type=\"text/css\" href=\"/styles/htmlize.css\"/>
<link rel=\"stylesheet\" type=\"text/css\" href=\"/styles/readtheorg.css\"/>
<link rel=\"stylesheet\" type=\"text/css\" href=\"/styles/index.css" "\"/>
<script type=\"text/javascript\" src=\"/js/jquery.min.js\"></script>
<script type=\"text/javascript\" src=\"/js/jquery.stickytableheaders.min.js\"></script>
<script type=\"text/javascript\" src=\"/js/bootstrap.min.js\"></script>
<script type=\"text/javascript\" src=\"/js/readtheorg.js\"></script>"
))

(defun hurricane//collect-backlinks-string (backend)
  (goto-char (point-max))
  (insert "\n\n* References\n:PROPERTIES:\n:HTML_CONTAINER_CLASS: references\n:END:\n")
  (when (org-roam-node-at-point)
    (let* ((source-node (org-roam-node-at-point))
           (source-file (org-roam-node-file source-node))
           (nodes-in-file (--filter (s-equals? (org-roam-node-file it) source-file)
                                    (org-roam-node-list)))
           (nodes-start-position (-map 'org-roam-node-point nodes-in-file))
           ;; Nodes don't store the last position, so get the next headline position
           ;; and subtract one character (or, if no next headline, get point-max)
           (nodes-end-position (-map (lambda (nodes-start-position)
                                       (goto-char nodes-start-position)
                                       (if (org-before-first-heading-p) ;; file node
                                           (point-max)
                                         (call-interactively
                                          'org-forward-heading-same-level)
                                         (if (> (point) nodes-start-position)
                                             (- (point) 1) ;; successfully found next
                                           (point-max)))) ;; there was no next
                                     nodes-start-position))
           ;; sort in order of decreasing end position
           (nodes-in-file-sorted (->> (-zip-pair nodes-in-file nodes-end-position)
                                      (--sort (> (cdr it) (cdr other))))))
      (dolist (node-and-end nodes-in-file-sorted)
        (-when-let* (((node . end-position) node-and-end)
                     (backlinks (--filter (->> (org-roam-backlink-source-node it)
                                               (org-roam-node-file)
                                               (s-contains? "private/") (not))
                                          (org-roam-backlinks-get node))))
          (goto-char (point-max))
          (dolist (backlink backlinks)
            (let* ((source-node (org-roam-backlink-source-node backlink))
                   (source-file (org-roam-node-file source-node))
                   (properties (org-roam-backlink-properties backlink))
                   (outline (when-let ((outline (plist-get properties :outline)))
                              (when (> (length outline) 1)
                                (mapconcat #'org-link-display-format outline " > "))))
                   (point (org-roam-backlink-point backlink))
                   (text (s-replace "\n" " " (org-roam-preview-get-contents
                                              source-file
                                              point)))
                   (reference (format "%s [[id:%s][%s]]\n%s\n\n"
                                      (s-repeat (+ (org-roam-node-level node) 2) "*")
                                      (org-roam-node-id source-node)
                                      (org-roam-node-title source-node)
                                      (if outline (format "%s (/%s/)"
                                                          (s-repeat (+ (org-roam-node-level node) 3) "*") outline) "")))
                   (label-list (with-temp-buffer
                                 (insert text)
                                 (org-element-map (org-element-parse-buffer) 'footnote-reference
                                   (lambda (reference)
                                     (org-element-property :label reference)))))
                   (footnote-string-list
                      (with-temp-buffer
                        (insert-file-contents source-file)
                        (-map (lambda (label) (buffer-substring-no-properties
                                               (nth 1 (org-footnote-get-definition label))
                                               (nth 2 (org-footnote-get-definition label))))
                              label-list))))
              (-map (lambda (footnote-string) (insert footnote-string)) footnote-string-list)
              (insert reference))))))))

(add-hook 'org-export-before-processing-functions 'hurricane//collect-backlinks-string)

;; Define the publishing project
(setq org-publish-project-alist
      (list
       (list "org-roam-notes"
             :recursive t
             :base-directory org-roam-directory
             :publishing-function 'org-html-publish-to-html
             :publishing-directory (expand-file-name "../public" org-roam-directory)
             :with-author t             ;; Don't include author name
             :with-creator t            ;; Include Emacs and Org versions in footer
             :with-latex t              ;; Include LaTeX formatting
             :with-tags nil             ;; Don't include tags
             :with-toc t                ;; Include a table of contents
             :section-numbers nil       ;; Don't include section numbers
             :time-stamp-file nil)))    ;; Don't include time stamp in file

;; Generate the site output
(message "%s" org-roam-directory)
(message "%s" (expand-file-name "../public" org-roam-directory))
(org-publish "org-roam-notes" t)

(message "Build complete!")
