
build: components index.js
	@component build --dev
	@touch build

components: component.json
	@component install --dev

test:
	@mocha -R list -t 4000

.PHONY: test
