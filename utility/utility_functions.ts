export function toFullWidth(s: string): string {
    let resultCharCodes: number[] = []
    for (let i = 0; i < s.length; i++) {
        let cc = s.charCodeAt(i)
        if ((cc >= 33) && (cc <= 126)) resultCharCodes.push(cc + 65281 - 33)
        else resultCharCodes.push(cc)
    }
    return String.fromCharCode(...resultCharCodes)
}
export function toHalfWidth(s: string): string {
    let resultCharCodes: number[] = []
    for (let i = 0; i < s.length; i++) {
        let cc = s.charCodeAt(i)
        if ((cc >= 65281) && (cc <= 65374)) resultCharCodes.push(cc - 65281 + 33)
        else resultCharCodes.push(cc)
    }
    return String.fromCharCode(...resultCharCodes)
}