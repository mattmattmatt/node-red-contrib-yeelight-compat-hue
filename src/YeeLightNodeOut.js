// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf
// https://github.com/song940/node-yeelight/blob/master/index.js

import Yeelight from 'yeelight2';
import convert from 'color-convert';

import { sanitizeState, hexToRgbInt, normalize, colorTemperatureToRgbInt, clamp } from './utils';

export default function YeeLightNodeOut(RED) {
    return function(config) {
        const node = this;

        const onInput = msg => {
            if (typeof msg.payload === 'string') {
                try {
                    msg.payload = JSON.parse(msg.payload);
                } catch (e) {
                    return node.error(
                        `Yeelight: Error during payload parsing\n${e}\n${msg.payload}`
                    );
                }
            }

            if (typeof msg.payload !== 'object') {
                return node.error(`Yeelight: Invalid payload\n${msg.payload}`);
            }

            const { on, hex, bri, hue, sat, duration = 500, ct } = msg.payload;

        
            node.serverConfig.yeelight
                .sync()
                .then(state => {
                    let colorValue;
                    let colorMode;
                    const currentState = sanitizeState(state).state;
                    let briToTurnTo = clamp(normalize(bri || currentState.bri, 255, 100), 1, 100);
                
                    // if msg.payload.on = "toggle", invert the state of the light
                    // if the light is on, turn it off and if the light is off: turn it on
                    // so, the param on car noew have three states: true, false or "toggle"
                    if (on == 'toggle') {
                        on != currentState.on;
                    }
                    // I need to move this test here to keep the off status functionnal
                    if (on === false) {
                        return node.serverConfig.yeelight.set_power(on, null, duration);
                    }
                    // end of modification
                
                    if (typeof ct !== 'undefined') {
                        colorMode = 2;
                        colorValue = ct;
                    } else if (typeof hex !== 'undefined') {
                        colorMode = 1;
                        colorValue = hexToRgbInt(hex);
                        // if no bri was specified, calculate from hex value
                        briToTurnTo = bri ? briToTurnTo : clamp(convert.hex.hsv(hex)[2], 1, 100);
                    } else if (
                        typeof hue !== 'undefined' ||
                        typeof sat !== 'undefined' ||
                        typeof bri !== 'undefined'
                    ) {
                        colorMode = 1;
                        colorValue = hexToRgbInt(
                            convert.hsv.hex(
                                normalize(hue || currentState.hue, 65535, 359),
                                normalize(sat || currentState.sat, 255, 100),
                                briToTurnTo
                            )
                        );
                    } else if (on) {
                        return node.serverConfig.yeelight.set_power(on, null, duration);
                    }

                    return node.serverConfig.yeelight
                        .set_scene(
                            'cf',
                            1, // don't repeat
                            1, // keep in end-state
                            `${duration}, ${colorMode}, ${colorValue}, ${briToTurnTo}`
                        )
                        .catch(e => {
                            if (e.code === -5000) {
                                return node.error(
                                    'Yeelight "general error (code -5000)". Payload might be invalid.'
                                );
                            }
                            throw e;
                        });
                })
                .catch(e => {
                    if (e.message === 'timeout') {
                        e.code = 'timeout';
                        e.message = 'Local timeout in "Yeelight.command" execution';
                    }
                    node.log('An error occured while syncing or setting a new value');
                    console.error(e);
                    node.status({
                        fill: 'red',
                        shape: 'ring',
                        text: `Command send error: ${e.code}`,
                    });
                });
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.serverConfig = RED.nodes.getNode(config.server);

            if (!node.serverConfig || !node.serverConfig.hostname) {
                node.status({ fill: 'red', shape: 'ring', text: 'Hostname not set' });
                return;
            }

            node.serverConfig.registerClientNode(node);

            node.on('input', onInput);

            node.on('close', function() {
                if (node.serverConfig) {
                    node.serverConfig.deregisterClientNode(node);
                }
            });
        })();
    };
}
