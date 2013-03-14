
build: components index.js
	@component-build --dev

components: component.json
	@component-install --dev

dist: build
	@component-build -s dom -n dom-lite -o dist/ \
		&& cd utils \
		&& python builder.py

docs: index.js
	@qdox -m md > api.md

clean:
	rm -rf components build dist api.md

.PHONY: clean
