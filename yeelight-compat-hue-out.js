import YeeLightNodeOut from './src/YeeLightNodeOut';

module.exports = RED => {
    RED.nodes.registerType('yeelight-compat-hue-out', YeeLightNodeOut(RED));
};
