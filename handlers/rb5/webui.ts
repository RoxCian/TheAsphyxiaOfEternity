import { IRb5Mylist } from "../../models/rb5/mylist"
import { IRb5PlayerAccount, IRb5PlayerBase, IRb5PlayerConfig, IRb5PlayerCustom } from "../../models/rb5/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

type Rb5SettingsWebUI = {
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
    backgroundMusic: string
    explodeType: string
    frameType: string
    background: string
    backgroundBrightness: string
    highSpeed: string
    rivalObjectsDisplayingType: string
    topAssistDisplayingType: string
    voiceMessageVolume: string
    voiceMessageSet: string
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

export namespace Rb5HandlersWebUI {
    export const updateSettings = async (dataJSON: string) => {
        let data: Rb5SettingsWebUI = JSON.parse(dataJSON)
        try {
            let rb5Account = await DB.FindOne<IRb5PlayerAccount>(data.refid, { collection: "rb.rb5.player.account" })
            let rb5Base = await DB.FindOne<IRb5PlayerBase>(data.refid, { collection: "rb.rb5.player.base" })
            let rb5Config = await DB.FindOne<IRb5PlayerConfig>(data.refid, { collection: "rb.rb5.player.config" })
            let rb5Custom = await DB.FindOne<IRb5PlayerCustom>(data.refid, { collection: "rb.rb5.player.custom" })
            let rb5LobbySettings = generateRbLobbySettings(5, rb5Account.userId)

            rb5Base.name = data.name.trim()
            rb5Base.comment = data.comment
            rb5Custom.stageClearGaugeType = parseInt(data.gaugeType)
            rb5Custom.stageMainGaugeType = parseInt(data.mainGaugeType)
            rb5Custom.stageAchievementRateDisplayingType = parseInt(data.achievementRateDisplayingType)
            rb5Custom.stageObjectSize = parseInt(data.objectSize)
            rb5Custom.stageSameTimeObjectsDisplayingType = parseInt(data.sameTimeObjectsDisplayingType)
            rb5Custom.stageShotSound = parseInt(data.shotSound)
            rb5Custom.stageShotVolume = parseInt(data.shotVolume)
            rb5Custom.stageExplodeType = parseInt(data.explodeType)
            rb5Custom.stageFrameType = parseInt(data.frameType)
            rb5Custom.stageBackground = parseInt(data.background)
            rb5Custom.stageBackgroundBrightness = parseInt(data.backgroundBrightness)
            rb5Custom.stageHighSpeed = parseInt(data.highSpeed)
            rb5Custom.voiceMessageVolume = parseInt(data.voiceMessageVolume)
            rb5Custom.voiceMessageSet = parseInt(data.voiceMessageSet)

            rb5Config.musicSelectBgm = parseInt(data.backgroundMusic)
            rb5Config.bywordLeft = parseInt(data.bywordLeft)
            rb5Config.bywordRight = parseInt(data.bywordRight)
            rb5Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
            rb5Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true

            rb5LobbySettings.isEnabled = data.isLobbyEnabled != null

            let mylist: number[] | undefined = []
            try {
                mylist = JSON.parse(data.mylist)
            } catch {
                mylist = undefined
            }


            await DBM.update<IRb5PlayerBase>(data.refid, { collection: "rb.rb5.player.base" }, rb5Base)
            await DBM.update<IRb5PlayerConfig>(data.refid, { collection: "rb.rb5.player.config" }, rb5Config)
            await DBM.update<IRb5PlayerCustom>(data.refid, { collection: "rb.rb5.player.custom" }, rb5Custom)
            if (mylist) await DBM.upsert<IRb5Mylist>(data.refid, { collection: "rb.rb5.player.mylist" }, {
                collection: "rb.rb5.player.mylist",
                index: 0,
                mylist: mylist
            })
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