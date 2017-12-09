import convert from 'color-convert';

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0;
        padString = String(padString || ' ');
        if (this.length > targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length);
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

export function rgbIntToHex(number) {
    return (
        '#' +
        (number >>> 0)
            .toString(16)
            .slice(-6)
            .padStart(6, '0')
    );
}

export function colorTemperatureToRGB(kelvin) {
    var temp = kelvin / 100;
    var red, green, blue;

    if (temp <= 66) {
        red = 255;
        green = temp;
        green = 99.4708025861 * Math.log(green) - 161.1195681661;

        if (temp <= 19) {
            blue = 0;
        } else {
            blue = temp - 10;
            blue = 138.5177312231 * Math.log(blue) - 305.0447927307;
        }
    } else {
        red = temp - 60;
        red = 329.698727446 * Math.pow(red, -0.1332047592);

        green = temp - 60;
        green = 288.1221695283 * Math.pow(green, -0.0755148492);

        blue = 255;
    }

    return {
        r: clamp(red, 0, 255),
        g: clamp(green, 0, 255),
        b: clamp(blue, 0, 255),
    };
}

function clamp(x, min, max) {
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }

    return x;
}

export function hexToRgbInt(hex) {
    return parseInt('0x' + hex.replace('#', ''), 16);
}

export function normalize(value, currentMax = 100, newMax = 255) {
    return Math.round(parseInt(value, 10) / currentMax * newMax);
}

export function sanitizeState(state) {
    const { bright, power, name, color_mode } = state;
    const colorModeMap = {
        1: 'rgb',
        2: 'ct',
        3: 'hs',
    };
    let result = {
        state: {
            on: state.power !== 'off',
            bri: normalize(bright),
            colormode: colorModeMap[color_mode],
        },
        name,
        raw: state,
    };
    if (state.color_mode === '1') {
        const hex = rgbIntToHex(state.rgb);
        result.state = {
            ...result.state,
            hex,
            hue: normalize(convert.hex.hsv(hex)[0], 359, 65535),
            sat: normalize(convert.hex.hsv(hex)[1]),
        };
    } else if (state.color_mode === '2') {
        const { r: red, g: green, b: blue } = colorTemperatureToRGB(state.ct);
        result.state = {
            ...result.state,
            ct: parseInt(state.ct, 10),
            hex: '#' + convert.rgb.hex(red, green, blue),
            hue: normalize(convert.rgb.hsv(red, green, blue)[0], 359, 65535),
            sat: normalize(convert.rgb.hsv(red, green, blue)[1]),
        };
    } else if (state.color_mode === '3') {
        const hex = convert.hsv.hex(state.hue, state.sat, state.bright);
        result.state = {
            ...result.state,
            hex: '#' + hex,
            hue: normalize(state.hue, 359, 65535),
            sat: normalize(state.sat),
        };
    }
    return result;
}
