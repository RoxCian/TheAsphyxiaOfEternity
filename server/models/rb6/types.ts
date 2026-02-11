export type Rb6CharacterCardInfo = {
    id: number
    name: string
    nameOrig?: string
    element: Rb6CharacterCardElement
    isAccessable: boolean
}

export enum Rb6CharacterCardElement {
    fire, aqua, wood, light, dark
}

export type Rb6EquipmentInfo = {
    id: number
    part: Rb6EquipmentPart
    name: string
    nameOrig: string
}

export enum Rb6EquipmentPart {
    head, body, under, arm
}

export type Rb6PastelLevel = {
    level: number
    experiences: number
    experiencesToNextLevel: number
    health: number
    attack: number
}