(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("yeelight2"));
	else if(typeof define === 'function' && define.amd)
		define(["yeelight2"], factory);
	else if(typeof exports === 'object')
		exports["yeelight-compat-hue"] = factory(require("yeelight2"));
	else
		root["yeelight-compat-hue"] = factory(root["yeelight2"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),

/***/ 7:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _YeeLightConfig = __webpack_require__(8);

var _YeeLightConfig2 = _interopRequireDefault(_YeeLightConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (RED) {
    RED.nodes.registerType('yeelight-compat-hue-config', (0, _YeeLightConfig2.default)(RED));
};

/***/ }),

/***/ 8:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = YeeLightConfig;

var _yeelight = __webpack_require__(0);

var _yeelight2 = _interopRequireDefault(_yeelight);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YeeLightConfig(RED) {
    return function (config) {
        var node = this;
        var hostname = config.hostname,
            port = config.port;

        var host = hostname + ':' + port;
        var reconnectionTimeout = void 0;

        var onConnected = function onConnected() {
            node.log('Connected to ' + host);
            clearTimeout(reconnectionTimeout);
            node.yeelight.socketState = 'connected';
        };

        var onDisconnected = function onDisconnected() {
            node.log('Disconnected from ' + host);
        };

        var onYeelightError = function onYeelightError(error) {
            console.error('Error at ' + host, error);
            reconnectionTimeout = setTimeout(startConnection, 5000);
            node.yeelight.socketState = 'error';
        };

        var startConnection = function startConnection() {
            node.log('Connecting to Yeelight ' + host);
            node.yeelight = new _yeelight2.default('yeelight://' + host);
            node.yeelight.socketState = 'connecting';
            node.yeelight.on('connect', onConnected);
            node.yeelight.on('error', onYeelightError);
            node.yeelight.on('disconnect', onDisconnected);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.hostname = hostname;
            node.port = port;
            if (hostname && port) {
                startConnection();

                node.on('close', function () {
                    node.log('Closing connection');
                    clearTimeout(reconnectionTimeout);
                    node.yeelight.exit();
                });
            }
        })();
    };
}

/***/ })

/******/ });
});