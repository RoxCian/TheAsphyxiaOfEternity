import { rbPlayerIcon } from "../../data/tables/rb_player_icon"
import { RbPlayerIcon, RbVersion } from "../../models/shared/rb_types"
import { C } from "../../utils/controller"

export function registerPlayerIconController() {
    C.route("rbGetPlayerIcon", getPlayerIcon)
    C.route("rbGetAvailablePlayerIcons", getAvailablePlayerIcons)
}

const getPlayerIcon: C.C<{ version: RbVersion, id: number }, RbPlayerIcon> = async data => {
    return (await rbPlayerIcon).find(i => i.version === data.version && i.id === data.id)
}
const getAvailablePlayerIcons: C.C<{ version: RbVersion }, RbPlayerIcon[]> = async data => {
    return (await rbPlayerIcon).filter(i => i.version === data.version)
}