
build: components index.js
	@component-build --dev

components: component.json
	@component-install --dev

dist: build
	@component-build -s dom -n dom-lite -o dist/ \
		&& cd utils \
		&& python builder.py

clean:
	rm -rf components build dist

.PHONY: clean
