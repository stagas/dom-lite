;(function(){


/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-event/index.js", function(exports, require, module){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, type, fn, capture){
  if (el.addEventListener) {
    el.addEventListener(type, fn, capture || false);
  } else {
    el.attachEvent('on' + type, fn);
  }
  return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture || false);
  } else {
    el.detachEvent('on' + type, fn);
  }
  return fn;
};

});
require.register("component-matches-selector/index.js", function(exports, require, module){

/**
 * Element prototype.
 */

var proto = Element.prototype;

/**
 * Vendor function.
 */

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

/**
 * Expose `match()`.
 */

module.exports = match;

/**
 * Match `el` to `selector`.
 *
 * @param {Element} el
 * @param {String} selector
 * @return {Boolean}
 * @api public
 */

function match(el, selector) {
  if (vendor) return vendor.call(el, selector);
  var nodes = el.parentNode.querySelectorAll(selector);
  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i] == el) return true;
  }
  return false;
}
});
require.register("component-delegate/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var matches = require('matches-selector')
  , event = require('event');

/**
 * Delegate event `type` to `selector`
 * and invoke `fn(e)`. A callback function
 * is returned which may be passed to `.unbind()`.
 *
 * @param {Element} el
 * @param {String} selector
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
 */

exports.bind = function(el, selector, type, fn, capture){
  return event.bind(el, type, function(e){
    if (matches(e.target, selector)) fn.call(el, e);
  }, capture);
};

/**
 * Unbind event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @api public
 */

exports.unbind = function(el, type, fn, capture){
  event.unbind(el, type, fn, capture);
};

});
require.register("stagas-binder/index.js", function(exports, require, module){

/*!
 *
 * binder
 *
 * MIT
 *
 */

/**
 * Module dependencies.
 */

var events = require('event');
var delegate = require('delegate');

/**
 * Bind to `event` for `el` and invoke `fn(e)`.
 * When a `selector` is given then events are delegated.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

exports.on = function(el, event, selector, fn, capture){
  if ('string' == typeof selector) {
    fn._delegate = delegate.bind(el, selector, event, fn, capture);
    return this;
  }

  capture = fn;
  fn = selector;

  events.bind(el, event, fn, capture);

  return el;
};

/**
 * Unbind `event` listener `fn` for `el`.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

exports.off = function(el, event, selector, fn, capture){
  switch (typeof selector) {
    case 'function':
      capture = fn;
      fn = selector;
      if (!fn._delegate) break;
    case 'string':
      delegate.unbind(el, event, fn._delegate, capture);
      return this;
  }

  events.unbind(el, event, fn, capture);

  return el;
};

/**
 * Same as `.on` but will call `.off`
 * immediately after the first event.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

exports.once = function(el, event, selector, fn, capture){
  // regular
  if ('function' == typeof selector) {
    capture = fn;
    fn = selector;
    exports.on(el, event, function removeMe(e){
      exports.off(el, event, removeMe, capture);
      fn.call(el, e);
    }, capture);
  }
  else { // delegate
    exports.on(el, event, selector, function removeMe(e){
      exports.off(el, event, selector, removeMe, capture);
      fn.call(el, e);
    }, capture);
  }

  return el;
};

});
require.register("component-css/index.js", function(exports, require, module){

/**
 * Properties to ignore appending "px".
 */

var ignore = {
  columnCount: true,
  fillOpacity: true,
  fontWeight: true,
  lineHeight: true,
  opacity: true,
  orphans: true,
  widows: true,
  zIndex: true,
  zoom: true
};

/**
 * Set `el` css values.
 *
 * @param {Element} el
 * @param {Object} obj
 * @return {Element}
 * @api public
 */

module.exports = function(el, obj){
  for (var key in obj) {
    var val = obj[key];
    if ('number' == typeof val && !ignore[key]) val += 'px';
    el.style[key] = val;
  }
  return el;
};

});
require.register("component-indexof/index.js", function(exports, require, module){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
});
require.register("component-classes/index.js", function(exports, require, module){

/**
 * Module dependencies.
 */

var index = require('indexof');

/**
 * Whitespace regexp.
 */

var re = /\s+/;

/**
 * toString reference.
 */

var toString = Object.prototype.toString;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (!~i) arr.push(name);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present, or
 * pass a regular expression to remove
 * any which match.
 *
 * @param {String|RegExp} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  if ('[object RegExp]' == toString.call(name)) {
    return this.removeMatching(name);
  }

  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = index(arr, name);
  if (~i) arr.splice(i, 1);
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove all classes matching `re`.
 *
 * @param {RegExp} re
 * @return {ClassList}
 * @api private
 */

ClassList.prototype.removeMatching = function(re){
  var arr = this.array();
  for (var i = 0; i < arr.length; i++) {
    if (re.test(arr[i])) {
      this.remove(arr[i]);
    }
  }
  return this;
};

/**
 * Toggle class `name`.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name){
  // classList
  if (this.list) {
    this.list.toggle(name);
    return this;
  }

  // fallback
  if (this.has(name)) {
    this.remove(name);
  } else {
    this.add(name);
  }
  return this;
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var arr = this.el.className.split(re);
  if ('' === arr[0]) arr.pop();
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has =
ClassList.prototype.contains = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~index(this.array(), name);
};

});
require.register("component-inherit/index.js", function(exports, require, module){

module.exports = function(a, b){
  var fn = function(){};
  fn.prototype = b.prototype;
  a.prototype = new fn;
  a.prototype.constructor = a;
};
});
require.register("adamsanderson-trigger-event/index.js", function(exports, require, module){
var inherit = require('inherit');
module.exports = trigger;

/** 
  Event type mappings.
  This is not an exhaustive list, feel free to fork and contribute more.
  Namely keyboard events are not currently supported.
*/
var eventTypes = {
  load:        'HTMLEvents', 
  unload:      'HTMLEvents', 
  abort:       'HTMLEvents', 
  error:       'HTMLEvents', 
  select:      'HTMLEvents', 
  change:      'HTMLEvents', 
  submit:      'HTMLEvents', 
  reset:       'HTMLEvents', 
  focus:       'HTMLEvents', 
  blur:        'HTMLEvents', 
  resize:      'HTMLEvents', 
  scroll:      'HTMLEvents', 
  input:       'HTMLEvents', 
  
  click:       'MouseEvents',
  dblclick:    'MouseEvents', 
  mousedown:   'MouseEvents', 
  mouseup:     'MouseEvents', 
  mouseover:   'MouseEvents', 
  mousemove:   'MouseEvents', 
  mouseout:    'MouseEvents',
  contextmenu: 'MouseEvents'
};

// Default event properties:
var defaults = {
  clientX: 0,
  clientY: 0,
  button: 0,
  ctrlKey: false,
  altKey: false,
  shiftKey: false,
  metaKey: false,
  bubbles: true,
  cancelable: true
};

/**
 * Trigger a DOM event.
 * 
 *    trigger(document.body, "click", {clientX: 10, clientY: 35});
 *
 * Where sensible, sane defaults will be filled in.  See the list of event
 * types for supported events.
 *
 * Loosely based on:
 * https://github.com/kangax/protolicious/blob/master/event.simulate.js
 */
function trigger(el, name, options){
  var event, type;
  
  type = eventTypes[name];
  if (!type) {
    throw new SyntaxError('Unknown event type: '+type);
  }
  
  options = options || {};
  inherit(defaults, options);
  
  if (document.createEvent) {
    // Standard Event
    event = document.createEvent(type);
    initializers[type](el, name, event, options);
    el.dispatchEvent(event);
  } else {
    // IE Event
    event = document.createEventObject();
    for (var key in options){
      event[key] = options[key];
    }
    el.fireEvent('on' + name, event);
  }
}

var initializers = {
  HTMLEvents: function(el, name, event, o){
    return event.initEvent(name, o.bubbles, o.cancelable);
  },
  MouseEvents: function(el, name, event, o){
    var screenX = ('screenX' in o) ? o.screenX : o.clientX;
    var screenY = ('screenY' in o) ? o.screenY : o.clientY;
    var clicks;
    var button;
    
    if ('detail' in o) {
      clicks = o.detail;
    } else if (name === 'dblclick') {
      clicks = 2;
    } else {
      clicks = 1;
    }
    
    // Default context menu to be a right click
    if (name === 'contextmenu') {
      button = button = o.button || 2;
    }
    
    return event.initMouseEvent(name, o.bubbles, o.cancelable, document.defaultView, 
          clicks, screenX, screenY, o.clientX, o.clientY,
          o.ctrlKey, o.altKey, o.shiftKey, o.metaKey, button, el);
  }
};

});
require.register("dom-lite/index.js", function(exports, require, module){

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
var binder = require('binder')
var trigger = require('trigger-event')

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
 * Bind to `event` for `el` and invoke `fn(e)`.
 * When a `selector` is given then events are delegated.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

dom.on = function (el, event, selector, fn, capture) {
  el = raw(el)
  return binder.on(el, event, selector, fn, capture)
}
dom.bind = dom.on // alias

/**
 * Unbind to `event` for `el` and invoke `fn(e)`.
 * When a `selector` is given then delegated event
 * handlers are unbound.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

dom.off = function (el, event, selector, fn, capture) {
  el = raw(el)
  return binder.off(el, event, selector, fn, capture)
}
dom.unbind = dom.off // alias

/**
 * Same as `.on` but will call `.off`
 * immediately after the first event.
 *
 * @param {Element} el
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} [capture]
 * @return {Element} el
 * @api public
 */

dom.once = function (el, event, selector, fn, capture) {
  el = raw(el)
  return binder.once(el, event, selector, fn, capture)
}

/**
 * Trigger a DOM event.
 *
 * Examples:
 *
 * ```js
 * var button = dom.create('button')
 * dom.trigger(button, 'click')
 * dom.trigger(document.body, 'mousemove', { clientX: 10, clientY: 35 });
 * ```
 *
 * Where sensible, sane defaults will be filled in. See the list of event
 * types for supported events.
 *
 * Loosely based on:
 * https://github.com/kangax/protolicious/blob/master/event.simulate.js
 *
 * @param {Element} el
 * @param {String} name
 * @param {Object} [options]
 * @return {Element} el
 * @api public
 */

dom.trigger = function (el, name, options) {
  el = raw(el)
  trigger(el, name, options)
  return el
}

/**
 * Find closest element from `el`
 * that matches selector `sel`.
 *
 * @param {Element} el
 * @param {String} sel
 * @return {Element} found
 * @api public
 */

dom.closest = function (el, sel) {
  el = raw(el)
  var found
  do {
    found = el.querySelector(sel)
  }
  while (!found && el.parentNode !== el && (el = el.parentNode))
  return found
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

});
require.alias("stagas-binder/index.js", "dom-lite/deps/binder/index.js");
require.alias("component-event/index.js", "stagas-binder/deps/event/index.js");

require.alias("component-delegate/index.js", "stagas-binder/deps/delegate/index.js");
require.alias("component-matches-selector/index.js", "component-delegate/deps/matches-selector/index.js");

require.alias("component-event/index.js", "component-delegate/deps/event/index.js");

require.alias("component-css/index.js", "dom-lite/deps/css/index.js");

require.alias("component-classes/index.js", "dom-lite/deps/classes/index.js");
require.alias("component-indexof/index.js", "component-classes/deps/indexof/index.js");

require.alias("adamsanderson-trigger-event/index.js", "dom-lite/deps/trigger-event/index.js");
require.alias("component-inherit/index.js", "adamsanderson-trigger-event/deps/inherit/index.js");

if (typeof exports == "object") {
  module.exports = require("dom-lite");
} else if (typeof define == "function" && define.amd) {
  define(function(){ return require("dom-lite"); });
} else {
  window["dom"] = require("dom-lite");
}})();