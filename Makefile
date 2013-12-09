
build: components index.js
	@component build --dev
	@touch build

components: component.json
	@component install --dev

phantomjs:
	@mocha-phantomjs -R list test/test.html

test:
	@mocha -R list

test-cov:
	@./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha -- -R spec

test-coveralls:
	echo TRAVIS_JOB_ID $(TRAVIS_JOB_ID)
	@./node_modules/.bin/istanbul cover \
	./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec && \
		cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js

.PHONY: test phantomjs
