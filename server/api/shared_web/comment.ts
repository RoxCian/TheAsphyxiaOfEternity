import { rbPlayerIcon } from "../../data/tables/rb_player_icon"
import { RbCommentBase } from "../../models/shared/comment"
import { RbVersion } from "../../models/shared/rb_types"
import { RbCommentResponse } from "../../models/shared/web"
import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"

export function registerCommentsController() {
    C.route("rbGetComments", getComments)
}

const getComments: C.C<RbCommentResponse<RbVersion>> = async () => {
    const icons = await rbPlayerIcon
    return (await DBH.find<RbCommentBase<RbVersion>>({ collection: "rb.info.comment" })).sort((l, r) => r.time - l.time).map(c => {
        const result = c as RbCommentResponse<RbVersion>
        if (result.iconId != undefined) result.icon = icons.find(i => i.version === result.version && i.id === result.iconId)
        return result
    })
}