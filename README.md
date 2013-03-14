# dom-lite

not fancy dom helper utils

## Install

```sh
$ component-install stagas/dom-lite
```

## API

### dom.create(`tag|html`)
> _returns_ Element

Create an Element of `tag`
by passing a tag name, or
with an `html` string.

Examples:

```js
var button = dom.create('button')
var div = dom.create('<div>Hello</div>')
```

### dom.get(`id`)
> _returns_ Element

Get an Element by `id`.


### dom.find(`[target]`, `sel`)
> _returns_ Element

Find first Element by `sel` in
optional `target`.
If `target` is omitted then
`document.body` is used instead.


### dom.findAll(`[target]`, `sel`)
> _returns_ NodeList

Find Elements by `sel` in
optional `target`.
If `target` is omitted then
`document.body` is used instead.


### dom.append(`[target]`, `el`)
> _returns_ el:Element

Append `el` to `target` parent.
If `target` is omitted then
`document.body` is used instead.


### dom.prepend(`[target]`, `el`)
> _returns_ el:Element

Prepend `el` to `target` parent.
If `target` is omitted then
`document.body` is used instead.


### dom.insertBefore(`target`, `el`)
> _returns_ el:Element

Insert `el` before `target`.


### dom.remove(`el`)
> _returns_ el:Element

Remove `el` from its parentNode.


### dom.replace(`target`, `el`)
> _returns_ el:Element

Replace `target` Element with `el`.


### dom.css(`el`, `styles|prop`, `[val]`)
> _returns_ el:Element

Apply css `styles` to `el`
or change just one `prop` to `val`
or retrieve style value of `prop`.

Examples:

```js
dom.css(el, { padding: 10, margin: 10 })
dom.css(el, 'text-shadow', '1px 1px solid #ccc')
dom.css(el, 'display') === 'block' // true
```

### dom.style(`el`)
> _returns_ style:Object

Gets computed style for `el`.


### dom.rect(`el`)
> _returns_ rect:Object

Gets the bounding rectangle for `el`.


### dom.classes(`target`)
> _returns_ classList:Set

Returns a cross-browser `classList`
for `el`.

Example:

```js
var classes = dom.classes(el)
classes.add('some-class')
classes.remove('another')
```

### dom.html(`el`, `[html]`)
> _returns_ html|el:String|Element

Get the html string of Element `el`
or set its inner `html`.
When passed an `html` it returns
the Element instead of the html
contents.

Examples:

```js
var el = dom.create('div')
dom.html(el, '<span>Hello</span>')
dom.html(el) === '<div><span>Hello</span></div>' // true
```

### dom.hide(`el`)
> _returns_ el:Element

Hide `el` (sets `display: none`).


### dom.show(`el`)
> _returns_ Element

Show `el` (sets `display: block`).


### dom.on(`el`, `event`, `[selector]`, `fn`, `[capture]`)
> _returns_ el:Element

Bind to `event` for `el` and invoke `fn(e)`.
When a `selector` is given then events are delegated.


### dom.off(`el`, `event`, `[selector]`, `fn`, `[capture]`)
> _returns_ el:Element

Unbind to `event` for `el` and invoke `fn(e)`.
When a `selector` is given then delegated event
handlers are unbound.


### dom.once(`el`, `event`, `[selector]`, `fn`, `[capture]`)
> _returns_ el:Element

Same as `.on` but will call `.off`
immediately after the first event.


### dom.trigger(`el`, `name`, `[options]`)
> _returns_ el:Element

Trigger a DOM event.

Examples:

```js
var button = dom.create('button')
dom.trigger(button, 'click')
dom.trigger(document.body, 'mousemove', { clientX: 10, clientY: 35 });
```

Where sensible, sane defaults will be filled in. See the list of event
types for supported events.

Loosely based on:
https://github.com/kangax/protolicious/blob/master/event.simulate.js

### dom.closest(`el`, `sel`)
> _returns_ found:Element

Find closest element from `el`
that matches selector `sel`.


### dom.raw(`el`)
> _returns_ el:Element

Returns a raw Element from any type of `el`,
jQuery, custom container, raw Element.


## License

MIT
