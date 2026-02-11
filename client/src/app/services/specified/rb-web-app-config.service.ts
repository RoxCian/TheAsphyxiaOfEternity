import { Injectable } from "@angular/core"
import { rbData } from "../../signals/rb-data"
import { RbRequest, RbWebAppConfigResponse } from "server/models/shared/web"

@Injectable({ providedIn: "root" })
export class RbWebAppConfigService {
    readonly config = rbData<RbWebAppConfigResponse>("rbGetWebAppConfig", {} as RbRequest)
}