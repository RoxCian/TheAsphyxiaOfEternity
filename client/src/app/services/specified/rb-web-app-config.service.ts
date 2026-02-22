import { Injectable } from "@angular/core"
import { rbData } from "../../signals/rb-data"
import { RbRequest, RbWebAppConfigResponse } from "rbweb"

@Injectable({ providedIn: "root" })
export class RbWebAppConfigService {
    readonly config = rbData<RbWebAppConfigResponse>("rbGetWebAppConfig", {} as RbRequest)
}