import { rb6MusicChartInfo } from "../../data/musicinfo/rb6_music_info"
import { IRb6CharacterCard } from "../../models/rb6/character_card"
import { IRb6ClasscheckRecord } from "../../models/rb6/classcheck_record"
import { IRb6MiscSettings } from "../../models/rb6/misc_settings"
import { generateRb6MusicRecord, IRb6MusicRecord } from "../../models/rb6/music_record"
import { IRb6Mylist } from "../../models/rb6/mylist"
import { IRb6PlayerAccount, IRb6PlayerBase, IRb6PlayerConfig, IRb6PlayerCustom } from "../../models/rb6/profile"
import { generateRbLobbySettings, IRbLobbySettings } from "../../models/utility/lobby"
import { WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../utility/db_manager"
import { UtilityHandlersWebUI } from "../utility/webui"

export namespace Rb6HandlersWebUI {
    export const updateSettings = async (data: {
        refid: string
        name: string
        comment: string
        gaugeType: string
        achievementRateDisplayingType: string
        objectSize: string
        sameTimeObjectsDisplayingType: string
        shotSound: string
        shotVolume: string
        explodeType: string
        frameType: string
        background: string
        backgroundBrightness: string
        bywordLeft: string
        bywordRight: string
        isAutoBywordLeft?: string
        isAutoBywordRight?: string
        bigBangEffectPerformingType: string
        rivalObjectsDisplayingType: string
        topAssistDisplayingType: string
        chatSoundSwitch: string
        highSpeed: string
        color: string
        isLobbyEnabled?: string
        rankingQuestIndex: string
        pastelEquipHead: string
        pastelEquipTop: string
        pastelEquipUnder: string
        pastelEquipArm: string
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

            let rb6Account = await DB.FindOne<IRb6PlayerAccount>(data.refid, { collection: "rb.rb6.player.account" })
            let rb6Base = await DB.FindOne<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" })
            let rb6Config = await DB.FindOne<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" })
            let rb6Custom = await DB.FindOne<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" })
            let rb6LobbySettings = generateRbLobbySettings(6, rb6Account.userId)
            // import operation
            if ((data.asphyxiaProfileTextToImport != null) && (data.asphyxiaScoresTextToImport != null) && (data.asphyxiaProfileTextToImport != "") && (data.asphyxiaScoresTextToImport != "")) {
                let p = checkData(data.asphyxiaProfileTextToImport)
                let s = checkData(data.asphyxiaScoresTextToImport)

                rb6Base = await importAsphyxia(rb6Base, p, s, data.refid)
            }

            rb6Base.name = data.name.trim()
            rb6Base.comment = data.comment
            // Customize page 1
            if (data.gaugeType) rb6Custom.stageClearGaugeType = parseInt(data.gaugeType)
            if (data.achievementRateDisplayingType) rb6Custom.stageAchievementRateDisplayingType = parseInt(data.achievementRateDisplayingType)
            if (data.objectSize) rb6Custom.stageObjectSize = parseInt(data.objectSize)
            if (data.sameTimeObjectsDisplayingType) rb6Custom.stageSameTimeObjectsDisplayingType = parseInt(data.sameTimeObjectsDisplayingType)
            // Customize page 2
            if (data.shotSound) rb6Custom.stageShotSound = parseInt(data.shotSound)
            if (data.shotVolume) rb6Custom.stageShotVolume = parseInt(data.shotVolume)
            if (data.explodeType) rb6Custom.stageExplodeType = parseInt(data.explodeType)
            if (data.frameType) rb6Custom.stageFrameType = parseInt(data.frameType)
            if (data.background) rb6Custom.stageBackground = parseInt(data.background)
            if (data.backgroundBrightness) rb6Custom.stageBackgroundBrightness = parseInt(data.backgroundBrightness)
            // Customize page 3
            if (data.bywordLeft) rb6Config.bywordLeft = parseInt(data.bywordLeft)
            if (data.bywordRight) rb6Config.bywordRight = parseInt(data.bywordRight)
            rb6Config.isAutoBywordLeft = data.isAutoBywordLeft ? true : false
            rb6Config.isAutoBywordRight = data.isAutoBywordRight ? true : false
            // Customize page 4
            if (data.bigBangEffectPerformingType) rb6Custom.stageBigBangEffectPerformingType = parseInt(data.bigBangEffectPerformingType)
            if (data.rivalObjectsDisplayingType) rb6Custom.stageRivalObjectsDisplayingType = parseInt(data.rivalObjectsDisplayingType)
            if (data.topAssistDisplayingType) rb6Custom.stageTopAssistDisplayingType = parseInt(data.topAssistDisplayingType)
            if (data.chatSoundSwitch) rb6Custom.stageChatSoundSwitch = parseInt(data.chatSoundSwitch)

            if (data.highSpeed) rb6Custom.stageHighSpeed = parseInt(data.highSpeed)
            if (data.color) rb6Custom.stageColorSpecified = parseInt(data.color)
            if (data.pastelEquipArm) rb6Base.pastelParts = [parseInt(data.pastelEquipHead), parseInt(data.pastelEquipTop), parseInt(data.pastelEquipUnder), parseInt(data.pastelEquipArm)]

            rb6LobbySettings.isEnabled = data.isLobbyEnabled != null

            let rb6Mylist: IRb6Mylist = {
                collection: "rb.rb6.player.mylist",
                index: 0,
                mylist: JSON.parse(data.mylist)
            }

            let rb6MiscSettings: IRb6MiscSettings = {
                collection: "rb.rb6.player.misc",
                rankingQuestIndex: data.rankingQuestIndex ? parseInt(data.rankingQuestIndex) : 0
            }

            await DBM.update<IRb6PlayerBase>(data.refid, { collection: "rb.rb6.player.base" }, rb6Base)
            await DBM.update<IRb6PlayerConfig>(data.refid, { collection: "rb.rb6.player.config" }, rb6Config)
            await DBM.update<IRb6PlayerCustom>(data.refid, { collection: "rb.rb6.player.custom" }, rb6Custom)
            await DBM.upsert<IRb6Mylist>(data.refid, { collection: "rb.rb6.player.mylist" }, rb6Mylist)
            await DBM.upsert<IRbLobbySettings<6>>(null, { collection: "rb.rb6.player.lobbySettings#userId", userId: rb6Account.userId }, rb6LobbySettings)
            await DBM.upsert<IRb6MiscSettings>(data.refid, { collection: "rb.rb6.player.misc" }, rb6MiscSettings)
            UtilityHandlersWebUI.pushMessage("Save RB Reflesia settings succeeded!", 6, WebUIMessageType.success, data.refid)
        } catch (e) {
            UtilityHandlersWebUI.pushMessage("Error occurred while saving RB Reflesia settings: " + e.message, 6, WebUIMessageType.error, data.refid)
        }
    }

    export const exportData = async (data: { refid: string }) => {
        let account = await DB.FindOne<IRb6PlayerAccount>(data.refid, { collection: "rb.rb6.player.account" })
        return await DBM.overall(data.refid, account.userId, "rb.rb6", "export")
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