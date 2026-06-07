import { Service } from "@angular/core"
import { rbData } from "../../signals/rb-data"
import { RbRequest, RbWebAppConfigResponse } from "rbweb"

@Service()
export class RbWebAppConfigService {
    readonly config = rbData<RbWebAppConfigResponse>("rbGetWebAppConfig", {} as RbRequest)
}