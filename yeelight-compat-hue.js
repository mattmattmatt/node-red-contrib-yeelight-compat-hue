module.exports = RED => {
    function YeeLightNode(config) {
        const node = this;

        const onInput = msg => {
            console.log(msg);
            node.send(msg);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.on('input', onInput);
        })();
    }

    RED.nodes.registerType('yeelight-compat-hue', YeeLightNode);
};
