import Yeelight from 'yeelight2';

module.exports = RED => {
    function YeeLightNode(config) {
        const node = this;

        const onInput = msg => {
            console.log(msg);
            const { on, hex, bri, hue, sat, duration } = msg.payload;

            if (typeof on !== 'undefined') {
                node.yeelight.set_power(on, null, duration);
            }
            if (typeof bri !== 'undefined') {
                node.yeelight.set_bright(bri, null, duration);
            }
            if (typeof hue !== 'undefined' || typeof sat !== 'undefined') {
                node.yeelight.set_hsv(hue, sat, null, duration);
            }
            if (typeof hex !== 'undefined') {
                const _hex = parseInt('0x' + hex.replace('#', ''), 16);
                console.log('_hex', _hex);
                node.yeelight.set_rgb(_hex, null, duration);
            }
            console.log(on, bri, hue, sat);
        };

        (function init() {
            RED.nodes.createNode(node, config);
            node.yeelight = new Yeelight('yeelight://192.168.1.142:55443');
            node.on('input', onInput);
        })();
    }

    RED.nodes.registerType('yeelight-compat-hue', YeeLightNode);
};
