import { IRb1PlayerBase, IRb1PlayerCustom } from "../../models/rb1/profile"
import { generateRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

type Rb1SettingsWebUI = {
    refid: string
    name: string
    comment: string
    shotSound: string
    shotVolume: string
    explodeType: string
    frameType: string
    background: string
    backgroundBrightness: string
    isLobbyEnabled?: string
}

export namespace Rb1HandlersWebUI {
    export const updateSettings = async (dataJSON: string) => {
        let data: Rb1SettingsWebUI = JSON.parse(dataJSON)
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

            custom.stageShotSound = parseInt(data.shotSound)
            custom.stageShotVolume = parseInt(data.shotVolume)
            custom.stageExplodeType = parseInt(data.explodeType)
            custom.stageFrameType = parseInt(data.frameType)
            custom.stageBackground = parseInt(data.background)
            custom.stageBackgroundBrightness = parseInt(data.backgroundBrightness)

            await DBM.update(data.refid, { collection: "rb.rb1.player.custom" }, custom)
            await DBM.upsert(null, { collection: "rb.rb1.player.lobbySettings#userId", userId: base.userId }, lobbySettings)
            UtilityHandlersWebUI.pushMessage("Save RB settings succeeded!", 1, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB settings: " + e.message, 1, WebUIMessageType.error, data.refid)
        }
    }
}