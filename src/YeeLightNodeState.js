// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

import Yeelight from 'yeelight2';

import { rgbIntToHex, sanitizeState } from './utils';

export default function YeeLightNodeState(RED) {
    return function(config) {
        const node = this;
        let lastSentState;

        // on, hex, bri, hue, sat, duration
        const onInput = msg => {
            node.serverConfig.yeelight
                .sync()
                .then(state => {
                    msg.payload = sanitizeState(state);
                    // only send message if new information or if requested by input
                    if (
                        JSON.stringify(msg.payload) !== JSON.stringify(lastSentState) ||
                        Object.keys(msg).length > 1
                    ) {
                        node.send(msg);
                        lastSentState = msg.payload;
                    }
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

            node.serverConfig.yeelight.on('props', message => {
                if (message.flowing === undefined || Object.keys(message).length > 1) {
                    onInput({});
                }
            });
        })();
    };
}
