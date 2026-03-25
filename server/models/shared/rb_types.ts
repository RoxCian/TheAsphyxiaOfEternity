export * from "../rb6/types"

export type RbVersion = 1 | 2 | 3 | 4 | 5 | 6
export type RbVersionLiteral = "rb" | "limelight" | "colette" | "groovin" | "volzza" | "reflesia"
export type RbVersionWithClasscheck = 4 | 5 | 6
export enum Rb1ChartType {
    basic, medium, hard,
}
export enum Rb4ChartType {
    basic, medium, hard, special
}
export enum Rb6ChartType {
    basic, medium, hard, whiteHard
}
export type RbChartType<T extends RbVersion> = T extends 6 ? Rb6ChartType : T extends 4 | 5 ? Rb4ChartType : Rb1ChartType

export enum Rb1ClearType {
    none, failed, clear, fullCombo
}
export enum Rb2ClearType {
    none, failed, clear = 3, fullCombo
}
export enum Rb3ClearType {
    none, battleFailed /* TODO: Should check in game **/, failed, clear, fullCombo
}
export enum Rb4ClearType {
    none, failed, hardFailed, sHardFailed, clear = 9, hardClear = 10, sHardClear = 11
}
export enum Rb6ClearType {
    none, failed, hardFailed, clear, hardClear
}
export type RbClearType<T extends RbVersion> = T extends 6 ? Rb6ClearType : T extends 4 | 5 ? Rb4ClearType : T extends 3 ? Rb3ClearType : T extends 2 ? Rb2ClearType : Rb1ClearType

export enum Rb1ClearTypeLiteral {
    none = "", failed = "f", clear = "c", fullCombo = "fc"
}
export enum Rb3ClearTypeLiteral {
    none = "", failed = "f", clear = "c", miss2 = "2miss", miss1 = "1miss", fullCombo = "fc"
}
export enum Rb4ClearTypeLiteral {
    none = "", failed = "f", clear = "c", hardClear = "hc", sHardClear = "shc", fullCombo = "fc"
}
export enum Rb6ClearTypeLiteral {
    none = "", failed = "f", clear = "c", hardClear = "hc", fullCombo = "fc", excellent = "exc"
}
export type RbClearTypeLiteral<T extends RbVersion> = T extends 6 ? Rb6ClearTypeLiteral : T extends 4 | 5 ? Rb4ClearTypeLiteral : T extends 3 ? Rb3ClearTypeLiteral : Rb1ClearTypeLiteral

export enum Rb4DojoIndex {
    none = -1, kyu5, kyu4, kyu3, kyu2, kyu1, dan1, dan2, dan3, dan4, dan5, dan6, dan7, dan8, shihandai, shihan, meiyoshihan, saikoshihan, examination
}
export enum Rb5ClasscheckIndex {
    none = -1, class10, class9, class8, class7, class6, class5, class4, class3, class2, class1, class0, kiwami, class13, class12, class11
}
export enum Rb6ClasscheckIndex {
    none = -1, class13, class12, class11, class10, class9, class8, class7, class6, class5, class4, class3, class2, class1, class0, kiwami
}
export type RbClasscheckIndex<T extends RbVersionWithClasscheck> = T extends 4 ? Rb4DojoIndex : T extends 5 ? Rb5ClasscheckIndex : Rb6ClasscheckIndex

export enum RbClasscheckClearType {
    none, failed, clear
}

export enum RbColor {
    none = -1, red, blue
}
export enum RbBywordSide {
    none = -1, left, right
}
export enum RbColorSpecification {
    random, red, blue
}
export enum RbBywordRarity {
    none = -1, bronze, silver, gold, platinum
}

export type RbByword = {
    version: RbVersion
    side: RbColor
    id: number
    byword: string
    bywordOriginal: string
    rarity: RbBywordRarity
}

export type RbChartInfo<TVersion extends RbVersion, TChart extends RbChartType<TVersion>> = {
    version: TVersion
    musicId: number
    chartType: TChart
    level: number
    skillRate: number
    maxCombo: number
    maxKeepCount: number
    maxJustReflec: number
    chartVersion: RbVersion
}

export type RbMusicId<TVersion extends RbVersion> = {
    version: TVersion
    musicId: number
    musicUid: string
}

export type Range = number | [number, number]

export type RbMusicInfo = {
    musicUid: string
    title: string
    artist: string
    isRenewal: boolean
    bpm: Range,
    category: string
}

export type RbMusicVariation<TVersion extends RbVersion, TChart extends RbChartType<TVersion>> = {
    version: TVersion
    musicId: number
    chartType: TChart
    title?: string
    artist?: string
    bpm: Range
}

export type RbComment<TVersion extends RbVersion> = {
    version: TVersion
    entryId: number
    userId: number
    name: string
    balloon: RbCommentBalloon
    time: number
    comment: string
}

export enum RbCommentBalloon {
    default, rounded, rectangle, cloud, exploded
}