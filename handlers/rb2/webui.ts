import { IRb2PlayerBase, IRb2PlayerCustom } from "../../models/rb2/profile"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb2HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        shotSound: number
        shotVolume: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
    }) => {
        try {
            let base = await DB.FindOne<IRb2PlayerBase>(data.refid, { collection: "rb.rb2.player.base" })
            let custom = await DB.FindOne<IRb2PlayerCustom>(data.refid, { collection: "rb.rb2.player.custom" })
            if (data.name != base.name) {
                base.name = data.name
                await DBM.update(data.refid, { collection: "rb.rb2.player.base" }, base)
            }
            custom.stageShotSound = data.shotSound
            custom.stageShotVolume = data.shotVolume
            custom.stageExplodeType = data.explodeType
            custom.stageFrameType = data.frameType
            custom.stageBackground = data.background
            custom.stageBackgroundBrightness = data.backgroundBrightness
            await DBM.update(data.refid, { collection: "rb.rb2.player.custom" }, custom)
            UtilityHandlersWebUI.pushMessage("Save RB settings succeeded!", WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error while save RB settings: " + e.message, WebUIMessageType.error, data.refid)
        }
    }
}