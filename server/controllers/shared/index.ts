import { registerCommentsController } from "./comment"
import { registerItemsController } from "./items"
import { registerJacketController } from "./jackets"
import { registerMusicsController } from "./musics"
import { registerWebAppConfigController } from "./web_app_config"

export function registerSharedControllers() {
    registerWebAppConfigController()
    registerJacketController()
    registerItemsController()
    registerMusicsController()
    registerCommentsController()
}