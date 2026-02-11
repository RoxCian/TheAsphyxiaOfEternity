import { IRb1PlayerBase, IRb1PlayerCustom } from "../../models/rb1/profile"
import { generateRbLobbySettings } from "../../models/shared/lobby"
import { DBH } from "../../utils/db/dbh"
import { webUIMessage, WebUIMessageType } from "../../system/webui"

export namespace Rb1HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
        shotSound: number
        shotVolume: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
        isLobbyEnabled?: string
    }, send: WebUISend) => {
        try {
            let base = await DB.FindOne<IRb1PlayerBase>(data.refid, { collection: "rb.rb1.player.base" })
            let custom = await DB.FindOne<IRb1PlayerCustom>(data.refid, { collection: "rb.rb1.player.custom" })
            let lobbySettings = generateRbLobbySettings(1, base.userId)

            if ((data.name != base.name) || (data.comment != base.comment)) {
                base.name = data.name
                base.comment = data.comment
                await DBH.update(data.refid, { collection: "rb.rb1.player.base" }, base)
            }

            lobbySettings.isEnabled = data.isLobbyEnabled != null

            custom.stageShotSound = data.shotSound
            custom.stageShotVolume = data.shotVolume
            custom.stageExplodeType = data.explodeType
            custom.stageFrameType = data.frameType
            custom.stageBackground = data.background
            custom.stageBackgroundBrightness = data.backgroundBrightness

            await DBH.update(data.refid, { collection: "rb.rb1.player.custom" }, custom)
            await DBH.upsert(null, { collection: "rb.rb1.player.lobbySettings#userId", userId: base.userId }, lobbySettings)
            webUIMessage(send, "Save RB settings succeeded!", 1, WebUIMessageType.success)
        } catch (e) {
            webUIMessage(send, "Error occurred while saving RB settings: " + e.message, 1, WebUIMessageType.error)
        }
    }
}