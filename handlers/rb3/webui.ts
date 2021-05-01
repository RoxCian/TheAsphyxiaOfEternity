import { IRb3Mylist } from "../../models/rb3/mylist"
import { IRb3PlayerAccount, IRb3PlayerBase, IRb3PlayerConfig, IRb3PlayerCustom } from "../../models/rb3/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb3HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
        gaugeType: number
        mainGaugeType: number
        objectSize: number
        shotSound: number
        shotVolume: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
        touchMarker: number
        bywordLeft: number
        bywordRight: number
        isAutoBywordLeft?: string
        isAutoBywordRight?: string
        isLobbyEnabled?: string
        pastelEquipHead: number
        pastelEquipTop: number
        pastelEquipUnder: number
        pastelEquipArm: number
        mylist: string
    }) => {
        try {
            let rb3Account = await DB.FindOne<IRb3PlayerAccount>(data.refid, { collection: "rb.rb3.player.account" })
            let rb3Base = await DB.FindOne<IRb3PlayerBase>(data.refid, { collection: "rb.rb3.player.base" })
            let rb3Config = await DB.FindOne<IRb3PlayerConfig>(data.refid, { collection: "rb.rb3.player.config" })
            let rb3Custom = await DB.FindOne<IRb3PlayerCustom>(data.refid, { collection: "rb.rb3.player.custom" })
            let rb3LobbySettings = generateRbLobbySettings(3, rb3Account.userId)

            rb3Base.name = data.name.trim()
            rb3Base.comment = data.comment
            rb3Custom.stageClearGaugeType = data.gaugeType
            rb3Custom.stageMainGaugeType = data.mainGaugeType
            rb3Custom.stageObjectSize = data.objectSize
            rb3Custom.stageShotSound = data.shotSound
            rb3Custom.stageShotVolume = data.shotVolume
            rb3Custom.stageExplodeType = data.explodeType
            rb3Custom.stageFrameType = data.frameType
            rb3Custom.stageBackground = data.background
            rb3Custom.stageBackgroundBrightness = data.backgroundBrightness
            rb3Custom.stageTouchMarkerDisplayingType = data.touchMarker
            rb3Config.bywordLeft = data.bywordLeft
            rb3Config.bywordRight = data.bywordRight
            rb3Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
            rb3Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true

            rb3LobbySettings.isEnabled = data.isLobbyEnabled != null

            let rb3Mylist: IRb3Mylist = {
                collection: "rb.rb3.player.mylist",
                slot: (<number[]>JSON.parse(data.mylist)).map((v, i) => { return (v >= 0) ? { slotId: i, musicId: v } : null }).filter((v) => v)
            }
            if (rb3Mylist.slot.length == 0) delete rb3Mylist.slot

            await DBM.update<IRb3PlayerBase>(data.refid, { collection: "rb.rb3.player.base" }, rb3Base)
            await DBM.update<IRb3PlayerConfig>(data.refid, { collection: "rb.rb3.player.config" }, rb3Config)
            await DBM.update<IRb3PlayerCustom>(data.refid, { collection: "rb.rb3.player.custom" }, rb3Custom)
            await DBM.upsert<IRb3Mylist>(data.refid, { collection: "rb.rb3.player.mylist" }, rb3Mylist)
            await DBM.upsert<IRbLobbySettings<3>>(null, { collection: "rb.rb3.player.lobbySettings#userId", userId: rb3Account.userId }, rb3LobbySettings)
            UtilityHandlersWebUI.pushMessage("Save RB colette settings succeeded!", 3, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB colette settings: " + e.message, 3, WebUIMessageType.error, data.refid)
        }
    }

    export const exportData = async (data: { refid: string }) => {
        let account = await DB.FindOne<IRb3PlayerAccount>(data.refid, { collection: "rb.rb3.player.account" })
        return await DBM.overall(data.refid, account.userId, "rb.rb3", "export")
    }
}