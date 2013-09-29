
build: components index.js
	@component build --dev
	@touch build

components: component.json
	@component install --dev

phantomjs:
	@mocha-phantomjs -R list test/test.html

test:
	@mocha -R list

.PHONY: test phantomjs
