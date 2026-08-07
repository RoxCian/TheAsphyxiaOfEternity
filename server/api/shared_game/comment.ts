import { H } from "../../utils/handler"
import { XF } from "../../utils/x"
import { DBH } from "../../utils/db/dbh"
import { Rb2EventStatus } from "../../models/rb2/event"
import { getRbCommentType, Rb2Comment, Rb2Comments, Rb3Comment, Rb6Comment, RbCommentBase, RbComments, rbCommentTypeToken, RbReadCommentParam } from "../../models/shared/comment"
import { RbVersion } from "../../models/shared/rb_types"
import { injectorSymbol, TypeInjector } from "../../utils/types"
import { rbPlayerIcon } from "../../data/tables/rb_player_icon"

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
        const comments = (await DBH.find(closure.type, { collection: "rb.info.comment" }))
            .sort((l, r) => r.time - l.time).slice(0, param.limit)
        for (const comment of comments) {
            if (comment.version <= 5 && closure.version === 6) (comment as unknown as Rb6Comment).characterId = await convertIconOrCharacterId(comment.version, (comment as unknown as Rb2Comment).iconId, closure.version)
            else if (comment.version === 6 && closure.version <= 5) (comment as unknown as Rb2Comment).iconId = await convertIconOrCharacterId(comment.version, (comment as unknown as Rb6Comment).characterId, closure.version)
            else (comment as unknown as Rb2Comment).iconId = await convertIconOrCharacterId(comment.version, (comment as unknown as Rb2Comment).iconId, closure.version)
        }
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
        await DBH.insert(comment)
        return H.success
    }
}

async function convertIconOrCharacterId(commentVersion: RbVersion, iconOrCharacterId: number, targetVersion: RbVersion): Promise<number> {
    if (commentVersion < 6 && targetVersion === 6) return commentVersion + 7 // CPU 1 ~ CPU 5
    if (commentVersion === 6 && targetVersion === 6) return iconOrCharacterId
    const icons = rbPlayerIcon
    const findIconFromAsset = (aId: number) => icons.find(i => i.assetId === aId && i.version === targetVersion)?.id
    if (commentVersion === 6) {
        if (targetVersion === 5) return 96 // CPU 6
        else return findIconFromAsset(23) ?? 0 // staff 6
    }
    const assetId = icons.find(i => i.version === commentVersion && i.id === iconOrCharacterId)?.assetId
    const result = assetId == undefined ? undefined : findIconFromAsset(assetId)
    if (assetId == undefined || result == undefined) {
        if (targetVersion === 5) return 90 + commentVersion // CPU 1~5 since VOLZZA didn't get staff icons registered
        switch (commentVersion) {
            case 1: return findIconFromAsset(18) ?? 0 // staff KAC
            case 2: return findIconFromAsset(19) ?? 0 // staff ST
            case 3: return findIconFromAsset(21) ?? 0 // staff 3
            case 4: return findIconFromAsset(20) ?? 0 // staff KIH
            case 5: return findIconFromAsset(22) ?? 0 // staff 5
        }
    }
    return result
}