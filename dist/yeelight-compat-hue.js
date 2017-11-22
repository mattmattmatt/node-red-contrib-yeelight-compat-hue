(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("yeelight2"));
	else if(typeof define === 'function' && define.amd)
		define(["yeelight2"], factory);
	else if(typeof exports === 'object')
		exports["yeelight-compat-hue"] = factory(require("yeelight2"));
	else
		root["yeelight-compat-hue"] = factory(root["yeelight2"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _yeelight = __webpack_require__(1);

var _yeelight2 = _interopRequireDefault(_yeelight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (RED) {
    function YeeLightNode(config) {
        var node = this;

        var onInput = function onInput(msg) {
            console.log(msg);
            var _msg$payload = msg.payload,
                on = _msg$payload.on,
                hex = _msg$payload.hex,
                bri = _msg$payload.bri,
                hue = _msg$payload.hue,
                sat = _msg$payload.sat,
                duration = _msg$payload.duration;


            if (typeof on !== 'undefined') {
                node.yeelight.set_power(on, null, duration);
            }
            if (typeof bri !== 'undefined') {
                node.yeelight.set_bright(bri, null, duration);
            }
            if (typeof hue !== 'undefined' || typeof sat !== 'undefined') {
                node.yeelight.set_hsv(hue, sat, null, duration);
            }
            if (typeof hex !== 'undefined') {
                var _hex = parseInt('0x' + hex.replace('#', ''), 16);
                console.log('_hex', _hex);
                node.yeelight.set_rgb(_hex, null, duration);
            }
            console.log(on, bri, hue, sat);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.yeelight = new _yeelight2.default('yeelight://192.168.1.142:55443');
            node.on('input', onInput);
        })();
    }

    RED.nodes.registerType('yeelight-compat-hue', YeeLightNode);
};

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ })
/******/ ]);
});