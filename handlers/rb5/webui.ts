import { IRb5Mylist } from "../../models/rb5/mylist"
import { IRb5PlayerAccount, IRb5PlayerBase, IRb5PlayerConfig, IRb5PlayerCustom } from "../../models/rb5/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb5HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
        gaugeType: number
        mainGaugeType: number
        achievementRateDisplayingType: number
        objectSize: number
        sameTimeObjectsDisplayingType: number
        shotSound: number
        shotVolume: number
        backgroundMusic: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
        highSpeed: number
        rivalObjectsDisplayingType: number
        topAssistDisplayingType: number
        voiceMessageVolume: number
        voiceMessageSet: number
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
            let rb5Account = await DB.FindOne<IRb5PlayerAccount>(data.refid, { collection: "rb.rb5.player.account" })
            let rb5Base = await DB.FindOne<IRb5PlayerBase>(data.refid, { collection: "rb.rb5.player.base" })
            let rb5Config = await DB.FindOne<IRb5PlayerConfig>(data.refid, { collection: "rb.rb5.player.config" })
            let rb5Custom = await DB.FindOne<IRb5PlayerCustom>(data.refid, { collection: "rb.rb5.player.custom" })
            let rb5LobbySettings = generateRbLobbySettings(5, rb5Account.userId)

            rb5Base.name = data.name.trim()
            rb5Base.comment = data.comment
            rb5Custom.stageClearGaugeType = data.gaugeType
            rb5Custom.stageMainGaugeType = data.mainGaugeType
            rb5Custom.stageAchievementRateDisplayingType = data.achievementRateDisplayingType
            rb5Custom.stageObjectSize = data.objectSize
            rb5Custom.stageSameTimeObjectsDisplayingType = data.sameTimeObjectsDisplayingType
            rb5Custom.stageShotSound = data.shotSound
            rb5Custom.stageShotVolume = data.shotVolume
            rb5Custom.stageExplodeType = data.explodeType
            rb5Custom.stageFrameType = data.frameType
            rb5Custom.stageBackground = data.background
            rb5Custom.stageBackgroundBrightness = data.backgroundBrightness
            rb5Custom.stageHighSpeed = data.highSpeed
            rb5Custom.voiceMessageVolume = data.voiceMessageVolume
            rb5Custom.voiceMessageSet = data.voiceMessageSet

            rb5Config.musicSelectBgm = data.backgroundMusic
            rb5Config.bywordLeft = data.bywordLeft
            rb5Config.bywordRight = data.bywordRight
            rb5Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
            rb5Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true

            rb5LobbySettings.isEnabled = data.isLobbyEnabled != null

            let rb5Mylist: IRb5Mylist = {
                collection: "rb.rb5.player.mylist",
                index: 0,
                mylist: JSON.parse(data.mylist)
            }

            await DBM.update<IRb5PlayerBase>(data.refid, { collection: "rb.rb5.player.base" }, rb5Base)
            await DBM.update<IRb5PlayerConfig>(data.refid, { collection: "rb.rb5.player.config" }, rb5Config)
            await DBM.update<IRb5PlayerCustom>(data.refid, { collection: "rb.rb5.player.custom" }, rb5Custom)
            await DBM.upsert<IRb5Mylist>(data.refid, { collection: "rb.rb5.player.mylist" }, rb5Mylist)
            await DBM.upsert<IRbLobbySettings<5>>(null, { collection: "rb.rb5.player.lobbySettings#userId", userId: rb5Account.userId }, rb5LobbySettings)
            UtilityHandlersWebUI.pushMessage("Save RB VOLZZA settings succeeded!", 5, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB VOLZZA settings: " + e.message, 5, WebUIMessageType.error, data.refid)
        }
    }

    export const exportData = async (data: { refid: string }) => {
        let account = await DB.FindOne<IRb5PlayerAccount>(data.refid, { collection: "rb.rb5.player.account" })
        return await DBM.overall(data.refid, account.userId, "rb.rb5", "export")
    }
}