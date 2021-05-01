import { IRb1PlayerBase, IRb1PlayerCustom } from "../../models/rb1/profile"
import { generateRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

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
    }) => {
        try {
            let base = await DB.FindOne<IRb1PlayerBase>(data.refid, { collection: "rb.rb1.player.base" })
            let custom = await DB.FindOne<IRb1PlayerCustom>(data.refid, { collection: "rb.rb1.player.custom" })
            let lobbySettings = generateRbLobbySettings(1, base.userId)

            if ((data.name != base.name) || (data.comment != base.comment)) {
                base.name = data.name
                base.comment = data.comment
                await DBM.update(data.refid, { collection: "rb.rb1.player.base" }, base)
            }

            lobbySettings.isEnabled = data.isLobbyEnabled != null

            custom.stageShotSound = data.shotSound
            custom.stageShotVolume = data.shotVolume
            custom.stageExplodeType = data.explodeType
            custom.stageFrameType = data.frameType
            custom.stageBackground = data.background
            custom.stageBackgroundBrightness = data.backgroundBrightness

            await DBM.update(data.refid, { collection: "rb.rb1.player.custom" }, custom)
            await DBM.upsert(null, { collection: "rb.rb1.player.lobbySettings#userId", userId: base.userId }, lobbySettings)
            UtilityHandlersWebUI.pushMessage("Save RB settings succeeded!", 1, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB settings: " + e.message, 1, WebUIMessageType.error, data.refid)
        }
    }
}