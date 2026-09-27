/*! NanoPop 2.4.2 MIT | https://github.com/Simonwep/nanopop */
/*! Pickr | https://github.com/Simonwep/pickr */

const VERSION = '1.9.0';

const NanoPopDefaults = {
    variantFlipOrder: {start: 'sme', middle: 'mse', end: 'ems'},
    positionFlipOrder: {top: 'tbrl', right: 'rltb', bottom: 'btrl', left: 'lrbt'},
    position: 'bottom',
    margin: 8,
    padding: 0
};

/**
 * Repositions an element once using the provided options and elements.
 * @param reference Reference element
 * @param popper Popper element
 * @param opt Optional, additional options
 */
const reposition = (reference, popper, opt) => {
    const {
        container,
        arrow,
        margin,
        padding,
        position,
        variantFlipOrder,
        positionFlipOrder
    } = {
        container: document.documentElement.getBoundingClientRect(),
        ...NanoPopDefaults,
        ...opt
    };

    // Reset position to resolve viewport
    // See https://developer.mozilla.org/en-US/docs/Web/CSS/position#fixed
    const {left: originalLeft, top: originalTop} = popper.style;
    popper.style.left = '0';
    popper.style.top = '0';

    const refBox = reference.getBoundingClientRect();
    const popBox = popper.getBoundingClientRect();

    // Holds coordinates of top, left, bottom and right alignment
    const positionStore = {
        t: refBox.top - popBox.height - margin,
        b: refBox.bottom + margin,
        r: refBox.right + margin,
        l: refBox.left - popBox.width - margin
    };

    // Holds corresponding variants (start, middle, end).
    // The values depend on horizontal / vertical orientation
    const variantStore = {
        vs: refBox.left,
        vm: refBox.left + refBox.width / 2 - popBox.width / 2,
        ve: refBox.left + refBox.width - popBox.width,
        hs: refBox.top,
        hm: refBox.bottom - refBox.height / 2 - popBox.height / 2,
        he: refBox.bottom - popBox.height
    };

    // Extract position and variant
    // Top-start -> top is "position" and "start" is the variant
    const [posKey, varKey = 'middle'] = position.split('-');
    const positions = positionFlipOrder[posKey];
    const variants = variantFlipOrder[varKey];

    // Try out all possible combinations, starting with the preferred one.
    const {top, left, bottom, right} = container;

    for (const p of positions) {
        const vertical = (p === 't' || p === 'b');

        // The position-value
        let positionVal = positionStore[p];

        // Which property has to be changed.
        const [positionKey, variantKey] = vertical ? ['top', 'left'] : ['left', 'top'];

        // box refers to the size of the popper element. Depending on the orientation this is width or height.
        // The limit is the corresponding, maximum value for this position.
        const [positionSize, variantSize] = vertical ? [popBox.height, popBox.width] : [popBox.width, popBox.height];

        const [positionMaximum, variantMaximum] = vertical ? [bottom, right] : [right, bottom];
        const [positionMinimum, variantMinimum] = vertical ? [top, left] : [left, top];

        // Skip pre-clipped values
        if (positionVal < positionMinimum || (positionVal + positionSize + padding) > positionMaximum) {
            continue;
        }

        for (const v of variants) {

            // The position-value, the related size value of the popper and the limit
            let variantVal = variantStore[(vertical ? 'v' : 'h') + v];

            if (variantVal < variantMinimum || (variantVal + variantSize + padding) > variantMaximum) {
                continue;
            }

            // Subtract popBox's initial position
            variantVal -= popBox[variantKey];
            positionVal -= popBox[positionKey];

            // Apply styles and normalize viewport
            popper.style[variantKey] = `${variantVal}px`;
            popper.style[positionKey] = `${positionVal}px`;

            if (arrow) {
                // Calculate refBox's center offset from its variant position for arrow positioning
                const refBoxCenterOffset = vertical ? refBox.width / 2 : refBox.height / 2;
                const popBoxCenterOffset = variantSize / 2;

                // Check if refBox is larger than popBox
                const isRefBoxLarger = refBoxCenterOffset > popBoxCenterOffset;

                // Holds corresponding offset variants (start, middle, end) of arrow from the popper variant values.
                // When refBox is larger than popBox, have the arrow's variant position be the center of popBox instead.
                const arrowVariantStore = {
                    s: isRefBoxLarger ? popBoxCenterOffset : refBoxCenterOffset,
                    m: popBoxCenterOffset,
                    e: isRefBoxLarger ? popBoxCenterOffset : variantSize - refBoxCenterOffset
                };

                // Holds offsets of top, left, bottom and right alignment of arrow from the popper position values.
                const arrowPositionStore = {
                    t: positionSize,
                    b: 0,
                    r: 0,
                    l: positionSize
                };

                const arrowVariantVal = variantVal + arrowVariantStore[v];
                const arrowPositionVal = positionVal + arrowPositionStore[p];

                // Apply styles to arrow
                arrow.style[variantKey] = `${arrowVariantVal}px`;
                arrow.style[positionKey] = `${arrowPositionVal}px`;
            }

            return p + v;
        }
    }

    // Revert style values (won't work with styled-elements or similar systems)
    // "Fix" for https://github.com/Simonwep/nanopop/issues/7
    popper.style.left = originalLeft;
    popper.style.top = originalTop;

    return null;
};

/**
 * Creates a stateful popper.
 * You can either...
 * ... pass an options object: createPopper(<options>)
 * ... pass both the reference and popper: create(<ref>, <el>, <?options>)
 * ... pass nothing, in this case you'll have to set at least both a reference and a popper in update.
 *
 * @param reference | options Reference element or options
 * @param popper Popper element
 * @param options Optional additional options
 */
const createPopper = (reference, popper, options) => {

    // Resolve options
    const baseOptions = typeof reference === 'object' && !(reference instanceof HTMLElement) ?
        reference : {reference, popper, ...options};

    return {

        /**
         * Repositions the current popper.
         * @param options Optional options which get merged with the current ones.
         */
        update(options = baseOptions) {
            const {reference, popper} = Object.assign(baseOptions, options);

            if (!popper || !reference) {
                throw new Error('Popper- or reference-element missing.');
            }

            return reposition(reference, popper, baseOptions);
        }
    };
};

