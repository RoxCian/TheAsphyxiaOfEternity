import { C } from "../../utils/controller"
import { rbBywords } from "../../data/tables/rb_bywords"
import { rbItems } from "../../data/tables/rb_items"
import { RbByword, RbItemResponse, RbVersion } from "../../models/shared/web"

export function registerItemsController() {
    C.route("rbReadItems", readItems)
    C.route("rbReadBywords", readBywords)
}

const readItems: C.C<{ version: RbVersion }, RbItemResponse[]> = data => rbItems.filter(i => i.version === data.version)
const readBywords: C.C<{ version: RbVersion }, RbByword[]> = data => rbBywords.filter(b => b.version === data.version)
