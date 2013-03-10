require('stagas-watch-js')
var assert = require('component-assert')
var jquery = require('component-jquery')
var domlist = require('component-dom')
var dom = require('dom-lite')

describe("dom", function () {

  describe(".create()", function () {
    describe("when passed a tag name", function () {
      it("should create a dom Element of that tag", function () {
        var el = dom.create('a')
        assert(el instanceof Element)
        assert('<a></a>' === dom.html(el))
      })
    })

    describe("when passed some html", function () {
      it("should create a dom Element with that html", function () {
        var el = dom.create('<div class="find-me"><span>Hello</span></div>')
        assert(el instanceof Element)
        assert('find-me' === el.className)
        assert('<span>Hello</span>' === el.innerHTML)
        assert('<div class="find-me"><span>Hello</span></div>' === dom.html(el))
      })
    })
  })

  describe(".get()", function () {
    it("should get a dom Element by id", function () {
      var el = dom.create('div')
      el.id = 'hello'
      dom.append(el)
      assert(el === dom.get('hello'))
    })
  })

  describe(".find()", function () {
    describe("when no target is passed", function () {
      it("should return results for a selector from the body", function () {
        var a = dom.create('div')
        var b = dom.create('div')
        dom.classes(a).add('find-me').add('first')
        dom.classes(b).add('find-me').add('second')
        dom.append(a)
        dom.append(b)
        assert(b === dom.find('.find-me.second'))
        assert(a === dom.find('.find-me'))
      })
    })

    describe("when a target is passed", function () {
      it("should return results for a selector from a target", function () {
        var target = dom.create('div')
        var a = dom.create('div')
        var b = dom.create('div')
        dom.classes(a).add('find-me').add('first')
        dom.classes(b).add('find-me').add('second')
        dom.append(target, a)
        dom.append(target, b)
        assert(b === dom.find(target, '.find-me.second'))
        assert(a === dom.find(target, '.find-me'))
      })
    })
  })

  describe(".findAll()", function () {
    describe("when no target is passed", function () {
      it("should return results for a selector from the body", function () {
        var a = dom.create('div')
        var b = dom.create('div')
        dom.classes(a).add('find-all-me').add('first')
        dom.classes(b).add('find-all-me').add('second')
        dom.append(a)
        dom.append(b)
        var list = dom.findAll('.find-all-me')
        assert(list instanceof NodeList)
        assert(2 === list.length)
        var list = dom.findAll('.find-all-me.second')
        assert(list instanceof NodeList)
        assert(1 === list.length)
        assert(b === list[0])
      })
    })

    describe("when a target is passed", function () {
      it("should return results for a selector from a target", function () {
        var target = dom.create('div')
        var a = dom.create('div')
        var b = dom.create('div')
        dom.classes(a).add('find-all-me').add('first')
        dom.classes(b).add('find-all-me').add('second')
        dom.append(target, a)
        dom.append(target, b)
        var list = dom.findAll(target, '.find-all-me')
        assert(list instanceof NodeList)
        assert(2 === list.length)
        var list = dom.findAll(target, '.find-all-me.second')
        assert(list instanceof NodeList)
        assert(1 === list.length)
        assert(b === list[0])
      })
    })
  })

  describe(".append()", function () {
    describe("when no parent is passed", function () {
      it("should append an element to body", function () {
        var el = dom.create('b')
        el.id = 'appended'
        dom.append(el)
        assert(el === dom.get('appended'))
      })
    })

    describe("when a parent is passed", function () {
      it("should append an element in a parent", function () {
        var el = dom.create('b')
        var parent = dom.create('div')
        dom.append(parent, el)
        assert('<div><b></b></div>' === dom.html(parent))
      })
    })
  })

  describe(".prepend()", function () {
    describe("when no parent is passed", function () {
      it("should prepend an element to body", function () {
        var el = dom.create('b')
        el.id = 'prepended'
        dom.append(el)
        assert(el === dom.get('prepended'))
      })
    })

    describe("when a parent is passed", function () {
      it("should append an element in a parent", function () {
        var a = dom.create('a')
        var b = dom.create('b')
        var parent = dom.create('div')
        dom.append(parent, a)
        dom.prepend(parent, b)
        assert('<div><b></b><a></a></div>' === dom.html(parent))
      })
    })
  })

  describe(".insertBefore()", function () {
    it("should insert an element before another element", function () {
      var a = dom.create('a')
      var b = dom.create('b')
      var c = dom.create('c')
      var parent = dom.create('div')
      dom.append(parent, a)
      dom.append(parent, b)
      dom.insertBefore(b, c)
      assert('<div><a></a><c></c><b></b></div>' === dom.html(parent))
    })
  })

  describe(".remove()", function () {
    it("should remove an element from its parent", function () {
      var a = dom.create('a')
      var b = dom.create('b')
      var c = dom.create('c')
      var parent = dom.create('div')
      dom.append(parent, a)
      dom.append(parent, b)
      dom.append(parent, c)
      dom.remove(b)
      assert('<div><a></a><c></c></div>' === dom.html(parent))
    })
  })

  describe(".replace()", function () {
    it("should replace an element with another element", function () {
      var a = dom.create('a')
      var b = dom.create('b')
      var c = dom.create('c')
      var parent = dom.create('div')
      dom.append(parent, a)
      dom.append(parent, b)
      dom.replace(b, c)
      assert('<div><a></a><c></c></div>' === dom.html(parent))
    })
  })

  describe(".css()", function () {
    describe("when called with an object", function () {
      it("should change the css of an element", function () {
        var el = dom.create('div')
        dom.css(el, { padding: 10, margin: 10 })
        assert('10px' === el.style.padding)
        assert('10px' === el.style.margin)
      })
    })

    describe("when called with a property and a value", function () {
      it("should change only that css value of that element", function () {
        var el = dom.create('div')
        dom.css(el, 'text-shadow', '1px 1px solid #ccc')
        assert('1px 1px solid #ccc' === el.style['text-shadow'])
      })
    })

    describe("when called with a property", function () {
      it("should return the css value for that property", function () {
        var el = dom.create('div')
        dom.css(el, 'text-shadow', '1px 1px solid #ccc')
        assert('1px 1px solid #ccc' === dom.css(el, 'text-shadow'))
      })
    })
  })

  describe(".style()", function () {
    it("should return a style object of an element", function () {
      var el = dom.create('div')
      dom.css(el, { padding: 10, margin: 10 })
      var styles = dom.style(el)
      assert('object' === typeof styles)
      assert('10px' == styles.paddingLeft)
    })
  })

  describe(".rect()", function () {
    it("should return the bounding rect object of an element", function () {
      var el = dom.create('div')
      dom.css(el, { width: 10, height: 10 })
      dom.append(el)
      var rect = dom.rect(el)
      assert(rect instanceof ClientRect)
      assert(10 === rect.width)
      assert(10 === rect.height)
    })
  })

  describe(".classes()", function () {
    it("should return a classList or shim", function () {
      var el = dom.create('<div class="hello there"></div>')
      var classes = dom.classes(el)
      assert(true === classes.contains('hello'))
      assert(true === classes.contains('there'))
      classes.remove('there')
      assert(false === classes.contains('there'))
      classes.add('world')
      assert(true === classes.contains('world'))
      assert('<div class="hello world"></div>' === dom.html(el))
    })
  })

  describe(".html()", function () {
    describe("when called with just an element", function () {
      it("should return its html representation", function () {
        var el = dom.create('<div class="hello world"></div>')
        assert('<div class="hello world"></div>' === dom.html(el))
      })
    })

    describe("when called with an element and html string", function () {
      it("should change its innerHTML", function () {
        var el = dom.create('<div class="hello world"><b>Ahoy!</b></div>')
        dom.html(el, '<b>lol</b>')
        assert('<div class="hello world"><b>lol</b></div>' === dom.html(el))
      })
    })
  })

  describe(".hide()", function () {
    it("should set display:none", function () {
      var el = dom.create('div')
      dom.hide(el)
      assert('none'===dom.css(el, 'display'))
    })
  })

  describe(".show()", function () {
    it("should set display:block", function () {
      var el = dom.create('div')
      dom.hide(el)
      assert('none'===dom.css(el, 'display'))
      dom.show(el)
      assert('block'===dom.css(el, 'display'))
    })
  })

  describe(".raw()", function () {
    describe("when passed a container object with a `.el` property", function () {
      it("should use that el for further processing", function () {
        var el = dom.create('div')
        var obj = {
          el: el
        }
        assert(el===dom.raw(obj))
        obj = {
          el: jquery(el)
        }
        assert(el===dom.raw(obj))
      })
    })

    describe("when passed a plain Element", function () {
      it("should return that Element", function () {
        var el = dom.create('div')
        assert(el===dom.raw(el))
      })
    })

    describe("when passed a jquery object", function () {
      it("should extract the first dom Element", function () {
        var el = dom.create('div')
        var obj = jquery(el)
        assert(el===dom.raw(obj))
      })
    })

    describe("when passed a dom List object with `.els`", function () {
      it("should extract the first dom Element", function () {
        var el = dom.create('div')
        var obj = domlist(el)
        assert(el===dom.raw(obj))
      })
    })

    describe("when passed a NodeList object", function () {
      it("should extract the first dom Element", function () {
        var el = dom.create('div')
        var a = dom.create('a')
        var b = dom.create('a')
        dom.append(el, a)
        dom.append(el, b)
        var obj = dom.findAll(el, 'a')
        assert(a===dom.raw(obj))
      })
    })
  })

})
