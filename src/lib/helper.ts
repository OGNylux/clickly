export function formatNumber(num: number) {
    let str = num.toString();
    let result = '';
    let count = 0;

    for (let i = str.length - 1; i >= 0; i--) {
        if (count > 0 && count % 3 === 0) {
            result = '.' + result;
        }
        result = str.charAt(i) + result;
        count++;
    }

    return result;
}