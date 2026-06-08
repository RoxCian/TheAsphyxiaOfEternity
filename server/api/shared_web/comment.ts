import { RbCommentBase } from "../../models/shared/comment"
import { RbVersion } from "../../models/shared/rb_types"
import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"

export function registerCommentsController() {
    C.route("rbGetComments", getComments)
}

const getComments: C.C = async () => {
    return (await DBH.find<RbCommentBase<RbVersion>>({ collection: "rb.info.comment" })).sort((l, r) => r.time - l.time)
}