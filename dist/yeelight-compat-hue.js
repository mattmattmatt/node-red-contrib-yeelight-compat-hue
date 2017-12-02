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


var _YeeLightNodeOut = __webpack_require__(6);

var _YeeLightNodeOut2 = _interopRequireDefault(_YeeLightNodeOut);

var _YeeLightNodeState = __webpack_require__(7);

var _YeeLightNodeState2 = _interopRequireDefault(_YeeLightNodeState);

var _YeeLightConfig = __webpack_require__(8);

var _YeeLightConfig2 = _interopRequireDefault(_YeeLightConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (RED) {
    RED.nodes.registerType('yeelight-compat-hue', (0, _YeeLightNodeOut2.default)(RED));
    RED.nodes.registerType('yeelight-compat-hue-config', (0, _YeeLightConfig2.default)(RED));
    RED.nodes.registerType('yeelight-compat-hue-state', (0, _YeeLightNodeState2.default)(RED));
};

/***/ }),
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
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

var _utils = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function hexToRgbInt(hex) {
    console.log('hexToRgbInt', hex);
    return parseInt('0x' + hex.replace('#', ''), 16);
} // https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
// https://github.com/song940/node-yeelight/blob/master/index.js

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

            node.yeelight.sync().then(function (state) {
                var currentState = (0, _utils.sanitizeState)(state);
                var rgbIntToTurnTo = void 0;
                var briToTurnTo = void 0;

                if (typeof hex !== 'undefined') {
                    rgbIntToTurnTo = hexToRgbInt(hex);
                    briToTurnTo = bri || _colorConvert2.default.hex.hsv(hex)[2];
                } else if (typeof hue !== 'undefined' || typeof sat !== 'undefined' || typeof bri !== 'undefined') {
                    rgbIntToTurnTo = hexToRgbInt(_colorConvert2.default.hsv.hex(hue || currentState.hue, sat || currentState.sat, bri || currentState.bright));
                    briToTurnTo = bri || currentState.bright;
                } else if (on) {
                    node.yeelight.set_power(on, null, duration);
                    return;
                }

                var flowExpression = (duration || 500) + ', 1, ' + rgbIntToTurnTo + ', ' + briToTurnTo;

                console.log('rgbIntToTurnTo', rgbIntToTurnTo, 'briToTurnTo', briToTurnTo, 'flowExpression', flowExpression);

                var preparePromise = void 0;

                if (currentState.on) {
                    preparePromise = Promise.resolve();
                } else {
                    preparePromise = node.yeelight.set_scene('color', rgbIntToTurnTo, 1);
                }

                preparePromise.then(function () {
                    node.yeelight.start_cf(1, 1, flowExpression);
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = YeeLightNodeState;

var _yeelight = __webpack_require__(0);

var _yeelight2 = _interopRequireDefault(_yeelight);

var _utils = __webpack_require__(9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

function YeeLightNodeState(RED) {
    return function (config) {
        var node = this;
        var reconnectionTimeout = void 0;

        // on, hex, bri, hue, sat, duration
        var onInput = function onInput(msg) {
            node.yeelight.sync().then(function (state) {
                msg.payload = (0, _utils.sanitizeState)(state);
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
/* 8 */
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.rgbIntToHex = rgbIntToHex;
exports.colorTemperatureToRGB = colorTemperatureToRGB;
exports.sanitizeState = sanitizeState;

var _colorConvert = __webpack_require__(1);

var _colorConvert2 = _interopRequireDefault(_colorConvert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

function rgbIntToHex(number) {
    return '#' + (number >>> 0).toString(16).slice(-6).padStart(6, '0');
}

function colorTemperatureToRGB(kelvin) {
    var temp = kelvin / 100;
    var red, green, blue;

    if (temp <= 66) {
        red = 255;
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;

        if (temp <= 19) {
            blue = 0;
        } else {
            blue = temp - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        }
    } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);

        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);

        blue = 255;
    }

    return {
        r: clamp(red, 0, 255),
        g: clamp(green, 0, 255),
        b: clamp(blue, 0, 255)
    };
}

function clamp(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }

    return x;
}

function sanitizeState(state) {
    var bright = state.bright,
        power = state.power,
        name = state.name,
        color_mode = state.color_mode;

    var colorModeMap = {
        1: 'rgb',
        2: 'ct',
        3: 'hs'
    };
    var result = {
        on: state.power !== 'off',
        bri: parseInt(bright, 10),
        name: name,
        colormode: colorModeMap[color_mode],
        raw: state
    };
    if (state.color_mode === '1') {
        var hex = rgbIntToHex(state.rgb);
        result = _extends({}, result, {
            hex: hex,
            hue: _colorConvert2.default.hex.hsv(hex)[0],
            sat: _colorConvert2.default.hex.hsv(hex)[1]
        });
    } else if (state.color_mode === '2') {
        var _colorTemperatureToRG = colorTemperatureToRGB(state.ct),
            red = _colorTemperatureToRG.r,
            green = _colorTemperatureToRG.g,
            blue = _colorTemperatureToRG.b;

        result = _extends({}, result, {
            ct: parseInt(state.ct, 10),
            hex: '#' + _colorConvert2.default.rgb.hex(red, green, blue),
            hue: _colorConvert2.default.rgb.hsv(red, green, blue)[0],
            sat: _colorConvert2.default.rgb.hsv(red, green, blue)[1]
        });
    } else if (state.color_mode === '3') {
        var _hex = _colorConvert2.default.hsv.hex(parseInt(state.hue, 10), parseInt(state.sat, 10), parseInt(state.bright, 10));
        result = _extends({}, result, {
            hex: '#' + _hex,
            hue: parseInt(state.hue, 10),
            sat: parseInt(state.sat, 10)
        });
    }
    return result;
}

/***/ })
/******/ ]);
});