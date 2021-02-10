export interface IMusicInfo<TChartType extends RbChartType | Rb4ChartType | Rb6ChartType> {
    id: string
    title: string
    artist: string
    chartLevel: IRbChartProperty<number, TChartType>
    bpm: IBpmInfo
    appendedDate?: Date
    status: "Avaliable" | "Removed" | "Unavaliable"
}

export enum RbChartType { "easy", "medium", "hard" }
export enum Rb4ChartType { "easy", "medium", "hard", "special" }
export enum Rb6ChartType { "easy", "medium", "hard", "whiteHard" }

export interface IRbChartProperty<T, TChartType extends RbChartType | Rb4ChartType | Rb6ChartType> {
    //@ts-ignore
    [k: TChartType]: T | null
}

export interface IBpmInfo {
    min: number
    max?: number
}