(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("yeelight2"), require("color-convert"));
	else if(typeof define === 'function' && define.amd)
		define(["yeelight2", "color-convert"], factory);
	else if(typeof exports === 'object')
		exports["yeelight-compat-hue"] = factory(require("yeelight2"), require("color-convert"));
	else
		root["yeelight-compat-hue"] = factory(root["yeelight2"], root["color-convert"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__, __WEBPACK_EXTERNAL_MODULE_1__) {
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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _YeeLightNodeOut = __webpack_require__(3);

var _YeeLightNodeOut2 = _interopRequireDefault(_YeeLightNodeOut);

var _YeeLightNodeState = __webpack_require__(4);

var _YeeLightNodeState2 = _interopRequireDefault(_YeeLightNodeState);

var _YeeLightConfig = __webpack_require__(5);

var _YeeLightConfig2 = _interopRequireDefault(_YeeLightConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (RED) {
    RED.nodes.registerType('yeelight-compat-hue', (0, _YeeLightNodeOut2.default)(RED));
    RED.nodes.registerType('yeelight-compat-hue-config', (0, _YeeLightConfig2.default)(RED));
    RED.nodes.registerType('yeelight-compat-hue-state', (0, _YeeLightNodeState2.default)(RED));
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = YeeLightNodeOut;

var _yeelight = __webpack_require__(0);

var _yeelight2 = _interopRequireDefault(_yeelight);

var _colorConvert = __webpack_require__(1);

var _colorConvert2 = _interopRequireDefault(_colorConvert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
// https://github.com/song940/node-yeelight/blob/master/index.js

function hexToRgbInt(hex) {
    console.log('hexToRgbInt', hex);
    return parseInt('0x' + hex.replace('#', ''), 16);
}

function YeeLightNodeOut(RED) {
    return function (config) {
        var node = this;
        var reconnectionTimeout = void 0;

        var onInput = function onInput(msg) {
            console.log(msg.payload);
            var _msg$payload = msg.payload,
                on = _msg$payload.on,
                hex = _msg$payload.hex,
                bri = _msg$payload.bri,
                hue = _msg$payload.hue,
                sat = _msg$payload.sat,
                duration = _msg$payload.duration;


            if (on === false) {
                node.yeelight.set_power(on, null, duration);
                return;
            }

            node.yeelight.sync().then(function (currentState) {
                var hexToTurnTo = void 0;
                var briToTurnTo = void 0;

                if (typeof hex !== 'undefined') {
                    hexToTurnTo = hexToRgbInt(hex);
                } else if (typeof hue !== 'undefined' || typeof sat !== 'undefined' || typeof bri !== 'undefined') {
                    hexToTurnTo = hexToRgbInt(_colorConvert2.default.hsv.hex(hue || parseInt(currentState.hue, 10), sat || parseInt(currentState.sat, 10), bri || parseInt(currentState.bright, 10)));
                } else if (on) {
                    node.yeelight.set_power(on, null, duration);
                    return;
                }

                briToTurnTo = _colorConvert2.default.hex.hsv(hexToTurnTo)[2];

                console.log('hexToTurnTo', hexToTurnTo, 'briToTurnTo', briToTurnTo);

                var preparePromise = void 0;

                if (currentState.power === 'off') {
                    preparePromise = node.yeelight.set_scene('color', hexToTurnTo, 1);
                } else {
                    preparePromise = Promise.resolve();
                }

                preparePromise.then(function () {
                    node.yeelight.start_cf(1, 1, (duration || 500) + ', 1, ' + hexToTurnTo + ', ' + briToTurnTo);
                }).catch(function (e) {
                    return console.log('yeelight error', e);
                });
            });
        };

        var onConnected = function onConnected() {
            console.log('connected');
            clearTimeout(reconnectionTimeout);
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        };

        var onDisconnected = function onDisconnected() {
            console.log('disconnected');
            // node.status({ fill: 'red', shape: 'ring', text: 'Disconnected' });
        };

        var onYeelightError = function onYeelightError(error) {
            console.error('error happened', error);
            reconnectionTimeout = setTimeout(startConnection, 5000);
            node.status({ fill: 'red', shape: 'ring', text: 'Connection error: ' + error.code });
        };

        var startConnection = function startConnection() {
            console.log('connecting to yeelight...', node.serverConfig.hostname, node.serverConfig.port);
            node.status({ fill: 'yellow', shape: 'ring', text: 'Connecting...' });
            node.yeelight = new _yeelight2.default('yeelight://' + node.serverConfig.hostname + ':' + node.serverConfig.port);
            node.yeelight.on('connect', onConnected);
            node.yeelight.on('error', onYeelightError);
            node.yeelight.on('disconnect', onDisconnected);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.serverConfig = RED.nodes.getNode(config.server);

            if (!node.serverConfig || !node.serverConfig.hostname) {
                node.status({ fill: 'red', shape: 'ring', text: 'Hostname not set' });
                return;
            }
            startConnection();
            node.on('input', onInput);
            node.on('close', function () {
                console.log('closing');
                clearTimeout(reconnectionTimeout);
                node.yeelight.exit();
            });
        })();
    };
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = YeeLightNodeState;

var _yeelight = __webpack_require__(0);

var _yeelight2 = _interopRequireDefault(_yeelight);

var _colorConvert = __webpack_require__(1);

var _colorConvert2 = _interopRequireDefault(_colorConvert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function YeeLightNodeState(RED) {
    return function (config) {
        var node = this;
        var reconnectionTimeout = void 0;

        var onInput = function onInput(msg) {
            node.yeelight.sync().then(function (state) {
                msg.payload = state;
                msg.payload.on = state.power !== 'off';
                msg.payload.hex = _colorConvert2.default.hsv.hex(parseInt(state.hue, 10), parseInt(state.sat, 10), parseInt(state.bright, 10));
                node.send(msg);
            });
        };

        var onConnected = function onConnected() {
            console.log('connected');
            clearTimeout(reconnectionTimeout);
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        };

        var onDisconnected = function onDisconnected() {
            console.log('disconnected');
            // node.status({ fill: 'red', shape: 'ring', text: 'Disconnected' });
        };

        var onYeelightError = function onYeelightError(error) {
            console.error('error happened', error);
            reconnectionTimeout = setTimeout(startConnection, 5000);
            node.status({ fill: 'red', shape: 'ring', text: 'Connection error: ' + error.code });
        };

        var startConnection = function startConnection() {
            console.log('connecting to yeelight...', node.serverConfig.hostname, node.serverConfig.port);
            node.status({ fill: 'yellow', shape: 'ring', text: 'Connecting...' });
            node.yeelight = new _yeelight2.default('yeelight://' + node.serverConfig.hostname + ':' + node.serverConfig.port);
            node.yeelight.on('connect', onConnected);
            node.yeelight.on('error', onYeelightError);
            node.yeelight.on('disconnect', onDisconnected);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.serverConfig = RED.nodes.getNode(config.server);

            if (!node.serverConfig || !node.serverConfig.hostname) {
                node.status({ fill: 'red', shape: 'ring', text: 'Hostname not set' });
                return;
            }
            startConnection();
            node.on('input', onInput);
            node.on('close', function () {
                console.log('closing');
                clearTimeout(reconnectionTimeout);
                node.yeelight.exit();
            });
        })();
    };
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = YeeLightConfig;
function YeeLightConfig(RED) {
    return function (config) {
        var node = this;

        (function init() {
            RED.nodes.createNode(node, config);
            node.hostname = config.hostname;
            node.port = config.port;
        })();
    };
}

/***/ })
/******/ ]);
});