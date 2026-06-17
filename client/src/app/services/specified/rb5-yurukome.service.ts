import { computed, Service } from "@angular/core"
import { Rb5YurukomeResponse } from "rbweb"
import { RbPlayDataServiceBase } from "./rb-play-data.service"

@Service()
export class Rb5YurukomeService extends RbPlayDataServiceBase<Rb5YurukomeResponse> {
    constructor() {
        super(computed(() => this.dataVersion() === 5 ? `rb5ReadYurukome` : undefined))
    }
}
