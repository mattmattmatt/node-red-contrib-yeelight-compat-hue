import YeeLightNodeOut from './src/YeeLightNodeOut';
import YeeLightNodeState from './src/YeeLightNodeState';
import YeeLightConfig from './src/YeeLightConfig';

module.exports = RED => {
    RED.nodes.registerType('yeelight-compat-hue', YeeLightNodeOut(RED));
    RED.nodes.registerType('yeelight-compat-hue-config', YeeLightConfig(RED));
    RED.nodes.registerType('yeelight-compat-hue-state', YeeLightNodeState(RED));
};
