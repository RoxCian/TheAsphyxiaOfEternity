import { C } from "../../utils/controller"
import { RbWebAppConfigResponse } from "../../models/shared/web"

export function registerWebAppConfigController() {
    C.route("rbGetWebAppConfig", getWebAppConfig)
}

const getWebAppConfig: C.C<undefined, RbWebAppConfigResponse> = async () => ({
    pagingStrategy: "client"
})