function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) {
        events = [events];
    }

    for (const el of elements) {
        for (const ev of events) {
            el[method](ev, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
const off = eventListener.bind(null, 'removeEventListener');

/**
 * Creates an DOM-Element out of a string (Single element).
 * @param html HTML representing a single element
 * @returns {Element | null} The element.
 */
function createElementFromString(html) {
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstElementChild;
}

/**
 * Creates a new html element, every element which has
 * a ':ref' attribute will be saved in a object (which will be returned)
 * where the value of ':ref' is the object-key and the value the HTMLElement.
 *
 * It's possible to create a hierarchy if you add a ':obj' attribute. Every
 * sibling will be added to the object which will get the name from the 'data-con' attribute.
 *
 * If you want to create an Array out of multiple elements, you can use the ':arr' attribute,
 * the value defines the key and all elements, which has the same parent and the same 'data-arr' attribute,
 * would be added to it.
 *
 * @param str - The HTML String.
 */
function createFromTemplate(str) {

    // Removes an attribute from a HTMLElement and returns the value.
    const removeAttribute = (el, name) => {
        const value = el.getAttribute(name);
        el.removeAttribute(name);
        return value;
    };

    // Recursive function to resolve template
    const resolve = (element, base = {}) => {

        // Check key and container attribute
        const con = removeAttribute(element, ':obj');
        const key = removeAttribute(element, ':ref');
        const subtree = con ? (base[con] = {}) : base;

        // Check and save element
        key && (base[key] = element);
        for (const child of Array.from(element.children)) {
            const arr = removeAttribute(child, ':arr');
            const sub = resolve(child, arr ? {} : subtree);

            if (arr) {

                // Check if there is already an array and add element
                (subtree[arr] || (subtree[arr] = []))
                    .push(Object.keys(sub).length ? sub : child);
            }
        }

        return base;
    };

    return resolve(createElementFromString(str));
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) {
        return path;
    }

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while ((el = el.parentElement)) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}

/**
 * Resolves a HTMLElement by query.
 * @param val
 * @returns {null|Document|Element}
 */
function resolveElement(val) {
    if (val instanceof Element) {
        return val;
    } else if (typeof val === 'string') {
        return val.split(/>>/g).reduce((pv, cv, ci, a) => {
            pv = pv.querySelector(cv);
            return ci < a.length - 1 ? pv.shadowRoot : pv;
        }, document);
    }

    return null;
}

/**
 * Creates the ability to change numbers in an input field with the scroll-wheel.
 * @param el
 * @param mapper
 */
function adjustableInputNumbers(el, mapper = v => v) {

    function handleScroll(e) {
        const inc = ([0.001, 0.01, 0.1])[Number(e.shiftKey || e.ctrlKey * 2)] * (e.deltaY < 0 ? 1 : -1);

        let index = 0;
        let off = el.selectionStart;
        el.value = el.value.replace(/[\d.]+/g, (v, i) => {

            // Check if number is in cursor range and increase it
            if (i <= off && i + v.length >= off) {
                off = i;
                return mapper(Number(v), inc, index);
            }

            index++;
            return v;
        });

        el.focus();
        el.setSelectionRange(off, off);

        // Prevent default and trigger input event
        e.preventDefault();
        el.dispatchEvent(new Event('input'));
    }

    // Bind events
    on(el, 'focus', () => on(window, 'wheel', handleScroll, {passive: false}));
    on(el, 'blur', () => off(window, 'wheel', handleScroll));
}

const Utils = {on, off, createElementFromString, createFromTemplate, eventPath, resolveElement, adjustableInputNumbers};

// Shorthands
const {min, max, floor, round} = Math;

/**
 * Tries to convert a color name to rgb/a hex representation
 * @param name
 * @returns {string | CanvasGradient | CanvasPattern}
 */
function standardizeColor(name) {

    // Since invalid colors will be parsed as black, filter them out
    if (name.toLowerCase() === 'black') {
        return '#000';
    }

    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = name;
    return /^#0{3,6}$/.test(ctx.fillStyle) ? null : ctx.fillStyle;
}

/**
 * Convert HSV spectrum to RGB.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} Array with rgb values.
 */
function hsvToRgb(h, s, v) {
    h = (h / 360) * 6;
    s /= 100;
    v /= 100;

    const i = floor(h);

    const f = h - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    const mod = i % 6;
    const r = [v, q, p, p, t, v][mod];
    const g = [t, v, v, q, p, p][mod];
    const b = [p, p, t, v, v, q][mod];

    return [
        r * 255,
        g * 255,
        b * 255
    ];
}

/**
 * Convert HSV spectrum to Hex.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {string[]} Hex values
 */
function hsvToHex(h, s, v) {
    return hsvToRgb(h, s, v).map(v =>
        round(v).toString(16).padStart(2, '0')
    );
}

/**
 * Convert HSV spectrum to CMYK.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} CMYK values
 */
function hsvToCmyk(h, s, v) {
    const rgb = hsvToRgb(h, s, v);
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const k = min(1 - r, 1 - g, 1 - b);
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k);
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k);
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k);

    return [
        c * 100,
        m * 100,
        y * 100,
        k * 100
    ];
}

/**
 * Convert HSV spectrum to HSL.
 * @param h Hue
 * @param s Saturation
 * @param v Value
 * @returns {number[]} HSL values
 */
function hsvToHsl(h, s, v) {
    s /= 100;
    v /= 100;

    const l = (2 - s) * v / 2;

    if (l !== 0) {
        if (l === 1) {
            s = 0;
        } else if (l < 0.5) {
            s = s * v / (l * 2);
        } else {
            s = s * v / (2 - l * 2);
        }
    }

    return [
        h,
        s * 100,
        l * 100
    ];
}

/**
 * Convert RGB to HSV.
 * @param r Red
 * @param g Green
 * @param b Blue
 * @return {number[]} HSV values.
 */
function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const minVal = min(r, g, b);
    const maxVal = max(r, g, b);
    const delta = maxVal - minVal;

    let h, s;
    const v = maxVal;
    if (delta === 0) {
        h = s = 0;
    } else {
        s = delta / maxVal;
        const dr = (((maxVal - r) / 6) + (delta / 2)) / delta;
        const dg = (((maxVal - g) / 6) + (delta / 2)) / delta;
        const db = (((maxVal - b) / 6) + (delta / 2)) / delta;

        if (r === maxVal) {
            h = db - dg;
        } else if (g === maxVal) {
            h = (1 / 3) + dr - db;
        } else if (b === maxVal) {
            h = (2 / 3) + dg - dr;
        }

        if (h < 0) {
            h += 1;
        } else if (h > 1) {
            h -= 1;
        }
    }

    return [
        h * 360,
        s * 100,
        v * 100
    ];
}

/**
 * Convert CMYK to HSV.
 * @param c Cyan
 * @param m Magenta
 * @param y Yellow
 * @param k Key (Black)
 * @return {number[]} HSV values.
 */
function cmykToHsv(c, m, y, k) {
    c /= 100;
    m /= 100;
    y /= 100;
    k /= 100;

    const r = (1 - min(1, c * (1 - k) + k)) * 255;
    const g = (1 - min(1, m * (1 - k) + k)) * 255;
    const b = (1 - min(1, y * (1 - k) + k)) * 255;

    return [...rgbToHsv(r, g, b)];
}

/**
 * Convert HSL to HSV.
 * @param h Hue
 * @param s Saturation
 * @param l Lightness
 * @return {number[]} HSV values.
 */
function hslToHsv(h, s, l) {
    s /= 100;
    l /= 100;
    s *= l < 0.5 ? l : 1 - l;

    const ns = (2 * s / (l + s)) * 100;
    const v = (l + s) * 100;
    return [h, isNaN(ns) ? 0 : ns, v];
}

/**
 * Convert HEX to HSV.
 * @param hex Hexadecimal string of rgb colors, can have length 3 or 6.
 * @return {number[]} HSV values.
 */
function hexToHsv(hex) {
    return rgbToHsv(...hex.match(/.{2}/g).map(v => parseInt(v, 16)));
}

/**
 * Tries to parse a string which represents a color to a HSV array.
 * Current supported types are cmyk, rgba, hsla and hexadecimal.
 * @param str
 * @return {*}
 */
function parseToHSVA(str) {

    // Check if string is a color-name
    str = str.match(/^[a-zA-Z]+$/) ? standardizeColor(str) || str : str;

    // Regular expressions to match different types of color representation
    const regex = {
        cmyk: /^cmyk\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)/i,
        rgba: /^rgba?\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D+([\d.]+)(%?)\D*?(([\d.]+)(%?)|$)/i,
        hsla: /^hsla?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,
        hsva: /^hsva?\D+([\d.]+)\D+([\d.]+)\D+([\d.]+)\D*?(([\d.]+)(%?)|$)/i,
        hexa: /^#?(([\dA-Fa-f]{3,4})|([\dA-Fa-f]{6})|([\dA-Fa-f]{8}))$/i
    };

    /**
     * Takes an Array of any type, convert strings which represents
     * a number to a number an anything else to undefined.
     * @param array
     * @return {*}
     */
    const numerize = array => array.map(v => /^(|\d+)\.\d+|\d+$/.test(v) ? Number(v) : undefined);

    let match;
    invalid: for (const type in regex) {

        // Check if current scheme passed
        if (!(match = regex[type].exec(str))) {
            continue;
        }

        // Try to convert
        switch (type) {
            case 'cmyk': {
                const [, c, m, y, k] = numerize(match);

                if (c > 100 || m > 100 || y > 100 || k > 100) {
                    break invalid;
                }

                return {values: cmykToHsv(c, m, y, k), type};
            }
            case 'rgba': {
                let [, r, , g, , b, , , a] = numerize(match);

                r = match[2] === '%' ? (r / 100) * 255 : r;
                g = match[4] === '%' ? (g / 100) * 255 : g;
                b = match[6] === '%' ? (b / 100) * 255 : b;
                a = match[9] === '%' ? (a / 100) : a;

                if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1) {
                    break invalid;
                }

                return {values: [...rgbToHsv(r, g, b), a], a, type};
            }
            case 'hexa': {
                let [, hex] = match;

                if (hex.length === 4 || hex.length === 3) {
                    hex = hex.split('').map(v => v + v).join('');
                }

                const raw = hex.substring(0, 6);
                let a = hex.substring(6);

                // Convert 0 - 255 to 0 - 1 for opacity
                a = a ? (parseInt(a, 16) / 255) : undefined;

                return {values: [...hexToHsv(raw), a], a, type};
            }
            case 'hsla': {
                let [, h, s, l, , a] = numerize(match);
                a = match[6] === '%' ? (a / 100) : a;

                if (h > 360 || s > 100 || l > 100 || a < 0 || a > 1) {
                    break invalid;
                }

                return {values: [...hslToHsv(h, s, l), a], a, type};
            }
            case 'hsva': {
                let [, h, s, v, , a] = numerize(match);
                a = match[6] === '%' ? (a / 100) : a;

                if (h > 360 || s > 100 || v > 100 || a < 0 || a > 1) {
                    break invalid;
                }

                return {values: [h, s, v, a], a, type};
            }
        }
    }

    return {values: null, type: null};
}

