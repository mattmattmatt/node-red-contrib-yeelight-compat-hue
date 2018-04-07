import Yeelight from 'yeelight2';

const RECONNETION_INTERVAL_SECS = 5000;

export default function YeeLightConfig(RED) {
    return function(config) {
        const node = this;
        const { hostname, port } = config;
        const host = `${hostname}:${port}`;
        let reconnectionTimeout;

        const onConnected = () => {
            node.log(`Connected to ${host}`);
            clearTimeout(reconnectionTimeout);
            node.yeelight.socketState = 'connected';
        };

        const onDisconnected = () => {
            node.log(`Disconnected from ${host}`);
        };

        const onYeelightError = error => {
            console.error(`Error at ${host}`, error);
            clearTimeout(reconnectionTimeout);
            reconnectionTimeout = setTimeout(startConnection, RECONNETION_INTERVAL_SECS);
            node.yeelight.socketState = 'error';
        };

        const startConnection = () => {
            node.log(`Connecting to Yeelight ${host}`);
            node.yeelight = new Yeelight(`yeelight://${host}`);
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

                node.on('close', () => {
                    node.log('Closing connection');
                    clearTimeout(reconnectionTimeout);
                    node.yeelight.exit();
                });
            }
        })();
    };
}
