/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 18);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/

var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

var listToStyles = __webpack_require__(34)

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

module.exports = function (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(43);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 242);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ },

/***/ 1:
/***/ function(module, exports) {

module.exports = __webpack_require__(6);

/***/ },

/***/ 101:
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ 164:
/***/ function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(101)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(86),
  /* template */
  __webpack_require__(170),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ },

/***/ 170:
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('transition', {
    attrs: {
      "name": "mint-toast-pop"
    }
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.visible),
      expression: "visible"
    }],
    staticClass: "mint-toast",
    class: _vm.customClass,
    style: ({
      'padding': _vm.iconClass === '' ? '10px' : '20px'
    })
  }, [(_vm.iconClass !== '') ? _c('i', {
    staticClass: "mint-toast-icon",
    class: _vm.iconClass
  }) : _vm._e(), _vm._v(" "), _c('span', {
    staticClass: "mint-toast-text",
    style: ({
      'padding-top': _vm.iconClass === '' ? '0' : '10px'
    })
  }, [_vm._v(_vm._s(_vm.message))])])])
},staticRenderFns: []}

/***/ },

/***/ 242:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(50);


/***/ },

/***/ 50:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_toast_js__ = __webpack_require__(94);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony reexport (binding) */ __webpack_require__.d(exports, "default", function() { return __WEBPACK_IMPORTED_MODULE_0__src_toast_js__["a"]; });



/***/ },

/***/ 86:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  props: {
    message: String,
    className: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'middle'
    },
    iconClass: {
      type: String,
      default: ''
    }
  },

  data: function data() {
    return {
      visible: false
    };
  },

  computed: {
    customClass: function customClass() {
      var classes = [];
      switch (this.position) {
        case 'top':
          classes.push('is-placetop');
          break;
        case 'bottom':
          classes.push('is-placebottom');
          break;
        default:
          classes.push('is-placemiddle');
      }
      classes.push(this.className);

      return classes.join(' ');
    }
  }
};


/***/ },

/***/ 94:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);


var ToastConstructor = __WEBPACK_IMPORTED_MODULE_0_vue___default.a.extend(__webpack_require__(164));
var toastPool = [];

var getAnInstance = function () {
  if (toastPool.length > 0) {
    var instance = toastPool[0];
    toastPool.splice(0, 1);
    return instance;
  }
  return new ToastConstructor({
    el: document.createElement('div')
  });
};

var returnAnInstance = function (instance) {
  if (instance) {
    toastPool.push(instance);
  }
};

var removeDom = function (event) {
  if (event.target.parentNode) {
    event.target.parentNode.removeChild(event.target);
  }
};

ToastConstructor.prototype.close = function() {
  this.visible = false;
  this.$el.addEventListener('transitionend', removeDom);
  this.closed = true;
  returnAnInstance(this);
};

var Toast = function (options) {
  if ( options === void 0 ) options = {};

  var duration = options.duration || 3000;

  var instance = getAnInstance();
  instance.closed = false;
  clearTimeout(instance.timer);
  instance.message = typeof options === 'string' ? options : options.message;
  instance.position = options.position || 'middle';
  instance.className = options.className || '';
  instance.iconClass = options.iconClass || '';

  document.body.appendChild(instance.$el);
  __WEBPACK_IMPORTED_MODULE_0_vue___default.a.nextTick(function() {
    instance.visible = true;
    instance.$el.removeEventListener('transitionend', removeDom);
    ~duration && (instance.timer = setTimeout(function() {
      if (instance.closed) return;
      instance.close();
    }, duration));
  });
  return instance;
};

/* harmony default export */ exports["a"] = Toast;


/***/ }

/******/ });

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(21);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/*!
 * Vue.js v2.6.7
 * (c) 2014-2019 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value, e.g., [object Object].
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

function isPromise (val) {
  return (
    isDef(val) &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _toString)
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert an input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if an attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array.
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether an object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it,
 * e.g., PhantomJS 1.x. Technically, we don't need this anymore
 * since native bind is now performant enough in most browsers.
 * But removing it would mean breaking code that was able to run in
 * PhantomJS 1.x, so this must be kept for backward compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/* eslint-disable no-unused-vars */

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/).
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/* eslint-enable no-unused-vars */

/**
 * Return the same value.
 */
var identity = function (_) { return _; };

/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (a instanceof Date && b instanceof Date) {
        return a.getTime() === b.getTime()
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

/**
 * Return the first index at which a loosely equal value can be
 * found in the array (if value is a plain object, the array must
 * contain an object of the same shape), or -1 if it is not present.
 */
function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured',
  'serverPrefetch'
];

/*  */



var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: process.env.NODE_ENV !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: process.env.NODE_ENV !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Perform updates asynchronously. Intended to be used by Vue Test Utils
   * This will significantly reduce performance if set to false.
   */
  async: true,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * unicode letters used for parsing html tags, component names and property paths.
 * using https://www.w3.org/TR/html53/semantics-scripting.html#potentialcustomelementname
 * skipping \u10000-\uEFFFF due to it freezing up PhantomJS
 */
var unicodeLetters = 'a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD';

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = new RegExp(("[^" + unicodeLetters + ".$_\\d]"));
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;
var isPhantomJS = UA && /phantomjs/.test(UA);
var isFF = UA && UA.match(/firefox\/(\d+)/);

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'] && global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = /*@__PURE__*/(function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;
var tip = noop;
var generateComponentTrace = (noop); // work around flow check
var formatComponentName = (noop);

if (process.env.NODE_ENV !== 'production') {
  var hasConsole = typeof console !== 'undefined';
  var classifyRE = /(?:^|[-_])(\w)/g;
  var classify = function (str) { return str
    .replace(classifyRE, function (c) { return c.toUpperCase(); })
    .replace(/[-_]/g, ''); };

  warn = function (msg, vm) {
    var trace = vm ? generateComponentTrace(vm) : '';

    if (config.warnHandler) {
      config.warnHandler.call(null, msg, vm, trace);
    } else if (hasConsole && (!config.silent)) {
      console.error(("[Vue warn]: " + msg + trace));
    }
  };

  tip = function (msg, vm) {
    if (hasConsole && (!config.silent)) {
      console.warn("[Vue tip]: " + msg + (
        vm ? generateComponentTrace(vm) : ''
      ));
    }
  };

  formatComponentName = function (vm, includeFile) {
    if (vm.$root === vm) {
      return '<Root>'
    }
    var options = typeof vm === 'function' && vm.cid != null
      ? vm.options
      : vm._isVue
        ? vm.$options || vm.constructor.options
        : vm;
    var name = options.name || options._componentTag;
    var file = options.__file;
    if (!name && file) {
      var match = file.match(/([^/\\]+)\.vue$/);
      name = match && match[1];
    }

    return (
      (name ? ("<" + (classify(name)) + ">") : "<Anonymous>") +
      (file && includeFile !== false ? (" at " + file) : '')
    )
  };

  var repeat = function (str, n) {
    var res = '';
    while (n) {
      if (n % 2 === 1) { res += str; }
      if (n > 1) { str += str; }
      n >>= 1;
    }
    return res
  };

  generateComponentTrace = function (vm) {
    if (vm._isVue && vm.$parent) {
      var tree = [];
      var currentRecursiveSequence = 0;
      while (vm) {
        if (tree.length > 0) {
          var last = tree[tree.length - 1];
          if (last.constructor === vm.constructor) {
            currentRecursiveSequence++;
            vm = vm.$parent;
            continue
          } else if (currentRecursiveSequence > 0) {
            tree[tree.length - 1] = [last, currentRecursiveSequence];
            currentRecursiveSequence = 0;
          }
        }
        tree.push(vm);
        vm = vm.$parent;
      }
      return '\n\nfound in\n\n' + tree
        .map(function (vm, i) { return ("" + (i === 0 ? '---> ' : repeat(' ', 5 + i * 2)) + (Array.isArray(vm)
            ? ((formatComponentName(vm[0])) + "... (" + (vm[1]) + " recursive calls)")
            : formatComponentName(vm))); })
        .join('\n')
    } else {
      return ("\n\n(found in " + (formatComponentName(vm)) + ")")
    }
  };
}

/*  */

var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  if (process.env.NODE_ENV !== 'production' && !config.async) {
    // subs aren't sorted in scheduler if not running async
    // we need to sort them now to make sure they fire in correct
    // order
    subs.sort(function (a, b) { return a.id - b.id; });
  }
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null;
var targetStack = [];

function pushTarget (target) {
  targetStack.push(target);
  Dep.target = target;
}

function popTarget () {
  targetStack.pop();
  Dep.target = targetStack[targetStack.length - 1];
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    // #7975
    // clone children array to avoid mutating original in case of cloning
    // a child.
    vnode.children && vnode.children.slice(),
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.asyncMeta = vnode.asyncMeta;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    if (hasProto) {
      protoAugment(value, arrayMethods);
    } else {
      copyAugment(value, arrayMethods, arrayKeys);
    }
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through all properties and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment a target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment a target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive$$1 (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key];
  }

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter();
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) { return }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot set reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid adding reactive properties to a Vue instance or its root $data ' +
      'at runtime - declare it upfront in the data option.'
    );
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive$$1(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (process.env.NODE_ENV !== 'production' &&
    (isUndef(target) || isPrimitive(target))
  ) {
    warn(("Cannot delete reactive property on undefined, null, or primitive value: " + ((target))));
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    process.env.NODE_ENV !== 'production' && warn(
      'Avoid deleting properties on a Vue instance or its root $data ' +
      '- just set it to null.'
    );
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Options with restrictions
 */
if (process.env.NODE_ENV !== 'production') {
  strats.el = strats.propsData = function (parent, child, vm, key) {
    if (!vm) {
      warn(
        "option \"" + key + "\" can only be used during instance " +
        'creation with the `new` keyword.'
      );
    }
    return defaultStrat(parent, child)
  };
}

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;

  var keys = hasSymbol
    ? Reflect.ownKeys(from)
    : Object.keys(from);

  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    // in case the object is already observed...
    if (key === '__ob__') { continue }
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (
      toVal !== fromVal &&
      isPlainObject(toVal) &&
      isPlainObject(fromVal)
    ) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'The "data" option should be a function ' +
        'that returns a per-instance value in component ' +
        'definitions.',
        vm
      );

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  var res = childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal;
  return res
    ? dedupeHooks(res)
    : res
}

function dedupeHooks (hooks) {
  var res = [];
  for (var i = 0; i < hooks.length; i++) {
    if (res.indexOf(hooks[i]) === -1) {
      res.push(hooks[i]);
    }
  }
  return res
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    process.env.NODE_ENV !== 'production' && assertObjectType(key, childVal, vm);
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && process.env.NODE_ENV !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Validate component names
 */
function checkComponents (options) {
  for (var key in options.components) {
    validateComponentName(key);
  }
}

function validateComponentName (name) {
  if (!new RegExp(("^[a-zA-Z][\\-\\.0-9_" + unicodeLetters + "]*$")).test(name)) {
    warn(
      'Invalid component name: "' + name + '". Component names ' +
      'should conform to valid custom element name in html5 specification.'
    );
  }
  if (isBuiltInTag(name) || config.isReservedTag(name)) {
    warn(
      'Do not use built-in or reserved HTML elements as component ' +
      'id: ' + name
    );
  }
}

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      } else if (process.env.NODE_ENV !== 'production') {
        warn('props must be strings when using array syntax.');
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"props\": expected an Array or an Object, " +
      "but got " + (toRawType(props)) + ".",
      vm
    );
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  } else if (process.env.NODE_ENV !== 'production') {
    warn(
      "Invalid value for option \"inject\": expected an Array or an Object, " +
      "but got " + (toRawType(inject)) + ".",
      vm
    );
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def$$1 = dirs[key];
      if (typeof def$$1 === 'function') {
        dirs[key] = { bind: def$$1, update: def$$1 };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {
  if (process.env.NODE_ENV !== 'production') {
    checkComponents(child);
  }

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);

  // Apply extends and mixins on the child options,
  // but only if it is a raw options object that isn't
  // the result of another mergeOptions call.
  // Only merged options has the _base property.
  if (!child._base) {
    if (child.extends) {
      parent = mergeOptions(parent, child.extends, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        parent = mergeOptions(parent, child.mixins[i], vm);
      }
    }
  }

  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
    warn(
      'Failed to resolve ' + type.slice(0, -1) + ': ' + id,
      options
    );
  }
  return res
}

/*  */



function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  if (
    process.env.NODE_ENV !== 'production' &&
    // skip validation for weex recycle-list child component props
    !(false)
  ) {
    assertProp(prop, key, value, vm, absent);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // warn against non-factory defaults for Object & Array
  if (process.env.NODE_ENV !== 'production' && isObject(def)) {
    warn(
      'Invalid default value for prop "' + key + '": ' +
      'Props with type Object/Array must use a factory function ' +
      'to return the default value.',
      vm
    );
  }
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Assert whether a prop is valid.
 */
function assertProp (
  prop,
  name,
  value,
  vm,
  absent
) {
  if (prop.required && absent) {
    warn(
      'Missing required prop: "' + name + '"',
      vm
    );
    return
  }
  if (value == null && !prop.required) {
    return
  }
  var type = prop.type;
  var valid = !type || type === true;
  var expectedTypes = [];
  if (type) {
    if (!Array.isArray(type)) {
      type = [type];
    }
    for (var i = 0; i < type.length && !valid; i++) {
      var assertedType = assertType(value, type[i]);
      expectedTypes.push(assertedType.expectedType || '');
      valid = assertedType.valid;
    }
  }

  if (!valid) {
    warn(
      getInvalidTypeMessage(name, value, expectedTypes),
      vm
    );
    return
  }
  var validator = prop.validator;
  if (validator) {
    if (!validator(value)) {
      warn(
        'Invalid prop: custom validator check failed for prop "' + name + '".',
        vm
      );
    }
  }
}

var simpleCheckRE = /^(String|Number|Boolean|Function|Symbol)$/;

function assertType (value, type) {
  var valid;
  var expectedType = getType(type);
  if (simpleCheckRE.test(expectedType)) {
    var t = typeof value;
    valid = t === expectedType.toLowerCase();
    // for primitive wrapper objects
    if (!valid && t === 'object') {
      valid = value instanceof type;
    }
  } else if (expectedType === 'Object') {
    valid = isPlainObject(value);
  } else if (expectedType === 'Array') {
    valid = Array.isArray(value);
  } else {
    valid = value instanceof type;
  }
  return {
    valid: valid,
    expectedType: expectedType
  }
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

function getInvalidTypeMessage (name, value, expectedTypes) {
  var message = "Invalid prop: type check failed for prop \"" + name + "\"." +
    " Expected " + (expectedTypes.map(capitalize).join(', '));
  var expectedType = expectedTypes[0];
  var receivedType = toRawType(value);
  var expectedValue = styleValue(value, expectedType);
  var receivedValue = styleValue(value, receivedType);
  // check if we need to specify expected value
  if (expectedTypes.length === 1 &&
      isExplicable(expectedType) &&
      !isBoolean(expectedType, receivedType)) {
    message += " with value " + expectedValue;
  }
  message += ", got " + receivedType + " ";
  // check if we need to specify received value
  if (isExplicable(receivedType)) {
    message += "with value " + receivedValue + ".";
  }
  return message
}

function styleValue (value, type) {
  if (type === 'String') {
    return ("\"" + value + "\"")
  } else if (type === 'Number') {
    return ("" + (Number(value)))
  } else {
    return ("" + value)
  }
}

function isExplicable (value) {
  var explicitTypes = ['string', 'number', 'boolean'];
  return explicitTypes.some(function (elem) { return value.toLowerCase() === elem; })
}

function isBoolean () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return args.some(function (elem) { return elem.toLowerCase() === 'boolean'; })
}

/*  */

function handleError (err, vm, info) {
  // Deactivate deps tracking while processing error handler to avoid possible infinite rendering.
  // See: https://github.com/vuejs/vuex/issues/1505
  pushTarget();
  try {
    if (vm) {
      var cur = vm;
      while ((cur = cur.$parent)) {
        var hooks = cur.$options.errorCaptured;
        if (hooks) {
          for (var i = 0; i < hooks.length; i++) {
            try {
              var capture = hooks[i].call(cur, err, vm, info) === false;
              if (capture) { return }
            } catch (e) {
              globalHandleError(e, cur, 'errorCaptured hook');
            }
          }
        }
      }
    }
    globalHandleError(err, vm, info);
  } finally {
    popTarget();
  }
}

function invokeWithErrorHandling (
  handler,
  context,
  args,
  vm,
  info
) {
  var res;
  try {
    res = args ? handler.apply(context, args) : handler.call(context);
    if (res && !res._isVue && isPromise(res)) {
      // issue #9511
      // reassign to res to avoid catch triggering multiple times when nested calls
      res = res.catch(function (e) { return handleError(e, vm, info + " (Promise/async)"); });
    }
  } catch (e) {
    handleError(e, vm, info);
  }
  return res
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      // if the user intentionally throws the original error in the handler,
      // do not log it twice
      if (e !== err) {
        logError(e, null, 'config.errorHandler');
      }
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  if (process.env.NODE_ENV !== 'production') {
    warn(("Error in " + info + ": \"" + (err.toString()) + "\""), vm);
  }
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */

var isUsingMicroTask = false;

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using microtasks.
// In 2.5 we used (macro) tasks (in combination with microtasks).
// However, it has subtle problems when state is changed right before repaint
// (e.g. #6813, out-in transitions).
// Also, using (macro) tasks in event handler would cause some weird behaviors
// that cannot be circumvented (e.g. #7109, #7153, #7546, #7834, #8109).
// So we now use microtasks everywhere, again.
// A major drawback of this tradeoff is that there are some scenarios
// where microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690, which have workarounds)
// or even between bubbling of the same event (#6566).
var timerFunc;

// The nextTick behavior leverages the microtask queue, which can be accessed
// via either native Promise.then or MutationObserver.
// MutationObserver has wider support, however it is seriously bugged in
// UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
// completely stops working after triggering a few times... so, if native
// Promise is available, we will use it:
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  timerFunc = function () {
    p.then(flushCallbacks);
    // In problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
  isUsingMicroTask = true;
} else if (!isIE && typeof MutationObserver !== 'undefined' && (
  isNative(MutationObserver) ||
  // PhantomJS and iOS 7.x
  MutationObserver.toString() === '[object MutationObserverConstructor]'
)) {
  // Use MutationObserver where native Promise is not available,
  // e.g. PhantomJS, iOS7, Android 4.4
  // (#6466 MutationObserver is unreliable in IE11)
  var counter = 1;
  var observer = new MutationObserver(flushCallbacks);
  var textNode = document.createTextNode(String(counter));
  observer.observe(textNode, {
    characterData: true
  });
  timerFunc = function () {
    counter = (counter + 1) % 2;
    textNode.data = String(counter);
  };
  isUsingMicroTask = true;
} else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  // Fallback to setImmediate.
  // Techinically it leverages the (macro) task queue,
  // but it is still a better choice than setTimeout.
  timerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else {
  // Fallback to setTimeout.
  timerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    timerFunc();
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

/* not type checking this file because flow doesn't play well with Proxy */

var initProxy;

if (process.env.NODE_ENV !== 'production') {
  var allowedGlobals = makeMap(
    'Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require' // for Webpack/Browserify
  );

  var warnNonPresent = function (target, key) {
    warn(
      "Property or method \"" + key + "\" is not defined on the instance but " +
      'referenced during render. Make sure that this property is reactive, ' +
      'either in the data option, or for class-based components, by ' +
      'initializing the property. ' +
      'See: https://vuejs.org/v2/guide/reactivity.html#Declaring-Reactive-Properties.',
      target
    );
  };

  var warnReservedPrefix = function (target, key) {
    warn(
      "Property \"" + key + "\" must be accessed with \"$data." + key + "\" because " +
      'properties starting with "$" or "_" are not proxied in the Vue instance to ' +
      'prevent conflicts with Vue internals' +
      'See: https://vuejs.org/v2/api/#data',
      target
    );
  };

  var hasProxy =
    typeof Proxy !== 'undefined' && isNative(Proxy);

  if (hasProxy) {
    var isBuiltInModifier = makeMap('stop,prevent,self,ctrl,shift,alt,meta,exact');
    config.keyCodes = new Proxy(config.keyCodes, {
      set: function set (target, key, value) {
        if (isBuiltInModifier(key)) {
          warn(("Avoid overwriting built-in modifier in config.keyCodes: ." + key));
          return false
        } else {
          target[key] = value;
          return true
        }
      }
    });
  }

  var hasHandler = {
    has: function has (target, key) {
      var has = key in target;
      var isAllowed = allowedGlobals(key) ||
        (typeof key === 'string' && key.charAt(0) === '_' && !(key in target.$data));
      if (!has && !isAllowed) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return has || !isAllowed
    }
  };

  var getHandler = {
    get: function get (target, key) {
      if (typeof key === 'string' && !(key in target)) {
        if (key in target.$data) { warnReservedPrefix(target, key); }
        else { warnNonPresent(target, key); }
      }
      return target[key]
    }
  };

  initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }
  };
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

var mark;
var measure;

if (process.env.NODE_ENV !== 'production') {
  var perf = inBrowser && window.performance;
  /* istanbul ignore if */
  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    perf.clearMeasures
  ) {
    mark = function (tag) { return perf.mark(tag); };
    measure = function (name, startTag, endTag) {
      perf.measure(name, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
      // perf.clearMeasures(name)
    };
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns, vm) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments$1, vm, "v-on handler");
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, "v-on handler")
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  createOnceHandler,
  vm
) {
  var name, def$$1, cur, old, event;
  for (name in on) {
    def$$1 = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    if (isUndef(cur)) {
      process.env.NODE_ENV !== 'production' && warn(
        "Invalid handler for event \"" + (event.name) + "\": got " + String(cur),
        vm
      );
    } else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur, vm);
      }
      if (isTrue(event.once)) {
        cur = on[name] = createOnceHandler(event.name, cur, event.capture);
      }
      add(event.name, cur, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      if (process.env.NODE_ENV !== 'production') {
        var keyInLowerCase = key.toLowerCase();
        if (
          key !== keyInLowerCase &&
          attrs && hasOwn(attrs, keyInLowerCase)
        ) {
          tip(
            "Prop \"" + keyInLowerCase + "\" is passed to component " +
            (formatComponentName(tag || Ctor)) + ", but the declared prop name is" +
            " \"" + key + "\". " +
            "Note that HTML attributes are case-insensitive and camelCased " +
            "props need to use their kebab-case equivalents when using in-DOM " +
            "templates. You should probably use \"" + altKey + "\" instead of \"" + key + "\"."
          );
        }
      }
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive$$1(vm, key, result[key], function () {
          warn(
            "Avoid mutating an injected value directly since the changes will be " +
            "overwritten whenever the provided component re-renders. " +
            "injection being mutated: \"" + key + "\"",
            vm
          );
        });
      } else {
        defineReactive$$1(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject)
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      // #6574 in case the inject object is observed...
      if (key === '__ob__') { continue }
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        } else if (process.env.NODE_ENV !== 'production') {
          warn(("Injection \"" + key + "\" not found"), vm);
        }
      }
    }
    return result
  }
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  if (!children || !children.length) {
    return {}
  }
  var slots = {};
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

/*  */

function normalizeScopedSlots (
  slots,
  normalSlots,
  prevSlots
) {
  var res;
  var isStable = slots ? !!slots.$stable : true;
  var key = slots && slots.$key;
  if (!slots) {
    res = {};
  } else if (slots._normalized) {
    // fast path 1: child component re-render only, parent did not change
    return slots._normalized
  } else if (
    isStable &&
    prevSlots &&
    prevSlots !== emptyObject &&
    key === prevSlots.$key &&
    Object.keys(normalSlots).length === 0
  ) {
    // fast path 2: stable scoped slots w/ no normal slots to proxy,
    // only need to normalize once
    return prevSlots
  } else {
    res = {};
    for (var key$1 in slots) {
      if (slots[key$1] && key$1[0] !== '$') {
        res[key$1] = normalizeScopedSlot(normalSlots, key$1, slots[key$1]);
      }
    }
  }
  // expose normal slots on scopedSlots
  for (var key$2 in normalSlots) {
    if (!(key$2 in res)) {
      res[key$2] = proxyNormalSlot(normalSlots, key$2);
    }
  }
  // avoriaz seems to mock a non-extensible $scopedSlots object
  // and when that is passed down this would cause an error
  if (slots && Object.isExtensible(slots)) {
    (slots)._normalized = res;
  }
  def(res, '$stable', isStable);
  def(res, '$key', key);
  return res
}

function normalizeScopedSlot(normalSlots, key, fn) {
  var normalized = function () {
    var res = arguments.length ? fn.apply(null, arguments) : fn({});
    res = res && typeof res === 'object' && !Array.isArray(res)
      ? [res] // single vnode
      : normalizeChildren(res);
    return res && res.length === 0
      ? undefined
      : res
  };
  // this is a slot using the new v-slot syntax without scope. although it is
  // compiled as a scoped slot, render fn users would expect it to be present
  // on this.$slots because the usage is semantically a normal slot.
  if (fn.proxy) {
    Object.defineProperty(normalSlots, key, {
      get: normalized,
      enumerable: true,
      configurable: true
    });
  }
  return normalized
}

function proxyNormalSlot(slots, key) {
  return function () { return slots[key]; }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    if (hasSymbol && val[Symbol.iterator]) {
      ret = [];
      var iterator = val[Symbol.iterator]();
      var result = iterator.next();
      while (!result.done) {
        ret.push(render(result.value, ret.length));
        result = iterator.next();
      }
    } else {
      keys = Object.keys(val);
      ret = new Array(keys.length);
      for (i = 0, l = keys.length; i < l; i++) {
        key = keys[i];
        ret[i] = render(val[key], key, i);
      }
    }
  }
  if (!isDef(ret)) {
    ret = [];
  }
  (ret)._isVList = true;
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      if (process.env.NODE_ENV !== 'production' && !isObject(bindObject)) {
        warn(
          'slot v-bind without argument expects an Object',
          this
        );
      }
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    nodes = this.$slots[name] || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-bind without argument expects an Object or Array value',
        this
      );
    } else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        var camelizedKey = camelize(key);
        if (!(key in hash) && !(camelizedKey in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + camelizedKey)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on without argument expects an Object value',
        this
      );
    } else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function resolveScopedSlots (
  fns, // see flow/vnode
  res,
  // the following are added in 2.6
  hasDynamicKeys,
  contentHashKey
) {
  res = res || { $stable: !hasDynamicKeys };
  for (var i = 0; i < fns.length; i++) {
    var slot = fns[i];
    if (Array.isArray(slot)) {
      resolveScopedSlots(slot, res, hasDynamicKeys);
    } else if (slot) {
      // marker for reverse proxying v-slot without scope on this.$slots
      if (slot.proxy) {
        slot.fn.proxy = true;
      }
      res[slot.key] = slot.fn;
    }
  }
  if (contentHashKey) {
    (res).$key = contentHashKey;
  }
  return res
}

/*  */

function bindDynamicKeys (baseObj, values) {
  for (var i = 0; i < values.length; i += 2) {
    var key = values[i];
    if (typeof key === 'string' && key) {
      baseObj[values[i]] = values[i + 1];
    } else if (process.env.NODE_ENV !== 'production' && key !== '' && key !== null) {
      // null is a speical value for explicitly removing a binding
      warn(
        ("Invalid value for dynamic directive argument (expected string or null): " + key),
        this
      );
    }
  }
  return baseObj
}

// helper to dynamically append modifier runtime markers to event names.
// ensure only append when value is already string, otherwise it will be cast
// to string and cause the type check to miss.
function prependModifier (value, symbol) {
  return typeof value === 'string' ? symbol + value : value
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
  target._d = bindDynamicKeys;
  target._p = prependModifier;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var this$1 = this;

  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () {
    if (!this$1.$slots) {
      normalizeScopedSlots(
        data.scopedSlots,
        this$1.$slots = resolveSlots(children, parent)
      );
    }
    return this$1.$slots
  };

  Object.defineProperty(this, 'scopedSlots', ({
    enumerable: true,
    get: function get () {
      return normalizeScopedSlots(data.scopedSlots, this.slots())
    }
  }));

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = normalizeScopedSlots(data.scopedSlots, this.$slots);
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options, renderContext)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options, renderContext);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options, renderContext) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (process.env.NODE_ENV !== 'production') {
    (clone.devtoolsMeta = clone.devtoolsMeta || {}).renderContext = renderContext;
  }
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */

/*  */

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (vnode, hydrating) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(("Invalid Component definition: " + (String(Ctor))), context);
    }
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent // activeInstance in lifecycle state
) {
  var options = {
    _isComponent: true,
    _parentVnode: vnode,
    parent: parent
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    var existing = hooks[key];
    var toMerge = componentVNodeHooks[key];
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook$1(toMerge, existing) : toMerge;
    }
  }
}

function mergeHook$1 (f1, f2) {
  var merged = function (a, b) {
    // flow complains about extra args which is why we use any
    f1(a, b);
    f2(a, b);
  };
  merged._merged = true;
  return merged
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input'
  ;(data.attrs || (data.attrs = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  var existing = on[event];
  var callback = data.model.callback;
  if (isDef(existing)) {
    if (
      Array.isArray(existing)
        ? existing.indexOf(callback) === -1
        : existing !== callback
    ) {
      on[event] = [callback].concat(existing);
    }
  } else {
    on[event] = callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
      'Always create fresh vnode data objects in each render!',
      context
    );
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    {
      warn(
        'Avoid using non-primitive value as key, ' +
        'use string/number value instead.',
        context
      );
    }
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  if (process.env.NODE_ENV !== 'production') {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, function () {
      !isUpdatingChildComponent && warn("$attrs is readonly.", vm);
    }, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, function () {
      !isUpdatingChildComponent && warn("$listeners is readonly.", vm);
    }, true);
  } else {
    defineReactive$$1(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive$$1(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

var currentRenderingInstance = null;

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = normalizeScopedSlots(
        _parentVnode.data.scopedSlots,
        vm.$slots,
        vm.$scopedSlots
      );
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      // There's no need to maintain a stack becaues all render fns are called
      // separately from one another. Nested component's render fns are called
      // when parent component is patched.
      currentRenderingInstance = vm;
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e);
        } catch (e) {
          handleError(e, vm, "renderError");
          vnode = vm._vnode;
        }
      } else {
        vnode = vm._vnode;
      }
    } finally {
      currentRenderingInstance = null;
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0];
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        );
      }
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  var owner = currentRenderingInstance;
  if (isDef(factory.owners)) {
    // already pending
    factory.owners.push(owner);
  } else {
    var owners = factory.owners = [owner];
    var sync = true;

    var forceRender = function (renderCompleted) {
      for (var i = 0, l = owners.length; i < l; i++) {
        (owners[i]).$forceUpdate();
      }

      if (renderCompleted) {
        owners.length = 0;
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender(true);
      } else {
        owners.length = 0;
      }
    });

    var reject = once(function (reason) {
      process.env.NODE_ENV !== 'production' && warn(
        "Failed to resolve async component: " + (String(factory)) +
        (reason ? ("\nReason: " + reason) : '')
      );
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender(true);
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (isPromise(res)) {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isPromise(res.component)) {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender(false);
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                process.env.NODE_ENV !== 'production'
                  ? ("timeout (" + (res.timeout) + "ms)")
                  : null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn) {
  target.$on(event, fn);
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function createOnceHandler (event, fn) {
  var _target = target;
  return function onceHandler () {
    var res = fn.apply(null, arguments);
    if (res !== null) {
      _target.$off(event, onceHandler);
    }
  }
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, createOnceHandler, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        vm.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i$1 = 0, l = event.length; i$1 < l; i$1++) {
        vm.$off(event[i$1], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    // specific handler
    var cb;
    var i = cbs.length;
    while (i--) {
      cb = cbs[i];
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1);
        break
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    if (process.env.NODE_ENV !== 'production') {
      var lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
        tip(
          "Event \"" + lowerCaseEvent + "\" is emitted in component " +
          (formatComponentName(vm)) + " but the handler is registered for \"" + event + "\". " +
          "Note that HTML attributes are case-insensitive and you cannot use " +
          "v-on to listen to camelCase events when using in-DOM templates. " +
          "You should probably use \"" + (hyphenate(event)) + "\" instead of \"" + event + "\"."
        );
      }
    }
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      var info = "event handler for \"" + event + "\"";
      for (var i = 0, l = cbs.length; i < l; i++) {
        invokeWithErrorHandling(cbs[i], vm, args, vm, info);
      }
    }
    return vm
  };
}

/*  */

var activeInstance = null;
var isUpdatingChildComponent = false;

function setActiveInstance(vm) {
  var prevActiveInstance = activeInstance;
  activeInstance = vm;
  return function () {
    activeInstance = prevActiveInstance;
  }
}

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var restoreActiveInstance = setActiveInstance(vm);
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */);
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    restoreActiveInstance();
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
    if (process.env.NODE_ENV !== 'production') {
      /* istanbul ignore if */
      if ((vm.$options.template && vm.$options.template.charAt(0) !== '#') ||
        vm.$options.el || el) {
        warn(
          'You are using the runtime-only build of Vue where the template ' +
          'compiler is not available. Either pre-compile the templates into ' +
          'render functions, or use the compiler-included build.',
          vm
        );
      } else {
        warn(
          'Failed to mount component: template or render function not defined.',
          vm
        );
      }
    }
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
    updateComponent = function () {
      var name = vm._name;
      var id = vm._uid;
      var startTag = "vue-perf-start:" + id;
      var endTag = "vue-perf-end:" + id;

      mark(startTag);
      var vnode = vm._render();
      mark(endTag);
      measure(("vue " + name + " render"), startTag, endTag);

      mark(startTag);
      vm._update(vnode, hydrating);
      mark(endTag);
      measure(("vue " + name + " patch"), startTag, endTag);
    };
  } else {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before: function before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate');
      }
    }
  }, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {
  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = true;
  }

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren.

  // check if there are dynamic scopedSlots (hand-written or compiled but with
  // dynamic slot names). Static scoped slots compiled from template has the
  // "$stable" marker.
  var newScopedSlots = parentVnode.data.scopedSlots;
  var oldScopedSlots = vm.$scopedSlots;
  var hasDynamicScopedSlot = !!(
    (newScopedSlots && !newScopedSlots.$stable) ||
    (oldScopedSlots !== emptyObject && !oldScopedSlots.$stable) ||
    (newScopedSlots && vm.$scopedSlots.$key !== newScopedSlots.$key)
  );

  // Any static slot children from the parent may have changed during parent's
  // update. Dynamic scoped slots may also have changed. In such cases, a forced
  // update is necessary to ensure correctness.
  var needsForceUpdate = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    hasDynamicScopedSlot
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (needsForceUpdate) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }

  if (process.env.NODE_ENV !== 'production') {
    isUpdatingChildComponent = false;
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  var info = hook + " hook";
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      invokeWithErrorHandling(handlers[i], vm, null, vm, info);
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

/*  */

var MAX_UPDATE_COUNT = 100;

var queue = [];
var activatedChildren = [];
var has = {};
var circular = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  if (process.env.NODE_ENV !== 'production') {
    circular = {};
  }
  waiting = flushing = false;
}

// Async edge case #6566 requires saving the timestamp when event listeners are
// attached. However, calling performance.now() has a perf overhead especially
// if the page has thousands of event listeners. Instead, we take a timestamp
// every time the scheduler flushes and use that for all event listeners
// attached during that flush.
var currentFlushTimestamp = 0;

// Async edge case fix requires storing an event listener's attach timestamp.
var getNow = Date.now;

// Determine what event timestamp the browser is using. Annoyingly, the
// timestamp can either be hi-res (relative to page load) or low-res
// (relative to UNIX epoch), so in order to compare time we have to use the
// same timestamp type when saving the flush timestamp.
if (inBrowser && getNow() > document.createEvent('Event').timeStamp) {
  // if the low-res timestamp which is bigger than the event timestamp
  // (which is evaluated AFTER) it means the event is using a hi-res timestamp,
  // and we need to use the hi-res version for event listeners as well.
  getNow = function () { return performance.now(); };
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  currentFlushTimestamp = getNow();
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    if (watcher.before) {
      watcher.before();
    }
    id = watcher.id;
    has[id] = null;
    watcher.run();
    // in dev build, check and stop circular updates.
    if (process.env.NODE_ENV !== 'production' && has[id] != null) {
      circular[id] = (circular[id] || 0) + 1;
      if (circular[id] > MAX_UPDATE_COUNT) {
        warn(
          'You may have an infinite update loop ' + (
            watcher.user
              ? ("in watcher with expression \"" + (watcher.expression) + "\"")
              : "in a component render function."
          ),
          watcher.vm
        );
        break
      }
    }
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;

      if (process.env.NODE_ENV !== 'production' && !config.async) {
        flushSchedulerQueue();
        return
      }
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */



var uid$2 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.before = options.before;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = process.env.NODE_ENV !== 'production'
    ? expOrFn.toString()
    : '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = noop;
      process.env.NODE_ENV !== 'production' && warn(
        "Failed watching path: \"" + expOrFn + "\" " +
        'Watcher only accepts simple dot-delimited paths. ' +
        'For full control, use a function instead.',
        vm
      );
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
  var i = this.deps.length;
  while (i--) {
    var dep = this.deps[i];
    if (!this.newDepIds.has(dep.id)) {
      dep.removeSub(this);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
  var i = this.deps.length;
  while (i--) {
    this.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this.deps[i].removeSub(this);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      var hyphenatedKey = hyphenate(key);
      if (isReservedAttribute(hyphenatedKey) ||
          config.isReservedAttr(hyphenatedKey)) {
        warn(
          ("\"" + hyphenatedKey + "\" is a reserved attribute and cannot be used as component prop."),
          vm
        );
      }
      defineReactive$$1(props, key, value, function () {
        if (!isRoot && !isUpdatingChildComponent) {
          warn(
            "Avoid mutating a prop directly since the value will be " +
            "overwritten whenever the parent component re-renders. " +
            "Instead, use a data or computed property based on the prop's " +
            "value. Prop being mutated: \"" + key + "\"",
            vm
          );
        }
      });
    } else {
      defineReactive$$1(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
    process.env.NODE_ENV !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (process.env.NODE_ENV !== 'production') {
      if (methods && hasOwn(methods, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a data property."),
          vm
        );
      }
    }
    if (props && hasOwn(props, key)) {
      process.env.NODE_ENV !== 'production' && warn(
        "The data property \"" + key + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    if (process.env.NODE_ENV !== 'production' && getter == null) {
      warn(
        ("Getter is missing for computed property \"" + key + "\"."),
        vm
      );
    }

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    } else if (process.env.NODE_ENV !== 'production') {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  if (process.env.NODE_ENV !== 'production' &&
      sharedPropertyDefinition.set === noop) {
    sharedPropertyDefinition.set = function () {
      warn(
        ("Computed property \"" + key + "\" was assigned to but it has no setter."),
        this
      );
    };
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof methods[key] !== 'function') {
        warn(
          "Method \"" + key + "\" has type \"" + (typeof methods[key]) + "\" in the component definition. " +
          "Did you reference the function correctly?",
          vm
        );
      }
      if (props && hasOwn(props, key)) {
        warn(
          ("Method \"" + key + "\" has already been defined as a prop."),
          vm
        );
      }
      if ((key in vm) && isReserved(key)) {
        warn(
          "Method \"" + key + "\" conflicts with an existing Vue instance method. " +
          "Avoid defining component methods that start with _ or $."
        );
      }
    }
    vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  if (process.env.NODE_ENV !== 'production') {
    dataDef.set = function () {
      warn(
        'Avoid replacing instance root $data. ' +
        'Use nested data properties instead.',
        this
      );
    };
    propsDef.set = function () {
      warn("$props is readonly.", this);
    };
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value);
      } catch (error) {
        handleError(error, vm, ("callback for immediate watcher \"" + (watcher.expression) + "\""));
      }
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    var startTag, endTag;
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = "vue-perf-start:" + (vm._uid);
      endTag = "vue-perf-end:" + (vm._uid);
      mark(startTag);
    }

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm);
    } else {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(("vue " + (vm._name) + " init"), startTag, endTag);
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = latest[key];
    }
  }
  return modified
}

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name);
    }

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production' && type === 'component') {
          validateComponentName(id);
        }
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */



function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    for (var key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  if (process.env.NODE_ENV !== 'production') {
    configDef.set = function () {
      warn(
        'Do not replace the Vue.config object, set individual fields instead.'
      );
    };
  }
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive$$1
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  // 2.6 explicit observable API
  Vue.observable = function (obj) {
    observe(obj);
    return obj
  };

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.6.7';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isValidContentEditableValue = makeMap('events,caret,typing,plaintext-only');

var convertEnumeratedValue = function (key, value) {
  return isFalsyAttrValue(value) || value === 'false'
    ? 'false'
    // allow arbitrary string value for contenteditable
    : key === 'contenteditable' && isValidContentEditableValue(value)
      ? value
      : 'true'
};

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);

var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + el
      );
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}

var nodeOps = /*#__PURE__*/Object.freeze({
  createElement: createElement$1,
  createElementNS: createElementNS,
  createTextNode: createTextNode,
  createComment: createComment,
  insertBefore: insertBefore,
  removeChild: removeChild,
  appendChild: appendChild,
  parentNode: parentNode,
  nextSibling: nextSibling,
  tagName: tagName,
  setTextContent: setTextContent,
  setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove$$1 () {
      if (--remove$$1.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove$$1.listeners = listeners;
    return remove$$1
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function isUnknownElement$$1 (vnode, inVPre) {
    return (
      !inVPre &&
      !vnode.ns &&
      !(
        config.ignoredElements.length &&
        config.ignoredElements.some(function (ignore) {
          return isRegExp(ignore)
            ? ignore.test(vnode.tag)
            : ignore === vnode.tag
        })
      ) &&
      config.isUnknownElement(vnode.tag)
    )
  }

  var creatingElmInVPre = 0;

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {
      if (process.env.NODE_ENV !== 'production') {
        if (data && data.pre) {
          creatingElmInVPre++;
        }
        if (isUnknownElement$$1(vnode, creatingElmInVPre)) {
          warn(
            'Unknown custom element: <' + tag + '> - did you ' +
            'register the component correctly? For recursive components, ' +
            'make sure to provide the "name" option.',
            vnode.context
          );
        }
      }

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }

      if (process.env.NODE_ENV !== 'production' && data && data.pre) {
        creatingElmInVPre--;
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        insert(parentElm, vnode.elm, refElm);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (nodeOps.parentNode(ref$$1) === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      if (process.env.NODE_ENV !== 'production') {
        checkDuplicateKeys(children);
      }
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    if (process.env.NODE_ENV !== 'production') {
      checkDuplicateKeys(newCh);
    }

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue, newCh, newEndIdx);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue, newCh, newStartIdx);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function checkDuplicateKeys (children) {
    var seenKeys = {};
    for (var i = 0; i < children.length; i++) {
      var vnode = children[i];
      var key = vnode.key;
      if (isDef(key)) {
        if (seenKeys[key]) {
          warn(
            ("Duplicate keys detected: '" + key + "'. This may cause an update error."),
            vnode.context
          );
        } else {
          seenKeys[key] = true;
        }
      }
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (
    oldVnode,
    vnode,
    insertedVnodeQueue,
    ownerArray,
    index,
    removeOnly
  ) {
    if (oldVnode === vnode) {
      return
    }

    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // clone reused vnode
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (process.env.NODE_ENV !== 'production') {
          checkDuplicateKeys(ch);
        }
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }

  var hydrationBailed = false;
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    // assert node match
    if (process.env.NODE_ENV !== 'production') {
      if (!assertNodeMatch(elm, vnode, inVPre)) {
        return false
      }
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('server innerHTML: ', i);
                console.warn('client innerHTML: ', elm.innerHTML);
              }
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              /* istanbul ignore if */
              if (process.env.NODE_ENV !== 'production' &&
                typeof console !== 'undefined' &&
                !hydrationBailed
              ) {
                hydrationBailed = true;
                console.warn('Parent: ', elm);
                console.warn('Mismatching childNodes vs. VNodes: ', elm.childNodes, children);
              }
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  function assertNodeMatch (node, vnode, inVPre) {
    if (isDef(vnode.tag)) {
      return vnode.tag.indexOf('vue-component') === 0 || (
        !isUnknownElement$$1(vnode, inVPre) &&
        vnode.tag.toLowerCase() === (node.tagName && node.tagName.toLowerCase())
      )
    } else {
      return node.nodeType === (vnode.isComment ? 8 : 3)
    }
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            } else if (process.env.NODE_ENV !== 'production') {
              warn(
                'The client-side rendered virtual DOM tree is not matching ' +
                'server-rendered content. This is likely caused by incorrect ' +
                'HTML markup, for example nesting block-level elements inside ' +
                '<p>, or missing <tbody>. Bailing hydration and performing ' +
                'full client-side render.'
              );
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm)) {
          removeVnodes(parentElm, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      dir.oldArg = oldDir.arg;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && value !== '' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */

/*  */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler$1 (event, handler, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

// #9446: Firefox <= 53 (in particular, ESR 52) has incorrect Event.timeStamp
// implementation and does not fire microtasks in between event propagation, so
// safe to exclude.
var useMicrotaskFix = isUsingMicroTask && !(isFF && Number(isFF[1]) <= 53);

function add$1 (
  name,
  handler,
  capture,
  passive
) {
  // async edge case #6566: inner click event triggers patch, event handler
  // attached to outer element during patch, and triggered again. This
  // happens because browsers fire microtask ticks between event propagation.
  // the solution is simple: we save the timestamp when a handler is attached,
  // and the handler would only fire if the event passed to it was fired
  // AFTER it was attached.
  if (useMicrotaskFix) {
    var attachedTimestamp = currentFlushTimestamp;
    var original = handler;
    handler = original._wrapper = function (e) {
      if (
        // no bubbling, should always fire.
        // this is just a safety net in case event.timeStamp is unreliable in
        // certain weird environments...
        e.target === e.currentTarget ||
        // event is fired after handler attachment
        e.timeStamp >= attachedTimestamp ||
        // #9462 bail for iOS 9 bug: event.timeStamp is 0 after history.pushState
        e.timeStamp === 0 ||
        // #9448 bail if event is fired in another document in a multi-page
        // electron/nw.js app, since event.timeStamp will be using a different
        // starting reference
        e.target.ownerDocument !== document
      ) {
        return original.apply(this, arguments)
      }
    };
  }
  target$1.addEventListener(
    name,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  name,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    name,
    handler._wrapper || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, createOnceHandler$1, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

var svgContainer;

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value' && elm.tagName !== 'PROGRESS') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else if (key === 'innerHTML' && isSVG(elm.tagName) && isUndef(elm.innerHTML)) {
      // IE doesn't support innerHTML for SVG elements
      svgContainer = svgContainer || document.createElement('div');
      svgContainer.innerHTML = "<svg>" + cur + "</svg>";
      var svg = svgContainer.firstChild;
      while (elm.firstChild) {
        elm.removeChild(elm.firstChild);
      }
      while (svg.firstChild) {
        elm.appendChild(svg.firstChild);
      }
    } else if (
      // skip the update if old and new VDOM state is the same.
      // `value` is handled separately because the DOM value may be temporarily
      // out of sync with VDOM state due to focus, composition and modifiers.
      // This  #4521 by skipping the unnecesarry `checked` update.
      cur !== oldProps[key]
    ) {
      // some property updates can throw
      // e.g. `value` on <progress> w/ non-finite value
      try {
        elm[key] = cur;
      } catch (e) {}
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(hyphenate(name), val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

var whitespaceRE = /\s+/;

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(whitespaceRE).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def$$1) {
  if (!def$$1) {
    return
  }
  /* istanbul ignore else */
  if (typeof def$$1 === 'object') {
    var res = {};
    if (def$$1.css !== false) {
      extend(res, autoCssTransition(def$$1.name || 'v'));
    }
    extend(res, def$$1);
    return res
  } else if (typeof def$$1 === 'string') {
    return autoCssTransition(def$$1)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  // JSDOM may return undefined for transition properties
  var transitionDelays = (styles[transitionProp + 'Delay'] || '').split(', ');
  var transitionDurations = (styles[transitionProp + 'Duration'] || '').split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = (styles[animationProp + 'Delay'] || '').split(', ');
  var animationDurations = (styles[animationProp + 'Duration'] || '').split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

// Old versions of Chromium (below 61.0.3163.100) formats floating pointer numbers
// in a locale-dependent way, using a comma instead of a dot.
// If comma is not replaced with a dot, the input will be rounded down (i.e. acting
// as a floor function) causing unexpected behaviors
function toMs (s) {
  return Number(s.slice(0, -1).replace(',', '.')) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && explicitEnterDuration != null) {
    checkDuration(explicitEnterDuration, 'enter', vnode);
  }

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  if (process.env.NODE_ENV !== 'production' && isDef(explicitLeaveDuration)) {
    checkDuration(explicitLeaveDuration, 'leave', vnode);
  }

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show && el.parentNode) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

// only used in dev mode
function checkDuration (val, name, vnode) {
  if (typeof val !== 'number') {
    warn(
      "<transition> explicit " + name + " duration is not a valid number - " +
      "got " + (JSON.stringify(val)) + ".",
      vnode.context
    );
  } else if (isNaN(val)) {
    warn(
      "<transition> explicit " + name + " duration is NaN - " +
      'the duration expression might be incorrect.',
      vnode.context
    );
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    process.env.NODE_ENV !== 'production' && warn(
      "<select multiple v-model=\"" + (binding.expression) + "\"> " +
      "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
      vm
    );
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var isNotTextNode = function (c) { return c.tag || isAsyncPlaceholder(c); };

var isVShowDirective = function (d) { return d.name === 'show'; };

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(isNotTextNode);
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    // warn multiple elements
    if (process.env.NODE_ENV !== 'production' && children.length > 1) {
      warn(
        '<transition> can only be used on a single element. Use ' +
        '<transition-group> for lists.',
        this.$parent
      );
    }

    var mode = this.mode;

    // warn invalid mode
    if (process.env.NODE_ENV !== 'production' &&
      mode && mode !== 'in-out' && mode !== 'out-in'
    ) {
      warn(
        'invalid <transition> mode: ' + mode,
        this.$parent
      );
    }

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(isVShowDirective)) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  beforeMount: function beforeMount () {
    var this$1 = this;

    var update = this._update;
    this._update = function (vnode, hydrating) {
      var restoreActiveInstance = setActiveInstance(this$1);
      // force removing pass
      this$1.__patch__(
        this$1._vnode,
        this$1.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this$1._vnode = this$1.kept;
      restoreActiveInstance();
      update.call(this$1, vnode, hydrating);
    };
  },

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        } else if (process.env.NODE_ENV !== 'production') {
          var opts = c.componentOptions;
          var name = opts ? (opts.Ctor.options.name || opts.tag || '') : c.tag;
          warn(("<transition-group> children must be keyed: <" + name + ">"));
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (e && e.target !== el) {
            return
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      } else if (
        process.env.NODE_ENV !== 'production' &&
        process.env.NODE_ENV !== 'test'
      ) {
        console[console.info ? 'info' : 'log'](
          'Download the Vue Devtools extension for a better development experience:\n' +
          'https://github.com/vuejs/vue-devtools'
        );
      }
    }
    if (process.env.NODE_ENV !== 'production' &&
      process.env.NODE_ENV !== 'test' &&
      config.productionTip !== false &&
      typeof console !== 'undefined'
    ) {
      console[console.info ? 'info' : 'log'](
        "You are running Vue in development mode.\n" +
        "Make sure to turn on production mode when deploying for production.\n" +
        "See more tips at https://vuejs.org/guide/deployment.html"
      );
    }
  }, 0);
}

/*  */

/* harmony default export */ __webpack_exports__["default"] = (Vue);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7), __webpack_require__(8), __webpack_require__(26).setImmediate))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(process) {/*!
  * vue-router v3.0.2
  * (c) 2018 Evan You
  * @license MIT
  */
/*  */

function assert (condition, message) {
  if (!condition) {
    throw new Error(("[vue-router] " + message))
  }
}

function warn (condition, message) {
  if (process.env.NODE_ENV !== 'production' && !condition) {
    typeof console !== 'undefined' && console.warn(("[vue-router] " + message));
  }
}

function isError (err) {
  return Object.prototype.toString.call(err).indexOf('Error') > -1
}

function extend (a, b) {
  for (var key in b) {
    a[key] = b[key];
  }
  return a
}

var View = {
  name: 'RouterView',
  functional: true,
  props: {
    name: {
      type: String,
      default: 'default'
    }
  },
  render: function render (_, ref) {
    var props = ref.props;
    var children = ref.children;
    var parent = ref.parent;
    var data = ref.data;

    // used by devtools to display a router-view badge
    data.routerView = true;

    // directly use parent context's createElement() function
    // so that components rendered by router-view can resolve named slots
    var h = parent.$createElement;
    var name = props.name;
    var route = parent.$route;
    var cache = parent._routerViewCache || (parent._routerViewCache = {});

    // determine current view depth, also check to see if the tree
    // has been toggled inactive but kept-alive.
    var depth = 0;
    var inactive = false;
    while (parent && parent._routerRoot !== parent) {
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++;
      }
      if (parent._inactive) {
        inactive = true;
      }
      parent = parent.$parent;
    }
    data.routerViewDepth = depth;

    // render previous view if the tree is inactive and kept-alive
    if (inactive) {
      return h(cache[name], data, children)
    }

    var matched = route.matched[depth];
    // render empty node if no matched route
    if (!matched) {
      cache[name] = null;
      return h()
    }

    var component = cache[name] = matched.components[name];

    // attach instance registration hook
    // this will be called in the instance's injected lifecycle hooks
    data.registerRouteInstance = function (vm, val) {
      // val could be undefined for unregistration
      var current = matched.instances[name];
      if (
        (val && current !== vm) ||
        (!val && current === vm)
      ) {
        matched.instances[name] = val;
      }
    }

    // also register instance in prepatch hook
    // in case the same component instance is reused across different routes
    ;(data.hook || (data.hook = {})).prepatch = function (_, vnode) {
      matched.instances[name] = vnode.componentInstance;
    };

    // resolve props
    var propsToPass = data.props = resolveProps(route, matched.props && matched.props[name]);
    if (propsToPass) {
      // clone to prevent mutation
      propsToPass = data.props = extend({}, propsToPass);
      // pass non-declared props as attrs
      var attrs = data.attrs = data.attrs || {};
      for (var key in propsToPass) {
        if (!component.props || !(key in component.props)) {
          attrs[key] = propsToPass[key];
          delete propsToPass[key];
        }
      }
    }

    return h(component, data, children)
  }
}

function resolveProps (route, config) {
  switch (typeof config) {
    case 'undefined':
      return
    case 'object':
      return config
    case 'function':
      return config(route)
    case 'boolean':
      return config ? route.params : undefined
    default:
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false,
          "props in \"" + (route.path) + "\" is a " + (typeof config) + ", " +
          "expecting an object, function or boolean."
        );
      }
  }
}

/*  */

var encodeReserveRE = /[!'()*]/g;
var encodeReserveReplacer = function (c) { return '%' + c.charCodeAt(0).toString(16); };
var commaRE = /%2C/g;

// fixed encodeURIComponent which is more conformant to RFC3986:
// - escapes [!'()*]
// - preserve commas
var encode = function (str) { return encodeURIComponent(str)
  .replace(encodeReserveRE, encodeReserveReplacer)
  .replace(commaRE, ','); };

var decode = decodeURIComponent;

function resolveQuery (
  query,
  extraQuery,
  _parseQuery
) {
  if ( extraQuery === void 0 ) extraQuery = {};

  var parse = _parseQuery || parseQuery;
  var parsedQuery;
  try {
    parsedQuery = parse(query || '');
  } catch (e) {
    process.env.NODE_ENV !== 'production' && warn(false, e.message);
    parsedQuery = {};
  }
  for (var key in extraQuery) {
    parsedQuery[key] = extraQuery[key];
  }
  return parsedQuery
}

function parseQuery (query) {
  var res = {};

  query = query.trim().replace(/^(\?|#|&)/, '');

  if (!query) {
    return res
  }

  query.split('&').forEach(function (param) {
    var parts = param.replace(/\+/g, ' ').split('=');
    var key = decode(parts.shift());
    var val = parts.length > 0
      ? decode(parts.join('='))
      : null;

    if (res[key] === undefined) {
      res[key] = val;
    } else if (Array.isArray(res[key])) {
      res[key].push(val);
    } else {
      res[key] = [res[key], val];
    }
  });

  return res
}

function stringifyQuery (obj) {
  var res = obj ? Object.keys(obj).map(function (key) {
    var val = obj[key];

    if (val === undefined) {
      return ''
    }

    if (val === null) {
      return encode(key)
    }

    if (Array.isArray(val)) {
      var result = [];
      val.forEach(function (val2) {
        if (val2 === undefined) {
          return
        }
        if (val2 === null) {
          result.push(encode(key));
        } else {
          result.push(encode(key) + '=' + encode(val2));
        }
      });
      return result.join('&')
    }

    return encode(key) + '=' + encode(val)
  }).filter(function (x) { return x.length > 0; }).join('&') : null;
  return res ? ("?" + res) : ''
}

/*  */

var trailingSlashRE = /\/?$/;

function createRoute (
  record,
  location,
  redirectedFrom,
  router
) {
  var stringifyQuery$$1 = router && router.options.stringifyQuery;

  var query = location.query || {};
  try {
    query = clone(query);
  } catch (e) {}

  var route = {
    name: location.name || (record && record.name),
    meta: (record && record.meta) || {},
    path: location.path || '/',
    hash: location.hash || '',
    query: query,
    params: location.params || {},
    fullPath: getFullPath(location, stringifyQuery$$1),
    matched: record ? formatMatch(record) : []
  };
  if (redirectedFrom) {
    route.redirectedFrom = getFullPath(redirectedFrom, stringifyQuery$$1);
  }
  return Object.freeze(route)
}

function clone (value) {
  if (Array.isArray(value)) {
    return value.map(clone)
  } else if (value && typeof value === 'object') {
    var res = {};
    for (var key in value) {
      res[key] = clone(value[key]);
    }
    return res
  } else {
    return value
  }
}

// the starting route that represents the initial state
var START = createRoute(null, {
  path: '/'
});

function formatMatch (record) {
  var res = [];
  while (record) {
    res.unshift(record);
    record = record.parent;
  }
  return res
}

function getFullPath (
  ref,
  _stringifyQuery
) {
  var path = ref.path;
  var query = ref.query; if ( query === void 0 ) query = {};
  var hash = ref.hash; if ( hash === void 0 ) hash = '';

  var stringify = _stringifyQuery || stringifyQuery;
  return (path || '/') + stringify(query) + hash
}

function isSameRoute (a, b) {
  if (b === START) {
    return a === b
  } else if (!b) {
    return false
  } else if (a.path && b.path) {
    return (
      a.path.replace(trailingSlashRE, '') === b.path.replace(trailingSlashRE, '') &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query)
    )
  } else if (a.name && b.name) {
    return (
      a.name === b.name &&
      a.hash === b.hash &&
      isObjectEqual(a.query, b.query) &&
      isObjectEqual(a.params, b.params)
    )
  } else {
    return false
  }
}

function isObjectEqual (a, b) {
  if ( a === void 0 ) a = {};
  if ( b === void 0 ) b = {};

  // handle null value #1566
  if (!a || !b) { return a === b }
  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) {
    return false
  }
  return aKeys.every(function (key) {
    var aVal = a[key];
    var bVal = b[key];
    // check nested equality
    if (typeof aVal === 'object' && typeof bVal === 'object') {
      return isObjectEqual(aVal, bVal)
    }
    return String(aVal) === String(bVal)
  })
}

function isIncludedRoute (current, target) {
  return (
    current.path.replace(trailingSlashRE, '/').indexOf(
      target.path.replace(trailingSlashRE, '/')
    ) === 0 &&
    (!target.hash || current.hash === target.hash) &&
    queryIncludes(current.query, target.query)
  )
}

function queryIncludes (current, target) {
  for (var key in target) {
    if (!(key in current)) {
      return false
    }
  }
  return true
}

/*  */

// work around weird flow bug
var toTypes = [String, Object];
var eventTypes = [String, Array];

var Link = {
  name: 'RouterLink',
  props: {
    to: {
      type: toTypes,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    },
    exact: Boolean,
    append: Boolean,
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    event: {
      type: eventTypes,
      default: 'click'
    }
  },
  render: function render (h) {
    var this$1 = this;

    var router = this.$router;
    var current = this.$route;
    var ref = router.resolve(this.to, current, this.append);
    var location = ref.location;
    var route = ref.route;
    var href = ref.href;

    var classes = {};
    var globalActiveClass = router.options.linkActiveClass;
    var globalExactActiveClass = router.options.linkExactActiveClass;
    // Support global empty active class
    var activeClassFallback = globalActiveClass == null
      ? 'router-link-active'
      : globalActiveClass;
    var exactActiveClassFallback = globalExactActiveClass == null
      ? 'router-link-exact-active'
      : globalExactActiveClass;
    var activeClass = this.activeClass == null
      ? activeClassFallback
      : this.activeClass;
    var exactActiveClass = this.exactActiveClass == null
      ? exactActiveClassFallback
      : this.exactActiveClass;
    var compareTarget = location.path
      ? createRoute(null, location, null, router)
      : route;

    classes[exactActiveClass] = isSameRoute(current, compareTarget);
    classes[activeClass] = this.exact
      ? classes[exactActiveClass]
      : isIncludedRoute(current, compareTarget);

    var handler = function (e) {
      if (guardEvent(e)) {
        if (this$1.replace) {
          router.replace(location);
        } else {
          router.push(location);
        }
      }
    };

    var on = { click: guardEvent };
    if (Array.isArray(this.event)) {
      this.event.forEach(function (e) { on[e] = handler; });
    } else {
      on[this.event] = handler;
    }

    var data = {
      class: classes
    };

    if (this.tag === 'a') {
      data.on = on;
      data.attrs = { href: href };
    } else {
      // find the first <a> child and apply listener and href
      var a = findAnchor(this.$slots.default);
      if (a) {
        // in case the <a> is a static node
        a.isStatic = false;
        var aData = a.data = extend({}, a.data);
        aData.on = on;
        var aAttrs = a.data.attrs = extend({}, a.data.attrs);
        aAttrs.href = href;
      } else {
        // doesn't have <a> child, apply listener to self
        data.on = on;
      }
    }

    return h(this.tag, data, this.$slots.default)
  }
}

function guardEvent (e) {
  // don't redirect with control keys
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) { return }
  // don't redirect when preventDefault called
  if (e.defaultPrevented) { return }
  // don't redirect on right click
  if (e.button !== undefined && e.button !== 0) { return }
  // don't redirect if `target="_blank"`
  if (e.currentTarget && e.currentTarget.getAttribute) {
    var target = e.currentTarget.getAttribute('target');
    if (/\b_blank\b/i.test(target)) { return }
  }
  // this may be a Weex event which doesn't have this method
  if (e.preventDefault) {
    e.preventDefault();
  }
  return true
}

function findAnchor (children) {
  if (children) {
    var child;
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      if (child.tag === 'a') {
        return child
      }
      if (child.children && (child = findAnchor(child.children))) {
        return child
      }
    }
  }
}

var _Vue;

function install (Vue) {
  if (install.installed && _Vue === Vue) { return }
  install.installed = true;

  _Vue = Vue;

  var isDef = function (v) { return v !== undefined; };

  var registerInstance = function (vm, callVal) {
    var i = vm.$options._parentVnode;
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal);
    }
  };

  Vue.mixin({
    beforeCreate: function beforeCreate () {
      if (isDef(this.$options.router)) {
        this._routerRoot = this;
        this._router = this.$options.router;
        this._router.init(this);
        Vue.util.defineReactive(this, '_route', this._router.history.current);
      } else {
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this;
      }
      registerInstance(this, this);
    },
    destroyed: function destroyed () {
      registerInstance(this);
    }
  });

  Object.defineProperty(Vue.prototype, '$router', {
    get: function get () { return this._routerRoot._router }
  });

  Object.defineProperty(Vue.prototype, '$route', {
    get: function get () { return this._routerRoot._route }
  });

  Vue.component('RouterView', View);
  Vue.component('RouterLink', Link);

  var strats = Vue.config.optionMergeStrategies;
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created;
}

/*  */

var inBrowser = typeof window !== 'undefined';

/*  */

function resolvePath (
  relative,
  base,
  append
) {
  var firstChar = relative.charAt(0);
  if (firstChar === '/') {
    return relative
  }

  if (firstChar === '?' || firstChar === '#') {
    return base + relative
  }

  var stack = base.split('/');

  // remove trailing segment if:
  // - not appending
  // - appending to trailing slash (last segment is empty)
  if (!append || !stack[stack.length - 1]) {
    stack.pop();
  }

  // resolve relative path
  var segments = relative.replace(/^\//, '').split('/');
  for (var i = 0; i < segments.length; i++) {
    var segment = segments[i];
    if (segment === '..') {
      stack.pop();
    } else if (segment !== '.') {
      stack.push(segment);
    }
  }

  // ensure leading slash
  if (stack[0] !== '') {
    stack.unshift('');
  }

  return stack.join('/')
}

function parsePath (path) {
  var hash = '';
  var query = '';

  var hashIndex = path.indexOf('#');
  if (hashIndex >= 0) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  var queryIndex = path.indexOf('?');
  if (queryIndex >= 0) {
    query = path.slice(queryIndex + 1);
    path = path.slice(0, queryIndex);
  }

  return {
    path: path,
    query: query,
    hash: hash
  }
}

function cleanPath (path) {
  return path.replace(/\/\//g, '/')
}

var isarray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var pathToRegexp_1 = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (isarray(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!isarray(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (isarray(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}
pathToRegexp_1.parse = parse_1;
pathToRegexp_1.compile = compile_1;
pathToRegexp_1.tokensToFunction = tokensToFunction_1;
pathToRegexp_1.tokensToRegExp = tokensToRegExp_1;

/*  */

// $flow-disable-line
var regexpCompileCache = Object.create(null);

function fillParams (
  path,
  params,
  routeMsg
) {
  try {
    var filler =
      regexpCompileCache[path] ||
      (regexpCompileCache[path] = pathToRegexp_1.compile(path));
    return filler(params || {}, { pretty: true })
  } catch (e) {
    if (process.env.NODE_ENV !== 'production') {
      warn(false, ("missing param for " + routeMsg + ": " + (e.message)));
    }
    return ''
  }
}

/*  */

function createRouteMap (
  routes,
  oldPathList,
  oldPathMap,
  oldNameMap
) {
  // the path list is used to control path matching priority
  var pathList = oldPathList || [];
  // $flow-disable-line
  var pathMap = oldPathMap || Object.create(null);
  // $flow-disable-line
  var nameMap = oldNameMap || Object.create(null);

  routes.forEach(function (route) {
    addRouteRecord(pathList, pathMap, nameMap, route);
  });

  // ensure wildcard routes are always at the end
  for (var i = 0, l = pathList.length; i < l; i++) {
    if (pathList[i] === '*') {
      pathList.push(pathList.splice(i, 1)[0]);
      l--;
      i--;
    }
  }

  return {
    pathList: pathList,
    pathMap: pathMap,
    nameMap: nameMap
  }
}

function addRouteRecord (
  pathList,
  pathMap,
  nameMap,
  route,
  parent,
  matchAs
) {
  var path = route.path;
  var name = route.name;
  if (process.env.NODE_ENV !== 'production') {
    assert(path != null, "\"path\" is required in a route configuration.");
    assert(
      typeof route.component !== 'string',
      "route config \"component\" for path: " + (String(path || name)) + " cannot be a " +
      "string id. Use an actual component instead."
    );
  }

  var pathToRegexpOptions = route.pathToRegexpOptions || {};
  var normalizedPath = normalizePath(
    path,
    parent,
    pathToRegexpOptions.strict
  );

  if (typeof route.caseSensitive === 'boolean') {
    pathToRegexpOptions.sensitive = route.caseSensitive;
  }

  var record = {
    path: normalizedPath,
    regex: compileRouteRegex(normalizedPath, pathToRegexpOptions),
    components: route.components || { default: route.component },
    instances: {},
    name: name,
    parent: parent,
    matchAs: matchAs,
    redirect: route.redirect,
    beforeEnter: route.beforeEnter,
    meta: route.meta || {},
    props: route.props == null
      ? {}
      : route.components
        ? route.props
        : { default: route.props }
  };

  if (route.children) {
    // Warn if route is named, does not redirect and has a default child route.
    // If users navigate to this route by name, the default child will
    // not be rendered (GH Issue #629)
    if (process.env.NODE_ENV !== 'production') {
      if (route.name && !route.redirect && route.children.some(function (child) { return /^\/?$/.test(child.path); })) {
        warn(
          false,
          "Named Route '" + (route.name) + "' has a default child route. " +
          "When navigating to this named route (:to=\"{name: '" + (route.name) + "'\"), " +
          "the default child route will not be rendered. Remove the name from " +
          "this route and use the name of the default child route for named " +
          "links instead."
        );
      }
    }
    route.children.forEach(function (child) {
      var childMatchAs = matchAs
        ? cleanPath((matchAs + "/" + (child.path)))
        : undefined;
      addRouteRecord(pathList, pathMap, nameMap, child, record, childMatchAs);
    });
  }

  if (route.alias !== undefined) {
    var aliases = Array.isArray(route.alias)
      ? route.alias
      : [route.alias];

    aliases.forEach(function (alias) {
      var aliasRoute = {
        path: alias,
        children: route.children
      };
      addRouteRecord(
        pathList,
        pathMap,
        nameMap,
        aliasRoute,
        parent,
        record.path || '/' // matchAs
      );
    });
  }

  if (!pathMap[record.path]) {
    pathList.push(record.path);
    pathMap[record.path] = record;
  }

  if (name) {
    if (!nameMap[name]) {
      nameMap[name] = record;
    } else if (process.env.NODE_ENV !== 'production' && !matchAs) {
      warn(
        false,
        "Duplicate named routes definition: " +
        "{ name: \"" + name + "\", path: \"" + (record.path) + "\" }"
      );
    }
  }
}

function compileRouteRegex (path, pathToRegexpOptions) {
  var regex = pathToRegexp_1(path, [], pathToRegexpOptions);
  if (process.env.NODE_ENV !== 'production') {
    var keys = Object.create(null);
    regex.keys.forEach(function (key) {
      warn(!keys[key.name], ("Duplicate param keys in route with path: \"" + path + "\""));
      keys[key.name] = true;
    });
  }
  return regex
}

function normalizePath (path, parent, strict) {
  if (!strict) { path = path.replace(/\/$/, ''); }
  if (path[0] === '/') { return path }
  if (parent == null) { return path }
  return cleanPath(((parent.path) + "/" + path))
}

/*  */

function normalizeLocation (
  raw,
  current,
  append,
  router
) {
  var next = typeof raw === 'string' ? { path: raw } : raw;
  // named target
  if (next.name || next._normalized) {
    return next
  }

  // relative params
  if (!next.path && next.params && current) {
    next = extend({}, next);
    next._normalized = true;
    var params = extend(extend({}, current.params), next.params);
    if (current.name) {
      next.name = current.name;
      next.params = params;
    } else if (current.matched.length) {
      var rawPath = current.matched[current.matched.length - 1].path;
      next.path = fillParams(rawPath, params, ("path " + (current.path)));
    } else if (process.env.NODE_ENV !== 'production') {
      warn(false, "relative params navigation requires a current route.");
    }
    return next
  }

  var parsedPath = parsePath(next.path || '');
  var basePath = (current && current.path) || '/';
  var path = parsedPath.path
    ? resolvePath(parsedPath.path, basePath, append || next.append)
    : basePath;

  var query = resolveQuery(
    parsedPath.query,
    next.query,
    router && router.options.parseQuery
  );

  var hash = next.hash || parsedPath.hash;
  if (hash && hash.charAt(0) !== '#') {
    hash = "#" + hash;
  }

  return {
    _normalized: true,
    path: path,
    query: query,
    hash: hash
  }
}

/*  */



function createMatcher (
  routes,
  router
) {
  var ref = createRouteMap(routes);
  var pathList = ref.pathList;
  var pathMap = ref.pathMap;
  var nameMap = ref.nameMap;

  function addRoutes (routes) {
    createRouteMap(routes, pathList, pathMap, nameMap);
  }

  function match (
    raw,
    currentRoute,
    redirectedFrom
  ) {
    var location = normalizeLocation(raw, currentRoute, false, router);
    var name = location.name;

    if (name) {
      var record = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        warn(record, ("Route with name '" + name + "' does not exist"));
      }
      if (!record) { return _createRoute(null, location) }
      var paramNames = record.regex.keys
        .filter(function (key) { return !key.optional; })
        .map(function (key) { return key.name; });

      if (typeof location.params !== 'object') {
        location.params = {};
      }

      if (currentRoute && typeof currentRoute.params === 'object') {
        for (var key in currentRoute.params) {
          if (!(key in location.params) && paramNames.indexOf(key) > -1) {
            location.params[key] = currentRoute.params[key];
          }
        }
      }

      if (record) {
        location.path = fillParams(record.path, location.params, ("named route \"" + name + "\""));
        return _createRoute(record, location, redirectedFrom)
      }
    } else if (location.path) {
      location.params = {};
      for (var i = 0; i < pathList.length; i++) {
        var path = pathList[i];
        var record$1 = pathMap[path];
        if (matchRoute(record$1.regex, location.path, location.params)) {
          return _createRoute(record$1, location, redirectedFrom)
        }
      }
    }
    // no match
    return _createRoute(null, location)
  }

  function redirect (
    record,
    location
  ) {
    var originalRedirect = record.redirect;
    var redirect = typeof originalRedirect === 'function'
      ? originalRedirect(createRoute(record, location, null, router))
      : originalRedirect;

    if (typeof redirect === 'string') {
      redirect = { path: redirect };
    }

    if (!redirect || typeof redirect !== 'object') {
      if (process.env.NODE_ENV !== 'production') {
        warn(
          false, ("invalid redirect option: " + (JSON.stringify(redirect)))
        );
      }
      return _createRoute(null, location)
    }

    var re = redirect;
    var name = re.name;
    var path = re.path;
    var query = location.query;
    var hash = location.hash;
    var params = location.params;
    query = re.hasOwnProperty('query') ? re.query : query;
    hash = re.hasOwnProperty('hash') ? re.hash : hash;
    params = re.hasOwnProperty('params') ? re.params : params;

    if (name) {
      // resolved named direct
      var targetRecord = nameMap[name];
      if (process.env.NODE_ENV !== 'production') {
        assert(targetRecord, ("redirect failed: named route \"" + name + "\" not found."));
      }
      return match({
        _normalized: true,
        name: name,
        query: query,
        hash: hash,
        params: params
      }, undefined, location)
    } else if (path) {
      // 1. resolve relative redirect
      var rawPath = resolveRecordPath(path, record);
      // 2. resolve params
      var resolvedPath = fillParams(rawPath, params, ("redirect route with path \"" + rawPath + "\""));
      // 3. rematch with existing query and hash
      return match({
        _normalized: true,
        path: resolvedPath,
        query: query,
        hash: hash
      }, undefined, location)
    } else {
      if (process.env.NODE_ENV !== 'production') {
        warn(false, ("invalid redirect option: " + (JSON.stringify(redirect))));
      }
      return _createRoute(null, location)
    }
  }

  function alias (
    record,
    location,
    matchAs
  ) {
    var aliasedPath = fillParams(matchAs, location.params, ("aliased route with path \"" + matchAs + "\""));
    var aliasedMatch = match({
      _normalized: true,
      path: aliasedPath
    });
    if (aliasedMatch) {
      var matched = aliasedMatch.matched;
      var aliasedRecord = matched[matched.length - 1];
      location.params = aliasedMatch.params;
      return _createRoute(aliasedRecord, location)
    }
    return _createRoute(null, location)
  }

  function _createRoute (
    record,
    location,
    redirectedFrom
  ) {
    if (record && record.redirect) {
      return redirect(record, redirectedFrom || location)
    }
    if (record && record.matchAs) {
      return alias(record, location, record.matchAs)
    }
    return createRoute(record, location, redirectedFrom, router)
  }

  return {
    match: match,
    addRoutes: addRoutes
  }
}

function matchRoute (
  regex,
  path,
  params
) {
  var m = path.match(regex);

  if (!m) {
    return false
  } else if (!params) {
    return true
  }

  for (var i = 1, len = m.length; i < len; ++i) {
    var key = regex.keys[i - 1];
    var val = typeof m[i] === 'string' ? decodeURIComponent(m[i]) : m[i];
    if (key) {
      // Fix #1994: using * with props: true generates a param named 0
      params[key.name || 'pathMatch'] = val;
    }
  }

  return true
}

function resolveRecordPath (path, record) {
  return resolvePath(path, record.parent ? record.parent.path : '/', true)
}

/*  */

var positionStore = Object.create(null);

function setupScroll () {
  // Fix for #1585 for Firefox
  // Fix for #2195 Add optional third attribute to workaround a bug in safari https://bugs.webkit.org/show_bug.cgi?id=182678
  window.history.replaceState({ key: getStateKey() }, '', window.location.href.replace(window.location.origin, ''));
  window.addEventListener('popstate', function (e) {
    saveScrollPosition();
    if (e.state && e.state.key) {
      setStateKey(e.state.key);
    }
  });
}

function handleScroll (
  router,
  to,
  from,
  isPop
) {
  if (!router.app) {
    return
  }

  var behavior = router.options.scrollBehavior;
  if (!behavior) {
    return
  }

  if (process.env.NODE_ENV !== 'production') {
    assert(typeof behavior === 'function', "scrollBehavior must be a function");
  }

  // wait until re-render finishes before scrolling
  router.app.$nextTick(function () {
    var position = getScrollPosition();
    var shouldScroll = behavior.call(router, to, from, isPop ? position : null);

    if (!shouldScroll) {
      return
    }

    if (typeof shouldScroll.then === 'function') {
      shouldScroll.then(function (shouldScroll) {
        scrollToPosition((shouldScroll), position);
      }).catch(function (err) {
        if (process.env.NODE_ENV !== 'production') {
          assert(false, err.toString());
        }
      });
    } else {
      scrollToPosition(shouldScroll, position);
    }
  });
}

function saveScrollPosition () {
  var key = getStateKey();
  if (key) {
    positionStore[key] = {
      x: window.pageXOffset,
      y: window.pageYOffset
    };
  }
}

function getScrollPosition () {
  var key = getStateKey();
  if (key) {
    return positionStore[key]
  }
}

function getElementPosition (el, offset) {
  var docEl = document.documentElement;
  var docRect = docEl.getBoundingClientRect();
  var elRect = el.getBoundingClientRect();
  return {
    x: elRect.left - docRect.left - offset.x,
    y: elRect.top - docRect.top - offset.y
  }
}

function isValidPosition (obj) {
  return isNumber(obj.x) || isNumber(obj.y)
}

function normalizePosition (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : window.pageXOffset,
    y: isNumber(obj.y) ? obj.y : window.pageYOffset
  }
}

function normalizeOffset (obj) {
  return {
    x: isNumber(obj.x) ? obj.x : 0,
    y: isNumber(obj.y) ? obj.y : 0
  }
}

function isNumber (v) {
  return typeof v === 'number'
}

function scrollToPosition (shouldScroll, position) {
  var isObject = typeof shouldScroll === 'object';
  if (isObject && typeof shouldScroll.selector === 'string') {
    var el = document.querySelector(shouldScroll.selector);
    if (el) {
      var offset = shouldScroll.offset && typeof shouldScroll.offset === 'object' ? shouldScroll.offset : {};
      offset = normalizeOffset(offset);
      position = getElementPosition(el, offset);
    } else if (isValidPosition(shouldScroll)) {
      position = normalizePosition(shouldScroll);
    }
  } else if (isObject && isValidPosition(shouldScroll)) {
    position = normalizePosition(shouldScroll);
  }

  if (position) {
    window.scrollTo(position.x, position.y);
  }
}

/*  */

var supportsPushState = inBrowser && (function () {
  var ua = window.navigator.userAgent;

  if (
    (ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) &&
    ua.indexOf('Mobile Safari') !== -1 &&
    ua.indexOf('Chrome') === -1 &&
    ua.indexOf('Windows Phone') === -1
  ) {
    return false
  }

  return window.history && 'pushState' in window.history
})();

// use User Timing api (if present) for more accurate key precision
var Time = inBrowser && window.performance && window.performance.now
  ? window.performance
  : Date;

var _key = genKey();

function genKey () {
  return Time.now().toFixed(3)
}

function getStateKey () {
  return _key
}

function setStateKey (key) {
  _key = key;
}

function pushState (url, replace) {
  saveScrollPosition();
  // try...catch the pushState call to get around Safari
  // DOM Exception 18 where it limits to 100 pushState calls
  var history = window.history;
  try {
    if (replace) {
      history.replaceState({ key: _key }, '', url);
    } else {
      _key = genKey();
      history.pushState({ key: _key }, '', url);
    }
  } catch (e) {
    window.location[replace ? 'replace' : 'assign'](url);
  }
}

function replaceState (url) {
  pushState(url, true);
}

/*  */

function runQueue (queue, fn, cb) {
  var step = function (index) {
    if (index >= queue.length) {
      cb();
    } else {
      if (queue[index]) {
        fn(queue[index], function () {
          step(index + 1);
        });
      } else {
        step(index + 1);
      }
    }
  };
  step(0);
}

/*  */

function resolveAsyncComponents (matched) {
  return function (to, from, next) {
    var hasAsync = false;
    var pending = 0;
    var error = null;

    flatMapComponents(matched, function (def, _, match, key) {
      // if it's a function and doesn't have cid attached,
      // assume it's an async component resolve function.
      // we are not using Vue's default async resolving mechanism because
      // we want to halt the navigation until the incoming component has been
      // resolved.
      if (typeof def === 'function' && def.cid === undefined) {
        hasAsync = true;
        pending++;

        var resolve = once(function (resolvedDef) {
          if (isESModule(resolvedDef)) {
            resolvedDef = resolvedDef.default;
          }
          // save resolved on async factory in case it's used elsewhere
          def.resolved = typeof resolvedDef === 'function'
            ? resolvedDef
            : _Vue.extend(resolvedDef);
          match.components[key] = resolvedDef;
          pending--;
          if (pending <= 0) {
            next();
          }
        });

        var reject = once(function (reason) {
          var msg = "Failed to resolve async component " + key + ": " + reason;
          process.env.NODE_ENV !== 'production' && warn(false, msg);
          if (!error) {
            error = isError(reason)
              ? reason
              : new Error(msg);
            next(error);
          }
        });

        var res;
        try {
          res = def(resolve, reject);
        } catch (e) {
          reject(e);
        }
        if (res) {
          if (typeof res.then === 'function') {
            res.then(resolve, reject);
          } else {
            // new syntax in Vue 2.3
            var comp = res.component;
            if (comp && typeof comp.then === 'function') {
              comp.then(resolve, reject);
            }
          }
        }
      }
    });

    if (!hasAsync) { next(); }
  }
}

function flatMapComponents (
  matched,
  fn
) {
  return flatten(matched.map(function (m) {
    return Object.keys(m.components).map(function (key) { return fn(
      m.components[key],
      m.instances[key],
      m, key
    ); })
  }))
}

function flatten (arr) {
  return Array.prototype.concat.apply([], arr)
}

var hasSymbol =
  typeof Symbol === 'function' &&
  typeof Symbol.toStringTag === 'symbol';

function isESModule (obj) {
  return obj.__esModule || (hasSymbol && obj[Symbol.toStringTag] === 'Module')
}

// in Webpack 2, require.ensure now also returns a Promise
// so the resolve/reject functions may get called an extra time
// if the user uses an arrow function shorthand that happens to
// return that Promise.
function once (fn) {
  var called = false;
  return function () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (called) { return }
    called = true;
    return fn.apply(this, args)
  }
}

/*  */

var History = function History (router, base) {
  this.router = router;
  this.base = normalizeBase(base);
  // start with a route object that stands for "nowhere"
  this.current = START;
  this.pending = null;
  this.ready = false;
  this.readyCbs = [];
  this.readyErrorCbs = [];
  this.errorCbs = [];
};

History.prototype.listen = function listen (cb) {
  this.cb = cb;
};

History.prototype.onReady = function onReady (cb, errorCb) {
  if (this.ready) {
    cb();
  } else {
    this.readyCbs.push(cb);
    if (errorCb) {
      this.readyErrorCbs.push(errorCb);
    }
  }
};

History.prototype.onError = function onError (errorCb) {
  this.errorCbs.push(errorCb);
};

History.prototype.transitionTo = function transitionTo (location, onComplete, onAbort) {
    var this$1 = this;

  var route = this.router.match(location, this.current);
  this.confirmTransition(route, function () {
    this$1.updateRoute(route);
    onComplete && onComplete(route);
    this$1.ensureURL();

    // fire ready cbs once
    if (!this$1.ready) {
      this$1.ready = true;
      this$1.readyCbs.forEach(function (cb) { cb(route); });
    }
  }, function (err) {
    if (onAbort) {
      onAbort(err);
    }
    if (err && !this$1.ready) {
      this$1.ready = true;
      this$1.readyErrorCbs.forEach(function (cb) { cb(err); });
    }
  });
};

History.prototype.confirmTransition = function confirmTransition (route, onComplete, onAbort) {
    var this$1 = this;

  var current = this.current;
  var abort = function (err) {
    if (isError(err)) {
      if (this$1.errorCbs.length) {
        this$1.errorCbs.forEach(function (cb) { cb(err); });
      } else {
        warn(false, 'uncaught error during route navigation:');
        console.error(err);
      }
    }
    onAbort && onAbort(err);
  };
  if (
    isSameRoute(route, current) &&
    // in the case the route map has been dynamically appended to
    route.matched.length === current.matched.length
  ) {
    this.ensureURL();
    return abort()
  }

  var ref = resolveQueue(this.current.matched, route.matched);
    var updated = ref.updated;
    var deactivated = ref.deactivated;
    var activated = ref.activated;

  var queue = [].concat(
    // in-component leave guards
    extractLeaveGuards(deactivated),
    // global before hooks
    this.router.beforeHooks,
    // in-component update hooks
    extractUpdateHooks(updated),
    // in-config enter guards
    activated.map(function (m) { return m.beforeEnter; }),
    // async components
    resolveAsyncComponents(activated)
  );

  this.pending = route;
  var iterator = function (hook, next) {
    if (this$1.pending !== route) {
      return abort()
    }
    try {
      hook(route, current, function (to) {
        if (to === false || isError(to)) {
          // next(false) -> abort navigation, ensure current URL
          this$1.ensureURL(true);
          abort(to);
        } else if (
          typeof to === 'string' ||
          (typeof to === 'object' && (
            typeof to.path === 'string' ||
            typeof to.name === 'string'
          ))
        ) {
          // next('/') or next({ path: '/' }) -> redirect
          abort();
          if (typeof to === 'object' && to.replace) {
            this$1.replace(to);
          } else {
            this$1.push(to);
          }
        } else {
          // confirm transition and pass on the value
          next(to);
        }
      });
    } catch (e) {
      abort(e);
    }
  };

  runQueue(queue, iterator, function () {
    var postEnterCbs = [];
    var isValid = function () { return this$1.current === route; };
    // wait until async components are resolved before
    // extracting in-component enter guards
    var enterGuards = extractEnterGuards(activated, postEnterCbs, isValid);
    var queue = enterGuards.concat(this$1.router.resolveHooks);
    runQueue(queue, iterator, function () {
      if (this$1.pending !== route) {
        return abort()
      }
      this$1.pending = null;
      onComplete(route);
      if (this$1.router.app) {
        this$1.router.app.$nextTick(function () {
          postEnterCbs.forEach(function (cb) { cb(); });
        });
      }
    });
  });
};

History.prototype.updateRoute = function updateRoute (route) {
  var prev = this.current;
  this.current = route;
  this.cb && this.cb(route);
  this.router.afterHooks.forEach(function (hook) {
    hook && hook(route, prev);
  });
};

function normalizeBase (base) {
  if (!base) {
    if (inBrowser) {
      // respect <base> tag
      var baseEl = document.querySelector('base');
      base = (baseEl && baseEl.getAttribute('href')) || '/';
      // strip full URL origin
      base = base.replace(/^https?:\/\/[^\/]+/, '');
    } else {
      base = '/';
    }
  }
  // make sure there's the starting slash
  if (base.charAt(0) !== '/') {
    base = '/' + base;
  }
  // remove trailing slash
  return base.replace(/\/$/, '')
}

function resolveQueue (
  current,
  next
) {
  var i;
  var max = Math.max(current.length, next.length);
  for (i = 0; i < max; i++) {
    if (current[i] !== next[i]) {
      break
    }
  }
  return {
    updated: next.slice(0, i),
    activated: next.slice(i),
    deactivated: current.slice(i)
  }
}

function extractGuards (
  records,
  name,
  bind,
  reverse
) {
  var guards = flatMapComponents(records, function (def, instance, match, key) {
    var guard = extractGuard(def, name);
    if (guard) {
      return Array.isArray(guard)
        ? guard.map(function (guard) { return bind(guard, instance, match, key); })
        : bind(guard, instance, match, key)
    }
  });
  return flatten(reverse ? guards.reverse() : guards)
}

function extractGuard (
  def,
  key
) {
  if (typeof def !== 'function') {
    // extend now so that global mixins are applied.
    def = _Vue.extend(def);
  }
  return def.options[key]
}

function extractLeaveGuards (deactivated) {
  return extractGuards(deactivated, 'beforeRouteLeave', bindGuard, true)
}

function extractUpdateHooks (updated) {
  return extractGuards(updated, 'beforeRouteUpdate', bindGuard)
}

function bindGuard (guard, instance) {
  if (instance) {
    return function boundRouteGuard () {
      return guard.apply(instance, arguments)
    }
  }
}

function extractEnterGuards (
  activated,
  cbs,
  isValid
) {
  return extractGuards(activated, 'beforeRouteEnter', function (guard, _, match, key) {
    return bindEnterGuard(guard, match, key, cbs, isValid)
  })
}

function bindEnterGuard (
  guard,
  match,
  key,
  cbs,
  isValid
) {
  return function routeEnterGuard (to, from, next) {
    return guard(to, from, function (cb) {
      next(cb);
      if (typeof cb === 'function') {
        cbs.push(function () {
          // #750
          // if a router-view is wrapped with an out-in transition,
          // the instance may not have been registered at this time.
          // we will need to poll for registration until current route
          // is no longer valid.
          poll(cb, match.instances, key, isValid);
        });
      }
    })
  }
}

function poll (
  cb, // somehow flow cannot infer this is a function
  instances,
  key,
  isValid
) {
  if (
    instances[key] &&
    !instances[key]._isBeingDestroyed // do not reuse being destroyed instance
  ) {
    cb(instances[key]);
  } else if (isValid()) {
    setTimeout(function () {
      poll(cb, instances, key, isValid);
    }, 16);
  }
}

/*  */

var HTML5History = (function (History$$1) {
  function HTML5History (router, base) {
    var this$1 = this;

    History$$1.call(this, router, base);

    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    var initLocation = getLocation(this.base);
    window.addEventListener('popstate', function (e) {
      var current = this$1.current;

      // Avoiding first `popstate` event dispatched in some browsers but first
      // history route not updated since async guard at the same time.
      var location = getLocation(this$1.base);
      if (this$1.current === START && location === initLocation) {
        return
      }

      this$1.transitionTo(location, function (route) {
        if (supportsScroll) {
          handleScroll(router, route, current, true);
        }
      });
    });
  }

  if ( History$$1 ) HTML5History.__proto__ = History$$1;
  HTML5History.prototype = Object.create( History$$1 && History$$1.prototype );
  HTML5History.prototype.constructor = HTML5History;

  HTML5History.prototype.go = function go (n) {
    window.history.go(n);
  };

  HTML5History.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceState(cleanPath(this$1.base + route.fullPath));
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HTML5History.prototype.ensureURL = function ensureURL (push) {
    if (getLocation(this.base) !== this.current.fullPath) {
      var current = cleanPath(this.base + this.current.fullPath);
      push ? pushState(current) : replaceState(current);
    }
  };

  HTML5History.prototype.getCurrentLocation = function getCurrentLocation () {
    return getLocation(this.base)
  };

  return HTML5History;
}(History));

function getLocation (base) {
  var path = decodeURI(window.location.pathname);
  if (base && path.indexOf(base) === 0) {
    path = path.slice(base.length);
  }
  return (path || '/') + window.location.search + window.location.hash
}

/*  */

var HashHistory = (function (History$$1) {
  function HashHistory (router, base, fallback) {
    History$$1.call(this, router, base);
    // check history fallback deeplinking
    if (fallback && checkFallback(this.base)) {
      return
    }
    ensureSlash();
  }

  if ( History$$1 ) HashHistory.__proto__ = History$$1;
  HashHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  HashHistory.prototype.constructor = HashHistory;

  // this is delayed until the app mounts
  // to avoid the hashchange listener being fired too early
  HashHistory.prototype.setupListeners = function setupListeners () {
    var this$1 = this;

    var router = this.router;
    var expectScroll = router.options.scrollBehavior;
    var supportsScroll = supportsPushState && expectScroll;

    if (supportsScroll) {
      setupScroll();
    }

    window.addEventListener(supportsPushState ? 'popstate' : 'hashchange', function () {
      var current = this$1.current;
      if (!ensureSlash()) {
        return
      }
      this$1.transitionTo(getHash(), function (route) {
        if (supportsScroll) {
          handleScroll(this$1.router, route, current, true);
        }
        if (!supportsPushState) {
          replaceHash(route.fullPath);
        }
      });
    });
  };

  HashHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      pushHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    var ref = this;
    var fromRoute = ref.current;
    this.transitionTo(location, function (route) {
      replaceHash(route.fullPath);
      handleScroll(this$1.router, route, fromRoute, false);
      onComplete && onComplete(route);
    }, onAbort);
  };

  HashHistory.prototype.go = function go (n) {
    window.history.go(n);
  };

  HashHistory.prototype.ensureURL = function ensureURL (push) {
    var current = this.current.fullPath;
    if (getHash() !== current) {
      push ? pushHash(current) : replaceHash(current);
    }
  };

  HashHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    return getHash()
  };

  return HashHistory;
}(History));

function checkFallback (base) {
  var location = getLocation(base);
  if (!/^\/#/.test(location)) {
    window.location.replace(
      cleanPath(base + '/#' + location)
    );
    return true
  }
}

function ensureSlash () {
  var path = getHash();
  if (path.charAt(0) === '/') {
    return true
  }
  replaceHash('/' + path);
  return false
}

function getHash () {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var index = href.indexOf('#');
  return index === -1 ? '' : decodeURI(href.slice(index + 1))
}

function getUrl (path) {
  var href = window.location.href;
  var i = href.indexOf('#');
  var base = i >= 0 ? href.slice(0, i) : href;
  return (base + "#" + path)
}

function pushHash (path) {
  if (supportsPushState) {
    pushState(getUrl(path));
  } else {
    window.location.hash = path;
  }
}

function replaceHash (path) {
  if (supportsPushState) {
    replaceState(getUrl(path));
  } else {
    window.location.replace(getUrl(path));
  }
}

/*  */

var AbstractHistory = (function (History$$1) {
  function AbstractHistory (router, base) {
    History$$1.call(this, router, base);
    this.stack = [];
    this.index = -1;
  }

  if ( History$$1 ) AbstractHistory.__proto__ = History$$1;
  AbstractHistory.prototype = Object.create( History$$1 && History$$1.prototype );
  AbstractHistory.prototype.constructor = AbstractHistory;

  AbstractHistory.prototype.push = function push (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index + 1).concat(route);
      this$1.index++;
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.replace = function replace (location, onComplete, onAbort) {
    var this$1 = this;

    this.transitionTo(location, function (route) {
      this$1.stack = this$1.stack.slice(0, this$1.index).concat(route);
      onComplete && onComplete(route);
    }, onAbort);
  };

  AbstractHistory.prototype.go = function go (n) {
    var this$1 = this;

    var targetIndex = this.index + n;
    if (targetIndex < 0 || targetIndex >= this.stack.length) {
      return
    }
    var route = this.stack[targetIndex];
    this.confirmTransition(route, function () {
      this$1.index = targetIndex;
      this$1.updateRoute(route);
    });
  };

  AbstractHistory.prototype.getCurrentLocation = function getCurrentLocation () {
    var current = this.stack[this.stack.length - 1];
    return current ? current.fullPath : '/'
  };

  AbstractHistory.prototype.ensureURL = function ensureURL () {
    // noop
  };

  return AbstractHistory;
}(History));

/*  */



var VueRouter = function VueRouter (options) {
  if ( options === void 0 ) options = {};

  this.app = null;
  this.apps = [];
  this.options = options;
  this.beforeHooks = [];
  this.resolveHooks = [];
  this.afterHooks = [];
  this.matcher = createMatcher(options.routes || [], this);

  var mode = options.mode || 'hash';
  this.fallback = mode === 'history' && !supportsPushState && options.fallback !== false;
  if (this.fallback) {
    mode = 'hash';
  }
  if (!inBrowser) {
    mode = 'abstract';
  }
  this.mode = mode;

  switch (mode) {
    case 'history':
      this.history = new HTML5History(this, options.base);
      break
    case 'hash':
      this.history = new HashHistory(this, options.base, this.fallback);
      break
    case 'abstract':
      this.history = new AbstractHistory(this, options.base);
      break
    default:
      if (process.env.NODE_ENV !== 'production') {
        assert(false, ("invalid mode: " + mode));
      }
  }
};

var prototypeAccessors = { currentRoute: { configurable: true } };

VueRouter.prototype.match = function match (
  raw,
  current,
  redirectedFrom
) {
  return this.matcher.match(raw, current, redirectedFrom)
};

prototypeAccessors.currentRoute.get = function () {
  return this.history && this.history.current
};

VueRouter.prototype.init = function init (app /* Vue component instance */) {
    var this$1 = this;

  process.env.NODE_ENV !== 'production' && assert(
    install.installed,
    "not installed. Make sure to call `Vue.use(VueRouter)` " +
    "before creating root instance."
  );

  this.apps.push(app);

  // main app already initialized.
  if (this.app) {
    return
  }

  this.app = app;

  var history = this.history;

  if (history instanceof HTML5History) {
    history.transitionTo(history.getCurrentLocation());
  } else if (history instanceof HashHistory) {
    var setupHashListener = function () {
      history.setupListeners();
    };
    history.transitionTo(
      history.getCurrentLocation(),
      setupHashListener,
      setupHashListener
    );
  }

  history.listen(function (route) {
    this$1.apps.forEach(function (app) {
      app._route = route;
    });
  });
};

VueRouter.prototype.beforeEach = function beforeEach (fn) {
  return registerHook(this.beforeHooks, fn)
};

VueRouter.prototype.beforeResolve = function beforeResolve (fn) {
  return registerHook(this.resolveHooks, fn)
};

VueRouter.prototype.afterEach = function afterEach (fn) {
  return registerHook(this.afterHooks, fn)
};

VueRouter.prototype.onReady = function onReady (cb, errorCb) {
  this.history.onReady(cb, errorCb);
};

VueRouter.prototype.onError = function onError (errorCb) {
  this.history.onError(errorCb);
};

VueRouter.prototype.push = function push (location, onComplete, onAbort) {
  this.history.push(location, onComplete, onAbort);
};

VueRouter.prototype.replace = function replace (location, onComplete, onAbort) {
  this.history.replace(location, onComplete, onAbort);
};

VueRouter.prototype.go = function go (n) {
  this.history.go(n);
};

VueRouter.prototype.back = function back () {
  this.go(-1);
};

VueRouter.prototype.forward = function forward () {
  this.go(1);
};

VueRouter.prototype.getMatchedComponents = function getMatchedComponents (to) {
  var route = to
    ? to.matched
      ? to
      : this.resolve(to).route
    : this.currentRoute;
  if (!route) {
    return []
  }
  return [].concat.apply([], route.matched.map(function (m) {
    return Object.keys(m.components).map(function (key) {
      return m.components[key]
    })
  }))
};

VueRouter.prototype.resolve = function resolve (
  to,
  current,
  append
) {
  var location = normalizeLocation(
    to,
    current || this.history.current,
    append,
    this
  );
  var route = this.match(location, current);
  var fullPath = route.redirectedFrom || route.fullPath;
  var base = this.history.base;
  var href = createHref(base, fullPath, this.mode);
  return {
    location: location,
    route: route,
    href: href,
    // for backwards compat
    normalizedTo: location,
    resolved: route
  }
};

VueRouter.prototype.addRoutes = function addRoutes (routes) {
  this.matcher.addRoutes(routes);
  if (this.history.current !== START) {
    this.history.transitionTo(this.history.getCurrentLocation());
  }
};

Object.defineProperties( VueRouter.prototype, prototypeAccessors );

function registerHook (list, fn) {
  list.push(fn);
  return function () {
    var i = list.indexOf(fn);
    if (i > -1) { list.splice(i, 1); }
  }
}

function createHref (base, fullPath, mode) {
  var path = mode === 'hash' ? '#' + fullPath : fullPath;
  return base ? cleanPath(base + '/' + path) : path
}

VueRouter.install = install;
VueRouter.version = '3.0.2';

if (inBrowser && window.Vue) {
  window.Vue.use(VueRouter);
}

/* harmony default export */ __webpack_exports__["default"] = (VueRouter);

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(7)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = {
    data: function data() {
        return {
            search: '',
            JJVideoList: [],
            star: 0,
            place: '广州'
        };
    },
    created: function created() {

        this.getJJVideo();
    },

    methods: {
        change: function change(val) {
            this.star = 0;
            this.place = val;
            this.getJJVideo(val);
        },
        add: function add() {
            this.star += 10;
            this.getJJVideo();
        },
        getJJVideo: function getJJVideo(val) {
            var _this = this;

            this.$http.jsonp("https://api.douban.com/v2/movie/in_theaters?city=" + this.place + "&start=" + this.star + "&count=10").then(function (result) {
                console.log(result.body);
                if (val !== undefined) {
                    _this.JJVideoList = result.body.subjects;
                } else {
                    _this.JJVideoList = _this.JJVideoList.concat(result.body.subjects);
                }
            });
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

var _toast = __webpack_require__(4);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            JJVideoList: [],
            count: 10,
            star: 0
        };
    },
    created: function created() {
        this.getJJVideo();
    },

    methods: {
        add: function add() {
            this.star += 10;
            this.getJJVideo();
        },
        getJJVideo: function getJJVideo() {
            var _this = this;

            this.$http.jsonp("https://api.douban.com/v2/movie/top250?start=" + this.star + "&count=10").then(function (result) {
                console.log(result.body);
                if (result.body.total === 250) {
                    _this.JJVideoList = _this.JJVideoList.concat(result.body.subjects);
                    console.log(_this.JJVideoList);
                } else {
                    (0, _toast2.default)('接口api请求失败');
                }
            });
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

var _toast = __webpack_require__(4);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            msg: [],
            dy: [],
            ent: [],
            money: [],
            sports: [],
            tech: [],
            toutiao: [],
            war: []
        };
    },
    created: function created() {
        this.getMsg();
    },

    methods: {
        getMsg: function getMsg() {
            var _this = this;

            this.$http.get("https://www.apiopen.top/journalismApi").then(function (result) {
                console.log(result.body);
                if (result.body.code === 200) {
                    _this.msg = result.body.data.auto;
                    _this.dy = result.body.data.dy;
                    _this.ent = result.body.data.ent;
                    _this.money = result.body.data.end;
                    _this.sports = result.body.data.sports;
                    _this.tech = result.body.data.tech;
                    _this.toutiao = result.body.data.toutiao;
                    _this.war = result.body.data.war;

                    //digest  source title
                    // for (var i =0;i<this.msg.auto.length;i++){
                    //     console.log(this.msg.auto.title)
                    // }
                } else {
                    (0, _toast2.default)('接口api请求失败');
                }
            });
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

var _toast = __webpack_require__(4);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    name: "my",
    data: function data() {
        return {
            sear: '',
            city: '江门',
            skyList: [],
            yesterday: [],
            agg: []
        };
    },
    created: function created() {
        this.getJJsky(this.city);
    },

    methods: {
        search: function search() {
            this.city = this.sear;
            this.getJJsky(this.city);
        },
        getJJsky: function getJJsky(city) {
            var _this = this;

            this.$http.get("https://www.apiopen.top/weatherApi?city=" + city).then(function (result) {
                console.log(result.body);
                if (result.body.msg === "成功!") {
                    _this.agg = result.body.data;
                    _this.skyList = result.body.data.forecast;
                    _this.yesterday = [];
                    _this.yesterday.push(result.body.data.yesterday);
                    console.log(_this.skyList);
                } else {
                    (0, _toast2.default)('没有相关数据');
                }
            });
        }
    }
}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

var _toast = __webpack_require__(4);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {

            id: this.$route.params.id,
            videoInfo: []
        };
    },
    created: function created() {

        this.getJJVideo();
    },

    methods: {
        getJJVideo: function getJJVideo() {
            var _this = this;

            this.$http.jsonp("https://api.douban.com/v2/movie/subject/" + this.id).then(function (result) {
                console.log(result.body);
                if (result.body.id === _this.id) {
                    _this.videoInfo = result.body;
                } else {

                    (0, _toast2.default)('接口api请求失败');
                }
            });
        }
    }

}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _style = __webpack_require__(3);

var _style2 = _interopRequireDefault(_style);

var _toast = __webpack_require__(4);

var _toast2 = _interopRequireDefault(_toast);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    data: function data() {
        return {
            q: this.$route.params.search,
            searchInfo: []
        };
    },
    created: function created() {

        // console.log(this.$route.params.search)
        this.getJJVideo();
    },

    methods: {
        getJJVideo: function getJJVideo() {
            var _this = this;

            this.$http.jsonp("https://api.douban.com/v2/movie/search?q=" + this.q).then(function (result) {
                console.log(result.body);
                if (result.body.id === _this.id) {
                    _this.searchInfo = result.body.subjects;
                } else {

                    (0, _toast2.default)('接口api请求失败');
                }
            });
        }
    }

}; //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//


exports.default = {
    name: "outLink",
    data: function data() {
        return {
            ref: this.$route.query.ref
        };
    },

    methods: {},
    created: function created() {}
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


exports.default = {
    data: function data() {
        return {
            flag: false
        };
    },

    methods: {
        back: function back() {
            this.$router.go(-1);
        }
    },
    created: function created() {
        this.flag = this.$route.path === '/home' ? false : true;
    },

    watch: {
        "$route.path": function $routePath(newVal) {
            if (newVal === '/home') {
                this.flag = false;
            } else {
                this.flag = true;
            }
        }
    }
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _style = __webpack_require__(19);

var _style2 = _interopRequireDefault(_style);

var _swipeItem = __webpack_require__(22);

var _swipeItem2 = _interopRequireDefault(_swipeItem);

var _style3 = __webpack_require__(23);

var _style4 = _interopRequireDefault(_style3);

var _swipe = __webpack_require__(25);

var _swipe2 = _interopRequireDefault(_swipe);

var _vue = __webpack_require__(6);

var _vue2 = _interopRequireDefault(_vue);

var _vueRouter = __webpack_require__(9);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _vueResource = __webpack_require__(28);

var _vueResource2 = _interopRequireDefault(_vueResource);

var _router = __webpack_require__(30);

var _router2 = _interopRequireDefault(_router);

var _App = __webpack_require__(65);

var _App2 = _interopRequireDefault(_App);

__webpack_require__(69);

__webpack_require__(73);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//安装resource


//导入路由的包
_vue2.default.use(_vueResource2.default);
//导入mint-ui组件

//导入vue-resource
// 入口文件

_vue2.default.component(_swipe2.default.name, _swipe2.default);
_vue2.default.component(_swipeItem2.default.name, _swipeItem2.default);
//安装路由
_vue2.default.use(_vueRouter2.default);
//导入自己的router.js模块

var vm = new _vue2.default({
    el: '#app',
    render: function render(c) {
        return c(_App2.default);
    },
    router: _router2.default //挂载路由对象
});

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 22 */
/***/ (function(module, exports) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 236);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ },

/***/ 157:
/***/ function(module, exports, __webpack_require__) {

var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(79),
  /* template */
  __webpack_require__(181),
  /* styles */
  null,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ },

/***/ 181:
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mint-swipe-item"
  }, [_vm._t("default")], 2)
},staticRenderFns: []}

/***/ },

/***/ 236:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(43);


/***/ },

/***/ 43:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mint_ui_src_style_empty_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mint_ui_src_style_empty_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_style_empty_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__swipe_src_swipe_item_vue__ = __webpack_require__(157);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__swipe_src_swipe_item_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__swipe_src_swipe_item_vue__);
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(exports, "default", function() { return __WEBPACK_IMPORTED_MODULE_1__swipe_src_swipe_item_vue___default.a; });




/***/ },

/***/ 5:
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ },

/***/ 79:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//
//
//
//
//
//

/* harmony default export */ exports["default"] = {
  name: 'mt-swipe-item',

  mounted: function mounted() {
    this.$parent && this.$parent.swipeItemCreated(this);
  },

  destroyed: function destroyed() {
    this.$parent && this.$parent.swipeItemDestroyed(this);
  }
};


/***/ }

/******/ });

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../css-loader/index.js!./style.css", function() {
			var newContent = require("!!../../../css-loader/index.js!./style.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mint-swipe {\n    overflow: hidden;\n    position: relative;\n    height: 100%;\n}\n.mint-swipe-items-wrap {\n    position: relative;\n    overflow: hidden;\n    height: 100%;\n}\n.mint-swipe-items-wrap > div {\n    position: absolute;\n    -webkit-transform: translateX(-100%);\n            transform: translateX(-100%);\n    width: 100%;\n    height: 100%;\n    display: none\n}\n.mint-swipe-items-wrap > div.is-active {\n    display: block;\n    -webkit-transform: none;\n            transform: none;\n}\n.mint-swipe-indicators {\n    position: absolute;\n    bottom: 10px;\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n            transform: translateX(-50%);\n}\n.mint-swipe-indicator {\n    width: 8px;\n    height: 8px;\n    display: inline-block;\n    border-radius: 100%;\n    background: #000;\n    opacity: 0.2;\n    margin: 0 3px;\n}\n.mint-swipe-indicator.is-active {\n    background: #fff;\n}\n", ""]);

// exports


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 235);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports) {

/* globals __VUE_SSR_CONTEXT__ */

// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent (
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
) {
  var esModule
  var scriptExports = rawScriptExports = rawScriptExports || {}

  // ES6 modules interop
  var type = typeof rawScriptExports.default
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports
    scriptExports = rawScriptExports.default
  }

  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render
    options.staticRenderFns = compiledTemplate.staticRenderFns
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = injectStyles
  }

  if (hook) {
    var functional = options.functional
    var existing = functional
      ? options.render
      : options.beforeCreate
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return existing(h, context)
      }
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options
  }
}


/***/ },

/***/ 1:
/***/ function(module, exports) {

module.exports = __webpack_require__(6);

/***/ },

/***/ 158:
/***/ function(module, exports, __webpack_require__) {

function injectStyle (ssrContext) {
  __webpack_require__(99)
}
var Component = __webpack_require__(0)(
  /* script */
  __webpack_require__(80),
  /* template */
  __webpack_require__(168),
  /* styles */
  injectStyle,
  /* scopeId */
  null,
  /* moduleIdentifier (server only) */
  null
)

module.exports = Component.exports


/***/ },

/***/ 168:
/***/ function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mint-swipe"
  }, [_c('div', {
    ref: "wrap",
    staticClass: "mint-swipe-items-wrap"
  }, [_vm._t("default")], 2), _vm._v(" "), _c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.showIndicators),
      expression: "showIndicators"
    }],
    staticClass: "mint-swipe-indicators"
  }, _vm._l((_vm.pages), function(page, $index) {
    return _c('div', {
      staticClass: "mint-swipe-indicator",
      class: {
        'is-active': $index === _vm.index
      }
    })
  }))])
},staticRenderFns: []}

/***/ },

/***/ 2:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_vue__);
/* unused harmony export on */
/* unused harmony export off */
/* harmony export (binding) */ __webpack_require__.d(exports, "c", function() { return once; });
/* unused harmony export hasClass */
/* harmony export (immutable) */ exports["a"] = addClass;
/* harmony export (immutable) */ exports["b"] = removeClass;
/* unused harmony export getStyle */
/* unused harmony export setStyle */
/* istanbul ignore next */



var isServer = __WEBPACK_IMPORTED_MODULE_0_vue___default.a.prototype.$isServer;
var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
var MOZ_HACK_REGEXP = /^moz([A-Z])/;
var ieVersion = isServer ? 0 : Number(document.documentMode);

/* istanbul ignore next */
var trim = function(string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '');
};
/* istanbul ignore next */
var camelCase = function(name) {
  return name.replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
    return offset ? letter.toUpperCase() : letter;
  }).replace(MOZ_HACK_REGEXP, 'Moz$1');
};

/* istanbul ignore next */
var on = (function() {
  if (!isServer && document.addEventListener) {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
var off = (function() {
  if (!isServer && document.removeEventListener) {
    return function(element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false);
      }
    };
  } else {
    return function(element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler);
      }
    };
  }
})();

/* istanbul ignore next */
var once = function(el, event, fn) {
  var listener = function() {
    if (fn) {
      fn.apply(this, arguments);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
};

/* istanbul ignore next */
function hasClass(el, cls) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
};

/* istanbul ignore next */
function addClass(el, cls) {
  if (!el) return;
  var curClass = el.className;
  var classes = (cls || '').split(' ');

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else {
      if (!hasClass(el, clsName)) {
        curClass += ' ' + clsName;
      }
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
};

/* istanbul ignore next */
function removeClass(el, cls) {
  if (!el || !cls) return;
  var classes = cls.split(' ');
  var curClass = ' ' + el.className + ' ';

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else {
      if (hasClass(el, clsName)) {
        curClass = curClass.replace(' ' + clsName + ' ', ' ');
      }
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
};

/* istanbul ignore next */
var getStyle = ieVersion < 9 ? function(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'styleFloat';
  }
  try {
    switch (styleName) {
      case 'opacity':
        try {
          return element.filters.item('alpha').opacity / 100;
        } catch (e) {
          return 1.0;
        }
      default:
        return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
    }
  } catch (e) {
    return element.style[styleName];
  }
} : function(element, styleName) {
  if (isServer) return;
  if (!element || !styleName) return null;
  styleName = camelCase(styleName);
  if (styleName === 'float') {
    styleName = 'cssFloat';
  }
  try {
    var computed = document.defaultView.getComputedStyle(element, '');
    return element.style[styleName] || computed ? computed[styleName] : null;
  } catch (e) {
    return element.style[styleName];
  }
};

/* istanbul ignore next */
function setStyle(element, styleName, value) {
  if (!element || !styleName) return;

  if (typeof styleName === 'object') {
    for (var prop in styleName) {
      if (styleName.hasOwnProperty(prop)) {
        setStyle(element, prop, styleName[prop]);
      }
    }
  } else {
    styleName = camelCase(styleName);
    if (styleName === 'opacity' && ieVersion < 9) {
      element.style.filter = isNaN(value) ? '' : 'alpha(opacity=' + value * 100 + ')';
    } else {
      element.style[styleName] = value;
    }
  }
};


/***/ },

/***/ 235:
/***/ function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(44);


/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_swipe_vue__ = __webpack_require__(158);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_swipe_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_swipe_vue__);
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony reexport (default from non-hamory) */ __webpack_require__.d(exports, "default", function() { return __WEBPACK_IMPORTED_MODULE_0__src_swipe_vue___default.a; });



/***/ },

/***/ 80:
/***/ function(module, exports, __webpack_require__) {

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__ = __webpack_require__(2);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ exports["default"] = {
  name: 'mt-swipe',

  created: function created() {
    this.dragState = {};
  },

  data: function data() {
    return {
      ready: false,
      dragging: false,
      userScrolling: false,
      animating: false,
      index: 0,
      pages: [],
      timer: null,
      reInitTimer: null,
      noDrag: false,
      isDone: false
    };
  },

  props: {
    speed: {
      type: Number,
      default: 300
    },

    defaultIndex: {
      type: Number,
      default: 0
    },

    auto: {
      type: Number,
      default: 3000
    },

    continuous: {
      type: Boolean,
      default: true
    },

    showIndicators: {
      type: Boolean,
      default: true
    },

    noDragWhenSingle: {
      type: Boolean,
      default: true
    },

    prevent: {
      type: Boolean,
      default: false
    },

    stopPropagation: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    index: function index(newIndex) {
      this.$emit('change', newIndex);
    }
  },

  methods: {
    swipeItemCreated: function swipeItemCreated() {
      var this$1 = this;

      if (!this.ready) return;

      clearTimeout(this.reInitTimer);
      this.reInitTimer = setTimeout(function () {
        this$1.reInitPages();
      }, 100);
    },

    swipeItemDestroyed: function swipeItemDestroyed() {
      var this$1 = this;

      if (!this.ready) return;

      clearTimeout(this.reInitTimer);
      this.reInitTimer = setTimeout(function () {
        this$1.reInitPages();
      }, 100);
    },

    rafTranslate: function rafTranslate(element, initOffset, offset, callback, nextElement) {
      var ALPHA = 0.88;
      this.animating = true;
      var _offset = initOffset;
      var raf = 0;

      function animationLoop() {
        if (Math.abs(_offset - offset) < 0.5) {
          this.animating = false;
          _offset = offset;
          element.style.webkitTransform = '';
          if (nextElement) {
            nextElement.style.webkitTransform = '';
          }
          cancelAnimationFrame(raf);

          if (callback) {
            callback();
          }

          return;
        }

        _offset = ALPHA * _offset + (1.0 - ALPHA) * offset;
        element.style.webkitTransform = "translate3d(" + _offset + "px, 0, 0)";

        if (nextElement) {
          nextElement.style.webkitTransform = "translate3d(" + (_offset - offset) + "px, 0, 0)";
        }

        raf = requestAnimationFrame(animationLoop.bind(this));
      }

      animationLoop.call(this);
    },

    translate: function translate(element, offset, speed, callback) {
      var arguments$1 = arguments;
      var this$1 = this;

      if (speed) {
        this.animating = true;
        element.style.webkitTransition = '-webkit-transform ' + speed + 'ms ease-in-out';
        setTimeout(function () {
          element.style.webkitTransform = "translate3d(" + offset + "px, 0, 0)";
        }, 50);

        var called = false;

        var transitionEndCallback = function () {
          if (called) return;
          called = true;
          this$1.animating = false;
          element.style.webkitTransition = '';
          element.style.webkitTransform = '';
          if (callback) {
            callback.apply(this$1, arguments$1);
          }
        };

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["c" /* once */])(element, 'webkitTransitionEnd', transitionEndCallback);
        setTimeout(transitionEndCallback, speed + 100); // webkitTransitionEnd maybe not fire on lower version android.
      } else {
        element.style.webkitTransition = '';
        element.style.webkitTransform = "translate3d(" + offset + "px, 0, 0)";
      }
    },

    reInitPages: function reInitPages() {
      var children = this.$children;
      this.noDrag = children.length === 1 && this.noDragWhenSingle;

      var pages = [];
      var intDefaultIndex = Math.floor(this.defaultIndex);
      var defaultIndex = (intDefaultIndex >= 0 && intDefaultIndex < children.length) ? intDefaultIndex : 0;
      this.index = defaultIndex;

      children.forEach(function(child, index) {
        pages.push(child.$el);

        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["b" /* removeClass */])(child.$el, 'is-active');

        if (index === defaultIndex) {
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["a" /* addClass */])(child.$el, 'is-active');
        }
      });

      this.pages = pages;
    },

    doAnimate: function doAnimate(towards, options) {
      var this$1 = this;

      if (this.$children.length === 0) return;
      if (!options && this.$children.length < 2) return;

      var prevPage, nextPage, currentPage, pageWidth, offsetLeft, speedX;
      var speed = this.speed || 300;
      var index = this.index;
      var pages = this.pages;
      var pageCount = pages.length;

      if (!options) {
        pageWidth = this.$el.clientWidth;
        currentPage = pages[index];
        prevPage = pages[index - 1];
        nextPage = pages[index + 1];
        if (this.continuous && pages.length > 1) {
          if (!prevPage) {
            prevPage = pages[pages.length - 1];
          }
          if (!nextPage) {
            nextPage = pages[0];
          }
        }
        if (prevPage) {
          prevPage.style.display = 'block';
          this.translate(prevPage, -pageWidth);
        }
        if (nextPage) {
          nextPage.style.display = 'block';
          this.translate(nextPage, pageWidth);
        }
      } else {
        prevPage = options.prevPage;
        currentPage = options.currentPage;
        nextPage = options.nextPage;
        pageWidth = options.pageWidth;
        offsetLeft = options.offsetLeft;
        speedX = options.speedX;
      }

      var newIndex;

      var oldPage = this.$children[index].$el;

      if (towards === 'prev') {
        if (index > 0) {
          newIndex = index - 1;
        }
        if (this.continuous && index === 0) {
          newIndex = pageCount - 1;
        }
      } else if (towards === 'next') {
        if (index < pageCount - 1) {
          newIndex = index + 1;
        }
        if (this.continuous && index === pageCount - 1) {
          newIndex = 0;
        }
      }

      var callback = function () {
        if (newIndex !== undefined) {
          var newPage = this$1.$children[newIndex].$el;
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["b" /* removeClass */])(oldPage, 'is-active');
          __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_mint_ui_src_utils_dom__["a" /* addClass */])(newPage, 'is-active');

          this$1.index = newIndex;
        }
        if (this$1.isDone) {
          this$1.end();
        }

        if (prevPage) {
          prevPage.style.display = '';
        }

        if (nextPage) {
          nextPage.style.display = '';
        }
      };

      setTimeout(function () {
        if (towards === 'next') {
          this$1.isDone = true;
          this$1.before(currentPage);
          if (speedX) {
            this$1.rafTranslate(currentPage, offsetLeft, -pageWidth, callback, nextPage);
          } else {
            this$1.translate(currentPage, -pageWidth, speed, callback);
            if (nextPage) {
              this$1.translate(nextPage, 0, speed);
            }
          }
        } else if (towards === 'prev') {
          this$1.isDone = true;
          this$1.before(currentPage);
          if (speedX) {
            this$1.rafTranslate(currentPage, offsetLeft, pageWidth, callback, prevPage);
          } else {
            this$1.translate(currentPage, pageWidth, speed, callback);
            if (prevPage) {
              this$1.translate(prevPage, 0, speed);
            }
          }
        } else {
          this$1.isDone = false;
          this$1.translate(currentPage, 0, speed, callback);
          if (typeof offsetLeft !== 'undefined') {
            if (prevPage && offsetLeft > 0) {
              this$1.translate(prevPage, pageWidth * -1, speed);
            }
            if (nextPage && offsetLeft < 0) {
              this$1.translate(nextPage, pageWidth, speed);
            }
          } else {
            if (prevPage) {
              this$1.translate(prevPage, pageWidth * -1, speed);
            }
            if (nextPage) {
              this$1.translate(nextPage, pageWidth, speed);
            }
          }
        }
      }, 10);
    },

    next: function next() {
      this.doAnimate('next');
    },

    prev: function prev() {
      this.doAnimate('prev');
    },

    before: function before() {
      this.$emit('before', this.index);
    },

    end: function end() {
      this.$emit('end', this.index);
    },

    doOnTouchStart: function doOnTouchStart(event) {
      if (this.noDrag) return;

      var element = this.$el;
      var dragState = this.dragState;
      var touch = event.touches[0];

      dragState.startTime = new Date();
      dragState.startLeft = touch.pageX;
      dragState.startTop = touch.pageY;
      dragState.startTopAbsolute = touch.clientY;

      dragState.pageWidth = element.offsetWidth;
      dragState.pageHeight = element.offsetHeight;

      var prevPage = this.$children[this.index - 1];
      var dragPage = this.$children[this.index];
      var nextPage = this.$children[this.index + 1];

      if (this.continuous && this.pages.length > 1) {
        if (!prevPage) {
          prevPage = this.$children[this.$children.length - 1];
        }
        if (!nextPage) {
          nextPage = this.$children[0];
        }
      }

      dragState.prevPage = prevPage ? prevPage.$el : null;
      dragState.dragPage = dragPage ? dragPage.$el : null;
      dragState.nextPage = nextPage ? nextPage.$el : null;

      if (dragState.prevPage) {
        dragState.prevPage.style.display = 'block';
      }

      if (dragState.nextPage) {
        dragState.nextPage.style.display = 'block';
      }
    },

    doOnTouchMove: function doOnTouchMove(event) {
      if (this.noDrag) return;

      var dragState = this.dragState;
      var touch = event.touches[0];

      dragState.speedX = touch.pageX - dragState.currentLeft;
      dragState.currentLeft = touch.pageX;
      dragState.currentTop = touch.pageY;
      dragState.currentTopAbsolute = touch.clientY;

      var offsetLeft = dragState.currentLeft - dragState.startLeft;
      var offsetTop = dragState.currentTopAbsolute - dragState.startTopAbsolute;

      var distanceX = Math.abs(offsetLeft);
      var distanceY = Math.abs(offsetTop);
      if (distanceX < 5 || (distanceX >= 5 && distanceY >= 1.73 * distanceX)) {
        this.userScrolling = true;
        return;
      } else {
        this.userScrolling = false;
        event.preventDefault();
      }
      offsetLeft = Math.min(Math.max(-dragState.pageWidth + 1, offsetLeft), dragState.pageWidth - 1);

      var towards = offsetLeft < 0 ? 'next' : 'prev';

      if (dragState.prevPage && towards === 'prev') {
        this.translate(dragState.prevPage, offsetLeft - dragState.pageWidth);
      }
      this.translate(dragState.dragPage, offsetLeft);
      if (dragState.nextPage && towards === 'next') {
        this.translate(dragState.nextPage, offsetLeft + dragState.pageWidth);
      }
    },

    doOnTouchEnd: function doOnTouchEnd() {
      if (this.noDrag) return;

      var dragState = this.dragState;

      var dragDuration = new Date() - dragState.startTime;
      var towards = null;

      var offsetLeft = dragState.currentLeft - dragState.startLeft;
      var offsetTop = dragState.currentTop - dragState.startTop;
      var pageWidth = dragState.pageWidth;
      var index = this.index;
      var pageCount = this.pages.length;

      if (dragDuration < 300) {
        var fireTap = Math.abs(offsetLeft) < 5 && Math.abs(offsetTop) < 5;
        if (isNaN(offsetLeft) || isNaN(offsetTop)) {
          fireTap = true;
        }
        if (fireTap) {
          this.$children[this.index].$emit('tap');
        }
      }

      if (dragDuration < 300 && dragState.currentLeft === undefined) return;

      if (dragDuration < 300 || Math.abs(offsetLeft) > pageWidth / 2) {
        towards = offsetLeft < 0 ? 'next' : 'prev';
      }

      if (!this.continuous) {
        if ((index === 0 && towards === 'prev') || (index === pageCount - 1 && towards === 'next')) {
          towards = null;
        }
      }

      if (this.$children.length < 2) {
        towards = null;
      }

      this.doAnimate(towards, {
        offsetLeft: offsetLeft,
        pageWidth: dragState.pageWidth,
        prevPage: dragState.prevPage,
        currentPage: dragState.dragPage,
        nextPage: dragState.nextPage,
        speedX: dragState.speedX
      });

      this.dragState = {};
    },

    initTimer: function initTimer() {
      var this$1 = this;

      if (this.auto > 0 && !this.timer) {
        this.timer = setInterval(function () {
          if (!this$1.continuous && (this$1.index >= this$1.pages.length - 1)) {
            return this$1.clearTimer();
          }
          if (!this$1.dragging && !this$1.animating) {
            this$1.next();
          }
        }, this.auto);
      }
    },

    clearTimer: function clearTimer() {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  destroyed: function destroyed() {
    if (this.timer) {
      this.clearTimer();
    }
    if (this.reInitTimer) {
      clearTimeout(this.reInitTimer);
      this.reInitTimer = null;
    }
  },

  mounted: function mounted() {
    var this$1 = this;

    this.ready = true;

    this.initTimer();

    this.reInitPages();

    var element = this.$el;

    element.addEventListener('touchstart', function (event) {
      if (this$1.prevent) event.preventDefault();
      if (this$1.stopPropagation) event.stopPropagation();
      if (this$1.animating) return;
      this$1.dragging = true;
      this$1.userScrolling = false;
      this$1.doOnTouchStart(event);
    });

    element.addEventListener('touchmove', function (event) {
      if (!this$1.dragging) return;
      if (this$1.timer) this$1.clearTimer();
      this$1.doOnTouchMove(event);
    });

    element.addEventListener('touchend', function (event) {
      if (this$1.userScrolling) {
        this$1.dragging = false;
        this$1.dragState = {};
        return;
      }
      if (!this$1.dragging) return;
      this$1.initTimer();
      this$1.doOnTouchEnd(event);
      this$1.dragging = false;
    });
  }
};


/***/ },

/***/ 99:
/***/ function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }

/******/ });

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(27);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(8), __webpack_require__(7)))

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Url", function() { return Url; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Http", function() { return Http; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Resource", function() { return Resource; });
/*!
 * vue-resource v1.5.1
 * https://github.com/pagekit/vue-resource
 * Released under the MIT License.
 */

/**
 * Promises/A+ polyfill v1.1.4 (https://github.com/bramstein/promis)
 */

var RESOLVED = 0;
var REJECTED = 1;
var PENDING = 2;

function Promise$1(executor) {

    this.state = PENDING;
    this.value = undefined;
    this.deferred = [];

    var promise = this;

    try {
        executor(function (x) {
            promise.resolve(x);
        }, function (r) {
            promise.reject(r);
        });
    } catch (e) {
        promise.reject(e);
    }
}

Promise$1.reject = function (r) {
    return new Promise$1(function (resolve, reject) {
        reject(r);
    });
};

Promise$1.resolve = function (x) {
    return new Promise$1(function (resolve, reject) {
        resolve(x);
    });
};

Promise$1.all = function all(iterable) {
    return new Promise$1(function (resolve, reject) {
        var count = 0, result = [];

        if (iterable.length === 0) {
            resolve(result);
        }

        function resolver(i) {
            return function (x) {
                result[i] = x;
                count += 1;

                if (count === iterable.length) {
                    resolve(result);
                }
            };
        }

        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolver(i), reject);
        }
    });
};

Promise$1.race = function race(iterable) {
    return new Promise$1(function (resolve, reject) {
        for (var i = 0; i < iterable.length; i += 1) {
            Promise$1.resolve(iterable[i]).then(resolve, reject);
        }
    });
};

var p = Promise$1.prototype;

p.resolve = function resolve(x) {
    var promise = this;

    if (promise.state === PENDING) {
        if (x === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        var called = false;

        try {
            var then = x && x['then'];

            if (x !== null && typeof x === 'object' && typeof then === 'function') {
                then.call(x, function (x) {
                    if (!called) {
                        promise.resolve(x);
                    }
                    called = true;

                }, function (r) {
                    if (!called) {
                        promise.reject(r);
                    }
                    called = true;
                });
                return;
            }
        } catch (e) {
            if (!called) {
                promise.reject(e);
            }
            return;
        }

        promise.state = RESOLVED;
        promise.value = x;
        promise.notify();
    }
};

p.reject = function reject(reason) {
    var promise = this;

    if (promise.state === PENDING) {
        if (reason === promise) {
            throw new TypeError('Promise settled with itself.');
        }

        promise.state = REJECTED;
        promise.value = reason;
        promise.notify();
    }
};

p.notify = function notify() {
    var promise = this;

    nextTick(function () {
        if (promise.state !== PENDING) {
            while (promise.deferred.length) {
                var deferred = promise.deferred.shift(),
                    onResolved = deferred[0],
                    onRejected = deferred[1],
                    resolve = deferred[2],
                    reject = deferred[3];

                try {
                    if (promise.state === RESOLVED) {
                        if (typeof onResolved === 'function') {
                            resolve(onResolved.call(undefined, promise.value));
                        } else {
                            resolve(promise.value);
                        }
                    } else if (promise.state === REJECTED) {
                        if (typeof onRejected === 'function') {
                            resolve(onRejected.call(undefined, promise.value));
                        } else {
                            reject(promise.value);
                        }
                    }
                } catch (e) {
                    reject(e);
                }
            }
        }
    });
};

p.then = function then(onResolved, onRejected) {
    var promise = this;

    return new Promise$1(function (resolve, reject) {
        promise.deferred.push([onResolved, onRejected, resolve, reject]);
        promise.notify();
    });
};

p.catch = function (onRejected) {
    return this.then(undefined, onRejected);
};

/**
 * Promise adapter.
 */

if (typeof Promise === 'undefined') {
    window.Promise = Promise$1;
}

function PromiseObj(executor, context) {

    if (executor instanceof Promise) {
        this.promise = executor;
    } else {
        this.promise = new Promise(executor.bind(context));
    }

    this.context = context;
}

PromiseObj.all = function (iterable, context) {
    return new PromiseObj(Promise.all(iterable), context);
};

PromiseObj.resolve = function (value, context) {
    return new PromiseObj(Promise.resolve(value), context);
};

PromiseObj.reject = function (reason, context) {
    return new PromiseObj(Promise.reject(reason), context);
};

PromiseObj.race = function (iterable, context) {
    return new PromiseObj(Promise.race(iterable), context);
};

var p$1 = PromiseObj.prototype;

p$1.bind = function (context) {
    this.context = context;
    return this;
};

p$1.then = function (fulfilled, rejected) {

    if (fulfilled && fulfilled.bind && this.context) {
        fulfilled = fulfilled.bind(this.context);
    }

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.then(fulfilled, rejected), this.context);
};

p$1.catch = function (rejected) {

    if (rejected && rejected.bind && this.context) {
        rejected = rejected.bind(this.context);
    }

    return new PromiseObj(this.promise.catch(rejected), this.context);
};

p$1.finally = function (callback) {

    return this.then(function (value) {
        callback.call(this);
        return value;
    }, function (reason) {
        callback.call(this);
        return Promise.reject(reason);
    }
    );
};

/**
 * Utility functions.
 */

var ref = {};
var hasOwnProperty = ref.hasOwnProperty;
var ref$1 = [];
var slice = ref$1.slice;
var debug = false, ntick;

var inBrowser = typeof window !== 'undefined';

function Util (ref) {
    var config = ref.config;
    var nextTick = ref.nextTick;

    ntick = nextTick;
    debug = config.debug || !config.silent;
}

function warn(msg) {
    if (typeof console !== 'undefined' && debug) {
        console.warn('[VueResource warn]: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.error(msg);
    }
}

function nextTick(cb, ctx) {
    return ntick(cb, ctx);
}

function trim(str) {
    return str ? str.replace(/^\s*|\s*$/g, '') : '';
}

function trimEnd(str, chars) {

    if (str && chars === undefined) {
        return str.replace(/\s+$/, '');
    }

    if (!str || !chars) {
        return str;
    }

    return str.replace(new RegExp(("[" + chars + "]+$")), '');
}

function toLower(str) {
    return str ? str.toLowerCase() : '';
}

function toUpper(str) {
    return str ? str.toUpperCase() : '';
}

var isArray = Array.isArray;

function isString(val) {
    return typeof val === 'string';
}

function isFunction(val) {
    return typeof val === 'function';
}

function isObject(obj) {
    return obj !== null && typeof obj === 'object';
}

function isPlainObject(obj) {
    return isObject(obj) && Object.getPrototypeOf(obj) == Object.prototype;
}

function isBlob(obj) {
    return typeof Blob !== 'undefined' && obj instanceof Blob;
}

function isFormData(obj) {
    return typeof FormData !== 'undefined' && obj instanceof FormData;
}

function when(value, fulfilled, rejected) {

    var promise = PromiseObj.resolve(value);

    if (arguments.length < 2) {
        return promise;
    }

    return promise.then(fulfilled, rejected);
}

function options(fn, obj, opts) {

    opts = opts || {};

    if (isFunction(opts)) {
        opts = opts.call(obj);
    }

    return merge(fn.bind({$vm: obj, $options: opts}), fn, {$options: opts});
}

function each(obj, iterator) {

    var i, key;

    if (isArray(obj)) {
        for (i = 0; i < obj.length; i++) {
            iterator.call(obj[i], obj[i], i);
        }
    } else if (isObject(obj)) {
        for (key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                iterator.call(obj[key], obj[key], key);
            }
        }
    }

    return obj;
}

var assign = Object.assign || _assign;

function merge(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source, true);
    });

    return target;
}

function defaults(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {

        for (var key in source) {
            if (target[key] === undefined) {
                target[key] = source[key];
            }
        }

    });

    return target;
}

function _assign(target) {

    var args = slice.call(arguments, 1);

    args.forEach(function (source) {
        _merge(target, source);
    });

    return target;
}

function _merge(target, source, deep) {
    for (var key in source) {
        if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
            if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                target[key] = {};
            }
            if (isArray(source[key]) && !isArray(target[key])) {
                target[key] = [];
            }
            _merge(target[key], source[key], deep);
        } else if (source[key] !== undefined) {
            target[key] = source[key];
        }
    }
}

/**
 * Root Prefix Transform.
 */

function root (options$$1, next) {

    var url = next(options$$1);

    if (isString(options$$1.root) && !/^(https?:)?\//.test(url)) {
        url = trimEnd(options$$1.root, '/') + '/' + url;
    }

    return url;
}

/**
 * Query Parameter Transform.
 */

function query (options$$1, next) {

    var urlParams = Object.keys(Url.options.params), query = {}, url = next(options$$1);

    each(options$$1.params, function (value, key) {
        if (urlParams.indexOf(key) === -1) {
            query[key] = value;
        }
    });

    query = Url.params(query);

    if (query) {
        url += (url.indexOf('?') == -1 ? '?' : '&') + query;
    }

    return url;
}

/**
 * URL Template v2.0.6 (https://github.com/bramstein/url-template)
 */

function expand(url, params, variables) {

    var tmpl = parse(url), expanded = tmpl.expand(params);

    if (variables) {
        variables.push.apply(variables, tmpl.vars);
    }

    return expanded;
}

function parse(template) {

    var operators = ['+', '#', '.', '/', ';', '?', '&'], variables = [];

    return {
        vars: variables,
        expand: function expand(context) {
            return template.replace(/\{([^{}]+)\}|([^{}]+)/g, function (_, expression, literal) {
                if (expression) {

                    var operator = null, values = [];

                    if (operators.indexOf(expression.charAt(0)) !== -1) {
                        operator = expression.charAt(0);
                        expression = expression.substr(1);
                    }

                    expression.split(/,/g).forEach(function (variable) {
                        var tmp = /([^:*]*)(?::(\d+)|(\*))?/.exec(variable);
                        values.push.apply(values, getValues(context, operator, tmp[1], tmp[2] || tmp[3]));
                        variables.push(tmp[1]);
                    });

                    if (operator && operator !== '+') {

                        var separator = ',';

                        if (operator === '?') {
                            separator = '&';
                        } else if (operator !== '#') {
                            separator = operator;
                        }

                        return (values.length !== 0 ? operator : '') + values.join(separator);
                    } else {
                        return values.join(',');
                    }

                } else {
                    return encodeReserved(literal);
                }
            });
        }
    };
}

function getValues(context, operator, key, modifier) {

    var value = context[key], result = [];

    if (isDefined(value) && value !== '') {
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            value = value.toString();

            if (modifier && modifier !== '*') {
                value = value.substring(0, parseInt(modifier, 10));
            }

            result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
        } else {
            if (modifier === '*') {
                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        result.push(encodeValue(operator, value, isKeyOperator(operator) ? key : null));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            result.push(encodeValue(operator, value[k], k));
                        }
                    });
                }
            } else {
                var tmp = [];

                if (Array.isArray(value)) {
                    value.filter(isDefined).forEach(function (value) {
                        tmp.push(encodeValue(operator, value));
                    });
                } else {
                    Object.keys(value).forEach(function (k) {
                        if (isDefined(value[k])) {
                            tmp.push(encodeURIComponent(k));
                            tmp.push(encodeValue(operator, value[k].toString()));
                        }
                    });
                }

                if (isKeyOperator(operator)) {
                    result.push(encodeURIComponent(key) + '=' + tmp.join(','));
                } else if (tmp.length !== 0) {
                    result.push(tmp.join(','));
                }
            }
        }
    } else {
        if (operator === ';') {
            result.push(encodeURIComponent(key));
        } else if (value === '' && (operator === '&' || operator === '?')) {
            result.push(encodeURIComponent(key) + '=');
        } else if (value === '') {
            result.push('');
        }
    }

    return result;
}

function isDefined(value) {
    return value !== undefined && value !== null;
}

function isKeyOperator(operator) {
    return operator === ';' || operator === '&' || operator === '?';
}

function encodeValue(operator, value, key) {

    value = (operator === '+' || operator === '#') ? encodeReserved(value) : encodeURIComponent(value);

    if (key) {
        return encodeURIComponent(key) + '=' + value;
    } else {
        return value;
    }
}

function encodeReserved(str) {
    return str.split(/(%[0-9A-Fa-f]{2})/g).map(function (part) {
        if (!/%[0-9A-Fa-f]/.test(part)) {
            part = encodeURI(part);
        }
        return part;
    }).join('');
}

/**
 * URL Template (RFC 6570) Transform.
 */

function template (options) {

    var variables = [], url = expand(options.url, options.params, variables);

    variables.forEach(function (key) {
        delete options.params[key];
    });

    return url;
}

/**
 * Service for URL templating.
 */

function Url(url, params) {

    var self = this || {}, options$$1 = url, transform;

    if (isString(url)) {
        options$$1 = {url: url, params: params};
    }

    options$$1 = merge({}, Url.options, self.$options, options$$1);

    Url.transforms.forEach(function (handler) {

        if (isString(handler)) {
            handler = Url.transform[handler];
        }

        if (isFunction(handler)) {
            transform = factory(handler, transform, self.$vm);
        }

    });

    return transform(options$$1);
}

/**
 * Url options.
 */

Url.options = {
    url: '',
    root: null,
    params: {}
};

/**
 * Url transforms.
 */

Url.transform = {template: template, query: query, root: root};
Url.transforms = ['template', 'query', 'root'];

/**
 * Encodes a Url parameter string.
 *
 * @param {Object} obj
 */

Url.params = function (obj) {

    var params = [], escape = encodeURIComponent;

    params.add = function (key, value) {

        if (isFunction(value)) {
            value = value();
        }

        if (value === null) {
            value = '';
        }

        this.push(escape(key) + '=' + escape(value));
    };

    serialize(params, obj);

    return params.join('&').replace(/%20/g, '+');
};

/**
 * Parse a URL and return its components.
 *
 * @param {String} url
 */

Url.parse = function (url) {

    var el = document.createElement('a');

    if (document.documentMode) {
        el.href = url;
        url = el.href;
    }

    el.href = url;

    return {
        href: el.href,
        protocol: el.protocol ? el.protocol.replace(/:$/, '') : '',
        port: el.port,
        host: el.host,
        hostname: el.hostname,
        pathname: el.pathname.charAt(0) === '/' ? el.pathname : '/' + el.pathname,
        search: el.search ? el.search.replace(/^\?/, '') : '',
        hash: el.hash ? el.hash.replace(/^#/, '') : ''
    };
};

function factory(handler, next, vm) {
    return function (options$$1) {
        return handler.call(vm, options$$1, next);
    };
}

function serialize(params, obj, scope) {

    var array = isArray(obj), plain = isPlainObject(obj), hash;

    each(obj, function (value, key) {

        hash = isObject(value) || isArray(value);

        if (scope) {
            key = scope + '[' + (plain || hash ? key : '') + ']';
        }

        if (!scope && array) {
            params.add(value.name, value.value);
        } else if (hash) {
            serialize(params, value, key);
        } else {
            params.add(key, value);
        }
    });
}

/**
 * XDomain client (Internet Explorer).
 */

function xdrClient (request) {
    return new PromiseObj(function (resolve) {

        var xdr = new XDomainRequest(), handler = function (ref) {
                var type = ref.type;


                var status = 0;

                if (type === 'load') {
                    status = 200;
                } else if (type === 'error') {
                    status = 500;
                }

                resolve(request.respondWith(xdr.responseText, {status: status}));
            };

        request.abort = function () { return xdr.abort(); };

        xdr.open(request.method, request.getUrl());

        if (request.timeout) {
            xdr.timeout = request.timeout;
        }

        xdr.onload = handler;
        xdr.onabort = handler;
        xdr.onerror = handler;
        xdr.ontimeout = handler;
        xdr.onprogress = function () {};
        xdr.send(request.getBody());
    });
}

/**
 * CORS Interceptor.
 */

var SUPPORTS_CORS = inBrowser && 'withCredentials' in new XMLHttpRequest();

function cors (request) {

    if (inBrowser) {

        var orgUrl = Url.parse(location.href);
        var reqUrl = Url.parse(request.getUrl());

        if (reqUrl.protocol !== orgUrl.protocol || reqUrl.host !== orgUrl.host) {

            request.crossOrigin = true;
            request.emulateHTTP = false;

            if (!SUPPORTS_CORS) {
                request.client = xdrClient;
            }
        }
    }

}

/**
 * Form data Interceptor.
 */

function form (request) {

    if (isFormData(request.body)) {
        request.headers.delete('Content-Type');
    } else if (isObject(request.body) && request.emulateJSON) {
        request.body = Url.params(request.body);
        request.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    }

}

/**
 * JSON Interceptor.
 */

function json (request) {

    var type = request.headers.get('Content-Type') || '';

    if (isObject(request.body) && type.indexOf('application/json') === 0) {
        request.body = JSON.stringify(request.body);
    }

    return function (response) {

        return response.bodyText ? when(response.text(), function (text) {

            var type = response.headers.get('Content-Type') || '';

            if (type.indexOf('application/json') === 0 || isJson(text)) {

                try {
                    response.body = JSON.parse(text);
                } catch (e) {
                    response.body = null;
                }

            } else {
                response.body = text;
            }

            return response;

        }) : response;

    };
}

function isJson(str) {

    var start = str.match(/^\s*(\[|\{)/);
    var end = {'[': /]\s*$/, '{': /}\s*$/};

    return start && end[start[1]].test(str);
}

/**
 * JSONP client (Browser).
 */

function jsonpClient (request) {
    return new PromiseObj(function (resolve) {

        var name = request.jsonp || 'callback', callback = request.jsonpCallback || '_jsonp' + Math.random().toString(36).substr(2), body = null, handler, script;

        handler = function (ref) {
            var type = ref.type;


            var status = 0;

            if (type === 'load' && body !== null) {
                status = 200;
            } else if (type === 'error') {
                status = 500;
            }

            if (status && window[callback]) {
                delete window[callback];
                document.body.removeChild(script);
            }

            resolve(request.respondWith(body, {status: status}));
        };

        window[callback] = function (result) {
            body = JSON.stringify(result);
        };

        request.abort = function () {
            handler({type: 'abort'});
        };

        request.params[name] = callback;

        if (request.timeout) {
            setTimeout(request.abort, request.timeout);
        }

        script = document.createElement('script');
        script.src = request.getUrl();
        script.type = 'text/javascript';
        script.async = true;
        script.onload = handler;
        script.onerror = handler;

        document.body.appendChild(script);
    });
}

/**
 * JSONP Interceptor.
 */

function jsonp (request) {

    if (request.method == 'JSONP') {
        request.client = jsonpClient;
    }

}

/**
 * Before Interceptor.
 */

function before (request) {

    if (isFunction(request.before)) {
        request.before.call(this, request);
    }

}

/**
 * HTTP method override Interceptor.
 */

function method (request) {

    if (request.emulateHTTP && /^(PUT|PATCH|DELETE)$/i.test(request.method)) {
        request.headers.set('X-HTTP-Method-Override', request.method);
        request.method = 'POST';
    }

}

/**
 * Header Interceptor.
 */

function header (request) {

    var headers = assign({}, Http.headers.common,
        !request.crossOrigin ? Http.headers.custom : {},
        Http.headers[toLower(request.method)]
    );

    each(headers, function (value, name) {
        if (!request.headers.has(name)) {
            request.headers.set(name, value);
        }
    });

}

/**
 * XMLHttp client (Browser).
 */

function xhrClient (request) {
    return new PromiseObj(function (resolve) {

        var xhr = new XMLHttpRequest(), handler = function (event) {

                var response = request.respondWith(
                'response' in xhr ? xhr.response : xhr.responseText, {
                    status: xhr.status === 1223 ? 204 : xhr.status, // IE9 status bug
                    statusText: xhr.status === 1223 ? 'No Content' : trim(xhr.statusText)
                });

                each(trim(xhr.getAllResponseHeaders()).split('\n'), function (row) {
                    response.headers.append(row.slice(0, row.indexOf(':')), row.slice(row.indexOf(':') + 1));
                });

                resolve(response);
            };

        request.abort = function () { return xhr.abort(); };

        xhr.open(request.method, request.getUrl(), true);

        if (request.timeout) {
            xhr.timeout = request.timeout;
        }

        if (request.responseType && 'responseType' in xhr) {
            xhr.responseType = request.responseType;
        }

        if (request.withCredentials || request.credentials) {
            xhr.withCredentials = true;
        }

        if (!request.crossOrigin) {
            request.headers.set('X-Requested-With', 'XMLHttpRequest');
        }

        // deprecated use downloadProgress
        if (isFunction(request.progress) && request.method === 'GET') {
            xhr.addEventListener('progress', request.progress);
        }

        if (isFunction(request.downloadProgress)) {
            xhr.addEventListener('progress', request.downloadProgress);
        }

        // deprecated use uploadProgress
        if (isFunction(request.progress) && /^(POST|PUT)$/i.test(request.method)) {
            xhr.upload.addEventListener('progress', request.progress);
        }

        if (isFunction(request.uploadProgress) && xhr.upload) {
            xhr.upload.addEventListener('progress', request.uploadProgress);
        }

        request.headers.forEach(function (value, name) {
            xhr.setRequestHeader(name, value);
        });

        xhr.onload = handler;
        xhr.onabort = handler;
        xhr.onerror = handler;
        xhr.ontimeout = handler;
        xhr.send(request.getBody());
    });
}

/**
 * Http client (Node).
 */

function nodeClient (request) {

    var client = __webpack_require__(29);

    return new PromiseObj(function (resolve) {

        var url = request.getUrl();
        var body = request.getBody();
        var method = request.method;
        var headers = {}, handler;

        request.headers.forEach(function (value, name) {
            headers[name] = value;
        });

        client(url, {body: body, method: method, headers: headers}).then(handler = function (resp) {

            var response = request.respondWith(resp.body, {
                status: resp.statusCode,
                statusText: trim(resp.statusMessage)
            });

            each(resp.headers, function (value, name) {
                response.headers.set(name, value);
            });

            resolve(response);

        }, function (error$$1) { return handler(error$$1.response); });
    });
}

/**
 * Base client.
 */

function Client (context) {

    var reqHandlers = [sendRequest], resHandlers = [];

    if (!isObject(context)) {
        context = null;
    }

    function Client(request) {
        while (reqHandlers.length) {

            var handler = reqHandlers.pop();

            if (isFunction(handler)) {

                var response = (void 0), next = (void 0);

                response = handler.call(context, request, function (val) { return next = val; }) || next;

                if (isObject(response)) {
                    return new PromiseObj(function (resolve, reject) {

                        resHandlers.forEach(function (handler) {
                            response = when(response, function (response) {
                                return handler.call(context, response) || response;
                            }, reject);
                        });

                        when(response, resolve, reject);

                    }, context);
                }

                if (isFunction(response)) {
                    resHandlers.unshift(response);
                }

            } else {
                warn(("Invalid interceptor of type " + (typeof handler) + ", must be a function"));
            }
        }
    }

    Client.use = function (handler) {
        reqHandlers.push(handler);
    };

    return Client;
}

function sendRequest(request) {

    var client = request.client || (inBrowser ? xhrClient : nodeClient);

    return client(request);
}

/**
 * HTTP Headers.
 */

var Headers = function Headers(headers) {
    var this$1 = this;


    this.map = {};

    each(headers, function (value, name) { return this$1.append(name, value); });
};

Headers.prototype.has = function has (name) {
    return getName(this.map, name) !== null;
};

Headers.prototype.get = function get (name) {

    var list = this.map[getName(this.map, name)];

    return list ? list.join() : null;
};

Headers.prototype.getAll = function getAll (name) {
    return this.map[getName(this.map, name)] || [];
};

Headers.prototype.set = function set (name, value) {
    this.map[normalizeName(getName(this.map, name) || name)] = [trim(value)];
};

Headers.prototype.append = function append (name, value) {

    var list = this.map[getName(this.map, name)];

    if (list) {
        list.push(trim(value));
    } else {
        this.set(name, value);
    }
};

Headers.prototype.delete = function delete$1 (name) {
    delete this.map[getName(this.map, name)];
};

Headers.prototype.deleteAll = function deleteAll () {
    this.map = {};
};

Headers.prototype.forEach = function forEach (callback, thisArg) {
        var this$1 = this;

    each(this.map, function (list, name) {
        each(list, function (value) { return callback.call(thisArg, value, name, this$1); });
    });
};

function getName(map, name) {
    return Object.keys(map).reduce(function (prev, curr) {
        return toLower(name) === toLower(curr) ? curr : prev;
    }, null);
}

function normalizeName(name) {

    if (/[^a-z0-9\-#$%&'*+.^_`|~]/i.test(name)) {
        throw new TypeError('Invalid character in header field name');
    }

    return trim(name);
}

/**
 * HTTP Response.
 */

var Response = function Response(body, ref) {
    var url = ref.url;
    var headers = ref.headers;
    var status = ref.status;
    var statusText = ref.statusText;


    this.url = url;
    this.ok = status >= 200 && status < 300;
    this.status = status || 0;
    this.statusText = statusText || '';
    this.headers = new Headers(headers);
    this.body = body;

    if (isString(body)) {

        this.bodyText = body;

    } else if (isBlob(body)) {

        this.bodyBlob = body;

        if (isBlobText(body)) {
            this.bodyText = blobText(body);
        }
    }
};

Response.prototype.blob = function blob () {
    return when(this.bodyBlob);
};

Response.prototype.text = function text () {
    return when(this.bodyText);
};

Response.prototype.json = function json () {
    return when(this.text(), function (text) { return JSON.parse(text); });
};

Object.defineProperty(Response.prototype, 'data', {

    get: function get() {
        return this.body;
    },

    set: function set(body) {
        this.body = body;
    }

});

function blobText(body) {
    return new PromiseObj(function (resolve) {

        var reader = new FileReader();

        reader.readAsText(body);
        reader.onload = function () {
            resolve(reader.result);
        };

    });
}

function isBlobText(body) {
    return body.type.indexOf('text') === 0 || body.type.indexOf('json') !== -1;
}

/**
 * HTTP Request.
 */

var Request = function Request(options$$1) {

    this.body = null;
    this.params = {};

    assign(this, options$$1, {
        method: toUpper(options$$1.method || 'GET')
    });

    if (!(this.headers instanceof Headers)) {
        this.headers = new Headers(this.headers);
    }
};

Request.prototype.getUrl = function getUrl () {
    return Url(this);
};

Request.prototype.getBody = function getBody () {
    return this.body;
};

Request.prototype.respondWith = function respondWith (body, options$$1) {
    return new Response(body, assign(options$$1 || {}, {url: this.getUrl()}));
};

/**
 * Service for sending network requests.
 */

var COMMON_HEADERS = {'Accept': 'application/json, text/plain, */*'};
var JSON_CONTENT_TYPE = {'Content-Type': 'application/json;charset=utf-8'};

function Http(options$$1) {

    var self = this || {}, client = Client(self.$vm);

    defaults(options$$1 || {}, self.$options, Http.options);

    Http.interceptors.forEach(function (handler) {

        if (isString(handler)) {
            handler = Http.interceptor[handler];
        }

        if (isFunction(handler)) {
            client.use(handler);
        }

    });

    return client(new Request(options$$1)).then(function (response) {

        return response.ok ? response : PromiseObj.reject(response);

    }, function (response) {

        if (response instanceof Error) {
            error(response);
        }

        return PromiseObj.reject(response);
    });
}

Http.options = {};

Http.headers = {
    put: JSON_CONTENT_TYPE,
    post: JSON_CONTENT_TYPE,
    patch: JSON_CONTENT_TYPE,
    delete: JSON_CONTENT_TYPE,
    common: COMMON_HEADERS,
    custom: {}
};

Http.interceptor = {before: before, method: method, jsonp: jsonp, json: json, form: form, header: header, cors: cors};
Http.interceptors = ['before', 'method', 'jsonp', 'json', 'form', 'header', 'cors'];

['get', 'delete', 'head', 'jsonp'].forEach(function (method$$1) {

    Http[method$$1] = function (url, options$$1) {
        return this(assign(options$$1 || {}, {url: url, method: method$$1}));
    };

});

['post', 'put', 'patch'].forEach(function (method$$1) {

    Http[method$$1] = function (url, body, options$$1) {
        return this(assign(options$$1 || {}, {url: url, method: method$$1, body: body}));
    };

});

/**
 * Service for interacting with RESTful services.
 */

function Resource(url, params, actions, options$$1) {

    var self = this || {}, resource = {};

    actions = assign({},
        Resource.actions,
        actions
    );

    each(actions, function (action, name) {

        action = merge({url: url, params: assign({}, params)}, options$$1, action);

        resource[name] = function () {
            return (self.$http || Http)(opts(action, arguments));
        };
    });

    return resource;
}

function opts(action, args) {

    var options$$1 = assign({}, action), params = {}, body;

    switch (args.length) {

        case 2:

            params = args[0];
            body = args[1];

            break;

        case 1:

            if (/^(POST|PUT|PATCH)$/i.test(options$$1.method)) {
                body = args[0];
            } else {
                params = args[0];
            }

            break;

        case 0:

            break;

        default:

            throw 'Expected up to 2 arguments [params, body], got ' + args.length + ' arguments';
    }

    options$$1.body = body;
    options$$1.params = assign({}, options$$1.params, params);

    return options$$1;
}

Resource.actions = {

    get: {method: 'GET'},
    save: {method: 'POST'},
    query: {method: 'GET'},
    update: {method: 'PUT'},
    remove: {method: 'DELETE'},
    delete: {method: 'DELETE'}

};

/**
 * Install plugin.
 */

function plugin(Vue) {

    if (plugin.installed) {
        return;
    }

    Util(Vue);

    Vue.url = Url;
    Vue.http = Http;
    Vue.resource = Resource;
    Vue.Promise = PromiseObj;

    Object.defineProperties(Vue.prototype, {

        $url: {
            get: function get() {
                return options(Vue.url, this, this.$options.url);
            }
        },

        $http: {
            get: function get() {
                return options(Vue.http, this, this.$options.http);
            }
        },

        $resource: {
            get: function get() {
                return Vue.resource.bind(this);
            }
        },

        $promise: {
            get: function get() {
                var this$1 = this;

                return function (executor) { return new Vue.Promise(executor, this$1); };
            }
        }

    });
}

if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(plugin);
}

/* harmony default export */ __webpack_exports__["default"] = (plugin);



/***/ }),
/* 29 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _vueRouter = __webpack_require__(9);

var _vueRouter2 = _interopRequireDefault(_vueRouter);

var _home = __webpack_require__(31);

var _home2 = _interopRequireDefault(_home);

var _video = __webpack_require__(40);

var _video2 = _interopRequireDefault(_video);

var _message = __webpack_require__(45);

var _message2 = _interopRequireDefault(_message);

var _my = __webpack_require__(49);

var _my2 = _interopRequireDefault(_my);

var _videos = __webpack_require__(53);

var _videos2 = _interopRequireDefault(_videos);

var _search = __webpack_require__(57);

var _search2 = _interopRequireDefault(_search);

var _outLink = __webpack_require__(61);

var _outLink2 = _interopRequireDefault(_outLink);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// 3. 创建路由对象
var router = new _vueRouter2.default({
    routes: [{ path: '/', redirect: '/home' }, { path: '/home', component: _home2.default }, { path: '/video', component: _video2.default }, { path: '/message', component: _message2.default }, { path: '/my', component: _my2.default }, { path: '/home/videos1/:id', component: _videos2.default }, { path: '/home/search/:search', component: _search2.default }, { path: '/outLink', component: _outLink2.default }],
    linkActiveClass: 'mui-active' //设置默认高亮类
});

// 把路由对象暴露出去
exports.default = router;

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_957c9522_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__ = __webpack_require__(35);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(32)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-957c9522"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_home_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_957c9522_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_home_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/home.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-957c9522", Component.options)
  } else {
    hotAPI.reload("data-v-957c9522", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(33);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("75ea7868", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-957c9522\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./home.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-957c9522\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./home.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n/*区域*/\n.mui-grid-view.mui-grid-9 .mui-media[data-v-957c9522]{\n    color: orangered;\n}\n.mui-media-body[data-v-957c9522]{\n    color: orange!important;\n}\n.mui-content > .mui-table-view[data-v-957c9522]:first-child {\n    margin-top: 0;\n}\n.mui-table-view[data-v-957c9522] {\n    background-color: mediumpurple;\n}\n/*区域*/\n/*加载按钮*/\n.mui-btn[data-v-957c9522]:active {\n    background-color: orange;\n}\n\n/*加载按钮*/\n/*搜索按钮*/\n.mui-input-row .mui-btn[data-v-957c9522] {\n    border-radius: 15px;\n    position: absolute;\n    right: 0;\n    top: 0;\n}\n.mui-search[data-v-957c9522] {\n    height: 34px;\n}\n\n/*搜索按钮*/\n.mint-swipe[data-v-957c9522] {\n    height: 200px;\n}\nimg[data-v-957c9522] {\n    width: 100%;\n    height: 100%;\n}\n.mui-input-clear[data-v-957c9522] {\n    padding-left: 30px\n}\n.mui-search .mui-placeholder[data-v-957c9522] {\n    width: 40px;\n}\n\n", ""]);

// exports


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
module.exports = function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}


/***/ }),
/* 35 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "div",
        { staticClass: "mui-input-row mui-search" },
        [
          _vm._m(0),
          _vm._v(" "),
          _c("input", {
            directives: [
              {
                name: "model",
                rawName: "v-model",
                value: _vm.search,
                expression: "search"
              }
            ],
            staticClass: "mui-input-clear",
            attrs: {
              type: "search",
              name: "search",
              placeholder: "请输入查询的视频"
            },
            domProps: { value: _vm.search },
            on: {
              input: function($event) {
                if ($event.target.composing) {
                  return
                }
                _vm.search = $event.target.value
              }
            }
          }),
          _vm._v(" "),
          _c("router-link", { attrs: { to: "/home/search/" + this.search } }, [
            _c(
              "button",
              {
                staticClass: "mui-btn mui-btn-primary",
                attrs: { type: "button" }
              },
              [_vm._v("\n                搜索\n            ")]
            )
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "mt-swipe",
        { attrs: { auto: 4000 } },
        [
          _c("mt-swipe-item", [
            _c("img", { attrs: { src: __webpack_require__(36), alt: "" } })
          ]),
          _vm._v(" "),
          _c("mt-swipe-item", [
            _c("img", { attrs: { src: __webpack_require__(37), alt: "" } })
          ]),
          _vm._v(" "),
          _c("mt-swipe-item", [
            _c("img", { attrs: { src: __webpack_require__(38), alt: "" } })
          ]),
          _vm._v(" "),
          _c("mt-swipe-item", [
            _c("img", { attrs: { src: __webpack_require__(39), alt: "" } })
          ])
        ],
        1
      ),
      _vm._v(" "),
      _c("div", { staticClass: "mui-content" }, [
        _c("ul", { staticClass: "mui-table-view mui-grid-view mui-grid-9" }, [
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("广州")
                }
              }
            },
            [_vm._m(1)]
          ),
          _vm._v(" "),
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("江门")
                }
              }
            },
            [_vm._m(2)]
          ),
          _vm._v(" "),
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("中山")
                }
              }
            },
            [_vm._m(3)]
          ),
          _vm._v(" "),
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("深圳")
                }
              }
            },
            [_vm._m(4)]
          ),
          _vm._v(" "),
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("惠州")
                }
              }
            },
            [_vm._m(5)]
          ),
          _vm._v(" "),
          _c(
            "li",
            {
              staticClass:
                "mui-table-view-cell mui-media mui-col-xs-4 mui-col-sm-4",
              on: {
                click: function($event) {
                  return _vm.change("北京")
                }
              }
            },
            [_vm._m(6)]
          )
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "content" }, [
        _c(
          "ul",
          { staticClass: "mui-table-view mui-grid-view" },
          _vm._l(_vm.JJVideoList, function(item) {
            return _c(
              "li",
              { staticClass: "mui-table-view-cell mui-media mui-col-xs-6" },
              [
                _c(
                  "router-link",
                  { attrs: { to: "/home/videos1/" + item.id } },
                  [
                    _c("img", {
                      staticClass: "mui-media-object",
                      attrs: { src: item.images.small }
                    }),
                    _vm._v(" "),
                    _c("div", { staticClass: "mui-media-body" }, [
                      _vm._v(_vm._s(item.title))
                    ])
                  ]
                )
              ],
              1
            )
          }),
          0
        )
      ]),
      _vm._v(" "),
      _c(
        "button",
        {
          staticClass: "mui-btn mui-btn-primary mui-btn-block",
          attrs: { type: "button" },
          on: { click: _vm.add }
        },
        [_vm._v("加载更多")]
      )
    ],
    1
  )
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "mui-placeholder" }, [
      _c("span", { staticClass: "mui-icon mui-icon-search" }),
      _c("span")
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-home" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("广州热映")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-reload" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("江门热映")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-reload" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("中山热映")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-reload" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("深圳热映")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-reload" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("惠州热映")])
    ])
  },
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("a", [
      _c("span", { staticClass: "mui-icon mui-icon-reload" }),
      _vm._v(" "),
      _c("div", { staticClass: "mui-media-body" }, [_vm._v("北京热映")])
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-957c9522", esExports)
  }
}

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4ed88c85-01.jpg";

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "4d980169-02.jpg";

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "244bca13-03.jpg";

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "b91addac-04.jpg";

/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7271a9ca_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_video_vue__ = __webpack_require__(44);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(41)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-7271a9ca"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_video_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7271a9ca_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_video_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/video.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7271a9ca", Component.options)
  } else {
    hotAPI.reload("data-v-7271a9ca", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(42);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("bcb87c26", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7271a9ca\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./video.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7271a9ca\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./video.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mui-btn[data-v-7271a9ca]:active{\n        background-color: orange;\n}\n.video[data-v-7271a9ca]{\n    text-align: center;\n}\n.mui-grid-view[data-v-7271a9ca]{\n    background-color: mediumpurple;\n}\n.mui-content[data-v-7271a9ca]{\n        background-color: white;\n}\n", ""]);

// exports


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mint-toast {\n    position: fixed;\n    max-width: 80%;\n    border-radius: 5px;\n    background: rgba(0, 0, 0, 0.7);\n    color: #fff;\n    box-sizing: border-box;\n    text-align: center;\n    z-index: 1000;\n    -webkit-transition: opacity .3s linear;\n    transition: opacity .3s linear\n}\n.mint-toast.is-placebottom {\n    bottom: 50px;\n    left: 50%;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0)\n}\n.mint-toast.is-placemiddle {\n    left: 50%;\n    top: 50%;\n    -webkit-transform: translate(-50%, -50%);\n            transform: translate(-50%, -50%)\n}\n.mint-toast.is-placetop {\n    top: 50px;\n    left: 50%;\n    -webkit-transform: translate(-50%, 0);\n            transform: translate(-50%, 0)\n}\n.mint-toast-icon {\n    display: block;\n    text-align: center;\n    font-size: 56px\n}\n.mint-toast-text {\n    font-size: 14px;\n    display: block;\n    text-align: center\n}\n.mint-toast-pop-enter, .mint-toast-pop-leave-active {\n    opacity: 0\n}\n", ""]);

// exports


/***/ }),
/* 44 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "video" }, [
    _c("div", { staticClass: "content" }, [
      _c(
        "ul",
        { staticClass: "mui-table-view mui-grid-view" },
        _vm._l(_vm.JJVideoList, function(item) {
          return _c(
            "li",
            {
              key: item.id,
              staticClass: "mui-table-view-cell mui-media mui-col-xs-6"
            },
            [
              _c("router-link", { attrs: { to: "/home/videos1/" + item.id } }, [
                _c("img", {
                  staticClass: "mui-media-object",
                  attrs: { src: item.images.small }
                }),
                _vm._v(" "),
                _c("div", { staticClass: "mui-media-body" }, [
                  _vm._v(_vm._s(item.title))
                ])
              ])
            ],
            1
          )
        }),
        0
      )
    ]),
    _vm._v(" "),
    _c(
      "button",
      {
        staticClass: "mui-btn mui-btn-primary mui-btn-block",
        attrs: { type: "button" },
        on: { click: _vm.add }
      },
      [_vm._v("加载更多")]
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7271a9ca", esExports)
  }
}

/***/ }),
/* 45 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_032da2b2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_vue__ = __webpack_require__(48);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(46)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-032da2b2"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_message_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_032da2b2_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_message_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/message.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-032da2b2", Component.options)
  } else {
    hotAPI.reload("data-v-032da2b2", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(47);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("c18550d0", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-032da2b2\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./message.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-032da2b2\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./message.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mui-ellipsis[data-v-032da2b2][data-v-032da2b2]{\n    height: 55px;\n    line-height: 55px;\n    margin-top: 0;\n}\n.mui-h5[data-v-032da2b2], h5[data-v-032da2b2]{\n    margin-left: 4px;\n    margin-top: 15px;\n}\n", ""]);

// exports


/***/ }),
/* 48 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _vm._l(_vm.msg, function(item) {
        return _c(
          "router-link",
          {
            key: item.link,
            attrs: { to: { path: "/outLink", query: { ref: item.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.dy, function(item1) {
        return _c(
          "router-link",
          {
            key: item1.link,
            attrs: { to: { path: "/outLink", query: { ref: item1.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item1.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item1.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item1.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item1.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.ent, function(item2) {
        return _c(
          "router-link",
          {
            key: item2.link,
            attrs: { to: { path: "/outLink", query: { ref: item2.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item2.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item2.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item2.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item2.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.money, function(item3) {
        return _c(
          "router-link",
          {
            key: item3.link,
            attrs: { to: { path: "/outLink", query: { ref: item3.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item3.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item3.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item3.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item3.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.sports, function(item4) {
        return _c(
          "router-link",
          {
            key: item4.link,
            attrs: { to: { path: "/outLink", query: { ref: item4.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item4.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item4.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item4.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item4.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.tech, function(item5) {
        return _c(
          "router-link",
          {
            key: item5.link,
            attrs: { to: { path: "/outLink", query: { ref: item5.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item5.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item5.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item5.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item5.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.toutiao, function(item6) {
        return _c(
          "router-link",
          {
            key: item6.link,
            attrs: { to: { path: "/outLink", query: { ref: item6.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item6.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item6.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item6.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item6.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      }),
      _vm._v(" "),
      _vm._l(_vm.war, function(item7) {
        return _c(
          "router-link",
          {
            key: item7.link,
            attrs: { to: { path: "/outLink", query: { ref: item7.link } } }
          },
          [
            _c("div", { staticClass: "mui-content" }, [
              _c(
                "ul",
                {
                  staticClass:
                    "mui-table-view mui-table-view-striped mui-table-view-condensed"
                },
                [
                  _c("li", { staticClass: "mui-table-view-cell" }, [
                    _c("div", { staticClass: "mui-table" }, [
                      _c(
                        "div",
                        { staticClass: "mui-table-cell mui-col-xs-10" },
                        [
                          _c("h4", { staticClass: "mui-ellipsis" }, [
                            _vm._v(_vm._s(item7.title))
                          ]),
                          _vm._v(" "),
                          _c("h5", [_vm._v("源头：" + _vm._s(item7.source))]),
                          _vm._v(" "),
                          _c("p", { staticClass: "mui-h6 mui-ellipsis" }, [
                            _vm._v(_vm._s(item7.digest))
                          ])
                        ]
                      ),
                      _vm._v(" "),
                      _c(
                        "div",
                        {
                          staticClass:
                            "mui-table-cell mui-col-xs-2 mui-text-right"
                        },
                        [
                          _c("span", { staticClass: "mui-h5" }, [
                            _vm._v(_vm._s(item7.ptime))
                          ])
                        ]
                      )
                    ])
                  ])
                ]
              )
            ])
          ]
        )
      })
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-032da2b2", esExports)
  }
}

/***/ }),
/* 49 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_49e49dbc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_my_vue__ = __webpack_require__(52);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(50)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-49e49dbc"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_my_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_49e49dbc_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_my_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/my.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-49e49dbc", Component.options)
  } else {
    hotAPI.reload("data-v-49e49dbc", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(51);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("06bd61a2", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-49e49dbc\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-49e49dbc\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./my.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mui-btn[data-v-49e49dbc]:active {\n    background-color: orange;\n}\n.mui-input-row .mui-btn[data-v-49e49dbc] {\n    border-radius: 15px;\n    position: absolute;\n    right: 0;\n    top: 0;\n}\n.mui-search[data-v-49e49dbc] {\n    height: 34px;\n}\n.mui-input-clear[data-v-49e49dbc] {\n    padding-left: 30px\n}\n.mui-search .mui-placeholder[data-v-49e49dbc] {\n    width: 40px;\n}\n.skyContent[data-v-49e49dbc] {\n    margin: 0 10px;\n}\np[data-v-49e49dbc] {\n    margin-top: 7px;\n    font-size: 20px;\n}\nh4[data-v-49e49dbc] {\n    margin-top: 15px;\n    font-size: 25px;\n}\n.days span[data-v-49e49dbc]{\n    color:darkorange;\n}\n.all[data-v-49e49dbc]{\n    margin: 0 10px;\n}\n.agg[data-v-49e49dbc]{\n    letter-spacing: 3px;\n    color: orangered;\n    font-size: 20px;\n}\n.skyContent span[data-v-49e49dbc]{\n    color:darkred;\n}\n.title[data-v-49e49dbc]{\n    color: mediumpurple;\n}\n", ""]);

// exports


/***/ }),
/* 52 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "mui-input-row mui-search" }, [
      _vm._m(0),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model",
            value: _vm.sear,
            expression: "sear"
          }
        ],
        staticClass: "mui-input-clear",
        attrs: {
          type: "search",
          name: "search",
          placeholder: "请输入查询天使的城市"
        },
        domProps: { value: _vm.sear },
        on: {
          input: function($event) {
            if ($event.target.composing) {
              return
            }
            _vm.sear = $event.target.value
          }
        }
      })
    ]),
    _vm._v(" "),
    _c(
      "button",
      {
        staticClass: "mui-btn mui-btn-primary mui-btn-block",
        attrs: { type: "button" },
        on: { click: _vm.search }
      },
      [_vm._v("查询")]
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "all" },
      [
        _c("h2", [
          _c("span", { staticClass: "title" }, [_vm._v(_vm._s(this.city))])
        ]),
        _vm._v(" "),
        _c("h3", [_vm._v("昨天天气：")]),
        _vm._v(" "),
        _vm._l(_vm.yesterday, function(item) {
          return _c("section", { staticClass: "skyContent" }, [
            _c("p", [
              _vm._v("日期："),
              _c("span", [_vm._v(_vm._s(item.date))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("最高温度："),
              _c("span", [_vm._v(_vm._s(item.high))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("最低温度："),
              _c("span", [_vm._v(_vm._s(item.low))])
            ]),
            _vm._v(" "),
            _c("p", [_vm._v("风力："), _c("span", [_vm._v(_vm._s(item.fl))])]),
            _vm._v(" "),
            _c("p", [_vm._v("风向："), _c("span", [_vm._v(_vm._s(item.fx))])]),
            _vm._v(" "),
            _c("p", [_vm._v("天气："), _c("span", [_vm._v(_vm._s(item.type))])])
          ])
        }),
        _vm._v(" "),
        _c("h3", [_vm._v("未来天气建议：")]),
        _vm._v(" "),
        _c("p", { staticClass: "agg" }, [_vm._v(_vm._s(this.agg.ganmao))]),
        _vm._v(" "),
        _vm._l(_vm.skyList, function(item) {
          return _c("div", { staticClass: "days" }, [
            _c("h4", [
              _vm._v("日期："),
              _c("span", [_vm._v(_vm._s(item.date))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("最高温度："),
              _c("span", [_vm._v(_vm._s(item.high))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("最低温度："),
              _c("span", [_vm._v(_vm._s(item.low))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("风力："),
              _c("span", [_vm._v(_vm._s(item.fengli))])
            ]),
            _vm._v(" "),
            _c("p", [
              _vm._v("风向："),
              _c("span", [_vm._v(_vm._s(item.fengxiang))])
            ]),
            _vm._v(" "),
            _c("p", [_vm._v("天气："), _c("span", [_vm._v(_vm._s(item.type))])])
          ])
        })
      ],
      2
    )
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("span", { staticClass: "mui-placeholder" }, [
      _c("span", { staticClass: "mui-icon mui-icon-search" }),
      _c("span")
    ])
  }
]
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-49e49dbc", esExports)
  }
}

/***/ }),
/* 53 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b3c54e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_videos1_vue__ = __webpack_require__(56);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(54)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-b3c54e88"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_videos1_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_b3c54e88_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_videos1_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/video/videos1.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-b3c54e88", Component.options)
  } else {
    hotAPI.reload("data-v-b3c54e88", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(55);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("29fd51f6", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b3c54e88\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./videos1.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-b3c54e88\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./videos1.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.tro >a[data-v-b3c54e88]{  text-decoration: underline;\n    color: #6641e2;\n   float: right;\n}\n.mui-icon[data-v-b3c54e88] {\n    position: fixed;\n    left: 5px;\n    z-index: 5001;\n    top: 8px;\n    font-size: 28px;\n}\n.img[data-v-b3c54e88]{\n    margin-left: 25%;\n    height: 300px;\n}\n.img img[data-v-b3c54e88]{\n\n    height: 100%;\n}\n.tro[data-v-b3c54e88]{\n    margin-top:20px;\n    margin-left: 30px;\n    margin-right: 30px;\n}\n", ""]);

// exports


/***/ }),
/* 56 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "img" }, [
      _c("img", { attrs: { src: _vm.videoInfo.images.medium, alt: "" } })
    ]),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "tro" },
      [
        _c(
          "router-link",
          {
            attrs: {
              to: { path: "/outLink", query: { ref: _vm.videoInfo.mobile_url } }
            }
          },
          [_vm._v("详情播放")]
        ),
        _vm._v(" "),
        _c("p", [
          _vm._v(
            "电影名：" +
              _vm._s(_vm.videoInfo.title) +
              "    (" +
              _vm._s(_vm.videoInfo.countries[0]) +
              ")"
          )
        ]),
        _vm._v(" "),
        _c("p", [
          _vm._v(
            "类型： " +
              _vm._s(_vm.videoInfo.genres[0]) +
              "  " +
              _vm._s(_vm.videoInfo.genres[1]) +
              "  " +
              _vm._s(_vm.videoInfo.genres[2])
          )
        ]),
        _vm._v(" "),
        _c("p", [_vm._v("年份： " + _vm._s(_vm.videoInfo.year))]),
        _vm._v(" "),
        _c("p", [_vm._v("评分：" + _vm._s(_vm.videoInfo.rating.average))]),
        _vm._v(" "),
        _c("p", [_vm._v("导演：" + _vm._s(_vm.videoInfo.directors[0].name))]),
        _vm._v(" "),
        _c("p", [_vm._v("主演：" + _vm._s(_vm.videoInfo.casts[0].name))]),
        _vm._v(" "),
        _c("p", [_vm._v("电影简介：" + _vm._s(_vm.videoInfo.summary))])
      ],
      1
    )
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-b3c54e88", esExports)
  }
}

/***/ }),
/* 57 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_937697d6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_search_vue__ = __webpack_require__(60);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(58)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-937697d6"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_search_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_937697d6_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_search_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/video/search.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-937697d6", Component.options)
  } else {
    hotAPI.reload("data-v-937697d6", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(59);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("34f97664", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-937697d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./search.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-937697d6\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./search.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mui-icon-back[data-v-937697d6]:before, .mui-icon-left-nav[data-v-937697d6]:before {\n        content: '\\E471';\n}\nh4[data-v-937697d6]{\n    height: 20px;\n    text-align: center;\n}\n.mui-icon[data-v-937697d6] {\n        position: absolute;\n        top: 45px;\n\n        font-size: 28px;\n}\n", ""]);

// exports


/***/ }),
/* 60 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "video" }, [
    _c("h4", [_vm._v("搜索" + _vm._s(this.q) + "的结果：")]),
    _vm._v(" "),
    _c("div", { staticClass: "content" }, [
      _c(
        "ul",
        { staticClass: "mui-table-view mui-grid-view" },
        _vm._l(_vm.searchInfo, function(item) {
          return _c(
            "li",
            {
              key: item.id,
              staticClass: "mui-table-view-cell mui-media mui-col-xs-6"
            },
            [
              _c("router-link", { attrs: { to: "/home/videos1/" + item.id } }, [
                _c("img", {
                  staticClass: "mui-media-object",
                  attrs: { src: item.images.small }
                }),
                _vm._v(" "),
                _c("div", { staticClass: "mui-media-body" }, [
                  _vm._v(_vm._s(item.title))
                ])
              ])
            ],
            1
          )
        }),
        0
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-937697d6", esExports)
  }
}

/***/ }),
/* 61 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3d8edaf0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_outLink_vue__ = __webpack_require__(64);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(62)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = "data-v-3d8edaf0"
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_outLink_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_3d8edaf0_hasScoped_true_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_outLink_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/components/outLink.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-3d8edaf0", Component.options)
  } else {
    hotAPI.reload("data-v-3d8edaf0", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(63);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("3b926a72", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3d8edaf0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./outLink.vue", function() {
     var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-3d8edaf0\",\"scoped\":true,\"hasInlineConfig\":false}!../../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./outLink.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n", ""]);

// exports


/***/ }),
/* 64 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("iframe", {
    attrs: { src: this.ref, frameborder: "0", height: "736px", width: "100%" }
  })
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-3d8edaf0", esExports)
  }
}

/***/ }),
/* 65 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__);
/* harmony namespace reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__ = __webpack_require__(68);
var disposed = false
function injectStyle (ssrContext) {
  if (disposed) return
  __webpack_require__(66)
}
var normalizeComponent = __webpack_require__(2)
/* script */


/* template */

/* template functional */
var __vue_template_functional__ = false
/* styles */
var __vue_styles__ = injectStyle
/* scopeId */
var __vue_scopeId__ = null
/* moduleIdentifier (server only) */
var __vue_module_identifier__ = null
var Component = normalizeComponent(
  __WEBPACK_IMPORTED_MODULE_0__babel_loader_node_modules_vue_loader_lib_selector_type_script_index_0_App_vue___default.a,
  __WEBPACK_IMPORTED_MODULE_1__node_modules_vue_loader_lib_template_compiler_index_id_data_v_7ba5bd90_hasScoped_false_buble_transforms_node_modules_vue_loader_lib_selector_type_template_index_0_App_vue__["a" /* default */],
  __vue_template_functional__,
  __vue_styles__,
  __vue_scopeId__,
  __vue_module_identifier__
)
Component.options.__file = "src/App.vue"

/* hot reload */
if (false) {(function () {
  var hotAPI = require("vue-hot-reload-api")
  hotAPI.install(require("vue"), false)
  if (!hotAPI.compatible) return
  module.hot.accept()
  if (!module.hot.data) {
    hotAPI.createRecord("data-v-7ba5bd90", Component.options)
  } else {
    hotAPI.reload("data-v-7ba5bd90", Component.options)
  }
  module.hot.dispose(function (data) {
    disposed = true
  })
})()}

/* harmony default export */ __webpack_exports__["default"] = (Component.exports);


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(67);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(1)("5be4cc20", content, false, {});
// Hot Module Replacement
if(false) {
 // When the styles change, update the <style> tags
 if(!content.locals) {
   module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue", function() {
     var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/vue-loader/lib/style-compiler/index.js?{\"vue\":true,\"id\":\"data-v-7ba5bd90\",\"scoped\":false,\"hasInlineConfig\":false}!../node_modules/vue-loader/lib/selector.js?type=styles&index=0!./App.vue");
     if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
     update(newContent);
   });
 }
 // When the module is disposed, remove the <style> tags
 module.hot.dispose(function() { update(); });
}

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "\n.mui-action-back {\n    color: orangered;\n}\n.app-container {\n    overflow: hidden;\n    padding-top: 44px;\n    padding-bottom: 50px;\n}\n.v-enter {\n    opacity: 0;\n    transform: translateX(100%);\n}\n.v-leave-to {\n    opacity: 0;\n    transform: translateX(-100%);\n    position: absolute;\n}\n.v-enter-active,\n.v-leave-active {\n    transition: all 0.5s ease;\n}\n.mui-bar-nav {\n    background-color: mediumpurple;\n}\n", ""]);

// exports


/***/ }),
/* 68 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "app-container" },
    [
      _c("header", { staticClass: "mui-bar mui-bar-nav" }, [
        _c(
          "span",
          {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: _vm.flag,
                expression: "flag"
              }
            ],
            staticClass:
              "mui-action-back mui-icon mui-icon-left-nav mui-pull-left",
            on: { click: _vm.back }
          },
          [_vm._v("返回")]
        ),
        _vm._v(" "),
        _c("h1", { staticClass: "mui-title", attrs: { id: "title" } }, [
          _vm._v("Help追哥 Please")
        ])
      ]),
      _vm._v(" "),
      _c("transition", [_c("router-view")], 1),
      _vm._v(" "),
      _c(
        "nav",
        { staticClass: "mui-bar mui-bar-tab" },
        [
          _c(
            "router-link",
            { staticClass: "mui-tab-item ", attrs: { to: "/home" } },
            [
              _c("span", { staticClass: "mui-icon mui-icon-home" }),
              _vm._v(" "),
              _c("span", { staticClass: "mui-tab-label" }, [_vm._v("首页")])
            ]
          ),
          _vm._v(" "),
          _c(
            "router-link",
            { staticClass: "mui-tab-item", attrs: { to: "/video" } },
            [
              _c("span", { staticClass: "mui-icon mui-icon-videocam" }),
              _vm._v(" "),
              _c("span", { staticClass: "mui-tab-label" }, [_vm._v("视频")])
            ]
          ),
          _vm._v(" "),
          _c(
            "router-link",
            { staticClass: "mui-tab-item", attrs: { to: "/message" } },
            [
              _c("span", { staticClass: "mui-icon mui-icon-weibo" }),
              _vm._v(" "),
              _c("span", { staticClass: "mui-tab-label" }, [_vm._v("新闻")])
            ]
          ),
          _vm._v(" "),
          _c(
            "router-link",
            { staticClass: "mui-tab-item", attrs: { to: "/my" } },
            [
              _c("span", { staticClass: "mui-icon mui-icon-map" }),
              _vm._v(" "),
              _c("span", { staticClass: "mui-tab-label" }, [_vm._v("天气")])
            ]
          )
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true
var esExports = { render: render, staticRenderFns: staticRenderFns }
/* harmony default export */ __webpack_exports__["a"] = (esExports);
if (false) {
  module.hot.accept()
  if (module.hot.data) {
    require("vue-hot-reload-api")      .rerender("data-v-7ba5bd90", esExports)
  }
}

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(70);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(5)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!./mui.min.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!./mui.min.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(71);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*!\n * =====================================================\n * Mui v3.7.0 (http://dev.dcloud.net.cn/mui)\n * =====================================================\n *//*! normalize.css v3.0.1 | MIT License | git.io/normalize */html{font-family:sans-serif;-webkit-text-size-adjust:100%}body{margin:0}article,aside,details,figcaption,figure,footer,header,hgroup,main,nav,section,summary{display:block}audio,canvas,progress,video{display:inline-block;vertical-align:baseline}audio:not([controls]){display:none;height:0}[hidden],template{display:none}a{background:0 0}a:active,a:hover{outline:0}abbr[title]{border-bottom:1px dotted}b,strong{font-weight:700}dfn{font-style:italic}h1{margin:.67em 0}mark{color:#000;background:#ff0}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sup{top:-.5em}sub{bottom:-.25em}img{border:0}svg:not(:root){overflow:hidden}figure{margin:1em 40px}hr{box-sizing:content-box;height:0}pre{overflow:auto}code,kbd,pre,samp{font-family:monospace,monospace;font-size:1em}button,input,optgroup,select,textarea{font:inherit;margin:0;color:inherit}button{overflow:visible}button,select{text-transform:none}button,html input[type=button],input[type=reset],input[type=submit]{cursor:pointer;-webkit-appearance:button}button[disabled],html input[disabled]{cursor:default}input{line-height:normal}input[type=checkbox],input[type=radio]{box-sizing:border-box;padding:0}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{height:auto}input[type=search]::-webkit-search-cancel-button,input[type=search]::-webkit-search-decoration{-webkit-appearance:none}fieldset{margin:0 2px;padding:.35em .625em .75em;border:1px solid silver}legend{padding:0;border:0}textarea{overflow:auto}optgroup{font-weight:700}table{border-spacing:0;border-collapse:collapse}td,th{padding:0}*{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;outline:0;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:transparent}body{font-family:'Helvetica Neue',Helvetica,sans-serif;font-size:17px;line-height:21px;color:#000;background-color:#efeff4;-webkit-overflow-scrolling:touch}a{text-decoration:none;color:#007aff}a:active{color:#0062cc}.mui-content{background-color:#efeff4;-webkit-overflow-scrolling:touch}.mui-bar-nav~.mui-content{padding-top:44px}.mui-bar-nav~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{top:44px}.mui-bar-header-secondary~.mui-content{padding-top:88px}.mui-bar-header-secondary~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{top:88px}.mui-bar-footer~.mui-content{padding-bottom:44px}.mui-bar-footer~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{bottom:44px}.mui-bar-footer-secondary~.mui-content{padding-bottom:88px}.mui-bar-footer-secondary~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{bottom:88px}.mui-bar-tab~.mui-content{padding-bottom:50px}.mui-bar-tab~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{bottom:50px}.mui-bar-footer-secondary-tab~.mui-content{padding-bottom:94px}.mui-bar-footer-secondary-tab~.mui-content.mui-scroll-wrapper .mui-scrollbar-vertical{bottom:94px}.mui-content-padded{margin:10px}.mui-inline{display:inline-block;vertical-align:top}.mui-block{display:block!important}.mui-visibility{visibility:visible!important}.mui-hidden{display:none!important}.mui-ellipsis{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.mui-ellipsis-2{display:-webkit-box;overflow:hidden;white-space:normal!important;text-overflow:ellipsis;word-wrap:break-word;-webkit-line-clamp:2;-webkit-box-orient:vertical}.mui-table{display:table;width:100%;table-layout:fixed}.mui-table-cell{position:relative;display:table-cell}.mui-text-left{text-align:left!important}.mui-text-center{text-align:center!important}.mui-text-justify{text-align:justify!important}.mui-text-right{text-align:right!important}.mui-pull-left{float:left}.mui-pull-right{float:right}.mui-list-unstyled{padding-left:0;list-style:none}.mui-list-inline{margin-left:-5px;padding-left:0;list-style:none}.mui-list-inline>li{display:inline-block;padding-right:5px;padding-left:5px}.mui-clearfix:after,.mui-clearfix:before{display:table;content:' '}.mui-clearfix:after{clear:both}.mui-bg-primary{background-color:#007aff}.mui-bg-positive{background-color:#4cd964}.mui-bg-negative{background-color:#dd524d}.mui-error{margin:88px 35px;padding:10px;border-radius:6px;background-color:#bbb}.mui-subtitle{font-size:15px}h1,h2,h3,h4,h5,h6{line-height:1;margin-top:5px;margin-bottom:5px}.mui-h1,h1{font-size:36px}.mui-h2,h2{font-size:30px}.mui-h3,h3{font-size:24px}.mui-h4,h4{font-size:18px}.mui-h5,h5{font-size:14px;font-weight:400;color:#8f8f94}.mui-h6,h6{font-size:12px;font-weight:400;color:#8f8f94}p{font-size:14px;margin-top:0;margin-bottom:10px;color:#8f8f94}.mui-row:after,.mui-row:before{display:table;content:' '}.mui-row:after{clear:both}.mui-col-sm-1,.mui-col-sm-10,.mui-col-sm-11,.mui-col-sm-12,.mui-col-sm-2,.mui-col-sm-3,.mui-col-sm-4,.mui-col-sm-5,.mui-col-sm-6,.mui-col-sm-7,.mui-col-sm-8,.mui-col-sm-9,.mui-col-xs-1,.mui-col-xs-10,.mui-col-xs-11,.mui-col-xs-12,.mui-col-xs-2,.mui-col-xs-3,.mui-col-xs-4,.mui-col-xs-5,.mui-col-xs-6,.mui-col-xs-7,.mui-col-xs-8,.mui-col-xs-9{position:relative;min-height:1px}.mui-row>[class*=mui-col-]{float:left}.mui-col-xs-12{width:100%}.mui-col-xs-11{width:91.66666667%}.mui-col-xs-10{width:83.33333333%}.mui-col-xs-9{width:75%}.mui-col-xs-8{width:66.66666667%}.mui-col-xs-7{width:58.33333333%}.mui-col-xs-6{width:50%}.mui-col-xs-5{width:41.66666667%}.mui-col-xs-4{width:33.33333333%}.mui-col-xs-3{width:25%}.mui-col-xs-2{width:16.66666667%}.mui-col-xs-1{width:8.33333333%}@media (min-width:400px){.mui-col-sm-12{width:100%}.mui-col-sm-11{width:91.66666667%}.mui-col-sm-10{width:83.33333333%}.mui-col-sm-9{width:75%}.mui-col-sm-8{width:66.66666667%}.mui-col-sm-7{width:58.33333333%}.mui-col-sm-6{width:50%}.mui-col-sm-5{width:41.66666667%}.mui-col-sm-4{width:33.33333333%}.mui-col-sm-3{width:25%}.mui-col-sm-2{width:16.66666667%}.mui-col-sm-1{width:8.33333333%}}.mui-scroll-wrapper{position:absolute;z-index:2;top:0;bottom:0;left:0;overflow:hidden;width:100%}.mui-scroll{position:absolute;z-index:1;width:100%;-webkit-transform:translateZ(0);transform:translateZ(0)}.mui-scrollbar{position:absolute;z-index:9998;overflow:hidden;-webkit-transition:500ms;transition:500ms;transform:translateZ(0px);pointer-events:none;opacity:0}.mui-scrollbar-vertical{top:0;right:1px;bottom:2px;width:4px}.mui-scrollbar-vertical .mui-scrollbar-indicator{width:100%}.mui-scrollbar-horizontal{right:2px;bottom:0;left:2px;height:4px}.mui-scrollbar-horizontal .mui-scrollbar-indicator{height:100%}.mui-scrollbar-indicator{position:absolute;display:block;box-sizing:border-box;-webkit-transition:.01s cubic-bezier(.1,.57,.1,1);transition:.01s cubic-bezier(.1,.57,.1,1);transform:translate(0px,0) translateZ(0px);border:1px solid rgba(255,255,255,.80196);border-radius:2px;background:rgba(0,0,0,.39804)}.mui-plus-pullrefresh .mui-fullscreen .mui-scroll-wrapper .mui-scroll-wrapper,.mui-plus-pullrefresh .mui-fullscreen .mui-slider-group .mui-scroll-wrapper{position:absolute;top:0;bottom:0;left:0;overflow:hidden;width:100%}.mui-plus-pullrefresh .mui-fullscreen .mui-scroll-wrapper .mui-scroll,.mui-plus-pullrefresh .mui-fullscreen .mui-slider-group .mui-scroll{position:absolute;width:100%}.mui-plus-pullrefresh .mui-scroll-wrapper,.mui-plus-pullrefresh .mui-slider-group{position:static;top:auto;bottom:auto;left:auto;overflow:auto;width:auto}.mui-plus-pullrefresh .mui-slider-group{overflow:visible}.mui-plus-pullrefresh .mui-scroll{position:static;width:auto}.mui-off-canvas-wrap .mui-bar{position:absolute!important;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);-webkit-box-shadow:none;box-shadow:none}.mui-off-canvas-wrap{position:relative;z-index:1;overflow:hidden;width:100%;height:100%}.mui-off-canvas-wrap .mui-inner-wrap{position:relative;z-index:1;width:100%;height:100%}.mui-off-canvas-wrap .mui-inner-wrap.mui-transitioning{-webkit-transition:-webkit-transform 350ms;transition:transform 350ms cubic-bezier(.165,.84,.44,1)}.mui-off-canvas-wrap .mui-inner-wrap .mui-off-canvas-left{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.mui-off-canvas-wrap .mui-inner-wrap .mui-off-canvas-right{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mui-off-canvas-wrap.mui-active{overflow:hidden;height:100%}.mui-off-canvas-wrap.mui-active .mui-off-canvas-backdrop{position:absolute;z-index:998;top:0;right:0;bottom:0;left:0;display:block;transition:background 350ms cubic-bezier(.165,.84,.44,1);background:rgba(0,0,0,.4);box-shadow:-4px 0 4px rgba(0,0,0,.5),4px 0 4px rgba(0,0,0,.5);-webkit-tap-highlight-color:transparent}.mui-off-canvas-wrap.mui-slide-in .mui-off-canvas-right{z-index:10000!important;-webkit-transform:translate3d(100%,0,0)}.mui-off-canvas-wrap.mui-slide-in .mui-off-canvas-left{z-index:10000!important;-webkit-transform:translate3d(-100%,0,0)}.mui-off-canvas-left,.mui-off-canvas-right{position:absolute;z-index:-1;top:0;bottom:0;visibility:hidden;box-sizing:content-box;width:70%;min-height:100%;background:#333;-webkit-overflow-scrolling:touch}.mui-off-canvas-left.mui-transitioning,.mui-off-canvas-right.mui-transitioning{-webkit-transition:-webkit-transform 350ms cubic-bezier(.165,.84,.44,1);transition:transform 350ms cubic-bezier(.165,.84,.44,1)}.mui-off-canvas-left{left:0}.mui-off-canvas-right{right:0}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable{background-color:#333}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-left,.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-right{width:80%;-webkit-transform:scale(.8);transform:scale(.8);opacity:.1}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-left.mui-transitioning,.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-right.mui-transitioning{-webkit-transition:-webkit-transform 350ms cubic-bezier(.165,.84,.44,1),opacity 350ms cubic-bezier(.165,.84,.44,1);transition:transform 350ms cubic-bezier(.165,.84,.44,1),opacity 350ms cubic-bezier(.165,.84,.44,1)}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-left{-webkit-transform-origin:-100%;transform-origin:-100%}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable>.mui-off-canvas-right{-webkit-transform-origin:200%;transform-origin:200%}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active>.mui-inner-wrap{-webkit-transform:scale(.8);transform:scale(.8)}.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active>.mui-off-canvas-left,.mui-off-canvas-wrap:not(.mui-slide-in).mui-scalable.mui-active>.mui-off-canvas-right{-webkit-transform:scale(1);transform:scale(1);opacity:1}.mui-loading .mui-spinner{display:block;margin:0 auto}.mui-spinner{display:inline-block;width:24px;height:24px;-webkit-transform-origin:50%;transform-origin:50%;-webkit-animation:spinner-spin 1s step-end infinite;animation:spinner-spin 1s step-end infinite}.mui-spinner:after{display:block;width:100%;height:100%;content:'';background-image:url('data:image/svg+xml;charset=utf-8,<svg viewBox=\\'0 0 120 120\\' xmlns=\\'http://www.w3.org/2000/svg\\' xmlns:xlink=\\'http://www.w3.org/1999/xlink\\'><defs><line id=\\'l\\' x1=\\'60\\' x2=\\'60\\' y1=\\'7\\' y2=\\'27\\' stroke=\\'%236c6c6c\\' stroke-width=\\'11\\' stroke-linecap=\\'round\\'/></defs><g><use xlink:href=\\'%23l\\' opacity=\\'.27\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(30 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(60 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(90 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(120 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(150 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.37\\' transform=\\'rotate(180 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.46\\' transform=\\'rotate(210 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.56\\' transform=\\'rotate(240 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.66\\' transform=\\'rotate(270 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.75\\' transform=\\'rotate(300 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.85\\' transform=\\'rotate(330 60,60)\\'/></g></svg>');background-repeat:no-repeat;background-position:50%;background-size:100%}.mui-spinner-white:after{background-image:url('data:image/svg+xml;charset=utf-8,<svg viewBox=\\'0 0 120 120\\' xmlns=\\'http://www.w3.org/2000/svg\\' xmlns:xlink=\\'http://www.w3.org/1999/xlink\\'><defs><line id=\\'l\\' x1=\\'60\\' x2=\\'60\\' y1=\\'7\\' y2=\\'27\\' stroke=\\'%23fff\\' stroke-width=\\'11\\' stroke-linecap=\\'round\\'/></defs><g><use xlink:href=\\'%23l\\' opacity=\\'.27\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(30 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(60 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(90 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(120 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.27\\' transform=\\'rotate(150 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.37\\' transform=\\'rotate(180 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.46\\' transform=\\'rotate(210 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.56\\' transform=\\'rotate(240 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.66\\' transform=\\'rotate(270 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.75\\' transform=\\'rotate(300 60,60)\\'/><use xlink:href=\\'%23l\\' opacity=\\'.85\\' transform=\\'rotate(330 60,60)\\'/></g></svg>')}@-webkit-keyframes spinner-spin{0%{-webkit-transform:rotate(0deg)}8.33333333%{-webkit-transform:rotate(30deg)}16.66666667%{-webkit-transform:rotate(60deg)}25%{-webkit-transform:rotate(90deg)}33.33333333%{-webkit-transform:rotate(120deg)}41.66666667%{-webkit-transform:rotate(150deg)}50%{-webkit-transform:rotate(180deg)}58.33333333%{-webkit-transform:rotate(210deg)}66.66666667%{-webkit-transform:rotate(240deg)}75%{-webkit-transform:rotate(270deg)}83.33333333%{-webkit-transform:rotate(300deg)}91.66666667%{-webkit-transform:rotate(330deg)}100%{-webkit-transform:rotate(360deg)}}@keyframes spinner-spin{0%{transform:rotate(0deg)}8.33333333%{transform:rotate(30deg)}16.66666667%{transform:rotate(60deg)}25%{transform:rotate(90deg)}33.33333333%{transform:rotate(120deg)}41.66666667%{transform:rotate(150deg)}50%{transform:rotate(180deg)}58.33333333%{transform:rotate(210deg)}66.66666667%{transform:rotate(240deg)}75%{transform:rotate(270deg)}83.33333333%{transform:rotate(300deg)}91.66666667%{transform:rotate(330deg)}100%{transform:rotate(360deg)}}.mui-btn,button,input[type=button],input[type=reset],input[type=submit]{font-size:14px;font-weight:400;line-height:1.42;position:relative;display:inline-block;margin-bottom:0;padding:6px 12px;cursor:pointer;-webkit-transition:all;transition:all;-webkit-transition-timing-function:linear;transition-timing-function:linear;-webkit-transition-duration:.2s;transition-duration:.2s;text-align:center;vertical-align:top;white-space:nowrap;color:#333;border:1px solid #ccc;border-radius:3px;border-top-left-radius:3px;border-top-right-radius:3px;border-bottom-right-radius:3px;border-bottom-left-radius:3px;background-color:#fff;background-clip:padding-box}.mui-btn.mui-active:enabled,.mui-btn:enabled:active,button.mui-active:enabled,button:enabled:active,input[type=button].mui-active:enabled,input[type=button]:enabled:active,input[type=reset].mui-active:enabled,input[type=reset]:enabled:active,input[type=submit].mui-active:enabled,input[type=submit]:enabled:active{color:#fff;background-color:#929292}.mui-btn.mui-disabled,.mui-btn:disabled,button.mui-disabled,button:disabled,input[type=button].mui-disabled,input[type=button]:disabled,input[type=reset].mui-disabled,input[type=reset]:disabled,input[type=submit].mui-disabled,input[type=submit]:disabled{opacity:.6}.mui-btn-blue,.mui-btn-primary,input[type=submit]{color:#fff;border:1px solid #007aff;background-color:#007aff}.mui-btn-blue.mui-active:enabled,.mui-btn-blue:enabled:active,.mui-btn-primary.mui-active:enabled,.mui-btn-primary:enabled:active,input[type=submit].mui-active:enabled,input[type=submit]:enabled:active{color:#fff;border:1px solid #0062cc;background-color:#0062cc}.mui-btn-green,.mui-btn-positive,.mui-btn-success{color:#fff;border:1px solid #4cd964;background-color:#4cd964}.mui-btn-green.mui-active:enabled,.mui-btn-green:enabled:active,.mui-btn-positive.mui-active:enabled,.mui-btn-positive:enabled:active,.mui-btn-success.mui-active:enabled,.mui-btn-success:enabled:active{color:#fff;border:1px solid #2ac845;background-color:#2ac845}.mui-btn-warning,.mui-btn-yellow{color:#fff;border:1px solid #f0ad4e;background-color:#f0ad4e}.mui-btn-warning.mui-active:enabled,.mui-btn-warning:enabled:active,.mui-btn-yellow.mui-active:enabled,.mui-btn-yellow:enabled:active{color:#fff;border:1px solid #ec971f;background-color:#ec971f}.mui-btn-danger,.mui-btn-negative,.mui-btn-red{color:#fff;border:1px solid #dd524d;background-color:#dd524d}.mui-btn-danger.mui-active:enabled,.mui-btn-danger:enabled:active,.mui-btn-negative.mui-active:enabled,.mui-btn-negative:enabled:active,.mui-btn-red.mui-active:enabled,.mui-btn-red:enabled:active{color:#fff;border:1px solid #cf2d28;background-color:#cf2d28}.mui-btn-purple,.mui-btn-royal{color:#fff;border:1px solid #8a6de9;background-color:#8a6de9}.mui-btn-purple.mui-active:enabled,.mui-btn-purple:enabled:active,.mui-btn-royal.mui-active:enabled,.mui-btn-royal:enabled:active{color:#fff;border:1px solid #6641e2;background-color:#6641e2}.mui-btn-grey{color:#fff;border:1px solid #c7c7cc;background-color:#c7c7cc}.mui-btn-grey.mui-active:enabled,.mui-btn-grey:enabled:active{color:#fff;border:1px solid #acacb4;background-color:#acacb4}.mui-btn-outlined{background-color:transparent}.mui-btn-outlined.mui-btn-blue,.mui-btn-outlined.mui-btn-primary{color:#007aff}.mui-btn-outlined.mui-btn-green,.mui-btn-outlined.mui-btn-positive,.mui-btn-outlined.mui-btn-success{color:#4cd964}.mui-btn-outlined.mui-btn-warning,.mui-btn-outlined.mui-btn-yellow{color:#f0ad4e}.mui-btn-outlined.mui-btn-danger,.mui-btn-outlined.mui-btn-negative,.mui-btn-outlined.mui-btn-red{color:#dd524d}.mui-btn-outlined.mui-btn-purple,.mui-btn-outlined.mui-btn-royal{color:#8a6de9}.mui-btn-outlined.mui-btn-blue:enabled:active,.mui-btn-outlined.mui-btn-danger:enabled:active,.mui-btn-outlined.mui-btn-green:enabled:active,.mui-btn-outlined.mui-btn-negative:enabled:active,.mui-btn-outlined.mui-btn-positive:enabled:active,.mui-btn-outlined.mui-btn-primary:enabled:active,.mui-btn-outlined.mui-btn-purple:enabled:active,.mui-btn-outlined.mui-btn-red:enabled:active,.mui-btn-outlined.mui-btn-royal:enabled:active,.mui-btn-outlined.mui-btn-success:enabled:active,.mui-btn-outlined.mui-btn-warning:enabled:active,.mui-btn-outlined.mui-btn-yellow:enabled:active{color:#fff}.mui-btn-link{padding-top:6px;padding-bottom:6px;color:#007aff;border:0;background-color:transparent}.mui-btn-link.mui-active:enabled,.mui-btn-link:enabled:active{color:#0062cc;background-color:transparent}.mui-btn-block{font-size:18px;display:block;width:100%;margin-bottom:10px;padding:15px 0}.mui-btn .mui-badge{font-size:14px;margin:-2px -4px -2px 4px;background-color:rgba(0,0,0,.15)}.mui-btn .mui-badge-inverted,.mui-btn:enabled:active .mui-badge-inverted{background-color:transparent}.mui-btn-negative:enabled:active .mui-badge-inverted,.mui-btn-positive:enabled:active .mui-badge-inverted,.mui-btn-primary:enabled:active .mui-badge-inverted{color:#fff}.mui-btn-block .mui-badge{position:absolute;right:0;margin-right:10px}.mui-btn .mui-icon{font-size:inherit}.mui-btn.mui-icon{font-size:14px;line-height:1.42}.mui-btn.mui-fab{width:56px;height:56px;padding:16px;border-radius:50%;outline:0}.mui-btn.mui-fab.mui-btn-mini{width:40px;height:40px;padding:8px}.mui-btn.mui-fab .mui-icon{font-size:24px;line-height:24px;width:24px;height:24px}.mui-btn .mui-spinner{width:14px;height:14px;vertical-align:text-bottom}.mui-btn-block .mui-spinner{width:22px;height:22px}.mui-bar{position:fixed;z-index:10;right:0;left:0;height:44px;padding-right:10px;padding-left:10px;border-bottom:0;background-color:#f7f7f7;-webkit-box-shadow:0 0 1px rgba(0,0,0,.85);box-shadow:0 0 1px rgba(0,0,0,.85);-webkit-backface-visibility:hidden;backface-visibility:hidden}.mui-bar .mui-title{right:40px;left:40px;display:inline-block;overflow:hidden;width:auto;margin:0;text-overflow:ellipsis}.mui-bar .mui-backdrop{background:0 0}.mui-bar-header-secondary{top:44px}.mui-bar-footer{bottom:0}.mui-bar-footer-secondary{bottom:44px}.mui-bar-footer-secondary-tab{bottom:50px}.mui-bar-footer,.mui-bar-footer-secondary,.mui-bar-footer-secondary-tab{border-top:0}.mui-bar-transparent{top:0;background-color:rgba(247,247,247,0);-webkit-box-shadow:none;box-shadow:none}.mui-bar-nav{top:0;-webkit-box-shadow:0 1px 6px #ccc;box-shadow:0 1px 6px #ccc}.mui-bar-nav~.mui-content .mui-anchor{display:block;visibility:hidden;height:45px;margin-top:-45px}.mui-bar-nav.mui-bar .mui-icon{margin-right:-10px;margin-left:-10px;padding-right:10px;padding-left:10px}.mui-title{font-size:17px;font-weight:500;line-height:44px;position:absolute;display:block;width:100%;margin:0 -10px;padding:0;text-align:center;white-space:nowrap;color:#000}.mui-title a{color:inherit}.mui-bar-tab{bottom:0;display:table;width:100%;height:50px;padding:0;table-layout:fixed;border-top:0;border-bottom:0;-webkit-touch-callout:none}.mui-bar-tab .mui-tab-item{display:table-cell;overflow:hidden;width:1%;height:50px;text-align:center;vertical-align:middle;white-space:nowrap;text-overflow:ellipsis;color:#929292}.mui-bar-tab .mui-tab-item.mui-active{color:#007aff}.mui-bar-tab .mui-tab-item .mui-icon{top:3px;width:24px;height:24px;padding-top:0;padding-bottom:0}.mui-bar-tab .mui-tab-item .mui-icon~.mui-tab-label{font-size:11px;display:block;overflow:hidden;text-overflow:ellipsis}.mui-bar-tab .mui-tab-item .mui-icon:active{background:0 0}.mui-focusin>.mui-bar-header-secondary,.mui-focusin>.mui-bar-nav{position:absolute}.mui-focusin>.mui-bar~.mui-content{padding-bottom:0}.mui-bar .mui-btn{font-weight:400;position:relative;z-index:20;top:7px;margin-top:0;padding:6px 12px 7px}.mui-bar .mui-btn.mui-pull-right{margin-left:10px}.mui-bar .mui-btn.mui-pull-left{margin-right:10px}.mui-bar .mui-btn-link{font-size:16px;line-height:44px;top:0;padding:0;color:#007aff;border:0}.mui-bar .mui-btn-link.mui-active,.mui-bar .mui-btn-link:active{color:#0062cc}.mui-bar .mui-btn-block{font-size:16px;top:6px;margin-bottom:0;padding:5px 0}.mui-bar .mui-btn-nav.mui-pull-left{margin-left:-5px}.mui-bar .mui-btn-nav.mui-pull-left .mui-icon-left-nav{margin-right:-3px}.mui-bar .mui-btn-nav.mui-pull-right{margin-right:-5px}.mui-bar .mui-btn-nav.mui-pull-right .mui-icon-right-nav{margin-left:-3px}.mui-bar .mui-btn-nav:active{opacity:.3}.mui-bar .mui-icon{font-size:24px;position:relative;z-index:20;padding-top:10px;padding-bottom:10px}.mui-bar .mui-icon:active{opacity:.3}.mui-bar .mui-btn .mui-icon{top:1px;margin:0;padding:0}.mui-bar .mui-title .mui-icon{margin:0;padding:0}.mui-bar .mui-title .mui-icon.mui-icon-caret{top:4px;margin-left:-5px}.mui-bar input[type=search]{height:29px;margin:6px 0}.mui-bar .mui-input-row .mui-btn{padding:12px 10px}.mui-bar .mui-search:before{margin-top:-10px}.mui-bar .mui-input-row .mui-input-clear~.mui-icon-clear,.mui-bar .mui-input-row .mui-input-speech~.mui-icon-speech{top:0;right:12px}.mui-bar.mui-bar-header-secondary .mui-input-row .mui-input-clear~.mui-icon-clear,.mui-bar.mui-bar-header-secondary .mui-input-row .mui-input-speech~.mui-icon-speech{top:0;right:0}.mui-bar .mui-segmented-control{top:7px;width:auto;margin:0 auto}.mui-bar.mui-bar-header-secondary .mui-segmented-control{top:0}.mui-badge{font-size:12px;line-height:1;display:inline-block;padding:3px 6px;color:#333;border-radius:100px;background-color:rgba(0,0,0,.15)}.mui-badge.mui-badge-inverted{padding:0 5px 0 0;color:#929292;background-color:transparent}.mui-badge-blue,.mui-badge-primary{color:#fff;background-color:#007aff}.mui-badge-blue.mui-badge-inverted,.mui-badge-primary.mui-badge-inverted{color:#007aff;background-color:transparent}.mui-badge-green,.mui-badge-success{color:#fff;background-color:#4cd964}.mui-badge-green.mui-badge-inverted,.mui-badge-success.mui-badge-inverted{color:#4cd964;background-color:transparent}.mui-badge-warning,.mui-badge-yellow{color:#fff;background-color:#f0ad4e}.mui-badge-warning.mui-badge-inverted,.mui-badge-yellow.mui-badge-inverted{color:#f0ad4e;background-color:transparent}.mui-badge-danger,.mui-badge-red{color:#fff;background-color:#dd524d}.mui-badge-danger.mui-badge-inverted,.mui-badge-red.mui-badge-inverted{color:#dd524d;background-color:transparent}.mui-badge-purple,.mui-badge-royal{color:#fff;background-color:#8a6de9}.mui-badge-purple.mui-badge-inverted,.mui-badge-royal.mui-badge-inverted{color:#8a6de9;background-color:transparent}.mui-icon .mui-badge{font-size:10px;line-height:1.4;position:absolute;top:-2px;left:100%;margin-left:-10px;padding:1px 5px;color:#fff;background:red}.mui-card{font-size:14px;position:relative;overflow:hidden;margin:10px;border-radius:2px;background-color:#fff;background-clip:padding-box;box-shadow:0 1px 2px rgba(0,0,0,.3)}.mui-content>.mui-card:first-child{margin-top:15px}.mui-card .mui-input-group .mui-input-row:last-child:after,.mui-card .mui-input-group .mui-input-row:last-child:before,.mui-card .mui-input-group:after,.mui-card .mui-input-group:before{height:0}.mui-card .mui-table-view{margin-bottom:0;border-top:0;border-bottom:0;border-radius:6px}.mui-card .mui-table-view .mui-table-view-cell:first-child,.mui-card .mui-table-view .mui-table-view-divider:first-child{top:0;border-top-left-radius:6px;border-top-right-radius:6px}.mui-card .mui-table-view .mui-table-view-cell:last-child,.mui-card .mui-table-view .mui-table-view-divider:last-child{border-bottom-right-radius:6px;border-bottom-left-radius:6px}.mui-card .mui-table-view:after,.mui-card .mui-table-view:before,.mui-card>.mui-table-view>.mui-table-view-cell:last-child:after,.mui-card>.mui-table-view>.mui-table-view-cell:last-child:before{height:0}.mui-card-footer,.mui-card-header{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;min-height:44px;padding:10px 15px;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.mui-card-footer .mui-card-link,.mui-card-header .mui-card-link{line-height:44px;position:relative;display:-webkit-box;display:-webkit-flex;display:flex;height:44px;margin-top:-10px;margin-bottom:-10px;-webkit-transition-duration:.3s;transition-duration:.3s;text-decoration:none;-webkit-box-pack:start;-webkit-justify-content:flex-start;justify-content:flex-start;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.mui-card-footer:before,.mui-card-header:after{position:absolute;top:0;right:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-card-header{font-size:17px;border-radius:2px 2px 0 0}.mui-card-header:after{top:auto;bottom:0}.mui-card-header>img:first-child{font-size:0;line-height:0;float:left;width:34px;height:34px}.mui-card-footer{color:#6d6d72;border-radius:0 0 2px 2px}.mui-card-content{font-size:14px;position:relative}.mui-card-content-inner{position:relative;padding:15px}.mui-card-media{vertical-align:bottom;color:#fff;background-position:center;background-size:cover}.mui-card-header.mui-card-media{display:block;padding:10px}.mui-card-header.mui-card-media .mui-media-body{font-size:14px;font-weight:500;line-height:17px;margin-bottom:0;margin-left:44px;color:#333}.mui-card-header.mui-card-media .mui-media-body p{font-size:13px;margin-bottom:0}.mui-table-view{position:relative;margin-top:0;margin-bottom:0;padding-left:0;list-style:none;background-color:#fff}.mui-table-view:after{position:absolute;right:0;bottom:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view:before{position:absolute;right:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc;top:-1px}.mui-table-view-icon .mui-table-view-cell .mui-navigate-right .mui-icon{font-size:20px;margin-top:-1px;margin-right:5px;margin-left:-5px}.mui-table-view-icon .mui-table-view-cell:after{left:40px}.mui-table-view-chevron .mui-table-view-cell{padding-right:65px}.mui-table-view-chevron .mui-table-view-cell>a:not(.mui-btn){margin-right:-65px}.mui-table-view-radio .mui-table-view-cell{padding-right:65px}.mui-table-view-radio .mui-table-view-cell>a:not(.mui-btn){margin-right:-65px}.mui-table-view-radio .mui-table-view-cell .mui-navigate-right:after{font-size:30px;font-weight:600;right:9px;content:'';color:#007aff}.mui-table-view-radio .mui-table-view-cell.mui-selected .mui-navigate-right:after{content:'\\E472'}.mui-table-view-inverted{color:#fff;background:#333}.mui-table-view-inverted:after{position:absolute;right:0;bottom:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#222}.mui-table-view-inverted:before{position:absolute;top:0;right:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#222}.mui-table-view-inverted .mui-table-view-cell:after{position:absolute;right:0;bottom:0;left:15px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#222}.mui-table-view-inverted .mui-table-view-cell.mui-active,.mui-table-view-inverted .mui-table-view-cell>a:not(.mui-btn).mui-active{background-color:#242424}.mui-table-view-cell{position:relative;overflow:hidden;padding:11px 15px;-webkit-touch-callout:none}.mui-table-view-cell:after{position:absolute;right:0;bottom:0;left:15px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view-cell.mui-checkbox input[type=checkbox],.mui-table-view-cell.mui-radio input[type=radio]{top:8px}.mui-table-view-cell.mui-checkbox.mui-left,.mui-table-view-cell.mui-radio.mui-left{padding-left:58px}.mui-table-view-cell.mui-active{background-color:#eee}.mui-table-view-cell:last-child:after,.mui-table-view-cell:last-child:before{height:0}.mui-table-view-cell>a:not(.mui-btn){position:relative;display:block;overflow:hidden;margin:-11px -15px;padding:inherit;white-space:nowrap;text-overflow:ellipsis;color:inherit}.mui-table-view-cell>a:not(.mui-btn).mui-active{background-color:#eee}.mui-table-view-cell p{margin-bottom:0}.mui-table-view-cell.mui-transitioning>.mui-slider-handle,.mui-table-view-cell.mui-transitioning>.mui-slider-left .mui-btn,.mui-table-view-cell.mui-transitioning>.mui-slider-right .mui-btn{-webkit-transition:-webkit-transform 300ms ease;transition:transform 300ms ease}.mui-table-view-cell.mui-active>.mui-slider-handle{background-color:#eee}.mui-table-view-cell>.mui-slider-handle{position:relative;background-color:#fff}.mui-table-view-cell>.mui-slider-handle .mui-navigate-right:after,.mui-table-view-cell>.mui-slider-handle.mui-navigate-right:after{right:0}.mui-table-view-cell>.mui-slider-handle,.mui-table-view-cell>.mui-slider-left .mui-btn,.mui-table-view-cell>.mui-slider-right .mui-btn{-webkit-transition:-webkit-transform 0ms ease;transition:transform 0ms ease}.mui-table-view-cell>.mui-slider-left,.mui-table-view-cell>.mui-slider-right{position:absolute;top:0;display:-webkit-box;display:-webkit-flex;display:flex;height:100%}.mui-table-view-cell>.mui-slider-left>.mui-btn,.mui-table-view-cell>.mui-slider-right>.mui-btn{position:relative;left:0;display:-webkit-box;display:-webkit-flex;display:flex;padding:0 30px;color:#fff;border:0;border-radius:0;-webkit-box-align:center;-webkit-align-items:center;align-items:center}.mui-table-view-cell>.mui-slider-left>.mui-btn:after,.mui-table-view-cell>.mui-slider-right>.mui-btn:after{position:absolute;z-index:-1;top:0;width:600%;height:100%;content:'';background:inherit}.mui-table-view-cell>.mui-slider-left>.mui-btn.mui-icon,.mui-table-view-cell>.mui-slider-right>.mui-btn.mui-icon{font-size:30px}.mui-table-view-cell>.mui-slider-right{right:0;-webkit-transition:-webkit-transform 0ms ease;transition:transform 0ms ease;-webkit-transform:translateX(100%);transform:translateX(100%)}.mui-table-view-cell>.mui-slider-left{left:0;-webkit-transition:-webkit-transform 0ms ease;transition:transform 0ms ease;-webkit-transform:translateX(-100%);transform:translateX(-100%)}.mui-table-view-cell>.mui-slider-left>.mui-btn:after{right:100%;margin-right:-1px}.mui-table-view-divider{font-weight:500;position:relative;margin-top:-1px;margin-left:0;padding-top:6px;padding-bottom:6px;padding-left:15px;color:#999;background-color:#fafafa}.mui-table-view-divider:after{position:absolute;right:0;bottom:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view-divider:before{position:absolute;top:0;right:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view .mui-media,.mui-table-view .mui-media-body{overflow:hidden}.mui-table-view .mui-media-large .mui-media-object{line-height:80px;max-width:80px;height:80px}.mui-table-view .mui-media .mui-subtitle{color:#000}.mui-table-view .mui-media-object{line-height:42px;max-width:42px;height:42px}.mui-table-view .mui-media-object.mui-pull-left{margin-right:10px}.mui-table-view .mui-media-object.mui-pull-right{margin-left:10px}.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object{line-height:29px;max-width:29px;height:29px;margin:-4px 0}.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object img{line-height:29px;max-width:29px;height:29px}.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object.mui-pull-left{margin-right:10px}.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-object .mui-icon{font-size:29px}.mui-table-view .mui-table-view-cell.mui-media-icon .mui-media-body:after{position:absolute;right:0;bottom:0;left:55px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view .mui-table-view-cell.mui-media-icon:after{height:0!important}.mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view{display:block}.mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view:after,.mui-table-view.mui-unfold .mui-table-view-cell.mui-collapse .mui-table-view:before{height:0!important}.mui-table-view.mui-unfold .mui-table-view-cell.mui-media-icon.mui-collapse .mui-media-body:after{position:absolute;right:0;bottom:0;left:70px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view-cell>.mui-badge,.mui-table-view-cell>.mui-btn,.mui-table-view-cell>.mui-switch,.mui-table-view-cell>a>.mui-badge,.mui-table-view-cell>a>.mui-btn,.mui-table-view-cell>a>.mui-switch{position:absolute;top:50%;right:15px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.mui-table-view-cell .mui-navigate-right>.mui-badge,.mui-table-view-cell .mui-navigate-right>.mui-btn,.mui-table-view-cell .mui-navigate-right>.mui-switch,.mui-table-view-cell .mui-push-left>.mui-badge,.mui-table-view-cell .mui-push-left>.mui-btn,.mui-table-view-cell .mui-push-left>.mui-switch,.mui-table-view-cell .mui-push-right>.mui-badge,.mui-table-view-cell .mui-push-right>.mui-btn,.mui-table-view-cell .mui-push-right>.mui-switch,.mui-table-view-cell>a .mui-navigate-right>.mui-badge,.mui-table-view-cell>a .mui-navigate-right>.mui-btn,.mui-table-view-cell>a .mui-navigate-right>.mui-switch,.mui-table-view-cell>a .mui-push-left>.mui-badge,.mui-table-view-cell>a .mui-push-left>.mui-btn,.mui-table-view-cell>a .mui-push-left>.mui-switch,.mui-table-view-cell>a .mui-push-right>.mui-badge,.mui-table-view-cell>a .mui-push-right>.mui-btn,.mui-table-view-cell>a .mui-push-right>.mui-switch{right:35px}.mui-content>.mui-table-view:first-child{margin-top:15px}.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell:last-child:after,.mui-table-view-cell.mui-collapse .mui-table-view:after,.mui-table-view-cell.mui-collapse .mui-table-view:before{height:0}.mui-table-view-cell.mui-collapse>.mui-navigate-right:after,.mui-table-view-cell.mui-collapse>.mui-push-right:after{content:'\\E581'}.mui-table-view-cell.mui-collapse.mui-active{margin-top:-1px}.mui-table-view-cell.mui-collapse.mui-active .mui-collapse-content,.mui-table-view-cell.mui-collapse.mui-active .mui-table-view{display:block}.mui-table-view-cell.mui-collapse.mui-active>.mui-navigate-right:after,.mui-table-view-cell.mui-collapse.mui-active>.mui-push-right:after{content:'\\E580'}.mui-table-view-cell.mui-collapse.mui-active .mui-table-view-cell>a:not(.mui-btn).mui-active{margin-left:-31px;padding-left:47px}.mui-table-view-cell.mui-collapse .mui-collapse-content{position:relative;display:none;overflow:hidden;margin:11px -15px -11px;padding:8px 15px;-webkit-transition:height .35s ease;-o-transition:height .35s ease;transition:height .35s ease;background:#fff}.mui-table-view-cell.mui-collapse .mui-collapse-content>.mui-input-group,.mui-table-view-cell.mui-collapse .mui-collapse-content>.mui-slider{width:auto;height:auto;margin:-8px -15px}.mui-table-view-cell.mui-collapse .mui-collapse-content>.mui-slider{margin:-8px -16px}.mui-table-view-cell.mui-collapse .mui-table-view{display:none;margin-top:11px;margin-right:-15px;margin-bottom:-11px;margin-left:-15px;border:0}.mui-table-view-cell.mui-collapse .mui-table-view.mui-table-view-chevron{margin-right:-65px}.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell{padding-left:31px;background-position:31px 100%}.mui-table-view-cell.mui-collapse .mui-table-view .mui-table-view-cell:after{position:absolute;right:0;bottom:0;left:30px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-table-view.mui-grid-view{font-size:0;display:block;width:100%;padding:0 10px 10px 0;white-space:normal}.mui-table-view.mui-grid-view .mui-table-view-cell{font-size:17px;display:inline-block;margin-right:-4px;padding:10px 0 0 14px;text-align:center;vertical-align:middle;background:0 0}.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-object{width:100%;max-width:100%;height:auto}.mui-table-view.mui-grid-view .mui-table-view-cell>a:not(.mui-btn){margin:-10px 0 0 -14px}.mui-table-view.mui-grid-view .mui-table-view-cell>a:not(.mui-btn).mui-active,.mui-table-view.mui-grid-view .mui-table-view-cell>a:not(.mui-btn):active{background:0 0}.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body{font-size:15px;line-height:15px;display:block;width:100%;height:15px;margin-top:8px;text-overflow:ellipsis;color:#333}.mui-table-view.mui-grid-view .mui-table-view-cell:after,.mui-table-view.mui-grid-view .mui-table-view-cell:before{height:0}.mui-grid-view.mui-grid-9{margin:0;padding:0;border-top:1px solid #eee;border-left:1px solid #eee;background-color:#f2f2f2}.mui-grid-view.mui-grid-9:after,.mui-grid-view.mui-grid-9:before{display:table;content:' '}.mui-grid-view.mui-grid-9:after{clear:both;position:static}.mui-grid-view.mui-grid-9 .mui-table-view-cell{margin:0;padding:11px 15px;vertical-align:top;border-right:1px solid #eee;border-bottom:1px solid #eee}.mui-grid-view.mui-grid-9 .mui-table-view-cell.mui-active{background-color:#eee}.mui-grid-view.mui-grid-9 .mui-table-view-cell>a:not(.mui-btn){margin:0;padding:10px 0}.mui-grid-view.mui-grid-9:before{height:0}.mui-grid-view.mui-grid-9 .mui-media{color:#797979}.mui-grid-view.mui-grid-9 .mui-media .mui-icon{font-size:2.4em;position:relative}.mui-slider-cell{position:relative}.mui-slider-cell>.mui-slider-handle{z-index:1}.mui-slider-cell>.mui-slider-left,.mui-slider-cell>.mui-slider-right{position:absolute;z-index:0;top:0;bottom:0}.mui-slider-cell>.mui-slider-left{left:0}.mui-slider-cell>.mui-slider-right{right:0}input,select,textarea{font-family:'Helvetica Neue',Helvetica,sans-serif;font-size:17px;-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:transparent}input:focus,select:focus,textarea:focus{-webkit-tap-highlight-color:transparent;-webkit-tap-highlight-color:transparent;-webkit-user-modify:read-write-plaintext-only}input[type=color],input[type=date],input[type=datetime-local],input[type=datetime],input[type=email],input[type=month],input[type=number],input[type=password],input[type=search],input[type=tel],input[type=text],input[type=time],input[type=url],input[type=week],select,textarea{line-height:21px;width:100%;height:40px;margin-bottom:15px;padding:10px 15px;-webkit-user-select:text;border:1px solid rgba(0,0,0,.2);border-radius:3px;outline:0;background-color:#fff;-webkit-appearance:none}input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{margin:0;-webkit-appearance:none}input[type=search]{font-size:16px;-webkit-box-sizing:border-box;box-sizing:border-box;height:34px;text-align:center;border:0;border-radius:6px;background-color:rgba(0,0,0,.1)}input[type=search]:focus{text-align:left}textarea{height:auto;resize:none}select{font-size:14px;height:auto;margin-top:1px;border:0!important;background-color:#fff}select:focus{-webkit-user-modify:read-only}.mui-input-group{position:relative;padding:0;border:0;background-color:#fff}.mui-input-group:after{position:absolute;right:0;bottom:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-input-group:before{position:absolute;top:0;right:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-input-group input,.mui-input-group textarea{margin-bottom:0;border:0;border-radius:0;background-color:transparent;-webkit-box-shadow:none;box-shadow:none}.mui-input-group input[type=search]{background:0 0}.mui-input-group input:last-child{background-image:none}.mui-input-row{clear:left;overflow:hidden}.mui-input-row select{font-size:17px;height:37px;padding:0}.mui-input-row .mui-btn+input,.mui-input-row label+input,.mui-input-row:last-child{background:0 0}.mui-input-group .mui-input-row{height:40px}.mui-input-group .mui-input-row:after{position:absolute;right:0;bottom:0;left:15px;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-input-row label{font-family:'Helvetica Neue',Helvetica,sans-serif;line-height:1.1;float:left;width:35%;padding:11px 15px}.mui-input-row label~input,.mui-input-row label~select,.mui-input-row label~textarea{float:right;width:65%;margin-bottom:0;padding-left:0;border:0}.mui-input-row .mui-btn{line-height:1.1;float:right;width:15%;padding:10px 15px}.mui-input-row .mui-btn~input,.mui-input-row .mui-btn~select,.mui-input-row .mui-btn~textarea{float:left;width:85%;margin-bottom:0;padding-left:0;border:0}.mui-button-row{position:relative;padding-top:5px;text-align:center}.mui-input-group .mui-button-row{height:45px}.mui-input-row{position:relative}.mui-input-row.mui-input-range{overflow:visible;padding-right:20px}.mui-input-row .mui-inline{padding:8px 0}.mui-input-row .mui-input-clear~.mui-icon-clear,.mui-input-row .mui-input-password~.mui-icon-eye,.mui-input-row .mui-input-speech~.mui-icon-speech{font-size:20px;position:absolute;z-index:1;top:10px;right:0;width:38px;height:38px;text-align:center;color:#999}.mui-input-row .mui-input-clear~.mui-icon-clear.mui-active,.mui-input-row .mui-input-password~.mui-icon-eye.mui-active,.mui-input-row .mui-input-speech~.mui-icon-speech.mui-active{color:#007aff}.mui-input-row .mui-input-speech~.mui-icon-speech{font-size:24px;top:8px}.mui-input-row .mui-input-clear~.mui-icon-clear~.mui-icon-speech{display:none}.mui-input-row .mui-input-clear~.mui-icon-clear.mui-hidden~.mui-icon-speech{display:inline-block}.mui-input-row .mui-icon-speech~.mui-placeholder{right:38px}.mui-input-row.mui-search .mui-icon-clear{top:7px}.mui-input-row.mui-search .mui-icon-speech{top:5px}.mui-checkbox,.mui-radio{position:relative}.mui-checkbox label,.mui-radio label{display:inline-block;float:none;width:100%;padding-right:58px}.mui-checkbox.mui-left input[type=checkbox],.mui-radio.mui-left input[type=radio]{left:20px}.mui-checkbox.mui-left label,.mui-radio.mui-left label{padding-right:15px;padding-left:58px}.mui-checkbox input[type=checkbox],.mui-radio input[type=radio]{position:absolute;top:4px;right:20px;display:inline-block;width:28px;height:26px;border:0;outline:0!important;background-color:transparent;-webkit-appearance:none}.mui-checkbox input[type=checkbox][disabled]:before,.mui-radio input[type=radio][disabled]:before{opacity:.3}.mui-checkbox input[type=checkbox]:before,.mui-radio input[type=radio]:before{font-family:Muiicons;font-size:28px;font-weight:400;line-height:1;text-decoration:none;color:#aaa;border-radius:0;background:0 0;-webkit-font-smoothing:antialiased}.mui-checkbox input[type=checkbox]:checked:before,.mui-radio input[type=radio]:checked:before{color:#007aff}.mui-checkbox label.mui-disabled,.mui-checkbox.mui-disabled label,.mui-radio label.mui-disabled,.mui-radio.mui-disabled label{opacity:.4}.mui-radio input[type=radio]:before{content:'\\E411'}.mui-radio input[type=radio]:checked:before{content:'\\E441'}.mui-checkbox input[type=checkbox]:before{content:'\\E411'}.mui-checkbox input[type=checkbox]:checked:before{content:'\\E442'}.mui-select{position:relative}.mui-select:before{font-family:Muiicons;position:absolute;top:8px;right:21px;content:'\\E581';color:rgba(170,170,170,.6)}.mui-input-row .mui-switch{float:right;margin-top:5px;margin-right:20px}.mui-input-range input[type=range]{position:relative;width:100%;height:2px;margin:17px 0;padding:0;cursor:pointer;border:0;border-radius:3px;outline:0;background-color:#999;-webkit-appearance:none!important}.mui-input-range input[type=range]::-webkit-slider-thumb{width:28px;height:28px;border-color:#0062cc;border-radius:50%;background-color:#007aff;background-clip:padding-box;-webkit-appearance:none!important}.mui-input-range label~input[type=range]{width:65%}.mui-input-range .mui-tooltip{font-size:36px;line-height:64px;position:absolute;z-index:1;top:-70px;width:64px;height:64px;text-align:center;opacity:.8;color:#333;border:1px solid #ddd;border-radius:6px;background-color:#fff;text-shadow:0 1px 0 #f3f3f3}.mui-search{position:relative}.mui-search input[type=search]{padding-left:30px}.mui-search .mui-placeholder{font-size:16px;line-height:34px;position:absolute;z-index:1;top:0;right:0;bottom:0;left:0;display:inline-block;height:34px;text-align:center;color:#999;border:0;border-radius:6px;background:0 0}.mui-search .mui-placeholder .mui-icon{font-size:20px;color:#333}.mui-search:before{font-family:Muiicons;font-size:20px;font-weight:400;position:absolute;top:50%;right:50%;display:none;margin-top:-18px;margin-right:31px;content:'\\E466'}.mui-search.mui-active:before{font-size:20px;right:auto;left:5px;display:block;margin-right:0}.mui-search.mui-active input[type=search]{text-align:left}.mui-search.mui-active .mui-placeholder{display:none}.mui-segmented-control{font-size:15px;font-weight:400;position:relative;display:table;overflow:hidden;width:100%;table-layout:fixed;border:1px solid #007aff;border-radius:3px;background-color:transparent;-webkit-touch-callout:none}.mui-segmented-control.mui-segmented-control-vertical{border-collapse:collapse;border-width:0;border-radius:0}.mui-segmented-control.mui-segmented-control-vertical .mui-control-item{display:block;border-bottom:1px solid #c8c7cc;border-left-width:0}.mui-segmented-control.mui-scroll-wrapper{height:38px}.mui-segmented-control.mui-scroll-wrapper .mui-scroll{width:auto;height:40px;white-space:nowrap}.mui-segmented-control.mui-scroll-wrapper .mui-control-item{display:inline-block;width:auto;padding:0 20px;border:0}.mui-segmented-control .mui-control-item{line-height:38px;display:table-cell;overflow:hidden;width:1%;-webkit-transition:background-color .1s linear;transition:background-color .1s linear;text-align:center;white-space:nowrap;text-overflow:ellipsis;color:#007aff;border-color:#007aff;border-left:1px solid #007aff}.mui-segmented-control .mui-control-item:first-child{border-left-width:0}.mui-segmented-control .mui-control-item.mui-active{color:#fff;background-color:#007aff}.mui-segmented-control.mui-segmented-control-inverted{width:100%;border:0;border-radius:0}.mui-segmented-control.mui-segmented-control-inverted.mui-segmented-control-vertical .mui-control-item,.mui-segmented-control.mui-segmented-control-inverted.mui-segmented-control-vertical .mui-control-item.mui-active{border-bottom:1px solid #c8c7cc}.mui-segmented-control.mui-segmented-control-inverted .mui-control-item{color:inherit;border:0}.mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active{color:#007aff;border-bottom:2px solid #007aff;background:0 0}.mui-segmented-control.mui-segmented-control-inverted~.mui-slider-progress-bar{background-color:#007aff}.mui-segmented-control-positive{border:1px solid #4cd964}.mui-segmented-control-positive .mui-control-item{color:#4cd964;border-color:inherit}.mui-segmented-control-positive .mui-control-item.mui-active{color:#fff;background-color:#4cd964}.mui-segmented-control-positive.mui-segmented-control-inverted .mui-control-item.mui-active{color:#4cd964;border-bottom:2px solid #4cd964;background:0 0}.mui-segmented-control-positive.mui-segmented-control-inverted~.mui-slider-progress-bar{background-color:#4cd964}.mui-segmented-control-negative{border:1px solid #dd524d}.mui-segmented-control-negative .mui-control-item{color:#dd524d;border-color:inherit}.mui-segmented-control-negative .mui-control-item.mui-active{color:#fff;background-color:#dd524d}.mui-segmented-control-negative.mui-segmented-control-inverted .mui-control-item.mui-active{color:#dd524d;border-bottom:2px solid #dd524d;background:0 0}.mui-segmented-control-negative.mui-segmented-control-inverted~.mui-slider-progress-bar{background-color:#dd524d}.mui-control-content{position:relative;display:none}.mui-control-content.mui-active{display:block}.mui-popover{position:absolute;z-index:999;display:none;width:280px;-webkit-transition:opacity .3s;transition:opacity .3s;-webkit-transition-property:opacity;transition-property:opacity;-webkit-transform:none;transform:none;opacity:0;border-radius:7px;background-color:#f7f7f7;-webkit-box-shadow:0 0 15px rgba(0,0,0,.1);box-shadow:0 0 15px rgba(0,0,0,.1)}.mui-popover .mui-popover-arrow{position:absolute;z-index:1000;top:-25px;left:0;overflow:hidden;width:26px;height:26px}.mui-popover .mui-popover-arrow:after{position:absolute;top:19px;left:0;width:26px;height:26px;content:' ';-webkit-transform:rotate(45deg);transform:rotate(45deg);border-radius:3px;background:#f7f7f7}.mui-popover .mui-popover-arrow.mui-bottom{top:100%;left:-26px;margin-top:-1px}.mui-popover .mui-popover-arrow.mui-bottom:after{top:-19px;left:0}.mui-popover.mui-popover-action{bottom:0;width:100%;-webkit-transition:-webkit-transform .3s,opacity .3s;transition:transform .3s,opacity .3s;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);border-radius:0;background:0 0;-webkit-box-shadow:none;box-shadow:none}.mui-popover.mui-popover-action .mui-popover-arrow{display:none}.mui-popover.mui-popover-action.mui-popover-bottom{position:fixed}.mui-popover.mui-popover-action.mui-active{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.mui-popover.mui-popover-action .mui-table-view{margin:8px;text-align:center;color:#007aff;border-radius:4px}.mui-popover.mui-popover-action .mui-table-view .mui-table-view-cell:after{position:absolute;right:0;bottom:0;left:0;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);background-color:#c8c7cc}.mui-popover.mui-popover-action .mui-table-view small{font-weight:400;line-height:1.3;display:block}.mui-popover.mui-active{display:block;opacity:1}.mui-popover .mui-bar~.mui-table-view{padding-top:44px}.mui-backdrop{position:fixed;z-index:998;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.3)}.mui-bar-backdrop.mui-backdrop{bottom:50px;background:0 0}.mui-backdrop-action.mui-backdrop{background-color:rgba(0,0,0,.3)}.mui-backdrop-action.mui-backdrop,.mui-bar-backdrop.mui-backdrop{opacity:0}.mui-backdrop-action.mui-backdrop.mui-active,.mui-bar-backdrop.mui-backdrop.mui-active{-webkit-transition:all .4s ease;transition:all .4s ease;opacity:1}.mui-popover .mui-btn-block{margin-bottom:5px}.mui-popover .mui-btn-block:last-child{margin-bottom:0}.mui-popover .mui-bar{-webkit-box-shadow:none;box-shadow:none}.mui-popover .mui-bar-nav{border-bottom:1px solid rgba(0,0,0,.15);border-top-left-radius:12px;border-top-right-radius:12px;-webkit-box-shadow:none;box-shadow:none}.mui-popover .mui-scroll-wrapper{margin:7px 0;border-radius:7px;background-clip:padding-box}.mui-popover .mui-scroll .mui-table-view{max-height:none}.mui-popover .mui-table-view{overflow:auto;max-height:300px;margin-bottom:0;border-radius:7px;background-color:#f7f7f7;background-image:none;-webkit-overflow-scrolling:touch}.mui-popover .mui-table-view:after,.mui-popover .mui-table-view:before{height:0}.mui-popover .mui-table-view .mui-table-view-cell:first-child,.mui-popover .mui-table-view .mui-table-view-cell:first-child>a:not(.mui-btn){border-top-left-radius:12px;border-top-right-radius:12px}.mui-popover .mui-table-view .mui-table-view-cell:last-child,.mui-popover .mui-table-view .mui-table-view-cell:last-child>a:not(.mui-btn){border-bottom-right-radius:12px;border-bottom-left-radius:12px}.mui-popover.mui-bar-popover .mui-table-view{width:106px}.mui-popover.mui-bar-popover .mui-table-view .mui-table-view-cell{padding:11px 15px;background-position:0 100%}.mui-popover.mui-bar-popover .mui-table-view .mui-table-view-cell>a:not(.mui-btn){margin:-11px -15px -11px -15px}.mui-popup-backdrop{position:fixed;z-index:998;top:0;right:0;bottom:0;left:0;-webkit-transition-duration:400ms;transition-duration:400ms;opacity:0;background:rgba(0,0,0,.4)}.mui-popup-backdrop.mui-active{opacity:1}.mui-popup{position:fixed;z-index:10000;top:50%;left:50%;display:none;overflow:hidden;width:270px;-webkit-transition-property:-webkit-transform,opacity;transition-property:transform,opacity;-webkit-transform:translate3d(-50%,-50%,0) scale(1.185);transform:translate3d(-50%,-50%,0) scale(1.185);text-align:center;opacity:0;color:#000;border-radius:13px}.mui-popup.mui-popup-in{display:block;-webkit-transition-duration:400ms;transition-duration:400ms;-webkit-transform:translate3d(-50%,-50%,0) scale(1);transform:translate3d(-50%,-50%,0) scale(1);opacity:1}.mui-popup.mui-popup-out{-webkit-transition-duration:400ms;transition-duration:400ms;-webkit-transform:translate3d(-50%,-50%,0) scale(1);transform:translate3d(-50%,-50%,0) scale(1);opacity:0}.mui-popup-inner{position:relative;padding:15px;border-radius:13px 13px 0 0;background:rgba(255,255,255,.95)}.mui-popup-inner:after{position:absolute;z-index:15;top:auto;right:auto;bottom:0;left:0;display:block;width:100%;height:1px;content:'';-webkit-transform:scaleY(.5);transform:scaleY(.5);-webkit-transform-origin:50% 100%;transform-origin:50% 100%;background-color:rgba(0,0,0,.2)}.mui-popup-title{font-size:18px;font-weight:500;text-align:center}.mui-popup-title+.mui-popup-text{font-family:inherit;font-size:14px;margin:5px 0 0}.mui-popup-buttons{position:relative;display:-webkit-box;display:-webkit-flex;display:flex;height:44px;-webkit-box-pack:center;-webkit-justify-content:center;justify-content:center}.mui-popup-button{font-size:17px;line-height:44px;position:relative;display:block;overflow:hidden;box-sizing:border-box;width:100%;height:44px;padding:0 5px;cursor:pointer;text-align:center;white-space:nowrap;text-overflow:ellipsis;color:#007aff;background:rgba(255,255,255,.95);-webkit-box-flex:1}.mui-popup-button:after{position:absolute;z-index:15;top:0;right:0;bottom:auto;left:auto;display:block;width:1px;height:100%;content:'';-webkit-transform:scaleX(.5);transform:scaleX(.5);-webkit-transform-origin:100% 50%;transform-origin:100% 50%;background-color:rgba(0,0,0,.2)}.mui-popup-button:first-child{border-radius:0 0 0 13px}.mui-popup-button:first-child:last-child{border-radius:0 0 13px 13px}.mui-popup-button:last-child{border-radius:0 0 13px}.mui-popup-button:last-child:after{display:none}.mui-popup-button.mui-popup-button-bold{font-weight:600}.mui-popup-input input{font-size:14px;width:100%;height:26px;margin:15px 0 0;padding:0 5px;border:1px solid rgba(0,0,0,.3);border-radius:0;background:#fff}.mui-plus.mui-android .mui-popup-backdrop{-webkit-transition-duration:1ms;transition-duration:1ms}.mui-plus.mui-android .mui-popup{-webkit-transition-duration:1ms;transition-duration:1ms;-webkit-transform:translate3d(-50%,-50%,0) scale(1);transform:translate3d(-50%,-50%,0) scale(1)}.mui-progressbar{position:relative;display:block;overflow:hidden;width:100%;height:2px;-webkit-transform-origin:center top;transform-origin:center top;vertical-align:middle;border-radius:2px;background:#b6b6b6;-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.mui-progressbar span{position:absolute;top:0;left:0;width:100%;height:100%;-webkit-transition:150ms;transition:150ms;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);background:#007aff}.mui-progressbar.mui-progressbar-infinite:before{position:absolute;top:0;left:0;width:100%;height:100%;content:'';-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);-webkit-transform-origin:left center;transform-origin:left center;-webkit-animation:mui-progressbar-infinite 1s linear infinite;animation:mui-progressbar-infinite 1s linear infinite;background:#007aff}body>.mui-progressbar{position:absolute;z-index:10000;top:44px;left:0;border-radius:0}.mui-progressbar-in{-webkit-animation:mui-progressbar-in 300ms forwards;animation:mui-progressbar-in 300ms forwards}.mui-progressbar-out{-webkit-animation:mui-progressbar-out 300ms forwards;animation:mui-progressbar-out 300ms forwards}@-webkit-keyframes mui-progressbar-in{from{-webkit-transform:scaleY(0);opacity:0}to{-webkit-transform:scaleY(1);opacity:1}}@keyframes mui-progressbar-in{from{transform:scaleY(0);opacity:0}to{transform:scaleY(1);opacity:1}}@-webkit-keyframes mui-progressbar-out{from{-webkit-transform:scaleY(1);opacity:1}to{-webkit-transform:scaleY(0);opacity:0}}@keyframes mui-progressbar-out{from{transform:scaleY(1);opacity:1}to{transform:scaleY(0);opacity:0}}@-webkit-keyframes mui-progressbar-infinite{0%{-webkit-transform:translate3d(-50%,0,0) scaleX(.5)}100%{-webkit-transform:translate3d(100%,0,0) scaleX(.5)}}@keyframes mui-progressbar-infinite{0%{transform:translate3d(-50%,0,0) scaleX(.5)}100%{transform:translate3d(100%,0,0) scaleX(.5)}}.mui-pagination{display:inline-block;margin:0 auto;padding-left:0;border-radius:6px}.mui-pagination>li{display:inline}.mui-pagination>li>a,.mui-pagination>li>span{line-height:1.428571429;position:relative;float:left;margin-left:-1px;padding:6px 12px;text-decoration:none;color:#007aff;border:1px solid #ddd;background-color:#fff}.mui-pagination>li:first-child>a,.mui-pagination>li:first-child>span{margin-left:0;border-top-left-radius:6px;border-bottom-left-radius:6px;background-clip:padding-box}.mui-pagination>li:last-child>a,.mui-pagination>li:last-child>span{border-top-right-radius:6px;border-bottom-right-radius:6px;background-clip:padding-box}.mui-pagination>li.mui-active>a,.mui-pagination>li.mui-active>a:active,.mui-pagination>li.mui-active>span,.mui-pagination>li.mui-active>span:active,.mui-pagination>li:active>a,.mui-pagination>li:active>a:active,.mui-pagination>li:active>span,.mui-pagination>li:active>span:active{z-index:2;cursor:default;color:#fff;border-color:#007aff;background-color:#007aff}.mui-pagination>li.mui-disabled>a,.mui-pagination>li.mui-disabled>a:active,.mui-pagination>li.mui-disabled>span,.mui-pagination>li.mui-disabled>span:active{opacity:.6;color:#777;border:1px solid #ddd;background-color:#fff}.mui-pagination-lg>li>a,.mui-pagination-lg>li>span{font-size:18px;padding:10px 16px}.mui-pagination-sm>li>a,.mui-pagination-sm>li>span{font-size:12px;padding:5px 10px}.mui-pager{padding-left:0;list-style:none;text-align:center}.mui-pager:after,.mui-pager:before{display:table;content:' '}.mui-pager:after{clear:both}.mui-pager li{display:inline}.mui-pager li>a,.mui-pager li>span{display:inline-block;padding:5px 14px;border:1px solid #ddd;border-radius:6px;background-color:#fff;background-clip:padding-box}.mui-pager li.mui-active>a,.mui-pager li.mui-active>span,.mui-pager li:active>a,.mui-pager li:active>span{cursor:default;text-decoration:none;color:#fff;border-color:#007aff;background-color:#007aff}.mui-pager .mui-next>a,.mui-pager .mui-next>span{float:right}.mui-pager .mui-previous>a,.mui-pager .mui-previous>span{float:left}.mui-pager .mui-disabled>a,.mui-pager .mui-disabled>a:active,.mui-pager .mui-disabled>span,.mui-pager .mui-disabled>span:active{opacity:.6;color:#777;border:1px solid #ddd;background-color:#fff}.mui-modal{position:fixed;z-index:999;top:0;overflow:hidden;width:100%;min-height:100%;-webkit-transition:-webkit-transform .25s,opacity 1ms .25s;transition:transform .25s,opacity 1ms .25s;-webkit-transition-timing-function:cubic-bezier(.1,.5,.1,1);transition-timing-function:cubic-bezier(.1,.5,.1,1);-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0);opacity:0;background-color:#fff}.mui-modal.mui-active{height:100%;-webkit-transition:-webkit-transform .25s;transition:transform .25s;-webkit-transition-timing-function:cubic-bezier(.1,.5,.1,1);transition-timing-function:cubic-bezier(.1,.5,.1,1);-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.mui-android .mui-modal .mui-bar{position:static}.mui-android .mui-modal .mui-bar-nav~.mui-content{padding-top:0}.mui-slider{position:relative;z-index:1;overflow:hidden;width:100%}.mui-slider .mui-segmented-control.mui-segmented-control-inverted .mui-control-item.mui-active{border-bottom:0}.mui-slider .mui-segmented-control.mui-segmented-control-inverted~.mui-slider-group .mui-slider-item{border-top:1px solid #c8c7cc;border-bottom:1px solid #c8c7cc}.mui-slider .mui-slider-group{font-size:0;position:relative;-webkit-transition:all 0s linear;transition:all 0s linear;white-space:nowrap}.mui-slider .mui-slider-group .mui-slider-item{font-size:14px;position:relative;display:inline-block;width:100%;height:100%;vertical-align:top;white-space:normal}.mui-slider .mui-slider-group .mui-slider-item>a:not(.mui-control-item){line-height:0;position:relative;display:block}.mui-slider .mui-slider-group .mui-slider-item img{width:100%}.mui-slider .mui-slider-group .mui-slider-item .mui-table-view:after,.mui-slider .mui-slider-group .mui-slider-item .mui-table-view:before{height:0}.mui-slider .mui-slider-group.mui-slider-loop{-webkit-transform:translate(-100%,0);transform:translate(-100%,0)}.mui-slider-title{line-height:30px;position:absolute;bottom:0;left:0;width:100%;height:30px;margin:0;text-align:left;text-indent:12px;opacity:.8;background-color:#000}.mui-slider-indicator{position:absolute;bottom:8px;width:100%;text-align:center;background:0 0}.mui-slider-indicator.mui-segmented-control{position:relative;bottom:auto}.mui-slider-indicator .mui-indicator{display:inline-block;width:6px;height:6px;margin:1px 6px;cursor:pointer;border-radius:50%;background:#aaa;-webkit-box-shadow:0 0 1px 1px rgba(130,130,130,.7);box-shadow:0 0 1px 1px rgba(130,130,130,.7)}.mui-slider-indicator .mui-active.mui-indicator{background:#fff}.mui-slider-indicator .mui-icon{font-size:20px;line-height:30px;width:40px;height:30px;margin:3px;text-align:center;border:1px solid #ddd}.mui-slider-indicator .mui-number{line-height:32px;display:inline-block;width:58px}.mui-slider-indicator .mui-number span{color:#ff5053}.mui-slider-progress-bar{z-index:1;height:2px;-webkit-transform:translateZ(0);transform:translateZ(0)}.mui-switch{position:relative;display:block;width:74px;height:30px;-webkit-transition-timing-function:ease-in-out;transition-timing-function:ease-in-out;-webkit-transition-duration:.2s;transition-duration:.2s;-webkit-transition-property:background-color,border;transition-property:background-color,border;border:2px solid #ddd;border-radius:20px;background-color:#fff;background-clip:padding-box}.mui-switch.mui-disabled{opacity:.3}.mui-switch .mui-switch-handle{position:absolute;z-index:1;top:-1px;left:-1px;width:28px;height:28px;-webkit-transition:.2s ease-in-out;transition:.2s ease-in-out;-webkit-transition-property:-webkit-transform,width,left;transition-property:transform,width,left;border-radius:16px;background-color:#fff;background-clip:padding-box;-webkit-box-shadow:0 2px 5px rgba(0,0,0,.4);box-shadow:0 2px 5px rgba(0,0,0,.4)}.mui-switch:before{font-size:13px;position:absolute;top:3px;right:11px;content:'Off';text-transform:uppercase;color:#999}.mui-switch.mui-dragging{border-color:#f7f7f7;background-color:#f7f7f7}.mui-switch.mui-dragging .mui-switch-handle{width:38px}.mui-switch.mui-dragging.mui-active .mui-switch-handle{left:-11px;width:38px}.mui-switch.mui-active{border-color:#4cd964;background-color:#4cd964}.mui-switch.mui-active .mui-switch-handle{-webkit-transform:translate(43px,0);transform:translate(43px,0)}.mui-switch.mui-active:before{right:auto;left:15px;content:'On';color:#fff}.mui-switch input[type=checkbox]{display:none}.mui-switch-mini{width:47px}.mui-switch-mini:before{display:none}.mui-switch-mini.mui-active .mui-switch-handle{-webkit-transform:translate(16px,0);transform:translate(16px,0)}.mui-switch-blue.mui-active{border:2px solid #007aff;background-color:#007aff}.mui-content.mui-fade{left:0;opacity:0}.mui-content.mui-fade.mui-in{opacity:1}.mui-content.mui-sliding{z-index:2;-webkit-transition:-webkit-transform .4s;transition:transform .4s;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.mui-content.mui-sliding.mui-left{z-index:1;-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.mui-content.mui-sliding.mui-right{z-index:3;-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.mui-navigate-right:after,.mui-push-left:after,.mui-push-right:after{font-family:Muiicons;font-size:inherit;line-height:1;position:absolute;top:50%;display:inline-block;-webkit-transform:translateY(-50%);transform:translateY(-50%);text-decoration:none;color:#bbb;-webkit-font-smoothing:antialiased}.mui-push-left:after{left:15px;content:'\\E582'}.mui-navigate-right:after,.mui-push-right:after{right:15px;content:'\\E583'}.mui-pull-bottom-pocket,.mui-pull-top-pocket{position:absolute;left:0;display:block;visibility:hidden;overflow:hidden;width:100%;height:50px}.mui-plus-pullrefresh .mui-pull-bottom-pocket,.mui-plus-pullrefresh .mui-pull-top-pocket{display:none;visibility:visible}.mui-pull-top-pocket{top:0}.mui-bar-nav~.mui-content .mui-pull-top-pocket{top:44px}.mui-bar-nav~.mui-bar-header-secondary~.mui-content .mui-pull-top-pocket{top:88px}.mui-pull-bottom-pocket{position:relative;bottom:0;height:40px}.mui-pull-bottom-pocket .mui-pull-loading{visibility:hidden}.mui-pull-bottom-pocket .mui-pull-loading.mui-in{display:inline-block}.mui-pull{font-weight:700;position:absolute;right:0;bottom:10px;left:0;text-align:center;color:#777}.mui-pull-loading{margin-right:10px;-webkit-transition:-webkit-transform .4s;transition:transform .4s;-webkit-transition-duration:400ms;transition-duration:400ms;vertical-align:middle}.mui-pull-loading.mui-reverse{-webkit-transform:rotate(180deg) translateZ(0);transform:rotate(180deg) translateZ(0)}.mui-pull-caption{font-size:15px;line-height:24px;position:relative;display:inline-block;overflow:visible;margin-top:0;vertical-align:middle}.mui-pull-caption span{display:none}.mui-pull-caption span.mui-in{display:inline}.mui-toast-container{line-height:17px;position:fixed;z-index:9999;bottom:50px;left:50%;-webkit-transition:opacity .3s;transition:opacity .3s;-webkit-transform:translate(-50%,0);transform:translate(-50%,0);opacity:0}.mui-toast-container.mui-active{opacity:.9}.mui-toast-message{font-size:14px;padding:10px 25px;text-align:center;color:#fff;border-radius:6px;background-color:#323232}.mui-numbox{position:relative;display:inline-block;overflow:hidden;width:120px;height:35px;padding:0 40px;vertical-align:top;vertical-align:middle;border:solid 1px #bbb;border-radius:3px;background-color:#efeff4}.mui-numbox [class*=btn-numbox],.mui-numbox [class*=numbox-btn]{font-size:18px;font-weight:400;line-height:100%;position:absolute;top:0;overflow:hidden;width:40px;height:100%;padding:0;color:#555;border:none;border-radius:0;background-color:#f9f9f9}.mui-numbox [class*=btn-numbox]:active,.mui-numbox [class*=numbox-btn]:active{background-color:#ccc}.mui-numbox [class*=btn-numbox][disabled],.mui-numbox [class*=numbox-btn][disabled]{color:silver}.mui-numbox .mui-btn-numbox-plus,.mui-numbox .mui-numbox-btn-plus{right:0;border-top-right-radius:3px;border-bottom-right-radius:3px}.mui-numbox .mui-btn-numbox-minus,.mui-numbox .mui-numbox-btn-minus{left:0;border-top-left-radius:3px;border-bottom-left-radius:3px}.mui-numbox .mui-input-numbox,.mui-numbox .mui-numbox-input{display:inline-block;overflow:hidden;width:100%!important;height:100%;margin:0;padding:0 3px!important;text-align:center;text-overflow:ellipsis;word-break:normal;border:none!important;border-right:solid 1px #ccc!important;border-left:solid 1px #ccc!important;border-radius:0!important}.mui-input-row .mui-numbox{float:right;margin:2px 8px}@font-face{font-family:Muiicons;font-weight:400;font-style:normal;src:url(" + escape(__webpack_require__(72)) + ") format('truetype')}.mui-icon{font-family:Muiicons;font-size:24px;font-weight:400;font-style:normal;line-height:1;display:inline-block;text-decoration:none;-webkit-font-smoothing:antialiased}.mui-icon.mui-active{color:#007aff}.mui-icon.mui-right:before{float:right;padding-left:.2em}.mui-icon-contact:before{content:'\\E100'}.mui-icon-person:before{content:'\\E101'}.mui-icon-personadd:before{content:'\\E102'}.mui-icon-contact-filled:before{content:'\\E130'}.mui-icon-person-filled:before{content:'\\E131'}.mui-icon-personadd-filled:before{content:'\\E132'}.mui-icon-phone:before{content:'\\E200'}.mui-icon-email:before{content:'\\E201'}.mui-icon-chatbubble:before{content:'\\E202'}.mui-icon-chatboxes:before{content:'\\E203'}.mui-icon-phone-filled:before{content:'\\E230'}.mui-icon-email-filled:before{content:'\\E231'}.mui-icon-chatbubble-filled:before{content:'\\E232'}.mui-icon-chatboxes-filled:before{content:'\\E233'}.mui-icon-weibo:before{content:'\\E260'}.mui-icon-weixin:before{content:'\\E261'}.mui-icon-pengyouquan:before{content:'\\E262'}.mui-icon-chat:before{content:'\\E263'}.mui-icon-qq:before{content:'\\E264'}.mui-icon-videocam:before{content:'\\E300'}.mui-icon-camera:before{content:'\\E301'}.mui-icon-mic:before{content:'\\E302'}.mui-icon-location:before{content:'\\E303'}.mui-icon-mic-filled:before,.mui-icon-speech:before{content:'\\E332'}.mui-icon-location-filled:before{content:'\\E333'}.mui-icon-micoff:before{content:'\\E360'}.mui-icon-image:before{content:'\\E363'}.mui-icon-map:before{content:'\\E364'}.mui-icon-compose:before{content:'\\E400'}.mui-icon-trash:before{content:'\\E401'}.mui-icon-upload:before{content:'\\E402'}.mui-icon-download:before{content:'\\E403'}.mui-icon-close:before{content:'\\E404'}.mui-icon-redo:before{content:'\\E405'}.mui-icon-undo:before{content:'\\E406'}.mui-icon-refresh:before{content:'\\E407'}.mui-icon-star:before{content:'\\E408'}.mui-icon-plus:before{content:'\\E409'}.mui-icon-minus:before{content:'\\E410'}.mui-icon-checkbox:before,.mui-icon-circle:before{content:'\\E411'}.mui-icon-clear:before,.mui-icon-close-filled:before{content:'\\E434'}.mui-icon-refresh-filled:before{content:'\\E437'}.mui-icon-star-filled:before{content:'\\E438'}.mui-icon-plus-filled:before{content:'\\E439'}.mui-icon-minus-filled:before{content:'\\E440'}.mui-icon-circle-filled:before{content:'\\E441'}.mui-icon-checkbox-filled:before{content:'\\E442'}.mui-icon-closeempty:before{content:'\\E460'}.mui-icon-refreshempty:before{content:'\\E461'}.mui-icon-reload:before{content:'\\E462'}.mui-icon-starhalf:before{content:'\\E463'}.mui-icon-spinner:before{content:'\\E464'}.mui-icon-spinner-cycle:before{content:'\\E465'}.mui-icon-search:before{content:'\\E466'}.mui-icon-plusempty:before{content:'\\E468'}.mui-icon-forward:before{content:'\\E470'}.mui-icon-back:before,.mui-icon-left-nav:before{content:'\\E471'}.mui-icon-checkmarkempty:before{content:'\\E472'}.mui-icon-home:before{content:'\\E500'}.mui-icon-navigate:before{content:'\\E501'}.mui-icon-gear:before{content:'\\E502'}.mui-icon-paperplane:before{content:'\\E503'}.mui-icon-info:before{content:'\\E504'}.mui-icon-help:before{content:'\\E505'}.mui-icon-locked:before{content:'\\E506'}.mui-icon-more:before{content:'\\E507'}.mui-icon-flag:before{content:'\\E508'}.mui-icon-home-filled:before{content:'\\E530'}.mui-icon-gear-filled:before{content:'\\E532'}.mui-icon-info-filled:before{content:'\\E534'}.mui-icon-help-filled:before{content:'\\E535'}.mui-icon-more-filled:before{content:'\\E537'}.mui-icon-settings:before{content:'\\E560'}.mui-icon-list:before{content:'\\E562'}.mui-icon-bars:before{content:'\\E563'}.mui-icon-loop:before{content:'\\E565'}.mui-icon-paperclip:before{content:'\\E567'}.mui-icon-eye:before{content:'\\E568'}.mui-icon-arrowup:before{content:'\\E580'}.mui-icon-arrowdown:before{content:'\\E581'}.mui-icon-arrowleft:before{content:'\\E582'}.mui-icon-arrowright:before{content:'\\E583'}.mui-icon-arrowthinup:before{content:'\\E584'}.mui-icon-arrowthindown:before{content:'\\E585'}.mui-icon-arrowthinleft:before{content:'\\E586'}.mui-icon-arrowthinright:before{content:'\\E587'}.mui-icon-pulldown:before{content:'\\E588'}.mui-fullscreen{position:absolute;top:0;right:0;bottom:0;left:0}.mui-fullscreen.mui-slider .mui-slider-group{height:100%}.mui-fullscreen .mui-segmented-control~.mui-slider-group{position:absolute;top:40px;bottom:0;width:100%;height:auto}.mui-fullscreen.mui-slider .mui-slider-item>a{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.mui-fullscreen .mui-off-canvas-wrap .mui-slider-item>a{top:auto;-webkit-transform:none;transform:none}.mui-bar-nav~.mui-content .mui-slider.mui-fullscreen{top:44px}.mui-bar-tab~.mui-content .mui-slider.mui-fullscreen .mui-segmented-control~.mui-slider-group{bottom:50px}.mui-android.mui-android-4-0 input:focus,.mui-android.mui-android-4-0 textarea:focus{-webkit-user-modify:inherit}.mui-android.mui-android-4-2 input,.mui-android.mui-android-4-2 textarea,.mui-android.mui-android-4-3 input,.mui-android.mui-android-4-3 textarea{-webkit-user-select:text}.mui-ios .mui-table-view-cell{-webkit-transform-style:preserve-3d;transform-style:preserve-3d}.mui-plus-visible,.mui-wechat-visible{display:none!important}.mui-plus-hidden,.mui-wechat-hidden{display:block!important}.mui-tab-item.mui-plus-hidden,.mui-tab-item.mui-wechat-hidden{display:table-cell!important}.mui-plus .mui-plus-visible,.mui-wechat .mui-wechat-visible{display:block!important}.mui-plus .mui-tab-item.mui-plus-visible,.mui-wechat .mui-tab-item.mui-wechat-visible{display:table-cell!important}.mui-plus .mui-plus-hidden,.mui-wechat .mui-wechat-hidden{display:none!important}.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav{height:64px;padding-top:20px}.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav~.mui-content{padding-top:64px}.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-header-secondary,.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-nav~.mui-content .mui-pull-top-pocket{top:64px}.mui-plus.mui-statusbar.mui-statusbar-offset .mui-bar-header-secondary~.mui-content{padding-top:94px}.mui-iframe-wrapper{position:absolute;right:0;left:0;-webkit-overflow-scrolling:touch}.mui-iframe-wrapper iframe{width:100%;height:100%;border:0}", ""]);

// exports


/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    if (typeof url !== 'string') {
        return url
    }
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = "data:font/ttf;base64,AAEAAAAPAIAAAwBwRkZUTXEUPgIAAAD8AAAAHE9TLzJXe1t/AAABGAAAAGBjbWFwekmFWgAAAXgAAAIiY3Z0IAyl/jQAAGpoAAAAJGZwZ20w956VAABqjAAACZZnYXNwAAAAEAAAamAAAAAIZ2x5ZmcDEe0AAAOcAABe8GhlYWQH9d5vAABijAAAADZoaGVhB34DJgAAYsQAAAAkaG10eCP3G2AAAGLoAAAAxGxvY2HcKPcoAABjrAAAALxtYXhwAiALZgAAZGgAAAAgbmFtZegpHpkAAGSIAAACMXBvc3TbB4OPAABmvAAAA6RwcmVwpbm+ZgAAdCQAAACVAAAAAQAAAADMPaLPAAAAANJrTZkAAAAA0mtNmQAEA/8B9AAFAAACmQLMAAAAjwKZAswAAAHrADMBCQAAAgAGAwAAAAAAAAAAAAEQAAAAAAAAAAAAAABQZkVkAMAAeOWIAyz/LABcAyAA4AAAAAEAAAAAAxgAAAAAACAAAQAAAAMAAAADAAAAHAABAAAAAAEcAAMAAQAAABwABAEAAAAAPAAgAAQAHAB44QLhMuID4jPiZOMD4zPjYONk5AnkEeQT5DTkOeRD5GbkaORy5QjlMOUy5TXlN+Vg5WPlZeVo5Yj//wAAAHjhAOEw4gDiMOJg4wDjMuNg42PkAOQQ5BPkNOQ35EDkYORo5HDlAOUw5TLlNOU35WDlYuVl5WflgP///4sfBB7XHgod3h2yHRcc6Ry9HLscIBwaHBkb+Rv3G/Eb1RvUG80bQBsZGxgbFxsWGu4a7RrsGusa1AABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABBgAAAQAAAAAAAAABAgAAAAIAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAIgAAATICqgADAAcAKUAmAAAAAwIAA1cAAgEBAksAAgIBTwQBAQIBQwAABwYFBAADAAMRBQ8rMxEhESczESMiARDuzMwCqv1WIgJmAAAABQAs/+EDvAMYABYAMAA6AFIAXgF3S7ATUFhASgIBAA0ODQAOZgADDgEOA14AAQgIAVwQAQkICgYJXhEBDAYEBgxeAAsEC2kPAQgABgwIBlgACgcFAgQLCgRZEgEODg1RAA0NCg5CG0uwF1BYQEsCAQANDg0ADmYAAw4BDgNeAAEICAFcEAEJCAoICQpmEQEMBgQGDF4ACwQLaQ8BCAAGDAgGWAAKBwUCBAsKBFkSAQ4ODVEADQ0KDkIbS7AYUFhATAIBAA0ODQAOZgADDgEOA14AAQgIAVwQAQkICggJCmYRAQwGBAYMBGYACwQLaQ8BCAAGDAgGWAAKBwUCBAsKBFkSAQ4ODVEADQ0KDkIbQE4CAQANDg0ADmYAAw4BDgMBZgABCA4BCGQQAQkICggJCmYRAQwGBAYMBGYACwQLaQ8BCAAGDAgGWAAKBwUCBAsKBFkSAQ4ODVEADQ0KDkJZWVlAKFNTOzsyMRcXU15TXltYO1I7UktDNzUxOjI6FzAXMFERMRgRKBVAExYrAQYrASIOAh0BITU0JjU0LgIrARUhBRUUFhQOAiMGJisBJyEHKwEiJyIuAj0BFyIGFBYzMjY0JhcGBw4DHgE7BjI2Jy4BJyYnATU0PgI7ATIWHQEBGRsaUxIlHBIDkAEKGCcehf5KAqIBFR8jDg4fDiAt/kksHSIUGRkgEwh3DBISDA0SEowIBgULBAIEDw4lQ1FQQCQXFgkFCQUFBv6kBQ8aFbwfKQIfAQwZJxpMKRAcBA0gGxJhiDQXOjolFwkBAYCAARMbIA6nPxEaEREaEXwaFhMkDhANCBgaDSMRExQBd+QLGBMMHSbjAAACAGD/gAOgAsAABwBXAEhARUpJQzk4NicmHBkXFgwEA08PAgEEAkAABAMBAwQBZgAABQECAwACWQADBAEDTQADAwFRAAEDAUUJCExLMC0IVwlXExAGECsAIAYQFiA2ECUyHgIVFAcmJy4BNTQ3NTY/Az4BNzY3Njc2LwE1Jjc2JicmJyMGBw4BFxYHFAcVDgEXHgEXFhcWFTAVFAYUDwEUIw4BByY1ND4EAqz+qPT0AVj0/mBNjmY8WFFpBAIBAQECAgIBAgINBRMIBwgBBAoEDhMoTSNMKBQOBAoEAQQBBAUOCAQOCAEBAgEpcBxZGzFHU2MCwPT+qPT0AVjRPGaOTYpqIR8BBg4DAwYDAwYGBgMFAx0iFiwjFAIBFTkTOhozBQUzGjoTORUBAQEKExoZIAkhHhAgCAMFAgEBAQwoDGqLNGNTRzEbAAAAAAMAwP/gA0ACYAAAAFMAwAE2S7ALUFhAHJOShQAEAQuempWEegUAAamnc0JAPxEKCAoAA0AbS7AMUFhAHJOShQAEAQuempWEegUAAamnc0JAPxEKCAcAA0AbQByTkoUABAELnpqVhHoFAAGpp3NCQD8RCggKAANAWVlLsAtQWEA1AwEBCwALAQBmBAEACgsACmQACgcLCgdkCQgCBwYLBwZkAAIACwECC1kMAQYGBVAABQULBUIbS7AMUFhALwMBAQsACwEAZgQBAAcLAAdkCgkIAwcGCwcGZAACAAsBAgtZDAEGBgVQAAUFCwVCG0A1AwEBCwALAQBmBAEACgsACmQACgcLCgdkCQgCBwYLBwZkAAIACwECC1kMAQYGBVAABQULBUJZWUAeVVSLimVkYmFfXl1cVMBVwE5NOTgvLiclHx4TEg0OKwkBLgEnJicuAT8BNjc+AzU3Mj4BNz4BNTQuAyM3PgE3NiYjIg4BFR4BHwEiBxQWFx4DFzMWFxYfAwYHDgEHDgQHBhUhNC4DByE2NzY3PgE3MjYyPgEyPgEyNzY3Nic9AjQmPQMnLgEnJi8BLgInJicmPgE3NSYnJjc2MhcWBw4CBzEGFR4BBwYHFA4BFQcOAgcOAQ8BHQEGHQEUBhUUFx4CFxYXHgEXFhceAhcBlQFCEEQDHgoDAQEBDAYCBAQDAQIFCQMBCwMDAwIBAwIGAQFQRi9GIAEGAgMLAQsBAgUEBQECBwcDBQcDAQECBRgLBhMRExIIaQKAEhchFOL+7QUMFiAJGREBBQMEAwQDBAMCKRAMAQEFAwoDBQcBAQgJAQQEAgIHAQkBAR0gciAdAQEFAwEBAQsDBAUJCQECBAUBAwoDBQEBDAccDwcIGBEZCSEVBAUFAgGN/rsGCwEGDAQpEhMTEQUQEQ8FBQEMCwcmCwUHBAIBCQYsGjZRKDwjGioJCBMLJAkGCgUCAS4RBwkPBUQLAwUKAwEDAwQEAyVDEiEVFAhEBwgQCwQFAgEBAQEBAQkUDjIICQcEBQIDAggHBRIIDioHBAUEAxMSDAgJAwwbMCkdISEdKRUmDQMFBgISDRITAwQFBAcJFhUECBAHBwgCAwQJBAwGMg4JDgUBAgQCBQQLEAMEBQMAAAQAwP/gA0ACYAALAAwAXwDMAXJLsAtQWEAcn56RDAQHBKqmoZCGBQYHtbN/TkxLHRYIEAYDQBtLsAxQWEAcn56RDAQHBKqmoZCGBQYHtbN/TkxLHRYIDQYDQBtAHJ+ekQwEBwSqpqGQhgUGB7Wzf05MSx0WCBAGA0BZWUuwC1BYQEcJAQcEBgQHBmYKAQYQBAYQZAAQDQQQDWQPDgINDAQNDGQACAARAQgRWQIBAAUBAwQAA1cAAQAEBwEEVxIBDAwLUAALCwsLQhtLsAxQWEBBCQEHBAYEBwZmCgEGDQQGDWQQDw4DDQwEDQxkAAgAEQEIEVkCAQAFAQMEAANXAAEABAcBBFcSAQwMC1AACwsLC0IbQEcJAQcEBgQHBmYKAQYQBAYQZAAQDQQQDWQPDgINDAQNDGQACAARAQgRWQIBAAUBAwQAA1cAAQAEBwEEVxIBDAwLUAALCwsLQllZQCRhYJeWcXBubWtqaWhgzGHMWllFRDs6MzErKh8eEREREREQExQrASM1IxUjFTMVMzUzBQEuAScmJy4BPwE2Nz4DNTcyPgE3PgE1NC4DIzc+ATc2JiMiDgEVHgEfASIHFBYXHgMXMxYXFh8DBgcOAQcOBAcGFSE0LgMHITY3Njc+ATcyNjI+ATI+ATI3Njc2Jz0CNCY9AycuAScmLwEuAicmJyY+ATc1JicmNzYyFxYHDgIHMQYVHgEHBgcUDgEVBw4CBw4BDwEdAQYdARQGFRQXHgIXFhceARcWFx4CFwNAMhwyMhwy/lUBQhBEAx4KAwEBAQwGAgQEAwECBQkDAQsDAwMCAQMCBgEBUEYvRiABBgIDCwELAQIFBAUBAgcHAwUHAwEBAgUYCwYTERMSCGkCgBIXIRTi/u0FDBYgCRkRAQUDBAMEAwQDAikQDAEBBQMKAwUHAQEICQEEBAICBwEJAQEdIHIgHQEBBQMBAQELAwQFCQkBAgQFAQMKAwUBAQwHHA8HCBgRGQkhFQQFBQIB7jIyHDIyRf67BgsBBgwEKRITExEFEBEPBQUBDAsHJgsFBwQCAQkGLBo2USg8IxoqCQgTCyQJBgoFAgEuEQcJDwVECwMFCgMBAwMEBAMlQxIhFRQIRAcIEAsEBQIBAQEBAQEJFA4yCAkHBAUCAwIIBwUSCA4qBwQFBAMTEgwICQMMGzApHSEhHSkVJg0DBQYCEg0SEwMEBQQHCRYVBAgQBwcIAgMECQQMBjIOCQ4FAQIEAgUECxADBAUDAAACAGD/gAOgAsAABwBEADJAL0EbGgsEAgMBQAAAAAMCAANZBAECAQECTQQBAgIBUQABAgFFCQgnJAhECUQTEAUQKwAgBhAWIDYQASImJz4BNz4BNTQnJicmJyY/ATU2JicmPgI3NjczFhceAQcGFzAXHgEHDgEHDgUVFBYXFhcOAgKs/qj09AFY9P5gVpk1HHAoBAIIDgQTCQcIAQIEBAICBg4KKEwjTSgUDgQKBAEEAQQFDwcCBgcIBQQCA2lRI1ptAsD0/qj09AFY/ddIQAwoDAEGDiAQHiEVLSMUAQIHMRYHGRofDjMFBTMaOhM5FQMKExoZIAkLGBQQDhEIDgYBHyErPSEAAAABAMD/4ANAAmAAUgA3QDRBPz4QCQUFAAFAAwEBAgACAQBmBAEABQIABWQAAgIFTwAFBQsFQk1MODcuLSYkHh0SEQYOKyUuAScmJy4BPwE2Nz4DNTcyPgE3PgE1NC4DIzc+ATc2JiMiDgEVHgEfASIHFBYXHgMXMxYXFh8DBgcOAQcOBAcGFSE0LgMC1xBEAx4KAwEBAQwGAgQEAwECBQkDAQsDAwMCAQMCBgEBUEYvRiABBgIDCwELAQIFBAUBAgcHAwUHAwEBAgUYCwYTERMSCGkCgBIXIRRIBgsBBgwEKRITExEFEBEPBQUBDAsHJgsFBwQCAQkGLBo2USg8IxoqCQgTCyQJBgoFAgEuEQcJDwVECwMFCgMBAwMEBAMlQxIhFRQIAAAAAAIAwP/gA0ACYAALAF4AwEAKTUtKHBUFCwYBQEuwC1BYQC4ACAEACFwJAQcEBgAHXgoBBgsEBgtkAgEABQEDBAADWAABAAQHAQRXAAsLCwtCG0uwDFBYQC0ACAEIaAkBBwQGAAdeCgEGCwQGC2QCAQAFAQMEAANYAAEABAcBBFcACwsLC0IbQC4ACAEIaAkBBwQGBAcGZgoBBgsEBgtkAgEABQEDBAADWAABAAQHAQRXAAsLCwtCWVlAFFlYREM6OTIwKikeHREREREREAwUKwEjNSMVIxUzFTM1MwMuAScmJy4BPwE2Nz4DNTcyPgE3PgE1NC4DIzc+ATc2JiMiDgEVHgEfASIHFBYXHgMXMxYXFh8DBgcOAQcOBAcGFSE0LgMDQDIcMjIcMmkQRAMeCgMBAQEMBgIEBAMBAgUJAwELAwMDAgEDAgYBAVBGL0YgAQYCAwsBCwECBQQFAQIHBwMFBwMBAQIFGAsGExETEghpAoASFyEUAe4yMhwyMv52BgsBBgwEKRITExEFEBEPBQUBDAsHJgsFBwQCAQkGLBo2USg8IxoqCQgTCyQJBgoFAgEuEQcJDwVECwMFCgMBAwMEBAMlQxIhFRQIAAACAKD/wANMAoAASQCMAFxAWWIBBgd5dxIQBAAGAkAAAwIHAgMHZgAGBwAHBgBmAAIABwYCB1kAAAAJAQAJWQABAAgFAQhZAAUEBAVNAAUFBFEABAUERYWDgH5lY2FgT01CQC0sKigkIgoQKyUuASMiDgEHBiMiJi8BJi8BJi8BLgMvAS4CNTQ+Ajc2JyYvASYjIgcGIwcOAgcOARQeARceARceARceATMyPgI3NicmBwYHBiMiJy4BJy4GNjc2NzA3MjU2MzIWHwEeAQcGFx4CHwEeARcWFxYfARYfARYzMjY3NjMyHgIXFgcGA0AbZyUGDAoEMAoECgsCJRYEAQIEBgYNEAwBCggIAgYJByEeEDECHSYcJAEBAQ4XDwQEBAgUECNIMyw6NjVhJBYWIyASNisGHSQmChVAaDQ5KxkoJSEjEwQDBAkhAgEdEwwVCwIuIxUgAgEKCwwBFxULAQIDAQMWJwIcEQ0fHwYKDyspIwobBgSBGzsCBAIfBwoCHxgDAgMDBgcNEw0BCwoMBAMICw4JLD8hOwMkFwEBCRYYDA0WIiQzHUBhNS4wJyYqAgoaFkE3BmkrBAFKJi8tGS8yNT8zJhgOHBUBARIMDQI5ShwsGAkTDg4BGRcLAQMCAQQXIgIYDxQEERgaChsWEQAAAwCAACADgAIgAAMABgATADxAORIRDg0MCQgECAMCAUAEAQEAAgMBAlcFAQMAAANLBQEDAwBPAAADAEMHBwAABxMHEwYFAAMAAxEGDysTESERASUhAREXBxc3FzcXNyc3EYADAP6A/roCjP1a5ogEnmBgngSI5gIg/gACAP7o+P5AAayvmwSLSUmLBJuv/lQAAgCA/+ADgAJgACcAVQBqQGc0MiEDBAAUAQECSgEIAU4YAgwJPwEHDAVAAAQAAgAEAmYFAwICAQACAWQLCgIIAQkBCAlmAAkMAQkMZAAGAAAEBgBZAAEADAcBDFkABwcLB0JRT01LSUhGRUVEPjwpKBESESEmEA0UKwAyHgEVFAcGIyInIiMnIyYnIgcjBw4BDwE+AzU0JyYnJicmNTQ2JCIOARUUFx4CFyY1MRYVFAcGFhczMj8CNj8BMyM2NzIXFTMyFRYzMj4BNCYBob6jXmNlllQ3AQIBAg8OERABBAULAk8LCwUBDQIBAwE1XgFq0LFnPQEDAgECByQCCQgGAwQDZQEKCQEBCwsLCgIBPVposGZnAkBKgEtvTE8TAQQBBgIBBAEjISQTBQIWEwMBBAFDT0t/alOOVFpMAQQEAQMBCwwCcgYMAgEBLAEDBAMBAwEBFE2Kp44AAAAAAwBg/4ADoALAAAkAEQAYAJ61FAEGBQFAS7AKUFhAOgABAAgAAQhmAAYFBQZdAAIAAAECAFcMAQgACwQIC1cABAADCQQDVwoBCQUFCUsKAQkJBU8HAQUJBUMbQDkAAQAIAAEIZgAGBQZpAAIAAAECAFcMAQgACwQIC1cABAADCQQDVwoBCQUFCUsKAQkJBU8HAQUJBUNZQBYKChgXFhUTEgoRChERERIREREREA0WKxMhFTM1IREzNSM3ESEXMzUzEQMjFSchESGAAgAg/cDgwOABRYAbYCBgbv7OAgACoMDg/kAgoP5AgIABwP5gbW0BgAAAAAEAoP/AA0wCgABJADZAMxIQAgADAUAAAgMCaAADAANoAAEABAABBGYAAAEEAE0AAAAEUQAEAARFQkAtLCooJCIFECslLgEjIg4BBwYjIiYvASYvASYvAS4DLwEuAjU0PgI3NicmLwEmIyIHBiMHDgIHDgEUHgEXHgEXHgEXHgEzMj4CNzYnJgNAG2clBgwKBDAKBAoLAiUWBAECBAYGDRAMAQoICAIGCQchHhAxAh0mHCQBAQEOFw8EBAQIFBAjSDMsOjY1YSQWFiMgEjYrBoEbOwIEAh8HCgIfGAMCAwMGBw0TDQELCgwEAwgLDgksPyE7AyQXAQEJFhgMDRYiJDMdQGE1LjAnJioCChoWQTcGAAAAAAIAgAAgA4ACIAAMAA8AK0AoDwsKBwYFAgEIAAEBQAABAAABSwABAQBPAgEAAQBDAAAODQAMAAwDDislEQUXBycHJwcnNyURASEBA4D++ogEnmBgngSI/voC7/0hAXAgAeTHmwSLSUmLBJvH/hwCAP7oAAAAAQCA/+ADgAJgAC0AQUA+IgwKAwIAJgEGAxcBAQYDQAUEAgIAAwACA2YAAwYAAwZkAAAABgEABlkAAQELAUIpJyUjISAeHR0cFhQQBw8rACIOARUUFx4CFyY1MRYVFAcGFhczMj8CNj8BMyM2NzIXFTMyFRYzMj4BNCYCaNCxZz0BAwIBAgckAgkIBgMEA2UBCgkBAQsLCwoCAT1aaLBmZwJgU45UWkwBBAQBAwELDAJyBgwCAQEsAQMEAwEDAQEUTYqnjgAAAAACAGD/gAOgAsAABQANAG1LsApQWEApAAEGAwYBA2YABAMDBF0AAAACBgACVwcBBgEDBksHAQYGA08FAQMGA0MbQCgAAQYDBgEDZgAEAwRpAAAAAgYAAlcHAQYBAwZLBwEGBgNPBQEDBgNDWUAOBgYGDQYNERESEREQCBQrASERMzUhBREhFzM1MxECoP3A4AFg/sABRYAbYALA/kDgIP5AgIABwAAAAAAHALP/5QMoAmcANwBGAFgAZgBxAI8AuwEAQCGZAQsJGRQTAwAHdgEEAAUBDANMKQICDAVAfgEFJQENAj9LsAtQWEBUAAkICwgJC2YACgsBCwoBZgAABwQBAF4PAQQNBwQNZAANAwcNA2QADAMCAwwCZg4BAgJnAAgACwoIC1kAAQUDAU0GAQUABwAFB1kAAQEDUQADAQNFG0BVAAkICwgJC2YACgsBCwoBZgAABwQHAARmDwEEDQcEDWQADQMHDQNkAAwDAgMMAmYOAQICZwAIAAsKCAtZAAEFAwFNBgEFAAcABQdZAAEBA1EAAwEDRVlAJnNyOTi1tLKxpKOgn5iXlJKEg4B/fXxyj3OPQT84RjlGHh0REBAOKwEuAjY/ATYnLgEOAQ8BDgEiJic1Jj4CNzQuAgYHDgQVDgEdAR4EFxY+Ajc2JyYDBi4CNTQ2NzYWFRQHBicOAxcVFB4BFxY2Nz4BLgEHBiY1NDY3Nh4CFRQGNwYmJyY2NzYWFxY3Mj4BNzU2LgQPASIGFRQzNh4DDgEVFBcWJy4BBiIOAQcjDwEGFRQeATM2NzYyHgMXFgcOAhUUFjI2NzM+AS4DAoUHCAEBAQEYHQogIB0JCgUIBgMBAQEBAgEDDBUlGRkzJyAQFxcEIi8/OiEnV09CDyRAEOslRTIebU1PbEI1WB0oEAgBAQ4NL1IaDAISMz4PFBMOCA4JBhUvBQsCAwIFBgsCBvQEBwUBAgcQFRYSBQYHChEQFg4GAwEBDgILCRMRDg8GBQEBARIHCwcBFQMOFRkZGQkTCwEBAw4VDAEBCQEQGSEiAS4BBgYGAgIyJQwJBwoFBQICAQMEAwgHDAQOFxoOAQsLKy8sGwEoTxQULEUrHw4DBBInQipjNA3+5gIVJzkhQV8FBExBSjcr+wUgJyYNDQUOIAgeGCkUPDcitAITDxAbAgEFCQ0IEBlBBQEGBRAEBQEGDbQFCAYCHi0ZEQQBAQEMCRYGBwkWDxQHAhMCAf4DAwEDAgEBAQYYCQ4JAQYBAgsQHhM3MgIGEAcNDwoQKko3Lh8UAAAGAED/pAPAApsADgAZADwARwBPAHMAiUCGUgEEC2ZeAg0AXzoxAwYNA0A5NAIGPQoBBwgLCAcLZhEBCwQICwRkEAIPAwABDQEADWYOAQ0GAQ0GZAAGBmcADAkBCAcMCFkFAQQBAQRNBQEEBAFRAwEBBAFFUVAQDwEAbWppaFZUUHNRc01MSUhDQT49MC4iHx4dFhUPGRAZBgQADgEOEg4rJSImNDYzMh4DFRQOASMiLgE1NDYyFhQGBTQuAScmKwEiDgYVFBceATMyNxcwFx4BPgE1Jz4BACImNDYzMh4BFRQ2MhYUBiImNBcyFy4BIyIOAxUUFhcHFAYUHgE/AR4BMzA7Ai4BNTQ+AQMOEBcXEAYMCgcECxHTChILFyAXFwFqRHVHBgUJHTYyLCYeFQsIF5VhQTo+AQIFBAMSLDL9VCAXFxALEgq9IRYWIRbaBgsRtHc1YU87IT02GAEFCQpYHDsgAwQDBARQiOEXIRcECAkMBwoSCwsSChEXFyEXOD9rQgQBChIaIScqMBkdHU9oGSoBAQEBBwZCIl4BRBcgFwoSCxA3FyAXFyBBAWaIHDNFVS1AbydZAQQKAwMEPQoKDx0PR3hGAAAIAED/YQPBAuIABwAQABQAGAAdACYALwA3AGZAYzAgEwMCBDYhAgECNx0MAQQAAS0cAgMALCcaFwQFAwVAAAECAAIBAGYAAAMCAANkCAEEBgECAQQCVwcBAwUFA0sHAQMDBVEABQMFRR8eFRURESooHiYfJhUYFRgRFBEUEhUJECslAQYVFBchJgEhFhcBPgE1NCcmJwcBFhc/ARE2NycDIgcRAS4DAxYzMjY3EQYHAQ4EBxcBXf73FBgBDwYCSP7xBQUBCQoKNUSCv/5uRIC/239Av9NKRgETEB8hIpRAQyZIIgUF/qcYLikkHwy+nAEJQERKRgYBGwUG/vcfQiJLiIBAwP5afz++xP6DRIG/AckY/vEBEwUHBQP8kxQMDAEOBQQCLw0gJiovGb4AAAAABQAF/0ID+wMAACEANABAAFAAYADBQA4IAQIFFgEBAgJAEAEBPUuwC1BYQCkKAQAAAwQAA1kNCAwGBAQJBwIFAgQFWQsBAgEBAk0LAQICAVEAAQIBRRtLsBZQWEAiDQgMBgQECQcCBQIEBVkLAQIAAQIBVQADAwBRCgEAAAoDQhtAKQoBAAADBAADWQ0IDAYEBAkHAgUCBAVZCwECAQECTQsBAgIBUQABAgFFWVlAJlJRQkEjIgEAW1lRYFJgSkhBUEJQPDs2NS0rIjQjNBoYACEBIQ4OKwEiDgIVFBYXFg4EDwE+BDceATMyPgI1NC4BAyIuATU0PgMzMh4CFRQOAQIiBhUUHgEyPgE1NCUiDgIVFBYzMj4CNTQmISIGFRQeAzMyPgE0LgECBWe9ilJpWwEIDhMSEAUFCB1QRlAYGjccZ7qGT4bninTBdCtQaIJEVZtvQnC+Tz0qFCEnIhT+zg8aEwwqHg8bFAwrAbEfKQcNEhYMFCEUFCEDAER0oFhlsjwXLSQhGBEFBAEGExYkFAUFRHSgWHXIc/z0U5thOm5ZQyU6YYVJYZpUAacnHxUjFRUjFR8nChIbDyAtDBUcEB8nJx8NFxMOCBUjKiARAAABAFf/bgOpAtEBeQGiQY0BYgCGAHQAcgBxAG4AbQBsAGsAagBpAGAAIQAUABMAEgARABAADAALAAoABQAEAAMAAgABAAAAGwALAAABRwFGAUUAAwACAAsBYAFdAVwBWwFaAVkBWAFKAKgApwCdAJAAjwCOAI0AjAAQAA0AAgCbAJoAmQCUAJMAkgAGAAEADQEuAS0BKgC1ALQAswAGAAkAAQEnASYBJQEkASMBIgEhASABHwEeAR0BHAEbARoBGQEYARYBFQEUARMBEgERARABDwEOAQ0BDADtAMwAywDJAMgAxwDGAMQAwwDCAMEAwAC/AL4AvQC8ACsABQAJAQoA6ADnANMABAADAAUABwBAAUQAhwACAAsAnACRAAIADQELAAEABQADAD9ARQwBCwACAAsCZgACDQACDWQADQEADQFkAAEJAAEJZAoBCQUACQVkBAEDBQcFAwdmCAEHB2cAAAsFAEsAAAAFTwYBBQAFQ0EeAVcBVAFDAUIBQQE/ASwBKwEpASgA/QD6APgA9wDsAOsA6gDpANsA2gDZANgApgClAJgAlQA5ADcADgAOKxMvAjU/BTU/BzU/IjsBHzEVBxUPAx0BHxEVDw0rAi8MIw8MHw0VFwcdAQcVDw8jByMvDSMnIycPCSMPASsCLxQ1NzU3PQE/DzM/ATM1LxErATUjDwEVDw0rAi8INT8X0QIBAQIBAwIEBQEBAgICAgIDAQIDBAIDAwQEBAUGAwMHBwcJCQkLCAgJCgkLCwsLDAsNDRkNJw0NDgwNDQ0NDAwMCwsJBQQJCAcHBgcFBQYEBwQDAwICAgQDAgECAQIFAwIEAwICAgEBAQEDAgIDDAkEBgUGBgcEAwMDAgMCAwEBAQIEAQICAgMCAwIEAwIDAwQCAgMCBAQEAwQFBQEBAgICBAUHBgYHBwMFCgEBBRYJCQkIBAIDAwECAQECAgQDAwMGBgcICQQECgoLCwwLJQ4MDQ0ODg0NDg0HBgQECwwHCAUHCgsHBhAICAwICAgKJxYWCwsKCgoJCQgIBgcCAwICAgECAQEBAQIBAwIBBAMEAgUDBQUFBgYHBwIBAQQKBggHCAkEBAQDBQMEAwMCAQEBAwEBAQUCBAMFBAUFBgYFBwcBAgECAgICAQECAQEBAgEDAwMDBAUFBQcHBwYHCAQFBgcLCAFLBQcEDgYGBwcIBwUFBwcJAwQEAhMKCw0OBwkHCAoICQkFBAoKCQoJCgoHBgcFBQUFBAMEAwICBAECAQMDAwQEBQYFBwcGBAMHCAcICAgJCAkIEQkICQgHCQ8NDAoQAgMIBQYGBwgICAQGBAQGBQoFBgIBBRENCAoKCwwOCQgJCAkIDxAOEwcMCwoEBAQEAgQDAgECAwEBAwIEBgYFBgoLAQIDAwsPEQkKCgoFBQoBAQMLBQUHBgMEBAQEBAQEAwMDAwIDBQUDAgUDBAMEAQEDAgICAgEBAgECBAIEBQQCAgIBAQEFBAUGAwMGAgIDAQECAgIBAgMCBAMEBAUCAwIDAwMGAwMDBAQDBwQFBAUCAwUCAgMBAgICAgEBAQEBAgIIBQcHCgoGBgcHBwgJCQgLAQECAgIDCAUEBQYEBQUDBAICAwEGBAQFBQsHFhAICQkICgoJCgkLCQsJCggICAQFBgUKBgAAAAQAXgAgA6ICIAATACgALAAxADdANDEwLy4sKyopCAIDAUAEAQAAAwIAA1kAAgEBAk0AAgIBUQABAgFFAgAmIxkWCwgAEwITBQ4rASEiDgEVERQWMyEyNjURNC4DExQGIyEiLgU1ETQ2MwUyFhUXFRcRBxEnNTcCX/5GEiEUKxwBuhwnBwwQFBUTDv5GBAgHBwUEAhYPAboOE17EIoCAAiARHhL+iBwrKh0BeAsUEAwG/kcPFgIEBQcHCAQBeA0SARENaatrAYA8/vdDhEMAAAAGAIAAAAOAAkAAHwBJAFEAWQBdAGUA30uwKFBYQFIADwsOBw9eABAOEg4QEmYAAQkBCAMBCFkAAwAHA0sEAhMDAAoBBwsAB1kACwAOEAsOWQASABENEhFZAA0ADAYNDFkABgUFBk0ABgYFUgAFBgVGG0BTAA8LDgsPDmYAEA4SDhASZgABCQEIAwEIWQADAAcDSwQCEwMACgEHCwAHWQALAA4QCw5ZABIAEQ0SEVkADQAMBg0MWQAGBQUGTQAGBgVSAAUGBUZZQCwBAGVkYWBdXFtaV1ZTUk9OS0pGRDo4NzYvLSYjGhcSEA8ODQwIBQAfAR8UDisBIyYnLgErASIGBwYHIzUjFSMiBhURFBYzITI2NRE0JhMUDgEjISImNRE0PgI7ATc+ATc2PwEzMDsBHgIXHgMfATMyHgEVJCIGFBYyNjQGIiY0NjIWFDczFSMEFBYyNjQmIgNDewMGMCQQsRAjLggEG0QbGygpGgKAGiMjAwcOCP2ADRYGCQ0HiAkEDwMmDQyxAQEBAwUDBQ8YEgoJigkNB/7njmRkjmRxdFFRdFE1IiL/ACU2JSU2AeADBzUhHzQIBSAgJBn+oBsoKBsBYBoj/mMKDwoWDQFgBgsHBQYFEwQqDAgBAgMDBREcFAsGBw4IAmSOZGSO0lF0UVF04CJpNiUlNiUAAwEA/2ADAALgAAsAFwAxAE1ASgwLAgUDAgMFAmYAAAADBQADWQACAAEEAgFZAAQKAQYHBAZZCQEHCAgHSwkBBwcITwAIBwhDGBgYMRgxLi0sKxERExMnFRcVEA0XKwAiBhURFBYyNjURNAMUBiImNRE0NjIWFRcVFA4BIyImPQEjFRQWFxUjFSE1IzU+AT0BAkGCXV2CXSBKaEpKaEpgO2Y7WoImi2WSAUKKY4cC4GJF/stFYmJFATVF/oY4T084ATU4T084mZ88ZDuAW5+fZZMHfiQkfgeTZZ8AAAQA9P9gAwwC4AASACQALAA5AEZAQxYUEwwKBgYDBAFAGAgCAz0AAAABAgABWQACAAUEAgVZBgEEAwMETQYBBAQDUQADBANFLi00My05LjkqKSYlISAQBw8rACIGFRQfAhsBNzY/AT4CNTQHFQYPAQsBJicuATU0NjIWFRQmIgYUFjI2NAciJjU0PgEyHgEUDgECb96dEwED9fUBAQEBBgkEMgEBAtbYAQEICorEirdqS0tqS4AnNxksMiwZGSwC4JtuMzIDBv33AgkCAwEDECEiEW/IAQEDBP45AcsDARYuF2GIiGEut0tqS0tqkzcnGSwZGSwyLBkAAgEA/2ADAALgAAsAJQBBQD4KCQIDAQABAwBmAAEAAAIBAFkAAggBBAUCBFkHAQUGBgVLBwEFBQZPAAYFBkMMDAwlDCURERERExMpFRALFyskMjY1ETQmIgYVERQlFRQOASMiJj0BIxUUFhcVIxUhNSM1PgE9AQG/gl1dgl0BfDtmO1qCJotlkgFCimOHXWJFATVFYmJF/stF4Z88ZDuAW5+fZZMHfiQkfgeTZZ8AAAACAPT/YAMMAuAAEgAfACtAKAwKCAYEAT0DAQECAWkAAAICAE0AAAACUQACAAJFFBMaGRMfFB8QBA8rACIGFRQfAhsBNzY/AT4CNTQFIiY1ND4BMh4BFA4BAm/enRMBA/X1AQEBAQYJBP70JzcZLDIsGRksAuCbbjMyAwb99wIJAgMBAxAhIhFvwzcnGSwZGSwyLBkABQEA/2ADMALgAAMACgAVAB0ANQBfQFwHAQIBHBsUBgQAAiEBBAAgAQMEBEAFAQIBAAECAGYAAQoBAAQBAFkABAYBAwcEA1kJAQcICAdLCQEHBwhPAAgHCEMFBDU0MzIxMC8uKyokIh8eGBcQDgQKBQoLDisBNwEHJTI3AxUUFjcRNCYjIg4BBwE2NzUjFRQHFzYHNjcnBiMiLgM9ASMVFBYXFSMVITUjAREcAgMc/uwlIONd31xCGS8mDwESCWIiIhQw6jItEy0zI0M2KRcmi2WSAUKKAtAQ/JAQ/REBgetFYqcBNUViEB0T/i0aGp+fQDUiQ6sDFyAWFik1QyOgn2WTB34kJAAAAwBA/6ADwAKgAAcAFwA6AJBACzEBAQc6MAIDBQJAS7AYUFhAMAAGAQABBgBmAAQABQUEXggBAgAHAQIHWQABAAAEAQBZAAUDAwVNAAUFA1IAAwUDRhtAMQAGAQABBgBmAAQABQAEBWYIAQIABwECB1kAAQAABAEAWQAFAwMFTQAFBQNSAAMFA0ZZQBQKCDYzLiwlIxsZEg8IFwoXExAJECsAMjY0JiIGFAEhIgYVERQWMyEyNjURNCYDJiMiBg8BDgQjIicuAi8BJiMiBwMRPgEzITIeARUTArhQODhQOAEI/PAXISEXAxAXISHlCw8HCwcmAgQFBAUDDQkBAwMBbA0UFA79Ag4KAswGDAcBAWA4UDg4UAEIIRj9chghIRgCjhgh/nUMBgUgAgIDAQEIAQIEAXQPD/7PAgkKDQYLB/33AAAACABW/z0DtwLJACkANgBVAGMAcQCAAJEAnQCyQK9yAQcMTQEGB3ABCwk4NyATBAIFTEVEGQQAAioBAQAGQFVUTgMEDD4ABgcJBwYJZgAFDgIOBQJmAAIADgIAZAAAAQ4AAWQAAQFnAAwACwQMC1kACQAKAwkKWQAEAAMNBANZEgENABAIDRBZEQEHAAgPBwhZAA8ODg9NAA8PDlEADg8ORYKBV1aYlpOSioiBkYKRf353dm1sZWRdXFZjV2NRUElIQD4yMCMiHRwXFRMOKwEnDwEnJg8BDgEVERQeAzY/ARcWMzI/ARYXFjI3NjcXFjI2NzY1ETQBLgE1ND4BMzIWFRQGNyc+ATU0LgEjIgYVFBcHJy4BIwYPARE3FxYyNj8BFwUiBhURFBYyNjURNC4BFyIOAh0BFBYyNj0BJjcVFB4BMj4BPQE0LgEjBgMiDgIVFBYzMj4CNTQuAQYiJjQ2MzIeAhUUA6m3C9vJBwfTBgYCBAQGBgPNygMEBAMeL0MFFAVkLE4DBgUCB/78NlwnQyg9Vl2pMwYFMVQyTGsmFskCAwIEA7rBygIFBQLcov2qCAsLDwsFCMwEBwUDCw8LA8QFCAoJBQUJBQ8wDhkSCygcDhkTCxMfBhoTEw0HCwkFAp8qAWRUAwNSAgkG/bwDBgUDAgEBUFUBAg1eZggIl24SAQICBggCRQ781VW1KidEJ1Y8KrWaDBEcDDFVMWxLKVIKVAEBAQFIAhxMVQEBAWQlNQsH/pAICwsIAXAFCAVHAwUHA40HCwsHjQ9SugUJBAQJBboFCAUD/p0LEhkOHCgKExkOEiASZBMaEwUJDAYNAAAAAAMAoP/gA4ACoAAJABIAIwBBQD4eEhENDAUCBg4JCAMEAQJAAAUGBWgABgIGaAAEAQABBABmAAIAAQQCAVcAAAADTwADAwsDQhInGBERERAHFSspAREhNyERIREHBScBJwEVMwEnNycuAiMiDwEzHwE3PgE1NALg/eABoCD+IAJgIP77EwFWFv6YQAFpF0YZAgcHBAsIGQEWKhgEBAIAIP3AAcAgmBMBVxf+mEEBaBdAGQMDAggYFyoZBAoFDAAAAAYA4P+gAyACoAAgAC8AQgBGAEoATgC4QAtAOTgwHhAGCAsBQEuwFFBYQEEACgMMAwpeDgEMDQMMDWQPAQ0LAw0LZAALCAgLXAABAAYAAQZZBwICAAkFAgMKAANXAAgEBAhNAAgIBFIABAgERhtAQwAKAwwDCgxmDgEMDQMMDWQPAQ0LAw0LZAALCAMLCGQAAQAGAAEGWQcCAgAJBQIDCgADVwAIBAQITQAICARSAAQIBEZZQBlOTUxLSklIR0ZFRENCQTQWNRozERUzEBAXKwEjNTQmKwEiDgIdASMVMxMUFjMhMj4HNRMzJTQ+AjsBMh4DHQEjARUUBiMhIiYvAS4EPQEDIQczESMTIwMzAyMTMwMgoCIZiwsWEAmgKi8jGAEaBQsJCQgGBQQCLin+fQUICwWLBQkHBgPGAQ4RDP7mAwYDBAMEAwIBMAGz6Bwcjh0WHs4dFR4CPSgZIgkQFgwoHf27GSICAwYGCAgKCgYCRUUGCwgFAwYHCQUo/Z8BDREBAgICBAUFBgMBAkRA/h4B4v4eAeL+HgAAAAACAMD/oANAAuAACwAUAD9APBQREA8ODQwHAz4ABgABAAYBZgcFAgMCAQAGAwBXAAEEBAFLAAEBBFAABAEERAAAExIACwALEREREREIEysBFTMRIREzNSERIRElJzcXBycRIxECQOD9wOD/AAKA/kIXlZUXbiACACD94AIgIP2gAmA0F5WVF23+GgHmAAIAwP+gA0ACoAALABQAPkA7FBEQDw4NDAcBAAFAAAYDBmgHBQIDAgEAAQMAVwABBAQBSwABAQRQAAQBBEQAABMSAAsACxERERERCBMrARUzESERMzUhESERBQcXNycHESMRAkDg/cDg/wACgP5CF5WVF24gAgAg/eACICD9oAJg2ReVlRdtAeb+GgAAAwBt/40DkwLAAA4AHQApACdAJCkoJyYlJCMiISAfHgwBPQAAAQEATQAAAAFRAAEAAUUZGBICDysBLgEiBgcOAR4CPgImAw4BLgI2Nz4BMhYXFhADBycHFwcXNxc3JzcDJjybnps8UDk5oNbWoDk5aEnFxZI0NEk3j5CPN2/VqKgYqKgYqKgYqakCRjw+PjxQ1tagOTmg1tb+HEk0NJLFxUk2OTk2cP7EAV6opxeoqBenqBioqAAAAAIAgAAAA4ACYAATACIAQUA+FgoCAwQbFxIQCQUAAQJAFQsCAj4AAAEAaQACBQEEAwIEWQADAQEDTQADAwFRAAEDAUUUFBQiFCIbFBYQBhIrOwE3Njc+AjcVCQEVBgcGFzAVMAE1DQE1IgYHJj4FgBUmSk4cK0AmAYD+gLdoYwIBoAEo/tiMr0UBAQwYOE+DPncjDA8MAaABAAEAoQhoZKUGAWCBwcKCXHcHGUZATjgnAAAAAAIAgAAAA4ACYAAfACoAOkA3JQwCAwQkIA0ABAIBAkAmCwIAPgACAQJpAAAABAMABFkAAwEBA00AAwMBUQABAwFFFBwWFBkFEyslMDU0LgInLgEnNQkBNR4BFx4BHwEzMD0HJy4BIxUtARUgFxYDgAMQLCM1i17+gAGAN0wqK0ojJhUgRa+M/tgBKAEEWSNABhoqUVEjNTcEof8A/wCgAhMTFE44PgcHCAcHCAYIE3dcgsLBgbRJAAADAGD/gAOgAsAAFQAdAC4AXUBaDQECCAsBBAECQAwBAQE/CQEEAQABBABmAAUACAIFCFkAAgABBAIBWQAAAAMHAANZCgEHBgYHTQoBBwcGUQAGBwZFHx4AACcmHi4fLhsaFxYAFQAVExQVIgsSKwEUBiMiLgE0PgEzFTcnFSIGFBYyNjUCIAYQFiA2EAEiLgE1ND4CMh4CFA4CAth+WjtjOjpjO8DAapaW1JZU/qj09AFY9P5gZ7BmPGaOmo5mPDxmjgEgWn46Y3ZjOm9vgFiW1JaVawGg9P6o9PQBWP3XZrBnTY5mPDxmjpqOZjwAAAACAED/gAPAAsAACQATAC5AKxACAgA+Ew0MCwoJCAcGBQoCPQEBAAICAEsBAQAAAk8DAQIAAkMSGhIQBBIrASELASEFAyUFAxcnBzcnITcXIQcDwP6paWn+qQEYbQEVARVuLtXVVdgBBlJSAQbYAYIBPv7CxP7CxcUBPuiYmPWV9/eVAAADAGD/gAOgAsAABwAaACYAR0BEAAAAAwQAA1kJAQUIAQYHBQZXAAQABwIEB1cKAQIBAQJNCgECAgFRAAECAUUJCCYlJCMiISAfHh0cGxAOCBoJGhMQCxArACAGEBYgNhABIi4BND4BMzIeBBUUDgIDIxUjFTMVMzUzNSMCrP6o9PQBWPT+YGewZmawZzRjU0cxGzxmjj0h7+8h8PACwPT+qPT0AVj912awzrBmGzFHU2M0TY5mPAJ98CHv7yEAAAADAGD/gAOgAsAABwAYABwAPEA5AAQDBQMEBWYABQIDBQJkAAAAAwQAA1kGAQIBAQJNBgECAgFSAAECAUYJCBwbGhkREAgYCRgTEAcQKwAgBhAWIDYQASIuATU0PgIyHgIUDgIBIRUhAqz+qPT0AVj0/mBnsGY8Zo6ajmY8PGaO/rMCAP4AAsD0/qj09AFY/ddmsGdNjmY8PGaOmo5mPAGNIgAAAAIAYP+AA6ACwAAHABgAKUAmAAAAAwIAA1kEAQIBAQJNBAECAgFRAAECAUUJCBEQCBgJGBMQBRArACAGEBYgNhABIi4BNTQ+AjIeAhQOAgKs/qj09AFY9P5gZ7BmPGaOmo5mPDxmjgLA9P6o9PQBWP3XZrBnTY5mPDxmjpqOZjwAAgA+/14DwgLiABEAKwAqQCcEAQAAAwIAA1kAAgEBAk0AAgIBUQABAgFFAgAmIxkWDAkAEQIRBQ4rASEiDgIVERQWMyEyNjURNCYTFA4CIyEiLgU1ETQ2MyEyHgMVA1v9ShUmHBA8KwK2Kzw8DwgOEwr9PAYLCgkHBQMeFQLECBAMCgUC4hAcJhX9Sis8PCsCtis8/NwKEw4IAwUHCQoLBgLEFR4FCgwQCAAAAAIAbf+NA5MCwAAOABoAGUAWGhkYFxYVFBMSERAPDAA9AAAAXxIBDysBLgEiBgcOAR4CPgImAwcnByc3JzcXNxcHAyY8m56bPFA5OaDW1qA5ObYYqKgYqKgYqKgYqQJGPD4+PFDW1qA5OaDW1v6CGKinF6ioF6eoGKgAAAACAGD/gAOgAsAABwAcAENAQA4BAwAQAQYEAkAPAQQBPwAGBAUEBgVmAAAAAwQAA1kABAAFAgQFWQACAQECTQACAgFRAAECAUUSFRQTExMQBxUrACAGEBYgNhAAIiY0NjM1Fwc1Ig4BFRQWMjY1MxQCrP6o9PQBWPT+ytSWlmrAwDtjOn+zfigCwPT+qPT0AVj+VJbUlliAb286YztZf35aagAAAAEAQP+AA8ACwAAJABhAFQIBAD4JCAcGBQUAPQEBAABfEhACECsBIQsBIQUDJQUDA8D+qWlp/qkBGG0BFQEVbgGCAT7+wsT+wsXFAT4AAAAAAgBg/4ADoALAAAcAEwA2QDMHAQUGAgYFAmYEAQIDBgIDZAAAAAYFAAZXAAMBAQNLAAMDAVIAAQMBRhERERERExMQCBYrACAGEBYgNhAHIxUjNSM1MzUzFTMCrP6o9PQBWPSg8CLu7iLwAsD0/qj09AFYvu7uIvDwAAAAAAIAYP+AA6ACwAAHAAsAIUAeAAAAAwIAA1cAAgEBAksAAgIBUQABAgFFERMTEAQSKwAgBhAWIDYQByE1IQKs/qj09AFY9KD+AAIAAsD0/qj09AFYviIAAAADADT/UwPNAuwABwAYACoAOUA2AAEEAAQBAGYAAAUEAAVkAAMGAQQBAwRZAAUCAgVNAAUFAlIAAgUCRhoZIyEZKhoqFxUTEgcSKwAUFjI2NCYiBRQOAiIuAjQ+AjIeAgEiDgIVFB4BMzI+AjU0LgEBLnyue3uuAiNIfKq8q3tJSXurvKp8SP40UZRrQGu4bVGUaz9ruAF3r3t7r3vTXat7SUl7q7ure0lJe6sBMkBqlFJsuGs/a5RRbbhrAAIAYP+AA6ACwAAHABIAJ0AkEhEQDw4FAgABQAAAAgBoAAIBAQJNAAICAVIAAQIBRiQTEAMRKwAgBhAWIDYQAQYjIiYvATcXNxcCrP6o9PQBWPT+IAkJBAoEcCRe+iMCwPT+qPT0AVj+wQkFBHAjXvskAAAAAgA+/14DwgLiABQAHAAqQCccGxoZGBYGAQABQAIBAAEBAE0CAQAAAVEAAQABRQIACgcAFAIUAw4rASEiBhURFBYzITI2NRE0LgUBJwcnNxcBFwNb/UorPDwrArYrPAULDhIUF/5EBQXKIK8BYyAC4jwr/UorPDwrArYMFxURDgsF/W8FBcogrwFjIAABAUAAYALAAeAACwAGswgAASYrAQcnBxcHFzcXNyc3AqioqBioqBioqBipqQHgqagXqKgXp6gXqagAAAABAQAAIAMAAngAFAA5QDYIAQQCAUAHAQIBPwYBAT4ABAIDAgQDZgABAAIEAQJZAAMAAANNAAMDAFEAAAMARRIVFBMQBRMrJCImNDYzNRcHNSIOARUUFjI2NTMUAmrUlpZqwMA7Yzp/s34oIJbUlliAb286YztZf35aagAAAQCA/6AEAAKgACYAOEA1GxoKCQgHBgUECQIBAUAEAQAAAQIAAVkAAgMDAk0AAgIDUQADAgNFAQAfHRcVEA4AJgEmBQ4rATIeARU3FwcnNxc0LgIjIg4BFB4BMzI+ATcXDgEjIi4BNTQ+AgIAaLFnbhKNhRJmOWCESWGlYGClYU2LYxgZJ8h9aLFnPWeOAqBmsWhpEoiIEmlJhGA4YKXCpWA+bkcHdJJnsWhOjmc9AAACAED/gAPAAsAACQAPACpAJwoHAgA+Dw4NBAMCAQAIAj0BAQACAgBLAQEAAAJPAAIAAkMSEhUDESslAyUFAyUhCwEhJRchBxcnAVhtARUBFW0BGP6paWn+qQHAUgEG2FXVvv7CxcUBPsQBPv7C1PaV9ZcAAAIAAP8gBAADIAAUACsAPEA5AAUBAgEFAmYAAgQBAgRkAAQHAQMEA1UAAQEAUQYBAAAKAUIWFQEAJiUhHxUrFisPDgoIABQBFAgOKwEiDgIHPgIzMhIVFBYyNjU0LgEDMj4DNw4DIyICNTQmIgYVFB4BAgBnu4lSAwNwvm+s9DhQOInsi1KbfF82AgJEb5hTrPQ4UDiJ7AMgT4a5ZnfJdP76uig4OCiL7In8ADJdeplSWaJ0RQEGuig4OCiL7IkAAAwAJf9EA9sC+gAPAB0ALgA8AE4AXwBwAIAAlQCnALQAwwBtQGqVgXADAQBOPQIGAS4eAgUGtQEJCpYBAgkFQAAKBQkFCglmAAkCBQkCZAsBAAABBgABWQgBBgcBBQoGBVkEAQIDAwJNBAECAgNRAAMCA0UBALi3mJc7ODQxKygjIB0cFxYREAoJAA8BDwwOKwEyHgMdARQGIiY9ATQ2EzIWHQEUBiImPQE0NjMBFAYrASIuATU0NjsBMh4BFSEUBisBIiY1NDY7ATIWJRYUBg8BBiYnJjY/AT4BHgEXARYGDwEOAS4BJyY2PwE2FhcBHgEPAQ4BJy4BPwE+AhYXAR4BDwEOAScuATY/AT4BFwM+AR4BHwEWBgcGJi8BLgE+AzcBNjIWHwEWBgcOAS4BLwEmNjcBPgEfAR4BDgEvAS4BAT4BMh8BHgEOAS8BLgE3AgAFCQcGAxIYEhIMDBISGBISDAHbEgx+CA4IEgx+CA4I/QQSDH4MEhIMfgwSArwECAdtChgHBgcKbQYMCgoD/WoGBgttBQwLCQMHBwtsCxgGAegLBgY/BhgKCwcHPwMJCwwF/oILBgY/BhgLBwgBAz8HGApdBgwLCQM/BgYLChgHPwICAQIDBgMBfwcPDgQ/BgYLBQwLCQM/BwcL/dQGGAptCwYMGAtsCwcCnAUODwdtCwYMGAttCgcGAvoDBQgJBX0NERENfQ0R/QQRDX4MEhIMfg0RASEMEQgNCA0RCA0JDBERDA0REeEIDw4EPwYGCwsYBj8DAQMHBf6CCxgGPwMBAwcFCxgGPwYHCgIsBhgLbQsGBgYYC20FBwMBA/1qBhgLbQsGBgQOEAdtCwYGApYDAQMHBW0LGAYGBgttAwgIBwcGAv1qBAgHbQsYBgMBAwcFbQsYBgHoCwYGPwYYFgYGPwYY/o0HCAQ/BhgWBgY/BhgLAAIAgf+gA4ECoAAPACAALUAqDgECAwIBQA8AAgE9AAAAAgMAAlkAAwEBA00AAwMBUQABAwFFKBgjJgQSKwUnNjU0LgEjIgYUFjMyNxcBLgE1NDYyFhUUDgQjIgOB40NSjFJ+srJ+a1Ti/Z4mKZ/hoBMjND1FJHEx4lRrUo1RsvyzROMBDyZkNnGgn3ElRT00IxMAAAABAQAAIAMAAiAACwAlQCIABAMBBEsFAQMCAQABAwBXAAQEAU8AAQQBQxEREREREAYUKwEjFSM1IzUzNTMVMwMA8CLu7iLwAQ7u7iLw8AAAAAEBQP/gAsACYAAFAAazAwEBJisBNwkBJwEBQEEBP/7BQQD/Ah9B/sD+wEEA/wAAAAEBQP/gAsACYAAFAAazAwEBJisBJwkBNwMCwEH+wQE/Qf8CH0H+wP7AQQD/AAAAAAEBLACEAssBvQAKABJADwoJCAcGBQA+AAAAXyEBDyslBiMiJi8BNxc3FwHACQkECgRwJF76I40JBQRwI177JAAEAID/oAOAAqAACAARABsAHwBMQEkdHBsaGBcWExEQDwgBDQQHAUAAAQcBPxkSAgY+AAYABwQGB1cABAABAwQBVwUBAwAAA0sFAQMDAE8CAQADAEMZFhEREhEREggWKwkBETMRMxEzEQMjESERIxElBQEHNSMVBxUJATUlBzUzAgD+wODA4CCg/wCgASABIP7gwIBAAYABgP2gQEACQP8A/mABAP8AAaD+gAEA/wABcebmAW+aWsAzKQEz/s0pgDOGAAAAAwBg/4ADoALAABkAIQAlAD5AOyIBBAAlAQEEAkAABAABAAQBZgACBQEABAIAWQABAwMBTQABAQNRAAMBA0UBACQjHx4bGhAOABkBGQYOKwEyHgEXHgEUBgcOBCMiLgEnLgE0PgMgBhAWIDYQJwUhEQIAM2FXJDY6OjYWMTU5Ox8zYVckNjo6bYv5/qj09AFY9OD+QQD/Ap8aMiQ3i5qLNxUkGxMJGjIkN4uajGw6IfT+qPT0AVgUwP8AAAAEAID/oAOAAqAAEgAeAKYBNwFuS7AmUFhAYQAHAB0FBx1ZCQEFHxsCGgYFGlkIAQYeARwABhxZIQEAAAMEAANZCiICBCABGRIEGVkYARIRAQsCEgtZAAIAARQCAVkWARQPAQ0TFA1ZABUADhUOVRcBExMMURABDAwLDEIbQGcABwAdBQcdWQkBBR8bAhoGBRpZCAEGHgEcAAYcWSEBAAADBAADWQoiAgQgARkSBBlZGAESEQELAhILWQACAAEUAgFZFgEUDwENExQNWRcBExABDBUTDFkAFQ4OFU0AFRUOUQAOFQ5FWUFMACEAHwABAAABNgEzASMBIgEeARwBEAENAQYBBAD/AP0A/AD7AO8A7ADnAOQA2QDXANMA0QDLAMgAwQC/ALwAugCsAKkAnwCcAJIAkQCOAIwAhwCEAH8AfQB5AHcAagBnAFoAVwBMAEoARgBEADwAOQA0ADIALQArAB8ApgAhAKYAGgAZABQAEwANAAwAAAASAAEAEgAjAA4rASIOAgcGFRQeARcWMjY1NCcmAiImNTQ+ATIeARUUNyMiJjU0PwE2NC8BJiMiDwEOAiMiJj0BNCYrASIGHQEUDgMjIiYvASYjIg8BBhQfARYVFA4BKwEiDgIPAQ4DHQEUFjsBMh4BFRQOAQ8BBhQfARYzMj8BPgEzMhYdARQWOwEyNj0BNDYzMh8BFjI/ATY0LwEmNTQ2OwEyNj0CNC4BFxUUKwEiBw4CFRQeAR8BFg8BBiMiLwEmIyIGHQEUDgIrASImPQE0JyYjIgYPAQYjIi8BJjQ/ATY1NCcmKwEiJj0BNDY7ATI3NjU0Ji8BJjQ/ATYzMDMyHgEfARYzMj4BNzY9ATQ7ATIeAR0BFB8BHgQzMj8BPgEyFh8BHgEVFA8BBhUUHgEXFjsBMhUCAhQlIiANOA0ZEjifcTk4DYVdKkpXSiuvHhMbDxQODi0OFRUOEwQLDQYTHRwUPBUdBQgMDggJEQcTDhUVDi0ODhMPDBUMHwQJCAgDBgMEAwIeFB8MFQwDBwUTDg4tDRYUDxMGEQoTHB0UPRQeGxMUDhMOKg4tDg4UDxsTHhQbDBYCDx4gFwcKBgYLCBMNDSwFCAgEExghHy8DBQYEPAcLFxgfEB4LEgUICAQtBQUSGhcWIR8HCwsHHyAXFg0MEgUFLAUIAwIDAwETFyELExIHGBE9BAgEGAgECQkKCgYhGBICBwcHAi0CAwUTGQUKCBYhHg8B4AcPFQ04UBowLBI4cFBPOTj+oF5CK0orK0orQpIbExQNEw8pDiwODhIFBwQbEx4UHh4UHwcOCwgFCAcTDg4sDikPEg4UDBYMAgMEAwYDBwgJBTwVHQwWDAcMCgUSDykOLA4OEwcIGxMeFR0dFR4TGxATDg4tDikPEw0UExwcFB8eDhcNUB4QGAcSFAsKFRIHEwwMLQUFEhotIR4EBwQDCggeIBcXDQwTBQUtBQ4FEhghIBcXCwY9BwsXFyAQHgsSBQ4FLQQBAgETGQUKBxcgHxIFCAUfHxgGAwUEAwEZEgMCAgItAgYEBwUTFyELExEIFxIAAAMAwP/gA0ACYAADAAYACQAKtwgHBgUDAgMmKxMfAQkCAxMBJ8DpcwEk/ogBOObi/ramAS1n5gKA/m8BTP4PAfX+xkkABABg/4ADoALAAAcAEQAZACoAUUBOAAcACgEHClkAAQAAAgEAWQACAAMEAgNXCwYCBAAFCQQFVwwBCQgICU0MAQkJCFEACAkIRRsaCAgjIhoqGyoXFhMSCBEIERERERITEg0UKwAUFjI2NCYiExEjFTMVIxUzNRIgBhAWIDYQASIuATU0PgIyHgIUDgIBzxciFxciOmAgIIBs/qj09AFY9P5gZ7BmPGaOmo5mPDxmjgHZIhcXIhf+gAEAEPAQEAJQ9P6o9PQBWP3XZrBnTY5mPDxmjpqOZjwABABg/4ADoALAAAcAGAAzAEAAXkBbAAUGBwYFB2YABwgGBwhkAAAAAwQAA1kLAQQABgUEBlkMAQgACQIICVkKAQIBAQJNCgECAgFRAAECAUU1NBoZCQg5ODRANUArKiEfHh0ZMxozERAIGAkYExANECsAIAYQFiA2EAEiLgE1ND4CMh4CFA4CAyIOARUzJjMyFhUUBgcOAgczPgE3PgE1NCYDIgYUFjI2NTQuAwKs/qj09AFY9P5gZ7BmPGaOmo5mPDxmjkYrPCAmAmEkMhUSFxkLASYBDSAaGkYxDxMUHBQEBggLAsD0/qj09AFY/ddmsGdNjmY8PGaOmo5mPAJZGzgpXS0jFiURFSYpHSohHxguHzI7/osTHBQUDgULCAYDAAAAAAUAwP+AA0ACwAALABMAFwApADEAWEBVJyACCQoBQAAAAAQBAARZBQwDAwEABwgBB1cACAALCggLWQAKAAkGCglZAAYCAgZLAAYGAk8AAgYCQwAALy4rKiQjGxoXFhUUExIPDgALAAsRExMNESsBNTQmIgYdASMRIRElNDYyFh0BIQEhESEHNCYiBhUUFhcVFBYyNj0BPgEGIiY0NjIWFALQeqx6cAKA/hBnkmf+oAHQ/cACQOAlNiUbFQkOCRUbMxoTExoTAWCQVnp6VpD+IAHgkElnZ0mQ/kABoKAbJSUbFiMFUgcJCQdSBSMKExoTExoAAAAGAMEA4ANAAWAABwAPAB4AJwAvADcARUBCCg0GAwIIDAQDAAECAFkJBQIBAwMBTQkFAgEBA1ELBwIDAQNFIB8REDU0MTAtLCkoJCMfJyAnGBYQHhEeExMTEA4SKwAyFhQGIiY0NiIGFBYyNjQlMh4BFRQGIyIuAjU0NjciBhQWMjY0JgQyFhQGIiY0NiIGFBYyNjQB8R4VFR4VPzYlJTYl/sEKEAoVDwcOCQYVDxslJTUmJgHWHhUVHhU/NiUlNiUBRBUeFRUeMSU2JSU2CQoQCg8VBgkOBw8VHCU2JSU2JRwVHhUVHjElNiUlNgAAAAACAQD/4AMAAmAAMABLASFLsAtQWEAeLxcCCQNLPgIKAT0BBQgxAQcFLSoCBgcFQBsBBwE/G0uwDFBYQB4vFwIJA0s+AgoCPQEFCDEBBwUtKgIGBwVAGwEHAT8bQB4vFwIJA0s+AgoBPQEFCDEBBwUtKgIGBwVAGwEHAT9ZWUuwC1BYQC8AAAkBCQABZgADAAkAAwlZAgEBAAoIAQpZAAgABQcIBVkABwAGBAcGWQAEBAsEQhtLsAxQWEAvAQEACQIJAAJmAAMACQADCVkAAgAKCAIKWQAIAAUHCAVZAAcABgQHBlkABAQLBEIbQC8AAAkBCQABZgADAAkAAwlZAgEBAAoIAQpZAAgABQcIBVkABwAGBAcGWQAEBAsEQllZQA9KSEJAJCw0IxYpMRIQCxcrASIOBCMiLgEvASYnLgIjIg4BDwEZATMRPgEzMh4BFxYzMj4DNz4BNxE1BgMGIyInLgIjIg4BBxE+ATMyFx4EMzI3AuACEggRDA8HDhoeCRsSBxwhMxYqQBIFByANMygTKjUOWjEIERILFAMKDwcMFDcWLlcNNy0VGCobCw0zKC1TBicSIBwOFzgCQAMBAQEBAgUCBgQBBgcGCwgDBf63/uQBHwUICA8DEwECAQIBAQIBATohAv7DBxIDDwkEBQMBEwUIEgEJAwYCBwAAAgCA/6ADgAKgAAgAEgA1QDISEQ8ODQoIAQAJAQMBQBAJAgM+AAEDAAMBAGYAAwEAA0sAAwMATwIBAAMAQxQRERIEEisJAREzETMRMxEBBzUjFQcVCQE1AgD+wODA4P7AwIBAAYABgAJA/wD+YAEA/wABoAFgmlrAMykBM/7NKQACAID/oAN/AqAAgQCOAKS2iIcCBwABQEuwJlBYQDEAAwAPAAMPWQYQAgANAQcOAAdZBAECCwEJCAIJWQAOAAoOClUFAQEBCFEMAQgICwhCG0A3AAMADwADD1kGEAIADQEHDgAHWQAOCQoOTQQBAgsBCQgCCVkFAQEMAQgKAQhZAA4OClEACg4KRVlAJgIAjIuFhHt4a2pnZV9cV1VRT0VCPDksKiUjGxgTEQ0MAIECgREOKwEjIiY1ND8BNjQvASYiDwEOASMiJj0BNCYrASIOAR0BFA4CIyIuAS8BJiMiDwEGFB8BHgMVFAYrASIOAR0BFBY7ATIWFRQPAQYUHwEWMzI/AT4BMzIWHQEUFjsBMjY9ATQ+ATMyHwEWMj8BPgE0Ji8BJjU0PgE7ATI2PQI2JgcUBiImNTE0PgEyHgEDUR4TGw8UDg4tDioOEwcRChMcHRQ9DRYNCA0RCQcMCgUTDhUVDi0ODhMEBQQCGxIfDRcOHhQfEhsPEw4OLQ0WFA8TBhIJExwdFD0UHQ0VDRMPEw4pDywHCAgHEw8MFQwfFBoBG8NehV0qSldKKwFvHBMTDhMOKQ8sDg4TBwgbEh8UHg4XDR8JEA0HAwcFEw4OLA4pDxIECAgJBRMcDRYOPBUcHBMUDhIPKQ4sDg4TBwgbEx4UHh0VHgwVDRASDg4sBxMSEwcTDRQNFQ0cFB8eFRxPQl5eQitKKytKAAADAGD/gAOgAsAABwARABsAN0A0AAAAAgMAAlkAAwAHBgMHVwAGCAEFBAYFVwAEAQEESwAEBAFRAAEEAUURERERFBQTExAJFysAIAYQFiA2ECQyFhUUBiImNTQTIzUzNSM1MxEzAqz+qPT0AVj0/kYiFxciF3GAICBgIALA9P6o9PQBWCQXERAYGBAR/ocQ8BD/AAAAAwBg/4ADoALAAAcAFAAuAEhARQAFBwYHBQZmAAYEBwYEZAAAAAcFAAdZAAQAAwIEA1oIAQIBAQJNCAECAgFSAAECAUYJCCooJyYlIxkYDQwIFAkUExAJECsAIAYQFiA2EAEiJjQ2MhYVFA4DNw4BByM0PgI3PgE1NCYjIhcjNjMyFhUUBgKs/qj09AFY9P5pDxMTHRQEBggLPiANASYHDhYREhUyJGECJgGGM0YaAsD0/qj09AFY/ngUHBMTDgYKCAcD5yAhKhYhHxsQESYVIy1dfDsyHi8AAwDBAOADQAFgAAcAEAAYACtAKAQGAgMAAQEATQQGAgMAAAFRBQMCAQABRQkIFhUSEQ0MCBAJEBMQBxArACIGFBYyNjQlIgYUFjI2NCYgIgYUFjI2NAIbNiUlNiX+wRslJTUmJgIANiUlNiUBYCU2JSU2JSU2JSU2JSU2JSU2AAAMAED/0APAAnAABwAPABcAHwAnAC8ANQA7AEMASwBTAFsBBEuwIVBYQGIAAgACaAADAQoBAwpmAAoIAQoIZAALCQYJCwZmAAYECQYEZAAHBQdpGBcCFBYBFQEUFVcAAAABAwABWQ8BDA4BDQkMDVgACAAJCwgJWRMBEBIBEQUQEVgABAQFUQAFBQsFQhtAZwACAAJoAAMBCgEDCmYACggBCghkAAsJBgkLBmYABgQJBgRkAAcFB2kYFwIUFgEVARQVVwAAAAEDAAFZDwEMDgENCQwNWAAIAAkLCAlZAAQQBQRNEwEQEgERBRARWAAEBAVRAAUEBUVZQC1UVFRbVFtaWU9OTUxKSUhHPz49PDs6OTgzMjEwLSwpKCUkExMTExMTExMQGRcrADIWFAYiJjQ2IgYUFjI2NAIyFhQGIiY0NiIGFBYyNjQAMhYUBiImNDYiBhQWMjY0FyEVITY0IhQXIzUzATMVIzY1NCYHFBYVITUhBhMzFSM2NTQmJwYVFBYVITUCsxoTExoTOjQmJjQmTRoTExoTOjQmJjQm/jMaExMaEzo0JiY0Jh8CIf3fAcABoaECPqGhAQG/Af3fAiEBv6GhAQG+AQH93wJQExoTExozJjQmJjT95hMaExMaMyY0JiY0ARYTGhMTGjMmNCYmNAogCBAQCCD+8CAICAQIDAQIBCAIAiggCAgECAQICAQIBCAACQBEACADvALLABUAJwAzAEQAUABdAHEAfgCMARJLsApQWEBeFwEMCwMKDF4ADQIKCw1eAAcACAEHCFkAARIBAAkBAFkACRUBBgsJBlkAAxMBAg0DAlkACxYBCg8LClkADxkBEAUPEFkABRQBBBEFBFkAEQ4OEU0AEREOURgBDhEORRtAYBcBDAsDCwwDZgANAgoCDQpmAAcACAEHCFkAARIBAAkBAFkACRUBBgsJBlkAAxMBAg0DAlkACxYBCg8LClkADxkBEAUPEFkABRQBBBEFBFkAEQ4OEU0AEREOURgBDhEORVlARoB/c3JfXlJRNTQqKBgWAgCEg3+MgIx5eHJ+c35pZ15xX3FYV1FdUl1MS0ZFPTs0RDVEMC0oMyozIR4WJxgnDgsAFQIVGg4rASEiLgU1NDYzITIeAxUUBgchIi4CNTQ2MyEyHgIVFAYHISImNDYzITIWFAYBIiY1ND4CMzIeARUUDgImIg4BFB4BMj4BNCYDIiY1ND4BMh4BFA4BJyIOARUUHgMzMj4BNTQuAwMiJjU0PgEyHgEUDgEnIgYUFjI2NTQuBAOa/d0EBwcGBQMCFA4CIwULCAYEFA793QYNCQYUDgIjBwwJBhQO/d0OFBQOAiMOFBT9Ays8ERsmFRswGxAcJgsTDwkJDxMQCQkZKzwcLzcwGxswGwoPCQMGCQoGCRAJBAYICwUrPBwvNzAbGzAbDhQUHBQDBAYICQJCAgMFBgcHBA4UAwYJCgYOFO8GCQwHDhQFCQ0HDhTvFB0UFB0UAZo8KhUmGxEcLxwVJRwQiAkPExAJCRATD/6SPCocLxwcLzcwG4gJDwoFCwgGBAkQCQYKCQYD/ok8KhwvHBwvNzAbiRQdFBQOBQkHBwQDAAMAQP/hA78CZwADAAcACwAmQCMAAgADAAIDVwAAAAEEAAFXAAQEBU8ABQULBUIRERERERAGFCsTIRUhESEVIREhFSFAA3/8gQN//IEDf/yBATwwAVsw/dkvAAAABAAX/4gD6QK4AAUAIgA5AD8APUA6Pz49PDs6OS0sIyIhHx4UEwYFBAMCAQAXAgEBQAAAAAECAAFZAAIDAwJNAAICA1EAAwIDRS8eFy0EEisBBycHFzcnMD0BLgMjIg4CBxc+ATIeARcVFAYHFzY1MQcOASIuATU0NjcnBh0DHgIzMjY3AQcXNxc3A9NTVRVqaVEBQW2XUjdpXE0bHDKwzKxlAQEBIAJQMrDMrWUBASACAm+6bW7ANv0caRZTUxYBIFNTFmppGAECU5VsQB02TTAQWWdkrGYOBg4HBBUWuFlnZK1mChQKBBUWAgQDbLhrcGABSGkXU1MXAAAAAQFg/6ACnwKgAEkAS0BIOgEABUcfCgMCAwJAAAUABWgHAQADAGgAAwIDaAACAAQBAgRZAAEGBgFNAAEBBlIABgEGRgEAQ0E3Ni0rJSMdGwgHAEkBSQgOKwEiDgEVERQGIiY3MBE0Njc2Fx4BFREUDgIHBiMiJjUwETQmIyIOARUDFBYzFjc+AjUTNCcmIgcGBzAdAwYWMxY3NjURNiYCiQYLBkVbRQESECMjEBECAgQCBggJDQ0JBwoGASkcHRQGCQQBOBs/GjgBAWBAQy4vAQ0B6gYLBv56PUFDPQHWFyMJFRUKIxf+PwYKCAgDBxYTAVoKDQYLBv6nKi8BGQgUFw0BwUsiEA8hS3iNfVRRXgEvME8BhQoOAAMAE//2A+0CSQAXACMAMQCaS7APUFhAIgcBBAIFAgReAAUDAwVcAAEGAQIEAQJZAAMDAFIAAAALAEIbS7AYUFhAJAcBBAIFAgQFZgAFAwIFA2QAAQYBAgQBAlkAAwMAUgAAAAsAQhtAKQcBBAIFAgQFZgAFAwIFA2QAAQYBAgQBAlkAAwAAA00AAwMAUgAAAwBGWVlAFCUkGRgrKiQxJTEgHxgjGSMpJggQKwEUDgQjIi4DND4DMzIXFhcWJSIOAhUUFjI2NCYHIg4BFRQWMjY1NC4CA+0hPFpqhkZRnXVbLy9bdpxRyJ1jHQj+EzBYQCWLxYuLYylGKFh+WBgoOAEgGD5DPzMfK0RQTTxNUEQqcEdLFuImQloxZY6Oyo5YKUgqQFtbQCA5KhgAAAEAwABgA0AB4AAFAAazAgABJislNwkBFwEDGSf+wP7AJwEZYCkBV/6pKQEtAAAAAAEAwABgA0AB4AAFAAazAgABJisBFwkBNwEDGSf+wP7AJwEZAeAp/qkBVyn+0wAAAAEBQP/gAsACYAAFAAazAwEBJisBJwkBNwECwCn+qQFXKf7TAjkn/sD+wCcBGQAAAAEBQP/gAsACYAAFAAazAwEBJisBNwkBJwEBQCkBV/6pKQEtAjkn/sD+wCcBGQAAAAEBQP/gAsACYAAhACVAIhkYEwsEBQACAUAAAAIBAgABZgACAgFRAAEBCwFCLBURAxErAQYiLwERFAYiJjURBwYnJjQ3Njc2MzIWHwEeAR8BHgEVFAK7BA0FlQkOCZUMCgUFrgIGBQMFAQIBWCwrAwIBpAQEhf3HBwkJBwI5hAsKBQ4EnwEFAgECAVAoJwIGAwcAAAABAUD/4ALAAmAAIAAkQCEYEwsEBAIAAUAAAAECAQACZgABAQJRAAICCwJCLBURAxErJSYiDwERNCYiBhURJyYHBhQXFhcWMzI2Nz4BPwE+ATU0ArsEDQWVCQ4JlQwKBQWuAgYFBAYBAVgsKwMCnAQEhQI5BwkJB/3HhAsKBQ4EnwEFAwIBUCgnAgYDBwAAAAABAMAAYANAAeAAHQAqQCcWEgIAAQFAAAIBAmgAAwADaQABAAABTQABAQBSAAABAEYcFCMjBBIrJTYvASEyNjQmIyE3NicmIgcGBwYVFBceAR8BFjM2AXwKCoUCOQcJCQf9x4QLCgUOBJ8BBQUBUCgnBAcHZQoMlQkOCZUMCgUFrgIGBQcEAVgsKwUBAAEAwABgA0AB4AAeACVAIhcTAgABAUAAAgACaQABAAABTQABAQBRAAABAEUdHCMjAxArJSY/ASEiJjQ2MyEnJjc+ARYXFhcWFRQHDgEPAQYjJgKECgqF/ccHCQkHAjmECwoDCQgDnwEFBQFQKCcEBwdlCgyVCQ4JlQwKAwMCBK4CBgUHBAFYLCsFAQAAAQEe/6cC2gJ/AAYAFkATAAEAPQABAAFoAgEAAF8REREDESsFEyMRIxEjAfzekZuQWQEoAbD+UAABAAAAAQAA+V1e2V8PPPUACwQAAAAAANJrTZkAAAAA0mtNmQAA/yAEAAMgAAAACAACAAAAAAAAAAEAAAMg/yAAXAQAAAAAAAQAAAEAAAAAAAAAAAAAAAAAAAAFAXYAIgAAAAABVQAAA+kALAQAAGAAwADAAGAAwADAAKAAgACAAGAAoACAAIAAYACzAEAAQAAFAFcAXgCAAQAA9AEAAPQBAABAAFYAoADgAMAAwABtAIAAgABgAEAAYABgAGAAPgBtAGAAQABgAGAANABgAD4BQAEAAIAAQAAAACUAgQEAAUABQAEsAIAAYACAAMAAYABgAMAAwQEAAIAAgABgAGAAwQBAAEQAQAAXAWAAEwDAAMABQAFAAUABQADAAMABHgAAACgAKAAoAWQCCgO0BYoGDgaiB4gIgAjICXYJ8Ap6CrQLGAtsDPgN3A50D1wRyhIyEzATnhQaFHIUvBVAFeIXHBd8GEoYkBjWGTIZjBnoGmAaohsCG1QblBvqHCgcehyiHOAdDB1qHaQd6h4IHkYenh7YHzggmiDkIQwhJCE8IVwhviIcJGYkiCT0JYYmACZ4J3YntijEKQ4peim6KsQsECw+LLwtSC3eLfYuDi4mLj4uiC7QLxYvXC94AAEAAABdAXoADAAAAAAAAgBGAFQAbAAAAQQJlgAAAAAAAAAMAJYAAQAAAAAAAQAIAAAAAQAAAAAAAgAGAAgAAQAAAAAAAwAlAA4AAQAAAAAABAAIADMAAQAAAAAABQBGADsAAQAAAAAABgAIAIEAAwABBAkAAQAQAIkAAwABBAkAAgAMAJkAAwABBAkAAwBKAKUAAwABBAkABAAQAO8AAwABBAkABQCMAP8AAwABBAkABgAQAYtpY29uZm9udE1lZGl1bUZvbnRGb3JnZSAyLjAgOiBpY29uZm9udCA6IDEzLTExLTIwMTVpY29uZm9udFZlcnNpb24gMS4wIDsgdHRmYXV0b2hpbnQgKHYwLjk0KSAtbCA4IC1yIDUwIC1HIDIwMCAteCAxNCAtdyAiRyIgLWYgLXNpY29uZm9udABpAGMAbwBuAGYAbwBuAHQATQBlAGQAaQB1AG0ARgBvAG4AdABGAG8AcgBnAGUAIAAyAC4AMAAgADoAIABpAGMAbwBuAGYAbwBuAHQAIAA6ACAAMQAzAC0AMQAxAC0AMgAwADEANQBpAGMAbwBuAGYAbwBuAHQAVgBlAHIAcwBpAG8AbgAgADEALgAwACAAOwAgAHQAdABmAGEAdQB0AG8AaABpAG4AdAAgACgAdgAwAC4AOQA0ACkAIAAtAGwAIAA4ACAALQByACAANQAwACAALQBHACAAMgAwADAAIAAtAHgAIAAxADQAIAAtAHcAIAAiAEcAIgAgAC0AZgAgAC0AcwBpAGMAbwBuAGYAbwBuAHQAAAAAAgAAAAAAAP+DADIAAAAAAAAAAAAAAAAAAAAAAAAAAABdAAAAAQACAFsBAgEDAQQBBQEGAQcBCAEJAQoBCwEMAQ0BDgEPARABEQESARMBFAEVARYBFwEYARkBGgEbARwBHQEeAR8BIAEhASIBIwEkASUBJgEnASgBKQEqASsBLAEtAS4BLwEwATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgE/AUABQQFCAUMBRAFFAUYBRwFIAUkBSgFLAUwBTQFOAU8BUAFRAVIBUwFUAVUBVgFXAVgBWQFaB3VuaUUxMDAHdW5pRTEwMQd1bmlFMTAyB3VuaUUxMzAHdW5pRTEzMQd1bmlFMTMyB3VuaUUyMDAHdW5pRTIwMQd1bmlFMjAyB3VuaUUyMDMHdW5pRTIzMAd1bmlFMjMxB3VuaUUyMzIHdW5pRTIzMwd1bmlFMjYwB3VuaUUyNjEHdW5pRTI2Mgd1bmlFMjYzB3VuaUUyNjQHdW5pRTMwMAd1bmlFMzAxB3VuaUUzMDIHdW5pRTMwMwd1bmlFMzMyB3VuaUUzMzMHdW5pRTM2MAd1bmlFMzYzB3VuaUUzNjQHdW5pRTQwMAd1bmlFNDAxB3VuaUU0MDIHdW5pRTQwMwd1bmlFNDA0B3VuaUU0MDUHdW5pRTQwNgd1bmlFNDA3B3VuaUU0MDgHdW5pRTQwOQd1bmlFNDEwB3VuaUU0MTEHdW5pRTQxMwd1bmlFNDM0B3VuaUU0MzcHdW5pRTQzOAd1bmlFNDM5B3VuaUU0NDAHdW5pRTQ0MQd1bmlFNDQyB3VuaUU0NDMHdW5pRTQ2MAd1bmlFNDYxB3VuaUU0NjIHdW5pRTQ2Mwd1bmlFNDY0B3VuaUU0NjUHdW5pRTQ2Ngd1bmlFNDY4B3VuaUU0NzAHdW5pRTQ3MQd1bmlFNDcyB3VuaUU1MDAHdW5pRTUwMQd1bmlFNTAyB3VuaUU1MDMHdW5pRTUwNAd1bmlFNTA1B3VuaUU1MDYHdW5pRTUwNwd1bmlFNTA4B3VuaUU1MzAHdW5pRTUzMgd1bmlFNTM0B3VuaUU1MzUHdW5pRTUzNwd1bmlFNTYwB3VuaUU1NjIHdW5pRTU2Mwd1bmlFNTY1B3VuaUU1NjcHdW5pRTU2OAd1bmlFNTgwB3VuaUU1ODEHdW5pRTU4Mgd1bmlFNTgzB3VuaUU1ODQHdW5pRTU4NQd1bmlFNTg2B3VuaUU1ODcHdW5pRTU4OAABAAH//wAPAAAAAAAAAAAAAAAAAAAAAAAyADIDGP/hAyD/IAMY/+EDIP8gsAAssCBgZi2wASwgZCCwwFCwBCZasARFW1ghIyEbilggsFBQWCGwQFkbILA4UFghsDhZWSCwCkVhZLAoUFghsApFILAwUFghsDBZGyCwwFBYIGYgiophILAKUFhgGyCwIFBYIbAKYBsgsDZQWCGwNmAbYFlZWRuwACtZWSOwAFBYZVlZLbACLCBFILAEJWFkILAFQ1BYsAUjQrAGI0IbISFZsAFgLbADLCMhIyEgZLEFYkIgsAYjQrIKAAIqISCwBkMgiiCKsAArsTAFJYpRWGBQG2FSWVgjWSEgsEBTWLAAKxshsEBZI7AAUFhlWS2wBCywCCNCsAcjQrAAI0KwAEOwB0NRWLAIQyuyAAEAQ2BCsBZlHFktsAUssABDIEUgsAJFY7ABRWJgRC2wBiywAEMgRSCwACsjsQQEJWAgRYojYSBkILAgUFghsAAbsDBQWLAgG7BAWVkjsABQWGVZsAMlI2FERC2wByyxBQVFsAFhRC2wCCywAWAgILAKQ0qwAFBYILAKI0JZsAtDSrAAUlggsAsjQlktsAksILgEAGIguAQAY4ojYbAMQ2AgimAgsAwjQiMtsAosS1RYsQcBRFkksA1lI3gtsAssS1FYS1NYsQcBRFkbIVkksBNlI3gtsAwssQANQ1VYsQ0NQ7ABYUKwCStZsABDsAIlQrIAAQBDYEKxCgIlQrELAiVCsAEWIyCwAyVQWLAAQ7AEJUKKiiCKI2GwCCohI7ABYSCKI2GwCCohG7AAQ7ACJUKwAiVhsAgqIVmwCkNHsAtDR2CwgGIgsAJFY7ABRWJgsQAAEyNEsAFDsAA+sgEBAUNgQi2wDSyxAAVFVFgAsA0jQiBgsAFhtQ4OAQAMAEJCimCxDAQrsGsrGyJZLbAOLLEADSstsA8ssQENKy2wECyxAg0rLbARLLEDDSstsBIssQQNKy2wEyyxBQ0rLbAULLEGDSstsBUssQcNKy2wFiyxCA0rLbAXLLEJDSstsBgssAcrsQAFRVRYALANI0IgYLABYbUODgEADABCQopgsQwEK7BrKxsiWS2wGSyxABgrLbAaLLEBGCstsBsssQIYKy2wHCyxAxgrLbAdLLEEGCstsB4ssQUYKy2wHyyxBhgrLbAgLLEHGCstsCEssQgYKy2wIiyxCRgrLbAjLCBgsA5gIEMjsAFgQ7ACJbACJVFYIyA8sAFgI7ASZRwbISFZLbAkLLAjK7AjKi2wJSwgIEcgILACRWOwAUViYCNhOCMgilVYIEcgILACRWOwAUViYCNhOBshWS2wJiyxAAVFVFgAsAEWsCUqsAEVMBsiWS2wJyywByuxAAVFVFgAsAEWsCUqsAEVMBsiWS2wKCwgNbABYC2wKSwAsANFY7ABRWKwACuwAkVjsAFFYrAAK7AAFrQAAAAAAEQ+IzixKAEVKi2wKiwgPCBHILACRWOwAUViYLAAQ2E4LbArLC4XPC2wLCwgPCBHILACRWOwAUViYLAAQ2GwAUNjOC2wLSyxAgAWJSAuIEewACNCsAIlSYqKRyNHI2EgWGIbIVmwASNCsiwBARUUKi2wLiywABawBCWwBCVHI0cjYbAGRStlii4jICA8ijgtsC8ssAAWsAQlsAQlIC5HI0cjYSCwBCNCsAZFKyCwYFBYILBAUVizAiADIBuzAiYDGllCQiMgsAlDIIojRyNHI2EjRmCwBEOwgGJgILAAKyCKimEgsAJDYGQjsANDYWRQWLACQ2EbsANDYFmwAyWwgGJhIyAgsAQmI0ZhOBsjsAlDRrACJbAJQ0cjRyNhYCCwBEOwgGJgIyCwACsjsARDYLAAK7AFJWGwBSWwgGKwBCZhILAEJWBkI7ADJWBkUFghGyMhWSMgILAEJiNGYThZLbAwLLAAFiAgILAFJiAuRyNHI2EjPDgtsDEssAAWILAJI0IgICBGI0ewACsjYTgtsDIssAAWsAMlsAIlRyNHI2GwAFRYLiA8IyEbsAIlsAIlRyNHI2EgsAUlsAQlRyNHI2GwBiWwBSVJsAIlYbABRWMjIFhiGyFZY7ABRWJgIy4jICA8ijgjIVktsDMssAAWILAJQyAuRyNHI2EgYLAgYGawgGIjICA8ijgtsDQsIyAuRrACJUZSWCA8WS6xJAEUKy2wNSwjIC5GsAIlRlBYIDxZLrEkARQrLbA2LCMgLkawAiVGUlggPFkjIC5GsAIlRlBYIDxZLrEkARQrLbA3LLAuKyMgLkawAiVGUlggPFkusSQBFCstsDgssC8riiAgPLAEI0KKOCMgLkawAiVGUlggPFkusSQBFCuwBEMusCQrLbA5LLAAFrAEJbAEJiAuRyNHI2GwBkUrIyA8IC4jOLEkARQrLbA6LLEJBCVCsAAWsAQlsAQlIC5HI0cjYSCwBCNCsAZFKyCwYFBYILBAUVizAiADIBuzAiYDGllCQiMgR7AEQ7CAYmAgsAArIIqKYSCwAkNgZCOwA0NhZFBYsAJDYRuwA0NgWbADJbCAYmGwAiVGYTgjIDwjOBshICBGI0ewACsjYTghWbEkARQrLbA7LLAuKy6xJAEUKy2wPCywLyshIyAgPLAEI0IjOLEkARQrsARDLrAkKy2wPSywABUgR7AAI0KyAAEBFRQTLrAqKi2wPiywABUgR7AAI0KyAAEBFRQTLrAqKi2wPyyxAAEUE7ArKi2wQCywLSotsEEssAAWRSMgLiBGiiNhOLEkARQrLbBCLLAJI0KwQSstsEMssgAAOistsEQssgABOistsEUssgEAOistsEYssgEBOistsEcssgAAOystsEgssgABOystsEkssgEAOystsEossgEBOystsEsssgAANystsEwssgABNystsE0ssgEANystsE4ssgEBNystsE8ssgAAOSstsFAssgABOSstsFEssgEAOSstsFIssgEBOSstsFMssgAAPCstsFQssgABPCstsFUssgEAPCstsFYssgEBPCstsFcssgAAOCstsFgssgABOCstsFkssgEAOCstsFossgEBOCstsFsssDArLrEkARQrLbBcLLAwK7A0Ky2wXSywMCuwNSstsF4ssAAWsDArsDYrLbBfLLAxKy6xJAEUKy2wYCywMSuwNCstsGEssDErsDUrLbBiLLAxK7A2Ky2wYyywMisusSQBFCstsGQssDIrsDQrLbBlLLAyK7A1Ky2wZiywMiuwNistsGcssDMrLrEkARQrLbBoLLAzK7A0Ky2waSywMyuwNSstsGossDMrsDYrLbBrLCuwCGWwAyRQeLABFTAtAABLuADIUlixAQGOWbkIAAgAYyCwASNEILADI3CwDkUgIEu4AA5RS7AGU1pYsDQbsChZYGYgilVYsAIlYbABRWMjYrACI0SzCgkFBCuzCgsFBCuzDg8FBCtZsgQoCUVSRLMKDQYEK7EGAUSxJAGIUViwQIhYsQYDRLEmAYhRWLgEAIhYsQYBRFlZWVm4Af+FsASNsQUARAAAAA=="

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * 解决hbuilder打包app之后点击手机返回键直接退出app的
 */
document.addEventListener('plusready', function () {
    var webview = plus.webview.currentWebview();
    plus.key.addEventListener('backbutton', function () {
        webview.canBack(function (e) {
            if (e.canBack) {
                webview.back();
            } else {
                // webview.close() //hide,quit
                // plus.runtime.quit()
                // 首页返回键处理
                // 处理逻辑：1秒内，连续两次按返回键，则退出应用；
                var first = null;
                plus.key.addEventListener('backbutton', function () {
                    // 首次按键，提示‘再按一次退出应用’
                    if (!first) {
                        first = new Date().getTime();
                        console.log('再按一次退出应用'); // 此处可以用自定义提示
                        setTimeout(function () {
                            first = null;
                        }, 1000);
                    } else {
                        if (new Date().getTime() - first < 1500) {
                            plus.runtime.quit();
                        }
                    }
                }, false);
            }
        });
    });
});

/***/ })
/******/ ]);