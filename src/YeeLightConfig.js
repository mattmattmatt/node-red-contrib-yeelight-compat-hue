export default function YeeLightConfig(RED) {
    return function(config) {
        const node = this;

        (function init() {
            RED.nodes.createNode(node, config);
            node.hostname = config.hostname;
            node.port = config.port;
        })();
    };
}
