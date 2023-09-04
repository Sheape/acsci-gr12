function collapse_toc_elements_on_click (nav_li_a){
    /*
      When an `a' element in the TOC is clicked, its parent
      `li' element's active attribute is toggled.  This causes
      the element to toggle between minimized and maximized
      states.  The active attribute is documented in bootstrap.
      https://getbootstrap.com/docs/4.0/components/navbar/#nav
    */
    $(nav_li_a).parent().toggleClass("active");
}

$( document ).ready(function() {
    // When the document is loaded and ready, bind the
    // function `collapse_toc_elements_on_click' to the
    // `a' elements in the table of contents.
    $("#text-table-of-contents a").click(function() {
        collapse_toc_elements_on_click(this);
    });
});

$(function() {
    function replace_admonition (tag, map, language) {
        var language = document.documentElement.lang;
        var translations = map.get(tag);
        var readable = translations.get(language) || translations.get("en"); // fallback to english
        $(`span.${tag}:not(#table-of-contents *)`) .parent().parent()
            .replaceWith(`<p id='${this.id}' class='admonition-title ${tag}'>${readable}</p>`);
        $(`div.${tag}`).before(`<p class='admonition-title ${tag}'>${readable}</p>`)
    }
    const map = new Map()
          .set("note", new Map()
               .set("en", "Note")
               .set("de", "Hinweis"))
          .set("seealso", new Map()
               .set("en", "See also")
               .set("de", "Siehe auch"))
          .set("warning", new Map()
               .set("en", "Warning")
               .set("de", "Warnung"))
          .set("caution", new Map()
               .set("en", "Caution")
               .set("de", "Vorsicht"))
          .set("attention", new Map()
               .set("en", "Attention")
               .set("de", "Obacht"))
          .set("tip", new Map()
               .set("en", "Tip")
               .set("de", "Tipp"))
          .set("important", new Map()
               .set("en", "Important")
               .set("de", "Wichtig"))
          .set("hint", new Map()
               .set("en", "Hint")
               .set("de", "Hinweis"))
          .set("error", new Map()
               .set("en", "Error")
               .set("de", "Fehler"))
          .set("danger", new Map()
               .set("en", "Danger")
               .set("de", "Gefahr"))
    ;
    replace_admonition('note', map);
    replace_admonition('seealso', map);
    replace_admonition('warning', map);
    replace_admonition('caution', map);
    replace_admonition('attention', map);
    replace_admonition('tip', map);
    replace_admonition('important', map);
    replace_admonition('hint', map);
    replace_admonition('error', map);
    replace_admonition('danger', map);
});

$( document ).ready(function() {

    // Shift nav in mobile when clicking the menu.
    $(document).on('click', "[data-toggle='wy-nav-top']", function() {
      $("[data-toggle='wy-nav-shift']").toggleClass("shift");
      $("[data-toggle='rst-versions']").toggleClass("shift");
    });
    // Close menu when you click a link.
    $(document).on('click', ".wy-menu-vertical .current ul li a", function() {
      $("[data-toggle='wy-nav-shift']").removeClass("shift");
      $("[data-toggle='rst-versions']").toggleClass("shift");
    });
    $(document).on('click', "[data-toggle='rst-current-version']", function() {
      $("[data-toggle='rst-versions']").toggleClass("shift-up");
    });
    // Make tables responsive
    $("table.docutils:not(.field-list)").wrap("<div class='wy-table-responsive'></div>");
});

$( document ).ready(function() {
    $('#text-table-of-contents ul').first().addClass('nav');
                                        // ScrollSpy also requires that we use
                                        // a Bootstrap nav component.
    $('body').scrollspy({target: '#text-table-of-contents'});

    // DON'T add sticky table headers (Fix issue #69?)
    // $('table').stickyTableHeaders();

    // set the height of tableOfContents
    var $postamble = $('#postamble');
    var $tableOfContents = $('#table-of-contents');
    $tableOfContents.css({paddingBottom: $postamble.outerHeight()});

    // add TOC button
    var toggleSidebar = $('<div id="toggle-sidebar"><a href="#table-of-contents"><h2>Table of Contents</h2></a></div>');
    $('#content').prepend(toggleSidebar);

    // add close button when sidebar showed in mobile screen
    var closeBtn = $('<a class="close-sidebar" href="#">Close</a>');
    var tocTitle = $('#table-of-contents').find('h2');
    tocTitle.append(closeBtn);
});

window.SphinxRtdTheme = (function (jquery) {
    var stickyNav = (function () {
        var navBar,
            win,
            stickyNavCssClass = 'stickynav',
            applyStickNav = function () {
                if (navBar.height() <= win.height()) {
                    navBar.addClass(stickyNavCssClass);
                } else {
                    navBar.removeClass(stickyNavCssClass);
                }
            },
            enable = function () {
                applyStickNav();
                win.on('resize', applyStickNav);
            },
            init = function () {
                navBar = jquery('nav.wy-nav-side:first');
                win    = jquery(window);
            };
        jquery(init);
        return {
            enable : enable
        };
    }());
    return {
        StickyNav : stickyNav
    };
}($));

document.addEventListener("DOMContentLoaded", () => {
  const tocTitleDiv = document.querySelector('div#table-of-contents');
  const tocTitle = document.querySelector('div#table-of-contents h2');
  const clonedTitle = tocTitle.cloneNode(true);
  const svgHomeIconString = `<svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0,0,256,256" id="svg-home-icon">
<g fill="#313244" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><g transform="scale(3.55556,3.55556)"><path d="M36,10c-1.139,0 -2.27708,0.38661 -3.20508,1.16211l-21.27734,17.7793c-1.465,1.224 -1.96564,3.32881 -1.05664,5.00781c1.251,2.309 4.20051,2.79122 6.10352,1.19922l18.79492,-15.70313c0.371,-0.31 0.91025,-0.31 1.28125,0l18.79492,15.70313c0.748,0.626 1.6575,0.92969 2.5625,0.92969c1.173,0 2.33591,-0.51091 3.12891,-1.50391c1.377,-1.724 0.98597,-4.27055 -0.70703,-5.68555l-2.41992,-2.02148v-10.19922c0,-1.473 -1.19402,-2.66797 -2.66602,-2.66797h-2.66602c-1.473,0 -2.66797,1.19497 -2.66797,2.66797v3.51367l-10.79492,-9.01953c-0.928,-0.7755 -2.06608,-1.16211 -3.20508,-1.16211zM35.99609,22.92578l-22,18.37695v8.69727c0,4.418 3.582,8 8,8h28c4.418,0 8,-3.582 8,-8v-8.69727zM32,38h8c1.105,0 2,0.895 2,2v10h-12v-10c0,-1.105 0.895,-2 2,-2z"></path></g></g>
</svg>`;

  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgHomeIconString, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  const wrapperDiv = document.createElement('div');
  wrapperDiv.classList = 'toc-header-container';

  const svgDivContainer = document.createElement('div');
  svgDivContainer.classList = 'svg-div-container';

  const h2HomeElement = document.createElement('h2');
  h2HomeElement.id = 'home-text-header';

  const linkToHomepage = document.createElement('a');
  linkToHomepage.textContent = 'Home';
  linkToHomepage.href = '/index.html';

  h2HomeElement.append(linkToHomepage);

  svgDivContainer.append(svgElement);
  svgDivContainer.append(h2HomeElement);

  tocTitle.parentNode.replaceChild(wrapperDiv, tocTitle);
  wrapperDiv.appendChild(svgDivContainer);
  wrapperDiv.appendChild(tocTitle);
})
