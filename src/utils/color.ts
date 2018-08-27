export function transformColorToRgba(color: string, opacity = 1) {
    const c = color.replace(/\s/g, '').toLowerCase();
    if (/^#([0-9abcdef]{3,})$/.test(c)) { //#ffffff
        const rgba: number[] = [];
        let hex = RegExp.$1;

        if (hex.length === 3) { // 处理 "#abc" 成 "#aabbcc"
            hex = hex.replace(/(.)/g, '$1$1');
        }

        hex.replace(/../g, (color) => {
            rgba.push(parseInt(color, 16));

            return color;
        });
        rgba.push(opacity);

        return `rgba(${rgba.join(',')})`;
    } else if (/^rgb\(\d+,\d+,\d+\)$/.test(c)) {
        return c.split('').splice(-1, 0, `,${opacity}`).join('');
    }

    return color;
}
