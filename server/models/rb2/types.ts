export type Rb2GlassInfo = {
    id: number
    category: string
    name: string
    categoryOrig?: string
    nameOrig?: string
    experiences: number
    relatedMusicsId: number[]
    unlockCondition: {
        anyMusicsPlayed?: number[]
        glassCompleted?: number[]
    }
    imageId: string
    layer: number
    palette: number
}