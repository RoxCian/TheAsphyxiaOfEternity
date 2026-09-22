import { Service } from "@angular/core"
import { RbRequest, RbWebAppConfigResponse } from "rbweb"
import { rbData } from "../../signals/rb-data"

@Service()
export class RbWebAppConfigService {
    readonly config = rbData<RbWebAppConfigResponse>("rbGetWebAppConfig", {} as RbRequest)
}