/**
 * Simple class which holds the properties
 * of the color representation model hsla (hue saturation lightness alpha)
 */
function HSVaColor(h = 0, s = 0, v = 0, a = 1) {
    const mapper = (original, next) => (precision = -1) => {
        return next(~precision ? original.map(v => Number(v.toFixed(precision))) : original);
    };

    const that = {
        h, s, v, a,

        toHSVA() {
            const hsva = [that.h, that.s, that.v, that.a];
            hsva.toString = mapper(hsva, arr => `hsva(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsva;
        },

        toHSLA() {
            const hsla = [...hsvToHsl(that.h, that.s, that.v), that.a];
            hsla.toString = mapper(hsla, arr => `hsla(${arr[0]}, ${arr[1]}%, ${arr[2]}%, ${that.a})`);
            return hsla;
        },

        toRGBA() {
            const rgba = [...hsvToRgb(that.h, that.s, that.v), that.a];
            rgba.toString = mapper(rgba, arr => `rgba(${arr[0]}, ${arr[1]}, ${arr[2]}, ${that.a})`);
            return rgba;
        },

        toCMYK() {
            const cmyk = hsvToCmyk(that.h, that.s, that.v);
            cmyk.toString = mapper(cmyk, arr => `cmyk(${arr[0]}%, ${arr[1]}%, ${arr[2]}%, ${arr[3]}%)`);
            return cmyk;
        },

        toHEXA() {
            const hex = hsvToHex(that.h, that.s, that.v);

            // Check if alpha channel make sense, convert it to 255 number space, convert
            // To hex and pad it with zeros if needed.
            const alpha = that.a >= 1 ? '' : Number((that.a * 255).toFixed(0))
                .toString(16)
                .toUpperCase().padStart(2, '0');

            alpha && hex.push(alpha);
            hex.toString = () => `#${hex.join('').toUpperCase()}`;
            return hex;
        },

        clone: () => HSVaColor(that.h, that.s, that.v, that.a)
    };

    return that;
}

const clamp = v => Math.max(Math.min(v, 1), 0);
function Moveable(opt) {

    const that = {

        // Assign default values
        options: Object.assign({
            lock: null,
            onchange: () => 0,
            onstop: () => 0
        }, opt),

        _keyboard(e) {
            const {options} = that;
            const {type, key} = e;

            // Check to see if the Movable is focused and then move it based on arrow key inputs
            // For improved accessibility
            if (document.activeElement === options.wrapper) {
                const {lock} = that.options;
                const up = key === 'ArrowUp';
                const right = key === 'ArrowRight';
                const down = key === 'ArrowDown';
                const left = key === 'ArrowLeft';

                if (type === 'keydown' && (up || right || down || left)) {
                    let xm, ym = 0;

                    if (lock === 'v') {
                        xm = (up || right) ? 1 : -1;
                    } else if (lock === 'h') {
                        xm = (up || right) ? -1 : 1;
                    } else {
                        ym = up ? -1 : (down ? 1 : 0);
                        xm = left ? -1 : (right ? 1 : 0);
                    }

                    that.update(
                        clamp(that.cache.x + (0.01 * xm)),
                        clamp(that.cache.y + (0.01 * ym))
                    );
                    e.preventDefault();
                } else if (key.startsWith('Arrow')) {
                    that.options.onstop();
                    e.preventDefault();
                }
            }
        },

        _tapstart(evt) {
            on(document, ['mouseup', 'touchend', 'touchcancel'], that._tapstop);
            on(document, ['mousemove', 'touchmove'], that._tapmove);

            if (evt.cancelable) {
                evt.preventDefault();
            }

            // Trigger
            that._tapmove(evt);
        },

        _tapmove(evt) {
            const {options, cache} = that;
            const {lock, element, wrapper} = options;
            const b = wrapper.getBoundingClientRect();

            let x = 0, y = 0;
            if (evt) {
                const touch = evt && evt.touches && evt.touches[0];
                x = evt ? (touch || evt).clientX : 0;
                y = evt ? (touch || evt).clientY : 0;

                // Reset to bounds
                if (x < b.left) {
                    x = b.left;
                } else if (x > b.left + b.width) {
                    x = b.left + b.width;
                }
                if (y < b.top) {
                    y = b.top;
                } else if (y > b.top + b.height) {
                    y = b.top + b.height;
                }

                // Normalize
                x -= b.left;
                y -= b.top;
            } else if (cache) {
                x = cache.x * b.width;
                y = cache.y * b.height;
            }

            if (lock !== 'h') {
                element.style.left = `calc(${x / b.width * 100}% - ${element.offsetWidth / 2}px)`;
            }

            if (lock !== 'v') {
                element.style.top = `calc(${y / b.height * 100}% - ${element.offsetHeight / 2}px)`;
            }

            that.cache = {x: x / b.width, y: y / b.height};
            const cx = clamp(x / b.width);
            const cy = clamp(y / b.height);

            switch (lock) {
                case 'v':
                    return options.onchange(cx);
                case 'h':
                    return options.onchange(cy);
                default:
                    return options.onchange(cx, cy);
            }
        },

        _tapstop() {
            that.options.onstop();
            off(document, ['mouseup', 'touchend', 'touchcancel'], that._tapstop);
            off(document, ['mousemove', 'touchmove'], that._tapmove);
        },

        trigger() {
            that._tapmove();
        },

        update(x = 0, y = 0) {
            const {left, top, width, height} = that.options.wrapper.getBoundingClientRect();

            if (that.options.lock === 'h') {
                y = x;
            }

            that._tapmove({
                clientX: left + width * x,
                clientY: top + height * y
            });
        },

        destroy() {
            const {options, _tapstart, _keyboard} = that;
            off(document, ['keydown', 'keyup'], _keyboard);
            off([options.wrapper, options.element], 'mousedown', _tapstart);
            off([options.wrapper, options.element], 'touchstart', _tapstart, {
                passive: false
            });
        }
    };

    // Initialize
    const {options, _tapstart, _keyboard} = that;
    on([options.wrapper, options.element], 'mousedown', _tapstart);
    on([options.wrapper, options.element], 'touchstart', _tapstart, {
        passive: false
    });

    on(document, ['keydown', 'keyup'], _keyboard);

    return that;
}

function Selectable(opt = {}) {
    opt = Object.assign({
        onchange: () => 0,
        className: '',
        elements: []
    }, opt);

    const onTap = on(opt.elements, 'click', evt => {
        opt.elements.forEach(e =>
            e.classList[evt.target === e ? 'add' : 'remove'](opt.className)
        );

        opt.onchange(evt);

        // Fix for https://github.com/Simonwep/pickr/issues/243
        evt.stopPropagation();
    });

    return {
        destroy: () => off(...onTap)
    };
}

const buildPickr = instance => {

    const {
        components,
        useAsButton,
        inline,
        appClass,
        theme,
        lockOpacity
    } = instance.options;

    // Utils
    const hidden = con => con ? '' : 'style="display:none" hidden';
    const t = str => instance._t(str);

    const root = createFromTemplate(`
      <div :ref="root" class="pickr">

        ${useAsButton ? '' : '<button type="button" :ref="button" class="pcr-button"></button>'}

        <div :ref="app" class="pcr-app ${appClass || ''}" data-theme="${theme}" ${inline ? 'style="position: unset"' : ''} aria-label="${t('ui:dialog', 'color picker dialog')}" role="window">
          <div class="pcr-selection" ${hidden(components.palette)}>
            <div :obj="preview" class="pcr-color-preview" ${hidden(components.preview)}>
              <button type="button" :ref="lastColor" class="pcr-last-color" aria-label="${t('btn:last-color')}"></button>
              <div :ref="currentColor" class="pcr-current-color"></div>
            </div>

            <div :obj="palette" class="pcr-color-palette">
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="palette" class="pcr-palette" tabindex="0" aria-label="${t('aria:palette')}" role="listbox"></div>
            </div>

            <div :obj="hue" class="pcr-color-chooser" ${hidden(components.hue)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-hue pcr-slider" tabindex="0" aria-label="${t('aria:hue')}" role="slider"></div>
            </div>

            <div :obj="opacity" class="pcr-color-opacity" ${hidden(components.opacity)}>
              <div :ref="picker" class="pcr-picker"></div>
              <div :ref="slider" class="pcr-opacity pcr-slider" tabindex="0" aria-label="${t('aria:opacity', 'opacity selection slider')}" role="slider"></div>
            </div>
          </div>

          <div class="pcr-swatches ${components.palette ? '' : 'pcr-last'}" :ref="swatches"></div>

          <div :obj="interaction" class="pcr-interaction" ${hidden(Object.keys(components.interaction).length)}>
            <input :ref="result" class="pcr-result" type="text" spellcheck="false" ${hidden(components.interaction.input)} aria-label="${t('aria:input', 'color input field')}">

            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HEXA" value="${lockOpacity ? 'HEX' : 'HEXA'}" type="button" ${hidden(components.interaction.hex)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="RGBA" value="${lockOpacity ? 'RGB' : 'RGBA'}" type="button" ${hidden(components.interaction.rgba)}>
            <input :ref="typeToggle" class="pcr-type pcr-toggle" value="RGB" type="button" ${hidden(components.interaction.hex && components.interaction.rgba)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HSLA" value="${lockOpacity ? 'HSL' : 'HSLA'}" type="button" ${hidden(components.interaction.hsla)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="HSVA" value="${lockOpacity ? 'HSV' : 'HSVA'}" type="button" ${hidden(components.interaction.hsva)}>
            <input :arr="options" class="pcr-type pcr-hidden-type" data-type="CMYK" value="CMYK" type="button" ${hidden(components.interaction.cmyk)}>

            <input :ref="eyedropper" class="pcr-eyedropper" value="EYE DROPPER" type="button" ${typeof EyeDropper === 'undefined' ? 'style="display:none" hidden' : ''}>

            <input :ref="save" class="pcr-save" value="${t('btn:save')}" type="button" ${hidden(components.interaction.save)} aria-label="${t('aria:btn:save')}">
            <input :ref="cancel" class="pcr-cancel" value="${t('btn:cancel')}" type="button" ${hidden(components.interaction.cancel)} aria-label="${t('aria:btn:cancel')}">
            <input :ref="clear" class="pcr-clear" value="${t('btn:clear')}" type="button" ${hidden(components.interaction.clear)} aria-label="${t('aria:btn:clear')}">
          </div>
        </div>
      </div>
    `);

    const int = root.interaction;

    // Select option which is not hidden
    int.options.find(o => !o.hidden && !o.classList.add('active'));

    // Append method to find currently active option
    int.type = () => int.options.find(e => e.classList.contains('active'));
    return root;
};

const PICKR_MONOLITH_CSS = `
.pickr {
  position: relative;
  overflow: visible;
  transform: translateY(0);
}
.pickr * {
  box-sizing: border-box;
  outline: none;
  border: none;
  -webkit-appearance: none;
}

.pickr .pcr-button {
  position: relative;
  height: 2em;
  width: 2em;
  padding: 0.5em;
  cursor: pointer;
  font-family: system-ui,-apple-system,Segoe UI,sans-serif;
  border-radius: 8px;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" stroke="%2342445A" stroke-width="5px" stroke-linecap="round"><path d="M45,45L5,5"></path><path d="M45,5L5,45"></path></svg>') no-repeat center;
  background-size: 0;
  transition: all 0.3s;
}
.pickr .pcr-button::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 0.5em;
  border-radius: 8px;
  z-index: initial;
}
.pickr .pcr-button::after {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transition: background 0.3s;
  background: var(--pcr-color);
  border-radius: 8px;
}
.pickr .pcr-button.clear {
  background-size: 70%;
}
.pickr .pcr-button.clear::before {
  opacity: 0;
}
.pickr .pcr-button.clear:focus {
  box-shadow: 0 0 0 1px rgba(255,255,255,.85), 0 0 0 3px var(--pcr-color);
}
.pickr .pcr-button.disabled {
  cursor: not-allowed;
}

.pickr input:focus,
.pickr button:focus,
.pcr-app input:focus,
.pcr-app button:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pickr .pcr-palette,
.pickr .pcr-slider,
.pcr-app .pcr-palette,
.pcr-app .pcr-slider {
  transition: box-shadow 0.3s;
}
.pickr .pcr-palette:focus,
.pickr .pcr-slider:focus,
.pcr-app .pcr-palette:focus,
.pcr-app .pcr-slider:focus {
  box-shadow: 0 0 0 1px rgba(255,255,255,.85), 0 0 0 3px rgba(0,0,0,.25);
}

.pcr-app {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 10000;
  border-radius: 12px;
  background: #1c1b22;
  border: 1px solid #302f38;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0s 0.3s;
  font-family: system-ui,-apple-system,Segoe UI,sans-serif;
  box-shadow: 0 20px 60px rgba(0,0,0,.45);
  left: 0;
  top: 0;
}
.pcr-app.visible {
  transition: opacity 0.3s;
  visibility: visible;
  opacity: 1;
}
.pcr-app .pcr-swatches {
  display: flex;
  flex-wrap: wrap;
  margin-top: 0.75em;
}
.pcr-app .pcr-swatches.pcr-last {
  margin: 0;
}
@supports (display: grid) {
  .pcr-app .pcr-swatches {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(auto-fit, 1.75em);
  }
}
.pcr-app .pcr-swatches > button {
  font-size: 1em;
  position: relative;
  width: calc(1.75em - 5px);
  height: calc(1.75em - 5px);
  border-radius: 6px;
  cursor: pointer;
  margin: 2.5px;
  flex-shrink: 0;
  justify-self: center;
  transition: all 0.15s;
  overflow: hidden;
  background: transparent;
  z-index: 1;
  border: 1px solid #3f3f47;
}
.pcr-app .pcr-swatches > button::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--pcr-color);
  border-radius: 5px;
  box-sizing: border-box;
}
.pcr-app .pcr-swatches > button:hover {
  filter: brightness(1.1);
  border-color: color-mix(in srgb, var(--accent) 50%, #3f3f47);
}
.pcr-app .pcr-swatches > button.pcr-active {
  border-color: var(--accent);
}
.pcr-app .pcr-swatches > button.pcr-recent::before {
  content: "";
  position: absolute;
  top: 2px;
  right: 2px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent);
  z-index: 2;
  box-shadow: 0 0 0 1px rgba(0,0,0,.4);
}
.pcr-app .pcr-interaction {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5em;
  margin-top: 0.75em;
}
.pcr-app .pcr-interaction > * {
  margin: 0;
  min-width: 0;
}
.pcr-app .pcr-interaction .pcr-result {
  grid-column: 1 / 3;
  grid-row: 1;
}
.pcr-app .pcr-interaction .pcr-toggle {
  grid-column: 3;
  grid-row: 1;
}
.pcr-app .pcr-interaction .pcr-eyedropper {
  grid-column: 1 / -1;
  grid-row: 2;
}
.pcr-app .pcr-interaction .pcr-save {
  grid-column: 1;
  grid-row: 3;
}
.pcr-app .pcr-interaction .pcr-cancel {
  grid-column: 2;
  grid-row: 3;
}
.pcr-app .pcr-interaction .pcr-clear {
  grid-column: 3;
  grid-row: 3;
}
.pcr-app .pcr-interaction input {
  letter-spacing: 0.07em;
  font-size: 0.75em;
  text-align: center;
  cursor: pointer;
  color: #a1a1aa;
  background: #18181b;
  border: 1px solid #3f3f47;
  border-radius: 8px;
  transition: all 0.15s;
  padding: 0.45em 0.5em;
}
.pcr-app .pcr-interaction input:hover {
  filter: brightness(1.15);
}
.pcr-app .pcr-interaction input:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pcr-app .pcr-interaction .pcr-eyedropper {
  font-weight: 500;
  letter-spacing: 0.08em;
}
.pcr-app .pcr-interaction .pcr-result {
  color: #f4f4f5;
  text-align: left;
  transition: all 0.2s;
  border-radius: 8px;
  background: #18181b;
  cursor: text;
  width: 100%;
}
.pcr-app .pcr-interaction .pcr-result::selection {
  background: var(--accent);
  color: #fff;
}
.pcr-app .pcr-interaction .pcr-type.active {
  color: #fff;
  background: #3f3f47;
  border-color: #3f3f47;
}
.pcr-app .pcr-interaction .pcr-type.pcr-hidden-type {
  display: none !important;
}
.pcr-app .pcr-interaction .pcr-save,
.pcr-app .pcr-interaction .pcr-cancel,
.pcr-app .pcr-interaction .pcr-clear {
  width: 100%;
  color: #a1a1aa;
  background: transparent;
  border: 1px solid #3f3f47;
  font-weight: 500;
  letter-spacing: 0;
}
.pcr-app .pcr-interaction .pcr-save:hover,
.pcr-app .pcr-interaction .pcr-cancel:hover,
.pcr-app .pcr-interaction .pcr-clear:hover {
  filter: none;
  color: #f4f4f5;
  border-color: color-mix(in srgb, #f4f4f5 40%, transparent);
  background: color-mix(in srgb, #f4f4f5 6%, transparent);
}
.pcr-app .pcr-interaction .pcr-save {
  color: var(--accent);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}
.pcr-app .pcr-interaction .pcr-save:hover {
  color: var(--accent);
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
}
.pcr-app .pcr-interaction .pcr-clear:focus,
.pcr-app .pcr-interaction .pcr-cancel:focus,
.pcr-app .pcr-interaction .pcr-save:focus {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 70%, transparent);
}
.pcr-app .pcr-selection .pcr-picker {
  position: absolute;
  height: 18px;
  width: 18px;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
}
.pcr-app .pcr-selection .pcr-color-palette,
.pcr-app .pcr-selection .pcr-color-chooser,
.pcr-app .pcr-selection .pcr-color-opacity {
  position: relative;
  user-select: none;
  display: flex;
  flex-direction: column;
  cursor: grab;
}
.pcr-app .pcr-selection .pcr-color-palette:active,
.pcr-app .pcr-selection .pcr-color-chooser:active,
.pcr-app .pcr-selection .pcr-color-opacity:active {
  cursor: grabbing;
}

.pcr-app[data-theme=monolith] {
  width: 14.25em;
  max-width: 95vw;
  padding: 0.8em;
}
.pcr-app[data-theme=monolith] .pcr-selection {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 1em;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 0.5em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview::before {
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 0.5em;
  border-radius: 0.15em;
  z-index: -1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-last-color {
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  border-radius: 0.15em 0 0 0.15em;
  z-index: 2;
  padding: 0;
  margin: 0;
  border: none;
  outline: none;
  font: inherit;
  color: inherit;
  -webkit-appearance: none;
  appearance: none;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-current-color {
  border-radius: 0 0.15em 0.15em 0;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-last-color,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-preview .pcr-current-color {
  background: var(--pcr-color);
  width: 50%;
  height: 100%;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-palette {
  width: 100%;
  height: 8em;
  z-index: 1;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-palette .pcr-palette {
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity {
  height: 0.5em;
  margin-top: 0.75em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-picker,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-picker {
  top: 50%;
  transform: translateY(-50%);
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-slider,
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-slider {
  flex-grow: 1;
  border-radius: 50em;
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-chooser .pcr-slider {
  background: linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(0,100%,50%));
}
.pcr-app[data-theme=monolith] .pcr-selection .pcr-color-opacity .pcr-slider {
  background: linear-gradient(to right, transparent, black), url('data:image/svg+xml;utf8, <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2 2"><path fill="white" d="M1,0H2V1H1V0ZM0,1H1V2H0V1Z"/><path fill="gray" d="M0,0H1V1H0V0ZM1,1H2V2H1V1Z"/></svg>');
  background-size: 100%, 0.25em;
}
`;

let pickrStylesInjected = false;

function injectPickrStyles() {
    if (pickrStylesInjected) {
        return;
    }
    pickrStylesInjected = true;
    const style = document.createElement('style');
    style.id = 'pcr-monolith-styles';
    style.textContent = PICKR_MONOLITH_CSS;
    document.head.appendChild(style);
}

injectPickrStyles();

export default class Pickr {

    // Expose pickr utils
    static utils = Utils;

    // Assign version and export
    static version = VERSION;

    // Default strings
    static I18N_DEFAULTS = {

        // Strings visible in the UI
        'ui:dialog': 'color picker dialog',
        'btn:toggle': 'toggle color picker dialog',
        'btn:swatch': 'color swatch',
        'btn:last-color': 'use previous color',
        'btn:save': 'Save',
        'btn:cancel': 'Cancel',
        'btn:clear': 'Reset',

        // Strings used for aria-labels
        'aria:btn:save': 'save and close',
        'aria:btn:cancel': 'cancel and close',
        'aria:btn:clear': 'clear and close',
        'aria:input': 'color input field',
        'aria:palette': 'color selection area',
        'aria:hue': 'hue selection slider',
        'aria:opacity': 'selection slider'
    };

    // Default options
    static DEFAULT_OPTIONS = {
        appClass: null,
        theme: 'classic',
        useAsButton: false,
        padding: 8,
        disabled: false,
        comparison: true,
        closeOnScroll: false,
        outputPrecision: 0,
        lockOpacity: false,
        autoReposition: true,
        container: 'body',

        components: {
            interaction: {}
        },

        i18n: {},
        swatches: null,
        inline: false,
        sliders: null,

        default: '#42445a',
        defaultRepresentation: null,
        position: 'bottom-middle',
        adjustableNumbers: true,
        showAlways: false,

        recentColors: {
            enabled: true,
            max: 3,
            key: 'anoxle-pcr-recent'
        },

        closeWithKey: 'Escape'
    };

    // Will be used to prevent specific actions during initialization
    _initializingActive = true;

    // If the current color value should be recalculated
    _recalc = true;

    // Positioning engine and DOM-Tree
    _nanopop = null;
    _root = null;

    // Current and last color for comparison
    _color = HSVaColor();
    _lastColor = HSVaColor();
    // Snapshot of the color at the moment the picker was opened, used by Cancel / Reset
    _originalColor = null;
    _swatchColors = [];
    _recentCount = 0;

    // Animation frame used for setup.
    // Will be cancelled in case of destruction.
    _setupAnimationFrame = null;

    // UI Components
    _components = null;

    // Evenlistener name: [callbacks]
    _eventBindings = [];
    _eventListener = {
        init: [],
        save: [],
        hide: [],
        show: [],
        clear: [],
        change: [],
        changestop: [],
        cancel: [],
        swatchselect: []
    };

    constructor(opt) {

        // Assign default values
        this.options = opt = Object.assign({...Pickr.DEFAULT_OPTIONS}, opt);

        const {swatches, components, theme, sliders, lockOpacity, padding, recentColors} = opt;

        if (['nano', 'monolith'].includes(theme) && !sliders) {
            opt.sliders = 'h';
        }

        // Check interaction section
        if (!components.interaction) {
            components.interaction = {};
        }

        // Overwrite palette if preview, opacity or hue are true
        const {preview, opacity, hue, palette} = components;
        components.opacity = (!lockOpacity && opacity);
        components.palette = palette || preview || opacity || hue;

        // Initialize picker
        this._preBuild();
        this._buildComponents();
        this._bindEvents();
        this._finalBuild();

        if (recentColors && recentColors.enabled) {
            this._loadRecentColors().slice().reverse().forEach(hex => this.addSwatch(hex, true));
        }

        // Append pre-defined swatch colors
        if (swatches && swatches.length) {
            swatches.forEach(color => this.addSwatch(color));
        }

        // Initialize positioning engine
        const {button, app} = this._root;
        this._nanopop = createPopper(button, app, {
            margin: padding
        });

        // Initialize accessibility
        button.setAttribute('role', 'button');
        button.setAttribute('aria-label', this._t('btn:toggle'));

        // Initialization is finished, pickr is visible and ready for usage
        const that = this;
        this._setupAnimationFrame = requestAnimationFrame((function cb() {

            // TODO: Performance issue due to high call-rate?
            if (!app.offsetWidth) {
                return requestAnimationFrame(cb);
            }

            // Apply default color
            that.setColor(that._color?.toHSLA().toString() ?? opt.default);
            that._rePositioningPicker();

            // Initialize color representation
            if (opt.defaultRepresentation) {
                that._representation = opt.defaultRepresentation;
                that.setColorRepresentation(that._representation);
            }

            // Show pickr if locked
            if (opt.showAlways) {
                that.show();
            }

            // Initialization is done - pickr is usable, fire init event
            that._initializingActive = false;
            that._emit('init');
        }));
    }

    // Create instance via method
    static create = options => new Pickr(options);

    // Does only the absolutely basic thing to initialize the components
    _preBuild() {
        const {options} = this;

        // Resolve elements
        for (const type of ['el', 'container']) {
            options[type] = resolveElement(options[type]);
        }

        // Create element and append it to body to
        // Prevent initialization errors
        this._root = buildPickr(this);

        // Check if a custom button is used
        if (options.useAsButton) {
            this._root.button = options.el; // Replace button with customized button
        }

        options.container.appendChild(this._root.root);
    }

    _finalBuild() {
        const opt = this.options;
        const root = this._root;

        // Remove from body
        opt.container.removeChild(root.root);

        if (opt.inline) {
            const parent = opt.el.parentElement;

            if (opt.el.nextSibling) {
                parent.insertBefore(root.app, opt.el.nextSibling);
            } else {
                parent.appendChild(root.app);
            }
        } else {
            opt.container.appendChild(root.app);
        }

        // Don't replace the element if a custom button is used
        if (!opt.useAsButton) {

            // Replace element with actual color-picker
            opt.el.parentNode.replaceChild(root.root, opt.el);
        } else if (opt.inline) {
            opt.el.remove();
        }

        // Check if it should be immediately disabled
        if (opt.disabled) {
            this.disable();
        }

        // Check if color comparison is disabled, if yes - remove transitions so everything keeps smoothly
        if (!opt.comparison) {
            root.button.style.transition = 'none';

            if (!opt.useAsButton) {
                root.preview.lastColor.style.transition = 'none';
            }
        }

        this.hide();
    }

    _buildComponents() {

        // Instance reference
        const inst = this;
        const cs = this.options.components;
        const sliders = (inst.options.sliders || 'v').repeat(2);
        const [so, sh] = sliders.match(/^[vh]+$/g) ? sliders : [];

        // Re-assign if null
        const getColor = () =>
            this._color || (this._color = this._lastColor.clone());

        const components = {

            palette: Moveable({
                element: inst._root.palette.picker,
                wrapper: inst._root.palette.palette,

                onstop: () => inst._emit('changestop', 'slider', inst),
                onchange(x, y) {
                    if (!cs.palette) {
                        return;
                    }

                    const color = getColor();
                    const {_root, options} = inst;
                    const {lastColor, currentColor} = _root.preview;

                    // Update the input field only if the user is currently not typing
                    if (inst._recalc) {

                        // Calculate saturation based on the position
                        color.s = x * 100;

                        // Calculate the value
                        color.v = 100 - y * 100;

                        // Prevent falling under zero
                        color.v < 0 ? color.v = 0 : 0;
                        inst._updateOutput('slider');
                    }

                    // Set picker and gradient color
                    const cssRGBaString = color.toRGBA().toString(0);
                    this.element.style.background = cssRGBaString;
                    this.wrapper.style.background = `
                        linear-gradient(to top, rgba(0, 0, 0, ${color.a}), transparent),
                        linear-gradient(to left, hsla(${color.h}, 100%, 50%, ${color.a}), rgba(255, 255, 255, ${color.a}))
                    `;

                    // Check if color is locked
                    if (!options.comparison) {
                        _root.button.style.setProperty('--pcr-color', cssRGBaString);

                        // If the user changes the color, remove the cleared icon
                        _root.button.classList.remove('clear');
                    } else if (!options.useAsButton && !inst._lastColor) {

                        // Apply color to both the last and current color since the current state is cleared
                        lastColor.style.setProperty('--pcr-color', cssRGBaString);
                    }

                    // Check if there's a swatch which color matches the current one
                    const hexa = color.toHEXA().toString();
                    for (const {el, color} of inst._swatchColors) {
                        el.classList[hexa === color.toHEXA().toString() ? 'add' : 'remove']('pcr-active');
                    }

                    // Change current color
                    currentColor.style.setProperty('--pcr-color', cssRGBaString);
                }
            }),

            hue: Moveable({
                lock: sh === 'v' ? 'h' : 'v',
                element: inst._root.hue.picker,
                wrapper: inst._root.hue.slider,

                onstop: () => inst._emit('changestop', 'slider', inst),
                onchange(v) {
                    if (!cs.hue || !cs.palette) {
                        return;
                    }

                    const color = getColor();

                    // Calculate hue
                    if (inst._recalc) {
                        color.h = v * 360;
                    }

                    // Update color
                    this.element.style.backgroundColor = `hsl(${color.h}, 100%, 50%)`;
                    components.palette.trigger();
                }
            }),

            opacity: Moveable({
                lock: so === 'v' ? 'h' : 'v',
                element: inst._root.opacity.picker,
                wrapper: inst._root.opacity.slider,

                onstop: () => inst._emit('changestop', 'slider', inst),
                onchange(v) {
                    if (!cs.opacity || !cs.palette) {
                        return;
                    }

                    const color = getColor();

                    // Calculate opacity
                    if (inst._recalc) {
                        color.a = Math.round(v * 1e2) / 100;
                    }

                    // Update color
                    this.element.style.background = `rgba(0, 0, 0, ${color.a})`;
                    components.palette.trigger();
                }
            }),

            selectable: Selectable({
                elements: inst._root.interaction.options,
                className: 'active',

                onchange(e) {
                    inst._representation = e.target.getAttribute('data-type').toUpperCase();
                    inst._recalc && inst._updateOutput('swatch');
                    inst._updateToggleLabel();
                }
            })
        };

        this._components = components;
    }

    _bindEvents() {
        const {_root, options} = this;

        const eventBindings = [

            // Reset: restore the color the picker had when it was opened and close
            on(_root.interaction.clear, 'click', () => {
                if (this._originalColor) {
                    this.setHSVA(...this._originalColor.toHSVA(), true);
                    this.applyColor();
                }
                if (!options.showAlways) {
                    this.hide();
                }
            }),

            // Click the preview's "last color" chip: apply the previously saved color
            on(_root.preview.lastColor, 'click', () => {
                this.setHSVA(...(this._lastColor || this._color).toHSVA(), true);
                if (!this._initializingActive) {
                    this._emit('change', this._color, 'lastColor', this);
                    this._emit('changestop', 'lastColor', this);
                }
            }),

            // Cancel: revert to the color the picker had when it was opened, then close
            on(_root.interaction.cancel, 'click', () => {
                if (this._originalColor) {
                    this.setHSVA(...this._originalColor.toHSVA(), true);
                }
                if (!this._initializingActive) {
                    this._emit('change', this._color, 'cancel', this);
                    this._emit('changestop', 'cancel', this);
                }
                this._emit('cancel');
                if (!options.showAlways) {
                    this.hide();
                }
            }),

            // Save color
            on(_root.interaction.save, 'click', () => {
                !this.applyColor() && !options.showAlways && this.hide();
            }),

            // User input
            on(_root.interaction.result, ['keyup', 'input'], e => {

                // Fire listener if initialization is finished and changed color was valid
                if (this.setColor(e.target.value, true) && !this._initializingActive) {
                    this._emit('change', this._color, 'input', this);
                    this._emit('changestop', 'input', this);
                }

                e.stopImmediatePropagation();
            }),

            // Detect user input and disable auto-recalculation
            on(_root.interaction.result, ['focus', 'blur'], e => {
                this._recalc = e.type === 'blur';
                this._recalc && this._updateOutput(null);
            }),

            // Toggle between HEX and RGB representations
            on(_root.interaction.typeToggle, 'click', () => {
                const rep = (this._representation || '').toUpperCase();
                this.setColorRepresentation(rep.startsWith('HEX') ? 'RGBA' : 'HEXA');
            }),

            // Eye dropper: sample a color from anywhere on screen
            on(_root.interaction.eyedropper, 'click', async () => {
                try {
                    const result = await new EyeDropper().open();
                    if (result && result.sRGBHex) {
                        this.setColor(result.sRGBHex, true);
                        this.applyColor(true);
                    }
                } catch (e) {
                    // User cancelled (AbortError) or the API is unavailable — ignore
                }
            }),

            // Cancel input detection on color change
            on([
                _root.palette.palette,
                _root.palette.picker,
                _root.hue.slider,
                _root.hue.picker,
                _root.opacity.slider,
                _root.opacity.picker
            ], ['mousedown', 'touchstart'], () => {
                // Using the inputs will change the value of it
                this._root.interaction.result.blur();
                this._recalc = true
            }, {passive: true})
        ];

        // Provide hiding / showing abilities only if showAlways is false
        if (!options.showAlways) {
            const ck = options.closeWithKey;

            eventBindings.push(

                // Save and hide / show picker
                on(_root.button, 'click', () => this.isOpen() ? this.hide() : this.show()),

                // Close with escape key
                on(document, 'keyup', e => this.isOpen() && (e.key === ck || e.code === ck) && this.hide()),

                // Cancel selecting if the user taps behind the color picker
                on(document, ['touchstart', 'mousedown'], e => {
                    if (this.isOpen() && !eventPath(e).some(el => el === _root.app || el === _root.button)) {
                        this.hide();
                    }
                }, {capture: true})
            );
        }

        // Make input adjustable if enabled
        if (options.adjustableNumbers) {
            const ranges = {
                rgba: [255, 255, 255, 1],
                hsva: [360, 100, 100, 1],
                hsla: [360, 100, 100, 1],
                cmyk: [100, 100, 100, 100]
            };

            adjustableInputNumbers(_root.interaction.result, (o, step, index) => {
                const range = ranges[this.getColorRepresentation().toLowerCase()];

                if (range) {
                    const max = range[index];

                    // Calculate next reasonable number
                    const nv = o + (max >= 100 ? step * 1000 : step);

                    // Apply range of zero up to max, fix floating-point issues
                    return nv <= 0 ? 0 : Number((nv < max ? nv : max).toPrecision(3));
                }

                return o;
            });
        }

        if ((options.autoReposition || options.closeOnScroll) && !options.inline) {
            let timeout = null;
            const that = this;

            // Re-calc position on window resize, scroll and wheel
            eventBindings.push(
                on(window, ['scroll', 'resize'], () => {
                    if (that.isOpen()) {

                        if (options.closeOnScroll) {
                            that.hide();
                        }

                        if (timeout === null) {
                            timeout = setTimeout(() => timeout = null, 100);

                            // Update position on every frame
                            requestAnimationFrame(function rs() {
                                that._rePositioningPicker();
                                (timeout !== null) && requestAnimationFrame(rs);
                            });
                        } else {
                            clearTimeout(timeout);
                            timeout = setTimeout(() => timeout = null, 100);
                        }
                    }
                }, {capture: true})
            );
        }

        // Save bindings
        this._eventBindings = eventBindings;
    }

    _rePositioningPicker() {
        const {options} = this;

        // No repositioning needed if inline
        if (!options.inline) {
            const success = this._nanopop.update({
                container: document.body.getBoundingClientRect(),
                position: options.position
            });

            if (!success) {
                const el = this._root.app;
                const eb = el.getBoundingClientRect();
                el.style.top = `${(window.innerHeight - eb.height) / 2}px`;
                el.style.left = `${(window.innerWidth - eb.width) / 2}px`;
            }
        }
    }

    _updateOutput(eventSource) {
        const {_root, _color, options} = this;

        // Check if component is present
        if (_root.interaction.type()) {

            // Construct function name and call if present
            const method = `to${_root.interaction.type().getAttribute('data-type')}`;
            _root.interaction.result.value = typeof _color[method] === 'function' ?
                _color[method]().toString(options.outputPrecision) : '';
        }

        // Fire listener if initialization is finished
        if (!this._initializingActive && this._recalc) {
            this._emit('change', _color, eventSource, this);
        }
    }

    _updateToggleLabel() {
        const toggle = this._root && this._root.interaction.typeToggle;
        if (!toggle) {
            return;
        }

        const rep = (this._representation || '').toUpperCase();
        toggle.value = rep.startsWith('HEX') ? 'RGB' : 'HEX';
    }

    _clearColor(silent = false) {
        const {_root, options} = this;

        // Change only the button color if it isn't customized
        if (!options.useAsButton) {
            _root.button.style.setProperty('--pcr-color', 'rgba(0, 0, 0, 0.15)');
        }

        _root.button.classList.add('clear');

        if (!options.showAlways) {
            this.hide();
        }

        this._lastColor = null;
        if (!this._initializingActive && !silent) {

            // Fire listener
            this._emit('save', null);
            this._emit('clear');
        }
    }

    _parseLocalColor(str) {
        const {values, type, a} = parseToHSVA(str);
        const {lockOpacity} = this.options;
        const alphaMakesAChange = a !== undefined && a !== 1;

        // If no opacity is applied, add undefined at the very end which gets
        // Set to 1 in setHSVA
        if (values && values.length === 3) {
            values[3] = undefined;
        }

        return {
            values: (!values || (lockOpacity && alphaMakesAChange)) ? null : values,
            type
        };
    }

    _t(key) {
        return this.options.i18n[key] || Pickr.I18N_DEFAULTS[key];
    }

    _emit(event, ...args) {
        this._eventListener[event].forEach(cb => cb(...args, this));
    }

    on(event, cb) {
        this._eventListener[event].push(cb);
        return this;
    }

    off(event, cb) {
        const callBacks = (this._eventListener[event] || []);
        const index = callBacks.indexOf(cb);

        if (~index) {
            callBacks.splice(index, 1);
        }

        return this;
    }

    /**
     * Appends a color to the swatch palette
     * @param color
     * @param prepend
     * @returns {boolean}
     */
    addSwatch(color, prepend = false) {
        const {values} = this._parseLocalColor(color);

        if (values) {
            const {_swatchColors, _root} = this;
            const color = HSVaColor(...values);

            // Create new swatch HTMLElement
            const el = createElementFromString(
                `<button type="button" class="${prepend ? 'pcr-recent' : ''}" style="--pcr-color: ${color.toRGBA().toString(0)}" aria-label="${this._t('btn:swatch')}"/>`
            );

            if (prepend) {
                _root.swatches.insertBefore(el, _root.swatches.firstChild);
                _swatchColors.unshift({el, color});
                this._recentCount++;
            } else {
                _root.swatches.appendChild(el);
                _swatchColors.push({el, color});
            }

            // Bind event
            this._eventBindings.push(
                on(el, 'click', () => {
                    this.setHSVA(...color.toHSVA(), true);
                    this._emit('swatchselect', color);
                    this._emit('change', color, 'swatch', this);
                })
            );

            return true;
        }

        return false;
    }

    _loadRecentColors() {
        const {key, max} = this.options.recentColors || {};
        try {
            const raw = localStorage.getItem(key);
            const list = raw ? JSON.parse(raw) : [];
            return Array.isArray(list) ? list.slice(0, max) : [];
        } catch (e) {
            return [];
        }
    }

    _saveRecentColor(hex) {
        const {key, max} = this.options.recentColors || {};
        let list = this._loadRecentColors().filter(c => c.toLowerCase() !== hex.toLowerCase());
        list.unshift(hex);
        list = list.slice(0, max);

        try {
            localStorage.setItem(key, JSON.stringify(list));
        } catch (e) {}

        return list;
    }

    _refreshRecentSwatches(hex) {
        for (let i = 0; i < this._recentCount; i++) {
            const entry = this._swatchColors.shift();
            if (entry) {
                this._root.swatches.removeChild(entry.el);
            }
        }

        this._recentCount = 0;

        const updated = this._saveRecentColor(hex);
        updated.slice().reverse().forEach(c => this.addSwatch(c, true));
    }

    /**
     * Removes a swatch color by it's index
     * @param index
     * @returns {boolean}
     */
    removeSwatch(index) {
        const swatchColor = this._swatchColors[index];

        // Check swatch data
        if (swatchColor) {
            const {el} = swatchColor;

            // Remove HTML child and swatch data
            this._root.swatches.removeChild(el);
            this._swatchColors.splice(index, 1);

            if (index < this._recentCount) {
                this._recentCount--;
            }

            return true;
        }

        return false;
    }

    applyColor(silent = false) {
        const {preview, button} = this._root;

        // Change preview and current color
        const cssRGBaString = this._color.toRGBA().toString(0);
        preview.lastColor.style.setProperty('--pcr-color', cssRGBaString);

        // Change only the button color if it isn't customized
        if (!this.options.useAsButton) {
            button.style.setProperty('--pcr-color', cssRGBaString);
        }

        // User changed the color so remove the clear class
        button.classList.remove('clear');

        // Save last color
        this._lastColor = this._color.clone();

        if (!this._initializingActive && this.options.recentColors && this.options.recentColors.enabled) {
            this._refreshRecentSwatches(this._color.toHEXA().toString());
        }

        // Fire listener
        if (!this._initializingActive && !silent) {
            this._emit('save', this._color);
        }

        return this;
    }

    /**
     * Destroys all functionalities
     */
    destroy() {

        // Cancel setup-frame if set
        cancelAnimationFrame(this._setupAnimationFrame);

        // Unbind events
        this._eventBindings.forEach(args => off(...args));

        // Destroy sub-components
        if (this._components) {
            Object.keys(this._components)
                .forEach(key => this._components[key].destroy());
        }
    }

    /**
     * Destroys all functionalities and removes
     * the pickr element.
     */
    destroyAndRemove() {
        this.destroy();
        const {root, app} = this._root;

        // Remove element
        if (root.parentElement) {
            root.parentElement.removeChild(root);
        }

        // Remove .pcr-app
        app.parentElement.removeChild(app);

        // There are references to various DOM elements stored in the pickr instance
        // This cleans all of them to avoid detached DOMs
        Object.keys(this)
            .forEach(key => this[key] = null);
    }

    /**
     * Hides the color-picker ui.
     */
    hide() {
        if (this.isOpen()) {
            this._root.app.classList.remove('visible');
            this._emit('hide');
            return true;
        }

        return false;
    }

    /**
     * Shows the color-picker ui.
     */
    show() {
        if (!this.options.disabled && !this.isOpen()) {
            // Snapshot the color at the moment the picker is opened, so Cancel / Reset
            // can restore it regardless of how many times the user dragged a slider.
            this._originalColor = this._color.clone();
            this._root.app.classList.add('visible');
            this._rePositioningPicker();
            this._emit('show', this._color);
            return this;
        }

        return false;
    }

    /**
     * @return {boolean} If the color picker is currently open
     */
    isOpen() {
        return this._root.app.classList.contains('visible');
    }

    /**
     * Set a specific color.
     * @param h Hue
     * @param s Saturation
     * @param v Value
     * @param a Alpha channel (0 - 1)
     * @param silent If the button should not change the color
     * @return boolean if the color has been accepted
     */
    setHSVA(h = 360, s = 0, v = 0, a = 1, silent = false) {

        // Deactivate color calculation
        const recalc = this._recalc; // Save state
        this._recalc = false;

        // Validate input
        if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100 || a < 0 || a > 1) {
            return false;
        }

        // Override current color and re-active color calculation
        this._color = HSVaColor(h, s, v, a);

        // Update slider and palette
        if (this._components) {
            const {hue, opacity, palette} = this._components;
            hue.update((h / 360));
            opacity.update(a);
            palette.update(s / 100, 1 - (v / 100));
        }

        // Check if call is silent
        if (!silent) {
            this.applyColor();
        }

        // Update output if recalculation is enabled
        if (recalc) {
            this._updateOutput();
        }

        // Restore old state
        this._recalc = recalc;
        return true;
    }

    /**
     * Tries to parse a string which represents a color.
     * Examples: #fff
     *           rgb 10 10 200
     *           hsva 10 20 5 0.5
     * @param string
     * @param silent
     */
    setColor(string, silent = false) {

        // Check if null
        if (string === null) {
            this._clearColor(silent);
            return true;
        }

        const {values, type} = this._parseLocalColor(string);

        // Check if color is ok
        if (values) {

            // Change selected color format
            const utype = type.toUpperCase();
            const {options} = this._root.interaction;
            const target = options.find(el => el.getAttribute('data-type') === utype);

            // Auto select only if not hidden
            if (target && !target.hidden) {
                for (const el of options) {
                    el.classList[el === target ? 'add' : 'remove']('active');
                }
            }

            // Update color (fires 'save' event if silent is 'false')
            if (!this.setHSVA(...values, silent)) {
                return false;
            }

            // Update representation (fires 'change' event)
            return this.setColorRepresentation(utype);
        }

        return false;
    }

    /**
     * Changes the color _representation.
     * Allowed values are HEX, RGB, HSV, HSL and CMYK
     * @param type
     * @returns {boolean} if the selected type was valid.
     */
    setColorRepresentation(type) {

         // Force uppercase to allow a case-sensitive comparison
        type = type.toUpperCase();

        // Find button with given type and trigger click event
        return !!this._root.interaction.options
            .find(v => v.getAttribute('data-type').startsWith(type) && !v.click());
    }

    /**
     * Returns the current color representation. See setColorRepresentation
     * @returns {*}
     */
    getColorRepresentation() {
        return this._representation;
    }

    /**
     * @returns HSVaColor Current HSVaColor object.
     */
    getColor() {
        return this._color;
    }

    /**
     * Returns the currently selected color.
     * @returns {{a, toHSVA, toHEXA, s, v, h, clone, toCMYK, toHSLA, toRGBA}}
     */
    getSelectedColor() {
        return this._lastColor;
    }

    /**
     * @returns The root HTMLElement with all his components.
     */
    getRoot() {
        return this._root;
    }

    /**
     * Disable pickr
     */
    disable() {
        this.hide();
        this.options.disabled = true;
        this._root.button.classList.add('disabled');
        return this;
    }

    /**
     * Enable pickr
     */
    enable() {
        this.options.disabled = false;
        this._root.button.classList.remove('disabled');
        return this;
    }
}