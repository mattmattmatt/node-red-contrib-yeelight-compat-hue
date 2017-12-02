// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
// https://github.com/song940/node-yeelight/blob/master/index.js

import Yeelight from 'yeelight2';
import convert from 'color-convert';

import { sanitizeState, hexToRgbInt, normalize } from './utils';

export default function YeeLightNodeOut(RED) {
    return function(config) {
        const node = this;

        const onInput = msg => {
            console.log(msg.payload);
            const { on, hex, bri, hue, sat, duration } = msg.payload;

            if (on === false) {
                node.serverConfig.yeelight.set_power(on, null, duration);
                return;
            }

            node.serverConfig.yeelight.sync().then(state => {
                const currentState = sanitizeState(state).state;
                console.log('currentState', currentState);
                let rgbIntToTurnTo;
                let briToTurnTo;

                if (typeof hex !== 'undefined') {
                    rgbIntToTurnTo = hexToRgbInt(hex);
                    briToTurnTo = (bri && normalize(bri, 255, 100)) || convert.hex.hsv(hex)[2];
                } else if (
                    typeof hue !== 'undefined' ||
                    typeof sat !== 'undefined' ||
                    typeof bri !== 'undefined'
                ) {
                    rgbIntToTurnTo = hexToRgbInt(
                        convert.hsv.hex(
                            normalize(hue || currentState.hue, 65535, 359),
                            normalize(sat || currentState.sat, 255, 100),
                            normalize(bri || currentState.bri, 255, 100)
                        )
                    );
                    briToTurnTo = normalize(bri || currentState.bri, 255, 100);
                } else if (on) {
                    node.serverConfig.yeelight.set_power(on, null, duration);
                    return;
                }

                const flowExpression = `${duration || 500}, 1, ${rgbIntToTurnTo}, ${briToTurnTo}`;

                console.log(
                    'rgbIntToTurnTo',
                    rgbIntToTurnTo,
                    'briToTurnTo',
                    briToTurnTo,
                    'flowExpression',
                    flowExpression
                );

                let preparePromise;

                if (currentState.on) {
                    preparePromise = Promise.resolve();
                } else {
                    preparePromise = node.serverConfig.yeelight.set_scene(
                        'color',
                        rgbIntToTurnTo,
                        1
                    );
                }

                preparePromise
                    .then(() => {
                        node.serverConfig.yeelight.start_cf(1, 1, flowExpression);
                    })
                    .catch(e => console.log('yeelight error', e));
            });
        };

        const onConnected = () => {
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        };

        const onYeelightError = (error = {}) => {
            node.status({ fill: 'red', shape: 'ring', text: `Connection error: ${error.code}` });
        };

        const startConnection = () => {
            node.status({ fill: 'yellow', shape: 'ring', text: 'Connecting...' });
            node.serverConfig.yeelight.on('connect', onConnected);
            node.serverConfig.yeelight.on('error', onYeelightError);
            node.serverConfig.yeelight.on('props', message => {
                console.log('message', message);
            });
            if (node.serverConfig.yeelight.socketState === 'connected') {
                onConnected();
            }
            if (node.serverConfig.yeelight.socketState === 'error') {
                onYeelightError();
            }
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
        })();
    };
}
