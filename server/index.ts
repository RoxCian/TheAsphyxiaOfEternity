import { PJ } from "./utils/pj"
import { registerRb1Controllers } from "./api/rb1/web"
import { registerRb2Controllers } from "./api/rb2/web"
import { registerRb3Controllers } from "./api/rb3/web"
import { registerRb4Controllers } from "./api/rb4/web"
import { registerRb5Controllers } from "./api/rb5/web"
import { registerRb6Controllers } from "./api/rb6/web"
import { registerSharedControllers } from "./api/shared_web"
import { registerRb1Handlers } from "./api/rb1/game"
import { registerRb2Handlers } from "./api/rb2/game"
import { registerRb3Handlers } from "./api/rb3/game"
import { registerRb4Handlers } from "./api/rb4/game"
import { registerRb5Handlers } from "./api/rb5/game"
import { registerRb6Handlers } from "./api/rb6/game"

export function register() {
    R.GameCode("KBR")
    R.GameCode("LBR")
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    R.Config("unlock_all_songs", { type: "boolean", default: false })
    R.Config("unlock_all_items", { type: "boolean", default: false })
    R.Config("comment_feature", { type: "boolean", default: true })

    R.Config("<colette_all_seasons>_daily_stamp_boost", { type: "integer", default: 0 })

    registerRb1Handlers()
    registerRb2Handlers()
    registerRb3Handlers()
    registerRb4Handlers()
    registerRb5Handlers()
    registerRb6Handlers()

    registerRb1Controllers()
    registerRb2Controllers()
    registerRb3Controllers()
    registerRb4Controllers()
    registerRb5Controllers()
    registerRb6Controllers()
    registerSharedControllers()

    R.Unhandled((_r, _d, send) => send.success())
}
