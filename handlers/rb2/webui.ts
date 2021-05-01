import { IRb2Mylist, IRb2PlayerBase, IRb2PlayerCustom } from "../../models/rb2/profile"
import { generateRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb2HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
        bywordLeft: number
        bywordRight: number
        isAutoBywordLeft: boolean
        isAutoBywordRight: boolean
        mainGaugeType: number
        shotSound: number
        shotVolume: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
        mylistMusicId: string
        isLobbyEnabled?: string
    }) => {
        try {
            let opm = new DBM.DBOperationManager()
            let base = await DB.FindOne<IRb2PlayerBase>(data.refid, { collection: "rb.rb2.player.base" })
            let custom = await DB.FindOne<IRb2PlayerCustom>(data.refid, { collection: "rb.rb2.player.custom" })
            let lobbySettings = generateRbLobbySettings(2, base.userId)

            if ((data.name != base.name) || (data.comment != base.comment)) {
                base.name = data.name
                base.comment = data.comment
                opm.update(data.refid, { collection: "rb.rb2.player.base" }, base)
            }

            custom.byword = [data.bywordLeft, data.bywordRight]
            custom.isAutoByword = [data.isAutoBywordLeft, data.isAutoBywordRight]
            custom.gaugeStyle = data.mainGaugeType
            custom.stageShotSound = data.shotSound
            custom.stageShotVolume = data.shotVolume
            custom.stageExplodeType = data.explodeType
            custom.stageFrameType = data.frameType
            custom.stageBackground = data.background
            custom.stageBackgroundBrightness = data.backgroundBrightness

            lobbySettings.isEnabled = data.isLobbyEnabled != null

            let mylist: IRb2Mylist = { collection: "rb.rb2.player.mylist", slot: [] }
            let parsedMylistMusicId: number[] = JSON.parse(data.mylistMusicId)
            for (let i = 0; i < parsedMylistMusicId.length; i++) if (parsedMylistMusicId[i] >= 0) mylist.slot.push({ slotId: i, musicId: parsedMylistMusicId[i] })
            if (mylist.slot.length == 0) delete mylist.slot

            opm.update(data.refid, { collection: "rb.rb2.player.custom" }, custom)
            opm.upsert(data.refid, { collection: "rb.rb2.player.mylist" }, mylist)
            opm.upsert(null, { collection: "rb.rb2.player.lobbySettings#userId", userId: base.userId }, lobbySettings)

            await DBM.operate(opm)
            UtilityHandlersWebUI.pushMessage("Save RB limelight settings succeeded!", 2, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB limelight settings: " + e.message, 2, WebUIMessageType.error, data.refid)
        }
    }
}