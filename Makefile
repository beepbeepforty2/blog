.PHONY: check build dev preview

dev:
	bash scripts/zola.sh serve --drafts

check:
	bash scripts/check.sh

build:
	bash scripts/build.sh

preview:
	python3 -m http.server 4321 --directory dist
