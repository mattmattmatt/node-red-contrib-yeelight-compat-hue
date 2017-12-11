// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

import Yeelight from 'yeelight2';

import { rgbIntToHex, sanitizeState } from './utils';

export default function YeeLightNodeState(RED) {
    return function(config) {
        const node = this;
        let lastSentState;

        // on, hex, bri, hue, sat, duration
        const onInput = msg => {
            node.serverConfig.yeelight.sync().then(state => {
                msg.payload = sanitizeState(state);
                // only send message if new information or if requested by input
                if (
                    JSON.stringify(msg.payload) !== JSON.stringify(lastSentState) ||
                    Object.keys(msg).length > 1
                ) {
                    node.send(msg);
                    lastSentState = msg.payload;
                }
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
            node.serverConfig.yeelight.on('props', message => {
                if (message.flowing === undefined || Object.keys(message).length > 1) {
                    onInput({});
                }
            });
        })();
    };
}
