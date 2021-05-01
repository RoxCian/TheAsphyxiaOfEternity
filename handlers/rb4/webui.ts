import { IRb4Mylist } from "../../models/rb4/mylist"
import { IRb4PlayerAccount, IRb4PlayerBase, IRb4PlayerConfig, IRb4PlayerCustom } from "../../models/rb4/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb4HandlersWebUI {
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
            let rb4Account = await DB.FindOne<IRb4PlayerAccount>(data.refid, { collection: "rb.rb4.player.account" })
            let rb4Base = await DB.FindOne<IRb4PlayerBase>(data.refid, { collection: "rb.rb4.player.base" })
            let rb4Config = await DB.FindOne<IRb4PlayerConfig>(data.refid, { collection: "rb.rb4.player.config" })
            let rb4Custom = await DB.FindOne<IRb4PlayerCustom>(data.refid, { collection: "rb.rb4.player.custom" })
            let rb4LobbySettings = generateRbLobbySettings(4, rb4Account.userId)

            rb4Base.name = data.name.trim()
            rb4Base.comment = data.comment
            rb4Custom.stageClearGaugeType = data.gaugeType
            rb4Custom.stageMainGaugeType = data.mainGaugeType
            rb4Custom.stageAchievementRateDisplayingType = data.achievementRateDisplayingType
            rb4Custom.stageObjectSize = data.objectSize
            rb4Custom.stageSameTimeObjectsDisplayingType = data.sameTimeObjectsDisplayingType
            rb4Custom.stageShotSound = data.shotSound
            rb4Custom.stageShotVolume = data.shotVolume
            rb4Custom.stageExplodeType = data.explodeType
            rb4Custom.stageFrameType = data.frameType
            rb4Custom.stageBackground = data.background
            rb4Custom.stageBackgroundBrightness = data.backgroundBrightness
            rb4Custom.stageTouchMarkerDisplayingType = data.touchMarker
            rb4Config.bywordLeft = data.bywordLeft
            rb4Config.bywordRight = data.bywordRight
            rb4Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
            rb4Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true

            rb4LobbySettings.isEnabled = data.isLobbyEnabled != null

            let rb4Mylist: IRb4Mylist = {
                collection: "rb.rb4.player.mylist",
                index: 0,
                mylist: JSON.parse(data.mylist)
            }

            await DBM.update<IRb4PlayerBase>(data.refid, { collection: "rb.rb4.player.base" }, rb4Base)
            await DBM.update<IRb4PlayerConfig>(data.refid, { collection: "rb.rb4.player.config" }, rb4Config)
            await DBM.update<IRb4PlayerCustom>(data.refid, { collection: "rb.rb4.player.custom" }, rb4Custom)
            await DBM.upsert<IRb4Mylist>(data.refid, { collection: "rb.rb4.player.mylist" }, rb4Mylist)
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