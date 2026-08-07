import { resolve } from "path"
import { readdirSync, readFileSync, statSync } from "fs"
import { pluginDir } from "../system/const"
import { Type } from "./types"
import { readFile } from "fs/promises"

export type CsvFile = {
    readonly path: string
    readonly name: string
    readonly lastUpdate: Date
}
export type CsvField = {
    name: string
    type: CsvFieldType
    nullable: boolean
    length: number | undefined
    enumDefinition?: Record<string, number | string>
}
enum CsvFieldType {
    integer, number, boolean, range, date, string, nullableString, bin, json, enum, flags
}
export type CsvTable = {
    readonly cacheKey: symbol
    readonly maxColumns: number
    readonly rows: number
    readonly data: string[][]
}

function parseCsvField(name: string, csvField: string): CsvField {
    const match = csvField.trim().toLowerCase().match(/^((?<type>number|num|n|integer|int|i|bool|boolean|bin)(?<length>(\[\d*\]|\(\d*\))?)|(?<noLengthType>str|string|str|string|range|date|datetime|t|time|json))(?<nullable>\??)$/)
    if (!match || !match.groups) {
        if (csvField.includes("|")) {
            const isFlags = csvField.startsWith("<") && csvField.endsWith(">")
            if (isFlags) csvField = csvField.substring(1, csvField.length - 1)
            const enumEls = csvField.replace("?", "").split("|")
            let currentValue = isFlags ? 1 : 0
            const enumDefinition: Record<string, number | string> = {}
            for (const enumEl of enumEls) {
                const elParts = enumEl.split("=")
                if (elParts.length === 1) enumDefinition[enumEl] = currentValue
                else {
                    const value = JSON.parse(elParts[1])
                    if (typeof value === "number") {
                        enumDefinition[elParts[0]] = value
                        currentValue = value
                    } else if (typeof value === "string") {
                        enumDefinition[elParts[0]] = value
                    } else {
                        enumDefinition[elParts[0]] = currentValue
                    }
                }
                if (isFlags) currentValue <<= 1
                else currentValue++
            }
            return { name, type: isFlags ? CsvFieldType.flags : CsvFieldType.enum, nullable: csvField.endsWith("?"), length: -1, enumDefinition }
        }
        throw new Error(`cannot parse field "${csvField}"`)
    }
    let type = match.groups.type
    const lengthStr = match.groups.length && match.groups.length.length >= 2 ? match.groups.length.slice(1, match.groups.length.length - 1).trim() : undefined
    let length = lengthStr == undefined ? undefined : lengthStr.length === 0 ? -1 : parseInt(lengthStr)
    const nullable = match.groups.nullable === "?"
    if (type) switch (type) {
        case "integer": case "int": case "i": return { name, type: CsvFieldType.integer, nullable, length }
        case "number": case "num": case "n": return { name, type: CsvFieldType.number, nullable, length }
        case "boolean": case "bool": return { name, type: CsvFieldType.boolean, nullable, length }
        case "bin": return { name, type: CsvFieldType.bin, nullable, length }
    }
    type = match.groups.noLengthType
    if (type) switch (type) {
        case "date": case "datetime": case "time": case "t": return { name, type: CsvFieldType.date, nullable, length }
        case "range": return { name, type: CsvFieldType.range, nullable, length: -1 }
        case "string": case "str": return { name, type: CsvFieldType.string, nullable, length: -1 }
        case "nullableString": case "string?": case "str?": return { name, type: CsvFieldType.nullableString, nullable, length: -1 }
        case "json": return { name, type: CsvFieldType.json, nullable, length: -1 }
    }
    throw new Error(`cannot recognize field "${csvField}"(${name})`)
}
function parseCsvValue(value: string, field: CsvField): any {
    if (field.nullable && (value === "" || !value)) return undefined
    switch (field.type) {
        case CsvFieldType.bin:
            const buf = Buffer.alloc(field.length == undefined || field.length < 0 ? 1 : field.length, 0)
            if (value.startsWith("0x")) { // hex
                let o = 3
                if ((value.length & 1) === 1) {
                    o = 2
                }
                for (; o < value.length; o += 2) {
                    if (o === 2) buf.writeUInt8(parseInt(value.charAt(2), 16))
                    else buf.writeUInt8(parseInt(value.substring(o, o + 2), 16))
                }
            } if (value.startsWith("base64:")) { // base64
                const a = btoa(value.substring(7))
                const buf = Buffer.alloc(a.length)
                for (let o = 0; o < a.length; o++) buf.writeUInt8(a.charCodeAt(o))
            }
            return buf
        case CsvFieldType.boolean: {
            if (field.length == undefined) return value !== "0" && value !== "" && value.toLowerCase() !== "false"
            const trimmed = value.trim()
            if (field.length < 0 && trimmed.length === 0) return []
            const parts = trimmed.length === 0 ? [] : value.split(",")
            if (field.length < 0) return parts.map(v => v !== "0" && v !== "" && v.toLowerCase() !== "false")
            const array = new Array(field.length)
            for (let i = 0; i < array.length; i++) array[i] = parts.length > i ? parts[i] !== "0" && parts[i] !== "" && parts[i].toLowerCase() !== "false" : false
            return array
        }
        case CsvFieldType.integer: {
            if (field.length == undefined) return parseInt(value)
            const trimmed = value.trim()
            if (field.length < 0 && trimmed.length === 0) return []
            const parts = trimmed.length === 0 ? [] : value.split(",")
            if (field.length < 0) return parts.map(parseInt)
            const array = new Array(field.length)
            for (let i = 0; i < array.length; i++) array[i] = parts.length > i ? parseInt(parts[i]) : 0
            return array
        }
        case CsvFieldType.number: {
            if (field.length == undefined) return parseFloat(value)
            const trimmed = value.trim()
            if (field.length < 0 && trimmed.length === 0) return []
            const parts = trimmed.length === 0 ? [] : value.split(",")
            if (field.length < 0) return parts.map(parseFloat)
            const array = new Array(field.length < 0 ? 1 : field.length)
            for (let i = 0; i < array.length; i++) array[i] = parts.length > i ? parseFloat(parts[i]) : 0
            return array
        }
        case CsvFieldType.date: return new Date(Date.parse(value))
        case CsvFieldType.range: {
            if (!value) return 0
            const parts = value.split("-").map(parseFloat).slice(0, 2) as [number, number] | [number] | []
            if (parts.length === 1) return parts[0]
            return parts
        }
        case CsvFieldType.string: return value == undefined ? "" : value
        case CsvFieldType.json: return value == undefined || value === "" ? undefined : JSON.parse(value)
        case CsvFieldType.enum: return field.enumDefinition?.[value]
        case CsvFieldType.flags: {
            if (!value) return 0
            const parts = value.split("|")
            let result = 0
            for (const p of parts) {
                const v = field.enumDefinition?.[p]
                if (v != undefined && typeof v === "number") result |= v
            }
            return result
        }
        default: throw new Error(`not registered type ${field.type}`)
    }
}

