default: reset build
reset: clean clear-cache
build:
	./build.sh
clear-cache:
	if ls "org-roam.db*" >1 /dev/null 2>&1; then \
		rm -v org-roam.db*;\
	fi
clean:
	if ls .packages/ public/ >1 /dev/null 2>&1; then \
		rm -rfv .packages/ public/;\
	fi
