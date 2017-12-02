// https://www.yeelight.com/download/Yeelight_Inter-Operation_Spec.pdf

import Yeelight from 'yeelight2';

import { rgbIntToHex, colorTemperatureToRGB, sanitizeState } from './utils';

export default function YeeLightNodeState(RED) {
    return function(config) {
        const node = this;
        let reconnectionTimeout;

        // on, hex, bri, hue, sat, duration
        const onInput = msg => {
            node.yeelight.sync().then(state => {
                msg.payload = sanitizeState(state);
                node.send(msg);
            });
        };

        const onConnected = () => {
            console.log('connected');
            clearTimeout(reconnectionTimeout);
            node.status({ fill: 'green', shape: 'dot', text: 'Connected' });
        };

        const onDisconnected = () => {
            console.log('disconnected');
            // node.status({ fill: 'red', shape: 'ring', text: 'Disconnected' });
        };

        const onYeelightError = error => {
            console.error('error happened', error);
            reconnectionTimeout = setTimeout(startConnection, 5000);
            node.status({ fill: 'red', shape: 'ring', text: `Connection error: ${error.code}` });
        };

        const startConnection = () => {
            console.log(
                'connecting to yeelight...',
                node.serverConfig.hostname,
                node.serverConfig.port
            );
            node.status({ fill: 'yellow', shape: 'ring', text: 'Connecting...' });
            node.yeelight = new Yeelight(
                `yeelight://${node.serverConfig.hostname}:${node.serverConfig.port}`
            );
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
            node.on('close', () => {
                console.log('closing');
                clearTimeout(reconnectionTimeout);
                node.yeelight.exit();
            });
        })();
    };
}
