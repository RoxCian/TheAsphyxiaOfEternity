import { RbComment } from "../../models/shared/comment"
import { RbVersion } from "../../models/shared/rb_types"
import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"

export function registerCommentsController() {
    C.route("rbGetComments", getComments)
}

const getComments: C.C = async () => {
    return DBH.find<RbComment<RbVersion>>({ collection: "rb.info.comment" })
}