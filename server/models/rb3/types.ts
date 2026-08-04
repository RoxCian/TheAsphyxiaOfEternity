export type Rb3OrderInfo = {
    id: number
    orderShopId: number
    orderName: string
    orderNameOrig: string
    hint: string
    hintOrig: string
    fragmentName: string
    fragmentNameOrig: string
    orderType: Rb3OrderType
    fragmentCount: number
    clearRewardType: Rb3OrderClearRewardType
    clearRewardName: string
    clearRewardNameOrig: string
    firstClearRewardAmount: number
    clearRewardAmount: number
    stars: number
    unlockCondition: {
        allOrdersCleared?: number[]
        anyOrdersCleared?: number[]
        anyOrdersClearedCount?: number
        equipCondition?: {
            index: number
            season: number
            experiences: number
        }
        orderExperience?: number
        anyMusicsUnlocked?: number[]
        hasOrder?: true
    }
    reacceptable: boolean
}

export enum Rb3OrderType {
    starter, ordinary, equip, event, challenge
}

export type Rb3OrderShopLevel = {
    level: number
    experiences: number
    experiencesToNextLevel: number
}

export enum Rb3OrderDetailsParamFlag {
    none = 0,
    unlocked = 1,
    lockedToSlot = 1 << 1
}

export enum Rb3OrderClearRewardType {
    ticket, winter, spring, summer, autumn, head, body, hand, bywordLeft, bywordRight
}

export type Rb3VerdetDesKriegesPhrasePart = {
    text: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
    clueId?: number
    highlight?: boolean
    annotation?: number
}

export type Rb3VerdetDesKriegesAppearance = {
    chapter: number
    clueId: number
    themeColor: string
    textColor: string
    background: string
    textColorDark: string
    backgroundDark: string
}

export type Rb3VerdetDesKriegesContentRaw = {
    chapter: number
    page: number
    phrase?: string
    phraseOrig: string
}
export type Rb3VerdetDesKriegesResponse = {
    completed: boolean
    chapter: number
    page: number
    lastReadChapter: number
    lastReadPage: number
    progress: [number, number, number, number, number] // max is 60
}

export type Rb3VerdetDesKriegesContent = {
    chapter: number
    page: number
    phrase?: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
    phraseOrig: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
}

export type Rb3VerdetDesKriegesNote = {
    id: number
    name: string
    nameOrig: string
    note: string
    noteOrig: string
}
