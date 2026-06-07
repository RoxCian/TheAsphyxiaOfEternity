import { Service } from "@angular/core"
import { rbData } from "../../signals/rb-data"

@Service()
export class RbJacketsService {
    readonly jackets = rbData<string[], {}>("rbGetJackets", {})
}
