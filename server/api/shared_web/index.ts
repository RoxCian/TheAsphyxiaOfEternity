import { registerCommentsController } from "./comment"
import { registerItemsController } from "./items"
import { registerJacketController } from "./jackets"
import { registerMusicsController } from "./musics"
import { registerSaveDataController } from "./save_data"
import { registerWebAppConfigController } from "./web_app_config"

export function registerSharedControllers() {
    registerWebAppConfigController()
    registerJacketController()
    registerItemsController()
    registerMusicsController()
    registerCommentsController()
    registerSaveDataController()
}