export function enumerateCsvFiles(baseDir: string): CsvFile[] {
    while (baseDir.endsWith("/") || baseDir.endsWith("\\")) baseDir = baseDir.substring(0, baseDir.length - 1)
    const result: CsvFile[] = []
    const dirs: string[] = [baseDir]
    while (dirs.length > 0) {
        const dir = dirs.pop()!
        for (const name of readdirSync(dir)) {
            const path = `${dir}/${name}`
            const stat = statSync(path)
            if (stat.isDirectory()) {
                dirs.push(path)
                continue
            }
            if (name.endsWith(".csv")) {
                result.push({ path, name: path.substring(baseDir.length + 1), lastUpdate: stat.mtime })
            }
        }
    }
    return result
}

function readCsvCore(text: string): CsvTable {
    let maxColumns = 0
    let rows = 0
    const data: string[][] = []

    let rowData: string[] = []
    let currentCell: string[] = []
    let quoted = false
    let quotedquoted = false
    let notAllowedToAppend = false

    let lastCharacter = ""

    const finishCell = () => {
        rowData.push(currentCell.join(""))
        currentCell.splice(0, currentCell.length)
    }
    const finishRow = () => {
        rows++
        maxColumns = Math.max(maxColumns, rowData.length)
        data.push(rowData)
        rowData = []
    }

    for (let i = 0; i < text.length; i++) {
        const c = text.charAt(i)
        if (quotedquoted) {
            quotedquoted = false
            switch (c) {
                case "\"":
                    currentCell.push("\"")
                    break
                case ",":
                    quoted = false
                    finishCell()
                    notAllowedToAppend = false
                    break
                case "\n":
                case "\r":
                    quoted = false
                    finishCell()
                    finishRow()
                    notAllowedToAppend = false
                    break
                default:
                    quoted = false
                    finishCell()
                    notAllowedToAppend = true
                    break
            }
        } else if (quoted) {
            switch (c) {
                case "\"":
                    quotedquoted = true
                    break
                default:
                    currentCell.push(c)
                    break
            }
        } else {
            switch (c) {
                case "\"":
                    if (notAllowedToAppend) break
                    if (currentCell.length === 0) quoted = true
                    else currentCell.push(c)
                    break
                case ",":
                    finishCell()
                    notAllowedToAppend = false
                    break
                case "\n":
                case "\r":
                    if (lastCharacter === "\n" || lastCharacter === "\r") break
                    finishCell()
                    finishRow()
                    notAllowedToAppend = false
                    break
                default:
                    if (!notAllowedToAppend) currentCell.push(c)
                    break
            }
        }
        lastCharacter = c
    }
    if (currentCell.length !== 0) finishCell()
    if (rowData.length !== 0) finishRow()
    return { cacheKey: Symbol(), maxColumns, rows, data }
}

