import { Rb4ExaminationInfo } from "../rb4/types"
import { RbByword, Rb1ChartType, Rb4ChartType, Rb6ChartType, RbChartType, RbColor, RbVersion, RbVersionWithClasscheck, RbMusicInfo, RbMusicVariation, RbChartInfo, RbClearTypeLiteral, Rb6ClasscheckIndex, Rb5ClasscheckIndex, Rb4DojoIndex, RbClasscheckIndex, RbColorSpecification } from "./rb_types"
export * from "./rb_types"

export interface RbRequest {
    rid: string
}
export interface RbPaginatedRequest extends RbRequest {
    pageOffset: number
    pageSize: number
}
export interface RbWebAppConfigResponse {
    pagingStrategy: "client" | "server"
}
export interface RbPlayerResponse {
    version: RbVersion
    name: string
    userId: number
    bywords?: {
        left: RbByword
        right: RbByword
    }
    comment?: string
    iconOrCharacter: number | undefined
    playCount: number
    class?: Rb4DojoIndex | Rb5ClasscheckIndex | Rb6ClasscheckIndex
    classAchievementRate?: number
    abilityPoint: number
    skillPoint?: number
    matchingGrade: number
    level: number
    experiences: number
    extraValues?: number[] // extra field for money or event progress
}

export interface RbMusicResponse<T extends RbVersion> {
    version: T
    musicId: number
    music: RbMusicInfo
    charts: RbChartsInfo<T>
}
export interface RbMusicRecordResponse<T extends RbVersion> extends RbMusicResponse<T> {
    scores: Partial<Record<RbChartType<T>, RbScoreResponse<T>>>
}
export type RbChartsInfo<TVersion extends RbVersion> = {
    [C in RbChartType<TVersion>]?: RbChartResponse<TVersion, C>
}
export type RbPaginatedResponse<T> = {
    pageOffset: number
    queryFinished: boolean
    data: T[]
}

export interface RbChartResponse<TVersion extends RbVersion, TChart extends RbChartType<TVersion>> extends RbChartInfo<TVersion, TChart> {
    variation?: RbMusicVariation<TVersion, TChart>
}

export interface Rb6JustCollectResponse {
    red: number
    blue: number
}
export interface Rb1BattleStatResponse {
    win: number
    draw: number
    lose: number
}

export interface RbScoreResponse<T extends RbVersion> {
    score: number
    clearType?: RbClearTypeLiteral<T>
    miss: number
    combo: number
    achievementRate: number
    playCount: number
    update?: Date
    lastPlay?: Date
    justCollectRate: T extends 6 ? Rb6JustCollectResponse : undefined
    battleStat: T extends 1 | 2 ? Rb1BattleStatResponse : undefined
    skillPoint?: T extends 5 | 6 ? number : undefined
}

export interface RbClasscheckResponse<T extends RbVersionWithClasscheck> {
    version: T
    class: RbClasscheckIndex<T>
    clearType: number
    averageAchievementRate: number
    totalScore: number
    playCount: number
    lastPlay: Date
    update: Date
    examination: T extends 4 ? (Rb4ExaminationInfo | undefined) : undefined
    score?: [RbStageLogResponse<T, RbChartType<T>>, RbStageLogResponse<T, RbChartType<T>> | undefined, RbStageLogResponse<T, RbChartType<T>> | undefined]
}

export interface RbStageLogResponse<T extends RbVersion, TChart extends RbChartType<T>> {
    version: T
    stageIndex: number
    musicId: number
    chartType: TChart
    music: RbMusicInfo
    chart: RbChartResponse<T, TChart>
    rivalUserId: number
    rivalCpuId?: number
    rivalPlayerId: number
    rivalUserName?: string
    rivalStageIndex: number
    color: RbColor
    clearType: RbClearTypeLiteral<T>
    rivalClearType: RbClearTypeLiteral<T>
    matchingGrade: number
    rivalMatchingGrade: number
    // clearGauge: number
    // rivalClearGauge: number
    achievementRate: number
    rivalAchievementRate: number
    score: number
    rivalScore: number
    justCount: number
    greatCount: number
    goodCount: number
    keepCount: T extends 6 ? number : undefined
    missCount: number
    justReflecCount: number
    combo: T extends 4 ? undefined : number
    time: Date
}

export type RbGetJacketRequest = {
    musicId: number
    chartType?: Rb1ChartType | Rb4ChartType | Rb6ChartType
}

export type RbPlayerPerformanceResponse<T extends RbVersion> = {
    activity: Record<number, number>
    totalScore: number
    totalScoreSeparated: number[]
    recentHighlightPlay: RbStageLogResponse<T, RbChartType<T>>[]
}

