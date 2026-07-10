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

export type Rb6QuestInfo = {
    questId: number
    chapter: number
    questName: string
    questNameOrig?: string
    element: Rb6CharacterCardElement
}
export type Rb6DungeonInfo = {
    dungeonId: number
    dungeonName: string
    dungeonNameOrig: string
    element: Rb6CharacterCardElement
    dungeonsIdToUnlock: number[]
    buffs: Rb6DungeonBuffFlag
}
export enum Rb6QuestType {
    none, story, hunting, challenge
}

export type Rb6PastelLevel = {
    level: number
    experiences: number
    experiencesToNextLevel: number
    health: number
    attack: number
}

export enum Rb6DungeonBuffFlag {
    masterJudge = 1 << 0,
    jrInfMode = 1 << 1,
    greatAsGood = 1 << 2,
    onlyJrDamage = 1 << 3,
    rivalJrGreatDamage = 1 << 4,
    noTopColor = 1 << 5,
    lowSpeed = 1 << 6,
    noRecovery = 1 << 7,
}