async function readCsvAsync(path: string): Promise<CsvTable> {
    return readCsvCore(await readFile(path, "utf8"))
}
function readCsvSync(path: string): CsvTable {
    return readCsvCore(readFileSync(path, "utf8"))
}

const dataCache: Record<symbol, any[][]> = {}
const fieldCache: Record<symbol, CsvField[]> = {}
function createRow<T extends object>(row: any[], fields: CsvField[], type?: Type<T>): Readonly<T> {
    const result = type ? new type() : {} as T
    for (let i = 0; i < fields.length; i++) result[fields[i].name] = row[i]
    return result
}
function createCsvRows<T extends object>(csvTable: CsvTable, type?: Type<T>): Readonly<T>[] {
    const fields: CsvField[] = fieldCache[csvTable.cacheKey] ?? csvTable.data[2].map((f, i) => parseCsvField(csvTable.data[0][i], f))
    fieldCache[csvTable.cacheKey] = fields
    const data: any[] = dataCache[csvTable.cacheKey] ?? csvTable.data.slice(3).map(r => r.map((c, i) => fields[i] ? parseCsvValue(c, fields[i]) : undefined))
    dataCache[csvTable.cacheKey] = data
    return data.map(r => createRow(r, fields, type))
}
export async function loadCsvAsync<T extends object>(name: string, type?: Type<T>): Promise<Readonly<T>[]> {
    let hasError = false
    try {
        const csv = await readCsvAsync(resolve(pluginDir, `data/contents/${name}.csv`))
        // return createCsvIndexer(csv, type)
        return createCsvRows(csv, type)
    } catch (ex) {
        hasError = true
        throw ex
    } finally {
        if (hasError) console.log(`csv table name: ${name}`)
    }
}
export function loadCsv<T extends object>(name: string, type?: Type<T>): Readonly<T>[] {
    let hasError = false
    try {
        const csv = readCsvSync(resolve(pluginDir, `data/contents/${name}.csv`))
        // return createCsvIndexer(csv, type)
        return createCsvRows(csv, type)
    } catch (ex) {
        hasError = true
        throw ex
    } finally {
        if (hasError) console.log(`csv table name: ${name}`)
    }
}