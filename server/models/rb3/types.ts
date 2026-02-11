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