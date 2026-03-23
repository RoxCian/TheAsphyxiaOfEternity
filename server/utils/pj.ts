// Protocoled JSON library "PJ"

const protocols: { [P in string]: {
    type: { constructor: Function, prototype: any, new(): any } | ((v: any) => boolean), parse?: (text: string) => any, stringify?: (value: any) => string
} } = {
    "date": {
        type: Date,
        parse: t => new Date(t),
        stringify: (d: Date) => d.toJSON()
    },
    "bigint": {
        type: v => typeof v === "bigint",
        parse: t => BigInt(t),
        stringify: (b: bigint) => b.toString()
    }
}

function PJReviver(this: any, _: string, value: any): any {
    if (typeof value === "string" && value.startsWith("pj@") && value.includes(":")) for (let pn in protocols) if (value.startsWith(`pj@${pn}:`)) return protocols[pn].parse!(value.substring(pn.length + 4))
    return value
}
function PJReplacer(this: any, key: string, _: any, replacedValue?: any): any {
    for (let pn in protocols) {
        let p = protocols[pn]
        let value = replacedValue ?? this[key]
        const type = p.type
        if (typeof type !== "function") continue
        if (type.constructor && type.prototype && !(value instanceof type)) continue
        if ((!type.constructor || !type.prototype) && !(type as (value: any) => boolean)(value)) continue
        return `pj@${pn}:${p.stringify!(value)}`
    }
    return _
}

function getPJReviver(reviver?: (this: any, key: string, value: any) => any) {
    if (!reviver) return PJReviver
    else return function (this: any, key: string, value: any) {
        return reviver.bind(this)(key, PJReviver(key, value))
    }
}
function getPJReplacer(replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | undefined | null) {
    if (!replacer) return PJReplacer
    else return function (this: any, key: string, value: any) {
        return PJReplacer(key, value, typeof replacer === "function" ? replacer.bind(this, key, value) : replacer)
    }
}

const originalParse = JSON.parse
const originalStringify = JSON.stringify

export const PJ = {
    parse(text: string, reviver?: (this: any, key: string, value: any) => any) {
        return originalParse(text, getPJReviver(reviver))
    },
    stringify(value: any, replacer?: ((this: any, key: string, value: any) => any) | (number | string)[] | undefined | null, space?: string | number) {
        return originalStringify(value, getPJReplacer(replacer), space)
    },
    convertToPJ(value: any) {
        for (const pn in protocols) {
            const p = protocols[pn]
            const type = p.type
            if (typeof type !== "function") continue
            if (type.constructor && type.prototype && !(value instanceof type)) continue
            if ((!type.constructor || !type.prototype) && !(type as (value: any) => boolean)(value)) continue
            return `pj@${pn}:${p.stringify!(value)}`
        }
        if (typeof value !== "object") return value
        for (const k in value) value[k] = PJ.convertToPJ(value[k])
        return value
    },
    convertFromPJ(value: any) {
        if (typeof value === "string" && value.startsWith("pj@") && value.includes(":")) for (let pn in protocols) if (value.startsWith(`pj@${pn}:`)) return protocols[pn].parse!(value.substring(pn.length + 4))
        if (typeof value !== "object") return value
        for (const k in value) value[k] = PJ.convertFromPJ(value[k])
        return value
    },
    register<T>(type: any, protocol: string, parse?: (text: string) => T, stringify?: (value: T) => string) {
        if (!parse) {
            if ("parse" in type) parse = type["parse"]
            else parse = JSON.parse
        }
        if (!stringify) {
            if ("stringify" in type) stringify = type["stringify"]
            else stringify = JSON.stringify
        }
        protocols[protocol] = { type, parse, stringify }
    }
}