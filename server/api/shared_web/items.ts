import { C } from "../../utils/controller"
import { rbItems } from "../../data/tables/rb_items"
import { RbByword, RbItemResponse, RbVersion } from "../../models/shared/web"
import { rbBywords } from "../../data/tables/rb_bywords"

export function registerItemsController() {
    C.route("rbReadItems", readItems)
    C.route("rbReadBywords", readBywords)
}

const readItems: C.C<{ version: RbVersion }, RbItemResponse[]> = data => rbItems.filter(i => i.version === data.version)
const readBywords: C.C<{ version: RbVersion }, RbByword[]> = data => rbBywords.filter(b => b.version === data.version)
