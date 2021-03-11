import { rb6MusicChartInfo } from "../../data/musicinfo/rb6_music_info"
import { IRb6CharacterCard } from "../../models/rb6/character_card"
import { IRb6ClasscheckRecord } from "../../models/rb6/classcheck_record"
import { generateRb6MusicRecord, IRb6MusicRecord } from "../../models/rb6/music_record"
import { IRb6Mylist } from "../../models/rb6/mylist"
import { IRb6PlayerBase, IRb6PlayerConfig, IRb6PlayerCustom } from "../../models/rb6/profile"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"
import { Rb6HandlersCommon } from "./common"
import { operateDataInternal } from "./data"

export namespace Rb6HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
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
        color: number
        pastelEquipHead: number
        pastelEquipTop: number
        pastelEquipUnder: number
        pastelEquipArm: number
        mylist: string
        textToOverride: string
        asphyxiaProfileTextToImport: string
        asphyxiaScoresTextToImport: string
    }) => {
        try {
            // override operation
            // Rb6Common.log(data.textToOverride)
            // if (data.textToOverride.length > 0) {
            //     let f = data.textToOverride[0]
            //     let d = await checkFile(f, data.refid)
            //     let r = await operateDataInternal(data.refid, "override", d)
            //     if (r != null) throw new Error(r)
            // }

            let rb6Base = await DB.FindOne<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" })
            let rb6Config = await DB.FindOne<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" })
            let rb6Custom = await DB.FindOne<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" })
            // import operation
            if ((data.asphyxiaProfileTextToImport != null) && (data.asphyxiaScoresTextToImport != null) && (data.asphyxiaProfileTextToImport != "") && (data.asphyxiaScoresTextToImport != "")) {
                let p = checkData(data.asphyxiaProfileTextToImport)
                let s = checkData(data.asphyxiaScoresTextToImport)

                rb6Base = await importAsphyxia(rb6Base, p, s, data.refid)
            }

            // const mapCharacters = (s: string) => {
            //     let patternLc = /[a-z]/
            //     let patternUc = /[A-Z]/
            //     let patternNum = /[0-9]/
            //     let resultCharCodes: number[] = []
            //     for (let i = 0; i < s.length; i++) {
            //         let c = s[i]
            //         let cc = s.charCodeAt(i)
            //         if (patternUc.test(c)) resultCharCodes.push(cc - "A".charCodeAt(0) + 65313)
            //         else if (patternLc.test(c)) resultCharCodes.push(cc - "a".charCodeAt(0) + 65345)
            //         else if (patternNum.test(c)) resultCharCodes.push(cc - "0".charCodeAt(0) + 65296)
            //         else if (c == " ") resultCharCodes.push(12288)
            //         else resultCharCodes.push(cc)
            //     }
            //     return String.fromCharCode(...resultCharCodes)
            // }

            rb6Base.name = data.name.trim()
            rb6Base.comment = data.comment
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
            rb6Custom.stageColorSpecified = data.color
            rb6Base.pastelParts = [data.pastelEquipHead, data.pastelEquipTop, data.pastelEquipUnder, data.pastelEquipArm]

            let rb6Mylist: IRb6Mylist = {
                collection: "rb.rb6.player.mylist",
                index: 0,
                mylist: JSON.parse(data.mylist)
            }

            await DBM.update<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" }, rb6Base)
            await DBM.update<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" }, rb6Config)
            await DBM.update<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" }, rb6Custom)
            await DBM.upsert<IRb6Mylist>(data.refid, { collection: "rb.rb6.player.mylist" }, rb6Mylist)
            UtilityHandlersWebUI.pushMessage("Save RB Reflesia settings succeeded!", WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error while save RB Reflesia settings: " + e.message, WebUIMessageType.error, data.refid)
        }
    }

    export const exportData = async (data: { refid: string }) => {
        return await operateDataInternal(data.refid, "export")
    }



    function checkData(content: string, rid?: string) {
        try {
            let result: Doc<{ __refid?: string }>[] = JSON.parse(content)
            if (rid == null) return result
            if (!Array.isArray(result)) return result
            for (let d of result) {
                if (d?.__refid != rid) throw new Error("This savedata is not belongs to you.")
            }
        } catch (e) {
            throw new Error("The data is not a json data.")
        }
    }

    async function importAsphyxia(rb6Base: IRb6PlayerBase, profile: any, scores: any[], rid: string): Promise<IRb6PlayerBase> {
        try {
            let dataToUpsert: {
                doc: Doc<any>
                query: Query<any>
            }[] = []

            let validCheckKeys = ["ap", "mg", "skillPoint", "pastelExp"]
            for (let k of validCheckKeys) if (profile[k] == null) throw new Error

            for (let kd in profile.dojo) {
                if (parseInt(kd).toString() != kd) continue
                let dojoData = profile.dojo[kd]
                let query: Query<IRb6ClasscheckRecord> = { collection: "rb.rb6.playData.classcheck", class: parseInt(kd) }
                let classcheck = await DB.FindOne<IRb6ClasscheckRecord>(rid, query)
                if (classcheck == null) {
                    classcheck = {
                        collection: "rb.rb6.playData.classcheck",
                        class: parseInt(kd),
                        clearType: dojoData.clear,
                        averageAchievementRateTimes100: dojoData.ar,
                        rank: dojoData.rank,
                        playCount: dojoData.pc,
                        recordUpdateTime: dojoData.update,
                        lastPlayTime: dojoData.time,
                        totalScore: dojoData.score
                    }
                } else {
                    let needsToUpdates = []
                    if (classcheck.clearType < dojoData.clear) {
                        needsToUpdates.push(true)
                        classcheck.clearType = dojoData.clear
                    }
                    if (classcheck.averageAchievementRateTimes100 < dojoData.ar) {
                        needsToUpdates.push(true)
                        classcheck.averageAchievementRateTimes100 = dojoData.ar
                    }
                    if (classcheck.totalScore < dojoData.score) {
                        needsToUpdates.push(true)
                        classcheck.totalScore = dojoData.score
                    }
                    if (classcheck.rank < dojoData.rank) {
                        needsToUpdates.push(true)
                        classcheck.rank = dojoData.rank
                    }
                    classcheck.playCount += dojoData.pc
                    if (classcheck.lastPlayTime < dojoData.time) classcheck.lastPlayTime = dojoData.time
                    if (needsToUpdates.length == 4) classcheck.recordUpdateTime = dojoData.update
                    else if ((needsToUpdates.length > 0) && (classcheck.recordUpdateTime < dojoData.update)) classcheck.recordUpdateTime = dojoData.update
                }
                if (classcheck.class > rb6Base.class) {
                    rb6Base.class = classcheck.class
                    rb6Base.classAchievrementRateTimes100 = classcheck.averageAchievementRateTimes100
                } else if ((classcheck.class == rb6Base.class) && (rb6Base.classAchievrementRateTimes100 < classcheck.averageAchievementRateTimes100)) rb6Base.classAchievrementRateTimes100 = classcheck.averageAchievementRateTimes100
                dataToUpsert.push({ doc: classcheck, query: query })
            }
            for (let kc in profile.charas) {
                if (parseInt(kc).toString() != kc) continue
                let chara = profile.charas[kc]
                let query: Query<IRb6CharacterCard> = { collection: "rb.rb6.player.characterCard", characterCardId: parseInt(kc) }
                let characterCard: IRb6CharacterCard = await DB.FindOne<IRb6CharacterCard>(rid, query)
                if (characterCard == null) {
                    characterCard = {
                        collection: "rb.rb6.player.characterCard",
                        characterCardId: parseInt(kc),
                        level: chara.level,
                        experience: chara.exp
                    }
                } else {
                    characterCard.level = Math.max(characterCard.level, chara.lv)
                    characterCard.experience = Math.max(characterCard.experience, chara.exp)
                }
                dataToUpsert.push({ doc: characterCard, query: query })
            }
            for (let ks in scores) {
                if (!/[0-9]{1,4}:[0-3]/.test(ks)) continue
                let mid = parseInt(ks.split(":")[0])
                let chart = parseInt(ks.split(":")[1])
                let s = scores[ks]

                let validCheckKeys2 = ["ar", "ct", "scr", "ms", "combo", "param", "time"]
                for (let k of validCheckKeys2) if (s[k] == null) throw new Error

                let query: Query<IRb6MusicRecord> = { collection: "rb.rb6.playData.musicRecord", musicId: mid, chartType: chart }
                let musicRecord: IRb6MusicRecord = await DB.FindOne<IRb6MusicRecord>(rid, query)
                let chartTypeKeys: ["basic", "medium", "hard", "whitehard"] = ["basic", "medium", "hard", "whitehard"]
                let musicInfo = rb6MusicChartInfo[mid]
                let chartInfo = musicInfo.chartsInfo[chartTypeKeys[chart]]

                if (musicRecord == null) {
                    musicRecord = generateRb6MusicRecord(mid, chart)
                    musicRecord.achievementRateTimes100 = s.ar
                    musicRecord.clearType = s.ct
                    musicRecord.score = s.scr
                    musicRecord.combo = s.combo
                    musicRecord.missCount = (s.combo == chartInfo.maxCombo) ? 0 : (s.ms <= 0) ? ((s.ct >= 3) ? 5 : -1) : s.ms
                    musicRecord.param = (s.combo == chartInfo.maxCombo) ? (s.param == 0) ? 1 : s.param : s.param
                    musicRecord.playCount = s.pc
                    musicRecord.time = s.time
                    musicRecord.bestComboUpdateTime = s.time
                    musicRecord.bestAchievementRateUpdateTime = s.time
                    musicRecord.bestMissCountUpdateTime = s.time
                    musicRecord.bestScoreUpdateTime = s.time
                } else {
                    if (musicRecord.clearType < s.ct) musicRecord.clearType = s.ct
                    if (musicRecord.achievementRateTimes100 < s.ar) {
                        musicRecord.bestAchievementRateUpdateTime = s.time
                        musicRecord.achievementRateTimes100 = s.ar
                    }
                    if (musicRecord.score < s.score) {
                        musicRecord.bestScoreUpdateTime = s.time
                        musicRecord.score = s.score
                    }
                    if (musicRecord.combo < s.combo) {
                        musicRecord.bestComboUpdateTime = s.time
                        musicRecord.combo = s.combo
                    }
                    if (musicRecord.param < s.param) musicRecord.param = s.param
                    if ((s.ms > 0) && ((musicRecord.missCount < s.ms) || (musicRecord.missCount < 0))) {
                        musicRecord.bestMissCountUpdateTime = s.time
                        musicRecord.missCount = s.ms
                    }
                    if ((musicRecord.combo == chartInfo.maxCombo) && ((musicRecord.missCount != 0) || (musicRecord.param == 0))) {
                        musicRecord.bestMissCountUpdateTime = s.time
                        musicRecord.missCount = 0
                        if (musicRecord.param == 0) musicRecord.param = 1
                    }
                    musicRecord.playCount += s.pc
                    musicRecord.time = Math.max(musicRecord.time, s.time)
                }
                dataToUpsert.push({ doc: musicRecord, query: query })
            }

            let musicRecords = await DB.Find<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord" })
            let oldEntryCount = musicRecords.length
            for (let d of dataToUpsert) await DBM.upsert(rid, d.query, d.doc)
            musicRecords = await DB.Find<IRb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord" })
            let newEntryCount = musicRecords.length


            rb6Base.abilityPointTimes100 = Math.trunc((rb6Base.abilityPointTimes100 * oldEntryCount + profile.ap * (newEntryCount - oldEntryCount)) / newEntryCount)
            rb6Base.matchingGrade = Math.max(rb6Base.matchingGrade, profile.mg)
            rb6Base.skillPointTimes10 = Math.max(rb6Base.skillPointTimes10, profile.skillPoint)
            rb6Base.pastelExperiences += profile.pastelExp

            return rb6Base
        } catch (e) {
            throw new Error("The data may not an appropriate Asphyxia savedata.")
        }
    }
}