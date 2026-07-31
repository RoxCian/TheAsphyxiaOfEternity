import { IRb4Mylist } from "../../models/rb4/mylist"
import { IRb4PlayerAccount, IRb4PlayerBase, IRb4PlayerConfig, IRb4PlayerCustom } from "../../models/rb4/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

type Rb4SettingsWebUI = {
    refid: string
    name: string
    comment: string
    gaugeType: string
    mainGaugeType: string
    achievementRateDisplayingType: string
    objectSize: string
    sameTimeObjectsDisplayingType: string
    shotSound: string
    shotVolume: string
    explodeType: string
    frameType: string
    background: string
    backgroundBrightness: string
    touchMarker: string
    cheerVoice: string
    bywordLeft: string
    bywordRight: string
    isAutoBywordLeft?: string
    isAutoBywordRight?: string
    isLobbyEnabled?: string
    pastelEquipHead: string
    pastelEquipTop: string
    pastelEquipUnder: string
    pastelEquipArm: string
    mylist: string
}

export namespace Rb4HandlersWebUI {
    export const updateSettings = async (data: Rb4SettingsWebUI) => {
        try {
            let rb4Account = await DB.FindOne<IRb4PlayerAccount>(data.refid, { collection: "rb.rb4.player.account" })
            let rb4Base = await DB.FindOne<IRb4PlayerBase>(data.refid, { collection: "rb.rb4.player.base" })
            let rb4Config = await DB.FindOne<IRb4PlayerConfig>(data.refid, { collection: "rb.rb4.player.config" })
            let rb4Custom = await DB.FindOne<IRb4PlayerCustom>(data.refid, { collection: "rb.rb4.player.custom" })
            let rb4LobbySettings = generateRbLobbySettings(4, rb4Account.userId)

            rb4Base.name = data.name.trim()
            rb4Base.comment = data.comment
            rb4Custom.stageClearGaugeType = parseInt(data.gaugeType)
            rb4Custom.stageMainGaugeType = parseInt(data.mainGaugeType)
            rb4Custom.stageAchievementRateDisplayingType = parseInt(data.achievementRateDisplayingType)
            rb4Custom.stageObjectSize = parseInt(data.objectSize)
            rb4Custom.stageSameTimeObjectsDisplayingType = parseInt(data.sameTimeObjectsDisplayingType)
            rb4Custom.stageShotSound = parseInt(data.shotSound)
            rb4Custom.stageShotVolume = parseInt(data.shotVolume)
            rb4Custom.stageExplodeType = parseInt(data.explodeType)
            rb4Custom.stageFrameType = parseInt(data.frameType)
            rb4Custom.stageBackground = parseInt(data.background)
            rb4Custom.stageBackgroundBrightness = parseInt(data.backgroundBrightness)
            rb4Custom.stageTouchMarkerDisplayingType = parseInt(data.touchMarker)
            rb4Custom.cheerVoice = parseInt(data.cheerVoice)
            rb4Config.bywordLeft = parseInt(data.bywordLeft)
            rb4Config.bywordRight = parseInt(data.bywordRight)
            rb4Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
            rb4Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true

            rb4LobbySettings.isEnabled = data.isLobbyEnabled != null

            let mylist: number[] | undefined = []
            try {
                mylist = JSON.parse(data.mylist)
            } catch {
                mylist = undefined
            }

            await DBM.update<IRb4PlayerBase>(data.refid, { collection: "rb.rb4.player.base" }, rb4Base)
            await DBM.update<IRb4PlayerConfig>(data.refid, { collection: "rb.rb4.player.config" }, rb4Config)
            await DBM.update<IRb4PlayerCustom>(data.refid, { collection: "rb.rb4.player.custom" }, rb4Custom)
            if (mylist) await DBM.upsert<IRb4Mylist>(data.refid, { collection: "rb.rb4.player.mylist" }, {
                collection: "rb.rb4.player.mylist",
                index: 0,
                mylist: mylist
            })
            await DBM.upsert<IRbLobbySettings<4>>(null, { collection: "rb.rb4.player.lobbySettings#userId", userId: rb4Account.userId }, rb4LobbySettings)
            UtilityHandlersWebUI.pushMessage("Save RB groovin'!! settings succeeded!", 4, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB groovin'!! settings: " + e.message, 4, WebUIMessageType.error, data.refid)
        }
    }

    export const exportData = async (data: { refid: string }) => {
        let account = await DB.FindOne<IRb4PlayerAccount>(data.refid, { collection: "rb.rb4.player.account" })
        return await DBM.overall(data.refid, account.userId, "rb.rb4", "export")
    }
}