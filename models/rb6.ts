export interface IRb6Collection {
    version: 'rb6'
}



export interface IRb6CourseRecord extends IRb6Collection {
    courseId: number

    totalRate: number
    partialRates: number[]
}

export interface IRb6ClasscheckCourseRecord extends IRb6CourseRecord {
    collection: 'classcheck'
}

export interface IRb6RefleciaCourseRecord extends IRb6CourseRecord {
    collection: 'refleciaCourse'
}

export interface IRb6GameSettings extends IRb6Collection {
    collection: 'gameSettings'
}









export interface IRb6CharacterRecord extends IRb6Collection {
    collection: 'character'

    characterId: number
    rank: number
    element: CharacterElement
    experiment: number
}

export enum CharacterElement {

}





