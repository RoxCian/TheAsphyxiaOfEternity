import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb2EventStatus } from "../../models/rb2/event"
import { getRbCommentType, Rb2Comment, Rb2Comments, Rb3Comment, Rb6Comment, RbCommentBase, RbComments, rbCommentTypeToken, RbReadCommentParam } from "../../models/shared/comment"
import { RbVersion } from "../../models/shared/rb_types"
import { injectorSymbol, TypeInjector } from "../../utils/types"

export function createReadCommentHandler<TVersion extends RbVersion>(version: TVersion): H.H<RbReadCommentParam> {
    if (!U.GetConfig("comment_feature")) return () => H.deny
    const closure = {
        version: version,
        type: getRbCommentType(version),
        typeInjector: {
            [injectorSymbol]: true,
            [rbCommentTypeToken]: getRbCommentType(version)
        } as TypeInjector
    }
    return async data => {
        const param = XF.o(data, RbReadCommentParam)
        const comments = (await DBH.find(undefined, closure.type, { collection: "rb.info.comment" }))
            .sort((l, r) => r.time - l.time).slice(0, param.limit)
        if (closure.version === 2) {
            const result = new Rb2Comments()
            if (comments.length > 0) result.comment.c = comments as unknown as Rb2Comment[]
            for (const comment of comments) {
                result.status.s ??= []
                const status = result.status.s.find(v => v.userId === comment.userId) ??
                    await DBH.findOne(Rb2EventStatus, { collection: "rb.rb2.player.event.status#userId", userId: param.userId }) ??
                    new Rb2EventStatus(comment.userId, comment.name)
                result.status.s.push(status)
            }
            return XF.x(result, undefined, closure.typeInjector)
        } else {
            const result = new RbComments()
            if (comments.length > 0) result.c = comments
            for (const comment of comments) {
                if (comment.version <= 5 && closure.version === 6) (comment as unknown as Rb6Comment).characterId = comment.version + 7 // version to CPU level (Limelight -> CPU Level 2 (characard id == 8))
                if (comment.version === 6 && closure.version <= 5) (comment as unknown as Rb3Comment).iconId = (comment as unknown as Rb6Comment).characterId
            }
            return XF.x(result, undefined, closure.typeInjector)
        }
    }
}
export function createWriteCommentHandler<TVersion extends RbVersion>(version: TVersion): H.H<RbCommentBase<TVersion>> {
    if (!U.GetConfig("comment_feature")) return () => H.deny
    const closure = {
        version: version,
        type: getRbCommentType(version),
        typeInjector: {
            [rbCommentTypeToken]: getRbCommentType(version)
        }
    }
    return async data => {
        const comment = XF.o(data, closure.type, closure.typeInjector)
        comment.version = closure.version
        do comment.entryId = Math.round(Math.random() * 99999999)
        while (await DB.FindOne<RbCommentBase<TVersion>>({ collection: "rb.info.comment", entryId: comment.entryId }))
        await DBH.insert(undefined, comment)
        return H.success
    }
}