export type RbAvailableItemResponse = {
    typeId: number
    value: number
}
export type RbItemResponse<TVersion extends RbVersion = RbVersion> = {
    version: TVersion
    type: keyof RbSettingsResponse<TVersion>
    typeId: number
    value: number
    name: string
    nameOrig?: string
    isUnlockedByDefault: boolean
}
abstract class RbSettingsResponseBase {
    name = ""
    comment = ""
    shotSound = 0
    shotVolume = 100
    explodeEffect = 0
    frame = 0
    background = 0
    backgroundBrightness = 100
    isLobbyEnabled = true
}
abstract class Rb2SettingsResponseBase extends RbSettingsResponseBase {
    bywordLeft = 0
    bywordRight = 0
    isAutoBywordLeft = true
    isAutoBywordRight = true
}

export class Rb1SettingsResponse extends RbSettingsResponseBase {
    backgroundMusic = 0
}
export class Rb2SettingsResponse extends Rb2SettingsResponseBase {
    mainGaugeType = 0
    backgroundMusic = 0
    mylist: [number, number, number, number, number] = [-1, -1, -1, -1, -1]
}
export class Rb3SettingsResponse extends Rb2SettingsResponseBase {
    mainGaugeType = 0
    clearGaugeType = 0 // achievementRateDisplayingType
    objectSize = 0
    backgroundMusic = 0
    touchMarkerDisplayingType = 0
    mylist: number[] = []
}
export class Rb4SettingsResponse extends Rb2SettingsResponseBase {
    mainGaugeType = 0
    clearGaugeType = 0
    achievementRateDisplayingType = 0
    objectSize = 0
    sameTimeObjectsDisplayingType = 0
    backgroundMusic = 0
    touchMarkerDisplayingType = 0
    mylist: number[] = []
}
export class Rb5SettingsResponse extends Rb2SettingsResponseBase {
    highSpeed = 0
    mainGaugeType = 0
    clearGaugeType = 0
    achievementRateDisplayingType = 0
    objectSize = 0
    sameTimeObjectsDisplayingType = 0
    backgroundMusic = 0
    rivalObjectsDisplayingType = 0
    topAssistDisplayingType = 0
    voiceMessageSet = 0
    voiceMessageVolume = 100
    mylist: number[] = []
}
export class Rb6SettingsResponse extends Rb2SettingsResponseBase {
    highSpeed = 1.0 // need a convert
    clearGaugeType = 0
    achievementRateDisplayingType = 0
    objectSize = 0
    sameTimeObjectsDisplayingType = 0
    bigbangEffectPerformingType = 0
    rivalObjectsDisplayingType = 0
    topAssistDisplayingType = 0
    chatSoundSwitch = 0
    colorSpecified = RbColorSpecification.random
    rankingQuestIndex = 0
    pastelParts: [number, number, number, number] = [0, 0, 0, 0]
    characterCardId = 0
    mylist: number[] = []
}
export type RbSettingsResponse<TVersion extends RbVersion> =
    TVersion extends 6 ? Rb6SettingsResponse :
    TVersion extends 5 ? Rb5SettingsResponse :
    TVersion extends 4 ? Rb4SettingsResponse :
    TVersion extends 3 ? Rb3SettingsResponse :
    TVersion extends 2 ? Rb2SettingsResponse :
    Rb1SettingsResponse

export type Rb6UploadAsphyxiaDataRequest = {
    sessionId: string
    type: "profile" | "scores"
    isFinished: boolean
}
type Rb6RankingQuestChart = {
    musicId: number
    chartType: Rb6ChartType
}
export type Rb6RankingQuestResponse = {
    id: number
    charts: [Rb6RankingQuestChart, Rb6RankingQuestChart, Rb6RankingQuestChart]
}

export function createRbSettingsResponse<TVersion extends RbVersion>(version: TVersion): RbSettingsResponse<TVersion> {
    switch (version) {
        case 1: return new Rb1SettingsResponse() as RbSettingsResponse<TVersion>
        case 2: return new Rb2SettingsResponse() as RbSettingsResponse<TVersion>
        case 3: return new Rb3SettingsResponse() as RbSettingsResponse<TVersion>
        case 4: return new Rb4SettingsResponse() as RbSettingsResponse<TVersion>
        case 5: return new Rb5SettingsResponse() as RbSettingsResponse<TVersion>
        case 6: return new Rb6SettingsResponse() as RbSettingsResponse<TVersion>
    }
}

export type RbUpdateSettingsRequest<TVersion extends RbVersion> = RbRequest & Partial<RbSettingsResponse<TVersion>> & {
    hasAsphyxiaDataToUpload?: boolean
}
export type RbUpdateSettingsResponse = {
    sessionId?: string
}