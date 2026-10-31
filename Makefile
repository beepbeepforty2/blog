.PHONY: check build dev preview seo-status seo-submit seo-setup

dev:
	bash scripts/zola.sh serve --drafts

check:
	bash scripts/check.sh

build:
	bash scripts/build.sh

preview:
	python3 -m http.server 4321 --directory dist

seo-status:
	node scripts/seo.mjs status

seo-submit:
	node scripts/seo.mjs submit

seo-setup:
	node scripts/seo.mjs setup
