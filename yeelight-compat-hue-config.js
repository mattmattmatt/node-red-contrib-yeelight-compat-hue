import YeeLightConfig from './src/YeeLightConfig';

module.exports = RED => {
    RED.nodes.registerType('yeelight-compat-hue-config', YeeLightConfig(RED));
};
