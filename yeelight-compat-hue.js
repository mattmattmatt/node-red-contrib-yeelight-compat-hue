console.log('hello from yeelight');

export default RED => {
    function YeeLightNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function(msg) {
            msg.payload = msg.payload.toLowerCase();
            node.send(msg);
        });
    }
    RED.nodes.registerType('yeelight-compat-hue', YeeLightNode);
};
