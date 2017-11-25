import YeeLightNodeOut from './YeeLightNodeOut';
import YeeLightNodeState from './YeeLightNodeState';
import YeeLightConfig from './YeeLightConfig';

module.exports = RED => {
    RED.nodes.registerType('yeelight-compat-hue', YeeLightNodeOut(RED));
    RED.nodes.registerType('yeelight-compat-hue-config', YeeLightConfig(RED));
    RED.nodes.registerType('yeelight-compat-hue-state', YeeLightNodeState(RED));
};
