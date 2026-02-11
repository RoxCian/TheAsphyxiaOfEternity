import { PJ } from "./utils/pj"
import { registerRb1Controllers } from "./controllers/rb1/web"
import { registerRb2Controllers } from "./controllers/rb2/web"
import { registerRb3Controllers } from "./controllers/rb3/web"
import { registerRb4Controllers } from "./controllers/rb4/web"
import { registerRb5Controllers } from "./controllers/rb5/web"
import { registerRb6Controllers } from "./controllers/rb6/web"
import { registerSharedControllers } from "./controllers/shared"
import { registerRb1Handlers } from "./handlers/rb1/common"
import { registerRb2Handlers } from "./handlers/rb2/common"
import { registerRb3Handlers } from "./handlers/rb3/common"
import { registerRb4Handlers } from "./handlers/rb4/common"
import { registerRb5Handlers } from "./handlers/rb5/common"
import { registerRb6Handlers } from "./handlers/rb6/common"
import { registerRb1Rb2Rb3HandlersDispatcher } from "./handlers/shared/common"

export function register() {
    R.GameCode("KBR")
    R.GameCode("LBR")
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    R.Config("unlock_all_songs", { type: "boolean", default: false })
    R.Config("unlock_all_items", { type: "boolean", default: false })
    R.Config("comment_feature", { type: "boolean", default: true })

    R.Config("<colette_all_seasons>_daily_stamp_boost", { type: "integer", default: 0 })

    JSON.stringify = PJ.stringify
    JSON.parse = PJ.parse

    registerRb1Handlers()
    registerRb2Handlers()
    registerRb3Handlers()
    registerRb4Handlers()
    registerRb5Handlers()
    registerRb6Handlers()
    registerRb1Rb2Rb3HandlersDispatcher()

    registerRb1Controllers()
    registerRb2Controllers()
    registerRb3Controllers()
    registerRb4Controllers()
    registerRb5Controllers()
    registerRb6Controllers()
    registerSharedControllers()

    R.Unhandled()
}
