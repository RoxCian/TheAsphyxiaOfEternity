import { InputSignal, InputSignalWithTransform, WritableSignal, linkedSignal } from "@angular/core"

type SizeUnit =
    "px" | "cm" | "mm" | "in" | "Q" | "pc" | "pt" |
    "em" | "rem" | "lh" | "rlh" | "cap" | "rcap" | "ex" | "rex" | "ic" | "ric" |
    "vh" | "vw" | "vmax" | "vmin" | "vb" | "vi" |
    "cqw" | "cqh" | "cqmax" | "cqmin" | "cqb" | "cqi" |
    "%"
export type numeric = `${number}` | number
export type numericNullable = `${number}` | number | undefined | null | ""
export type toggle = "" | "true" | "false" | undefined | null | boolean
export type size = number | `${number}${SizeUnit}`

export const toggleTransform = (v: toggle) => v != undefined && v !== false && v !== "false"
export const sizeTransform = (v: size) => typeof v === "number" ? `${v}px` as const : v
export const numericTransform = (v: numeric) => typeof v === "number" ? v : v ? parseFloat(v) : 0
export const numericNullableTransform = (v: numericNullable) => typeof v === "number" ? v : v ? parseFloat(v) : undefined

export type ToggleSignal = WritableSignal<boolean> & {
    toggle(): void
}
export function linkedToggle(input: InputSignal<boolean> | InputSignalWithTransform<boolean, any>): ToggleSignal {
    const result = linkedSignal(input) as ToggleSignal
    result.toggle = () => result.update(value => !value)
    return result
}
