import YeeLightNodeState from './src/YeeLightNodeState';

module.exports = RED => {
    RED.nodes.registerType('yeelight-compat-hue-state', YeeLightNodeState(RED));
};
