export type Rb3OrderShopInfo = {
    id: number
    orderShopId: number
    orderName: string
    appearCondition: string
    fragmentName: string
    hint: string
    clearRewardName: string
    orderNameOrig: string
    appearConditionOrig: string
    fragmentNameOrig: string
    hintOrig: string
    clearRewardNameOrig: string
    stars: number
    fragmentColor: Rb3OrderFragmentColor
    fragmentCount: number
    firstClearRewardAmount: number
    clearRewardAmount: number
    reacceptable: boolean
}

export enum Rb3OrderFragmentColor {
    green, orange, blue, violet, red
}

export type Rb3VerdetDesKriegesPhrasePart = {
    text: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
    emphasisColor?: string
    emphasisBackground?: string
    specialEmphasis?: boolean
    annotation?: number
}

export type Rb3VerdetDesKriegesContentOriginal = {
    chapter: number
    page: number
    phrase: string
    phraseOrig: string
}

export type Rb3VerdetDesKriegesContent = {
    chapter: number
    page: number
    phrase: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
    phraseOrig: string | (Rb3VerdetDesKriegesPhrasePart | string)[]
}

export type Rb3VerdetDesKriegesNote = {
    noteId: number
    name: string
    nameOrig: string
    note: string
    noteOrig: string
}