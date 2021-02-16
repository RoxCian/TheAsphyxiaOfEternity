import { IRb6Mylist } from "../models/rb6/mylist"
import { IRb6PlayerAccount, IRb6PlayerBase, IRb6PlayerConfig, IRb6PlayerCustom } from "../models/rb6/profile"

export namespace Rb6WebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        gaugeType: number
        achievementRateDisplayingType: number
        objectSize: number
        sameTimeObjectsDisplayingType: number
        shotSound: number
        shotVolume: number
        explodeType: number
        frameType: number
        background: number
        backgroundBrightness: number
        bywordLeft: number
        bywordRight: number
        isAutoBywordLeft?: string
        isAutoBywordRight?: string
        bigBangEffectPerformingType: number
        rivalObjectsDisplayingType: number
        topAssistDisplayingType: number
        chatSoundSwitch: number
        highSpeed: number
        mylist: string
    }) => {
        let rb6Base = await DB.FindOne<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" })
        let rb6Config = await DB.FindOne<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" })
        let rb6Custom = await DB.FindOne<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" })
        const mapCharacters = (s: string) => {
            let patternLc = /[a-z]/
            let patternUc = /[A-Z]/
            let patternNum = /[0-9]/
            let resultCharCodes: number[] = []
            for (let i = 0; i < s.length; i++) {
                let c = s[i]
                let cc = s.charCodeAt(i)
                if (patternUc.test(c)) resultCharCodes.push(cc - "A".charCodeAt(0) + 65313)
                else if (patternLc.test(c)) resultCharCodes.push(cc - "a".charCodeAt(0) + 65345)
                else if (patternNum.test(c)) resultCharCodes.push(cc - "0".charCodeAt(0) + 65296)
                else if (c == " ") resultCharCodes.push(12288)
                else resultCharCodes.push(cc)
            }
            return String.fromCharCode(...resultCharCodes)
        }

        rb6Base.name = mapCharacters(data.name.trim())
        // Customize page 1
        rb6Custom.stageClearGaugeType = data.gaugeType
        rb6Custom.stageAchievementRateDisplayingType = data.achievementRateDisplayingType
        rb6Custom.stageObjectSize = data.objectSize
        rb6Custom.stageSameTimeObjectsDisplayingType = data.sameTimeObjectsDisplayingType
        // Customize page 2
        rb6Custom.stageShotSound = data.shotSound
        rb6Custom.stageShotVolume = data.shotVolume
        rb6Custom.stageExplodeType = data.explodeType
        rb6Custom.stageFrameType = data.frameType
        rb6Custom.stageBackground = data.background
        rb6Custom.stageBackgroundBrightness = data.backgroundBrightness
        // Customize page 3
        rb6Config.bywordLeft = data.bywordLeft
        rb6Config.bywordRight = data.bywordRight
        rb6Config.isAutoBywordLeft = (data.isAutoBywordLeft == null) ? false : true
        rb6Config.isAutoBywordRight = (data.isAutoBywordRight == null) ? false : true
        // Customize page 4
        rb6Custom.stageBigBangEffectPerformingType = data.bigBangEffectPerformingType
        rb6Custom.stageRivalObjectsDisplayingType = data.rivalObjectsDisplayingType
        rb6Custom.stageTopAssistDisplayingType = data.topAssistDisplayingType
        rb6Custom.stageChatSoundSwitch = data.chatSoundSwitch

        rb6Custom.stageHighSpeed = data.highSpeed

        let rb6Mylist: IRb6Mylist = {
            collection: "rb.rb6.player.mylist",
            index: 0,
            mylist: JSON.parse(data.mylist)
        }

        await DB.Update<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" }, rb6Base)
        await DB.Update<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" }, rb6Config)
        await DB.Update<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" }, rb6Custom)
        await DB.Update<IRb6Mylist>(data.refid, { collection: "rb.rb6.player.mylist" }, rb6Mylist)
    }
}