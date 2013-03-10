
/*!
 *
 * dom-lite
 *
 * MIT
 *
 */

// filled later
// but kept first for speedier lookup
// because it's the hottest function
var raw

/**
 * Module dependencies.
 */

var css = require('css')
var classes = require('classes')

/**
 * Dom.
 */

var dom = {}

/**
 * Exports.
 */

module.exports = dom

/**
 * Create an Element of `tag`
 * by passing a tag name, or
 * with an `html` string.
 *
 * Examples:
 *
 * ```js
 * var button = dom.create('button')
 * var div = dom.create('<div>Hello</div>')
 * ```
 *
 * @param {String} tag|html
 * @return {Element}
 * @api public
 */

dom.create = function (tag) {
  if ('<' == tag.substr(0,1)) {
    var div = document.createElement('div')
    div.innerHTML = tag
    return div.firstChild
  }
  else return document.createElement(tag)
}

/**
 * Get an Element by `id`.
 *
 * @param {String} id
 * @return {Element}
 * @api public
 */

dom.get = function (id) {
  return document.getElementById(id)
}

/**
 * Find first Element by `sel` in
 * optional `target`.
 * If `target` is omitted then
 * `document.body` is used instead.
 *
 * @param {Element} [target]
 * @param {String} sel
 * @return {Element}
 * @api public
 */

dom.find = function (target, sel) {
  if (!sel) sel = target, target = document.body
  else target = raw(target)
  return target.querySelector(sel)
}

/**
 * Find Elements by `sel` in
 * optional `target`.
 * If `target` is omitted then
 * `document.body` is used instead.
 *
 * @param {Element} [target]
 * @param {String} sel
 * @return {NodeList}
 * @api public
 */

dom.findAll = function (target, sel) {
  if (!sel) sel = target, target = document.body
  else target = raw(target)
  return target.querySelectorAll(sel)
}

/**
 * Append `el` to `target` parent.
 * If `target` is omitted then
 * `document.body` is used instead.
 *
 * @param {Element} [target]
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.append = function (target, el) {
  if (!el) {
    el = target
    target = document.body
  }
  else {
    target = raw(target)
  }
  el = raw(el)
  target.appendChild(el)
  return el
}

/**
 * Prepend `el` to `target` parent.
 * If `target` is omitted then
 * `document.body` is used instead.
 *
 * @param {Element} [target]
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.prepend = function (target, el) {
  if (!el) {
    el = target
    target = document.body
  }
  else {
    target = raw(target)
  }
  el = raw(el)
  target.insertBefore(el, target.firstChild)
  return el
}

/**
 * Insert `el` before `target`.
 *
 * @param {Element} target
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.insertBefore = function (target, el) {
  target = raw(target)
  el = raw(el)
  target.parentNode.insertBefore(el, target)
}

/**
 * Remove `el` from its parentNode.
 *
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.remove = function (el) {
  el = raw(el)
  el.parentNode.removeChild(el)
  return el
}

/**
 * Replace `target` Element with `el`.
 *
 * @param {Element} target
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.replace = function (target, el) {
  dom.insertBefore(target, el)
  dom.remove(target)
  return el
}

/**
 * Apply css `styles` to `el`
 * or change just one `prop` to `val`
 * or retrieve style value of `prop`.
 *
 * Examples:
 *
 * ```js
 * dom.css(el, { padding: 10, margin: 10 })
 * dom.css(el, 'text-shadow', '1px 1px solid #ccc')
 * dom.css(el, 'display') === 'block' // true
 * ```
 *
 * @param {Element} el
 * @param {Object|String} styles|prop
 * @param {String} [val]
 * @return {Element} el
 * @api public
 */

dom.css = function (el, styles, val) {
  el = raw(el)
  if ('string' == typeof styles) {
    var prop = styles
    if (2 == arguments.length) return el.style[prop]
    styles = {}
    styles[prop] = val
  }
  css(el, styles)
  return el
}

/**
 * Gets computed style for `el`.
 *
 * @param {Element} el
 * @return {Object} style
 * @api public
 */

dom.style = function (el) {
  el = raw(el)
  if (window.getComputedStyle) {
    return window.getComputedStyle(el)
  }
  else {
    return el.currentStyle
  }
}

/**
 * Gets the bounding rectangle for `el`.
 *
 * @param {Element} el
 * @return {Object} rect
 * @api public
 */

dom.rect = function (el) {
  el = raw(el)
  return el.getBoundingClientRect()
}
dom.box = dom.rect // alias

/**
 * Returns a cross-browser `classList`
 * for `el`.
 *
 * Example:
 *
 * ```js
 * var classes = dom.classes(el)
 * classes.add('some-class')
 * classes.remove('another')
 * ```
 *
 * @param {Element} target
 * @return {Set} classList
 * @api public
 */

dom.classes = function (el) {
  el = raw(el)
  return classes(el)
}

/**
 * Get the html string of Element `el`
 * or set its inner `html`.
 * When passed an `html` it returns
 * the Element instead of the html
 * contents.
 *
 * Examples:
 *
 * ```js
 * var el = dom.create('div')
 * dom.html(el, '<span>Hello</span>')
 * dom.html(el) === '<div><span>Hello</span></div>' // true
 * ```
 *
 * @param {Element} el
 * @param {String} [html]
 * @return {String|Element} html|el
 * @api public
 */

dom.html = function (el, html) {
  el = raw(el)
  if (html) {
    el.innerHTML = html
    return el
  }
  if ('outerHTML' in el) {
    html = el.outerHTML
  }
  else {
    var outer = document.createElement('div')
    outer.appendChild(el.cloneNode(true))
    html = outer.innerHTML
  }
  return html
}

/**
 * Hide `el` (sets `display: none`).
 *
 * @param {Element} el
 * @return {Element} el
 * @api public
 */

dom.hide = function (el) {
  return dom.css(el, 'display', 'none')
}

/**
 * Show `el` (sets `display: block`).
 *
 * @param {Element} el
 * @return {Element}
 * @api public
 */

dom.show = function (el) {
  return dom.css(el, 'display', 'block')
}

/**
 * Returns a raw Element from any type of `el`,
 * jQuery, custom container, raw Element.
 *
 * @param {Mixed} el
 * @return {Element} el
 * @api public
 */

dom.raw = function (el) {
  if ('el' in el) el = el.el
  if (el instanceof Element) {/*noop*/}
  else if ('jquery' in el) el = el[0]
  else if ('els' in el) el = el.els[0]
  else if (el instanceof NodeList) el = el[0]
  return el
}
raw = dom.raw // shortcut
