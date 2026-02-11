import { Injectable } from "@angular/core"
import { rbData } from "../../signals/rb-data"

@Injectable({ providedIn: "root" })
export class RbJacketsService {
    readonly jackets = rbData<string[], {}>("rbGetJackets", {})
}
