import { C } from "../../utils/controller"
import { DBH } from "../../utils/db/dbh"
import { findChartInfoResponse, findCharts, rbChartInfo } from "../../data/tables/rb_chart_info"
import { findMusicInfo } from "../../data/tables/rb_music_info"
import { Rb6PlayerAccount, Rb6PlayerBase, Rb6PlayerConfig, Rb6PlayerCustom, Rb6PlayerReleasedInfo, Rb6PlayerStageLog } from "../../models/rb6/profile"
import { RbPlayerResponse, RbRequest, RbMusicRecordResponse, RbStageLogResponse, Rb6ChartType, RbColor, RbClasscheckResponse, RbPlayerPerformanceResponse, Rb6SettingsResponse, RbAvailableItemResponse, Rb6RankingQuestResponse, Rb6EquipmentInfo, Rb6CharacterCardInfo } from "../../models/shared/web"
import { toLiteralClearType } from "../../utils/rb_functions"
import { rb6PastelLevel } from "../../data/tables/rb6_pastel_level"
import { Rb6MusicRecord } from "../../models/rb6/music_record"
import { Rb6Classcheck } from "../../models/rb6/classcheck"
import { getRbByword } from "../../data/tables/rb_bywords"
import { hasLeapDay } from "../../utils/utility_functions"
import { rbItems } from "../../data/tables/rb_items"
import { Rb6Mylist } from "../../models/rb6/mylist"
import { RbLobbySettings } from "../../models/shared/lobby"
import { Rb6MiscSettings } from "../../models/rb6/misc_settings"
import { rb6RankingQuests } from "../../data/tables/rb6_ranking_quests"
import { rb6Equips } from "../../data/tables/rb6_equips"
import { rb6CharacterCards } from "../../data/tables/rb6_characard"
import { Rb6CharacterCard } from "../../models/rb6/character_card"

type V = 6
const version = 6 as const

export function registerRb6Controllers() {
    C.route("rb6ReadPlayer", readPlayer)
    C.route("rb6ReadPlayerPerformance", readPlayerPerformance)
    C.route("rb6ReadRecords", readRecords)
    C.route("rb6ReadClasschecks", readClasschecks)
    C.route("rb6ReadStageLogs", readStageLogs)
    C.route("rb6ReadSettings", readSettings)
    C.route("rb6ReadAvailableItems", readAvailableItems)
    C.route("rb6ReadRankingQuests", readRankingQuests)
    C.route("rb6ReadEquips", readEquips)
    C.route("rb6ReadCharacterCards", readCharacterCards)
}

const readPlayer: C.C<RbRequest, RbPlayerResponse> = async data => {
    const result = {} as RbPlayerResponse
    const account = await DBH.findOne<Rb6PlayerAccount>(data.rid, { collection: "rb.rb6.player.account" })
    const base = await DBH.findOne<Rb6PlayerBase>(data.rid, { collection: "rb.rb6.player.base" })
    if (!account || !base) return undefined
    const config = await DBH.findOne<Rb6PlayerConfig>(data.rid, { collection: "rb.rb6.player.config" })
    result.version = version
    result.userId = account.userId
    result.name = base.name
    result.comment = base.comment
    result.iconOrCharacter = config.characterCardId
    result.class = base.class
    result.classAchievementRate = base.classAchievementRateTimes100 / 100
    result.abilityPoint = base.abilityPointTimes100 / 100
    result.skillPoint = base.skillPointTimes10 / 10
    result.matchingGrade = base.matchingGrade
    result.playCount = account.playCount
    result.experiences = base.pastelExperiences
    const ls = await rb6PastelLevel
    result.extraValues = [-1 /* current experiences to next level **/, -1/* total experiences to next level **/]
    for (let i = 0; i < ls.length; i++) {
        const l = ls[i]
        if (base.pastelExperiences >= l.experiences && (l.experiencesToNextLevel < 0 || base.pastelExperiences < l.experiences + l.experiencesToNextLevel)) {
            result.level = l.level
            result.extraValues[0] = l.experiencesToNextLevel < 0 ? -1 : base.pastelExperiences - l.experiences
            result.extraValues[1] = l.experiencesToNextLevel
        }
    }
    result.bywords = {
        left: await getRbByword(version, RbColor.red, config.bywordLeft),
        right: await getRbByword(version, RbColor.blue, config.bywordRight)
    }
    return result
}
const readPlayerPerformance: C.C<RbRequest, RbPlayerPerformanceResponse<V>> = async data => {
    const activity = await statActivity(data.rid)
    const recentHighlightPlay = await Promise.all((await DBH.find<Rb6PlayerStageLog>(data.rid, { collection: "rb.rb6.playData.stageLog", time: { $exists: true, $gte: Date.now() / 1000 - 14 * 86400 } }))
        .sort((l, r) => r.achievementRateTimes100 - l.achievementRateTimes100 || r.time - l.time)
        .slice(0, 5)
        .map(toStageLogResponse))
    let totalScore = 0
    const totalScoreSeparated = [0, 0, 0, 0]
    const records = await DBH.find<Rb6MusicRecord>(data.rid, { collection: "rb.rb6.playData.musicRecord" })
    for (const r of records) {
        totalScore += r.score
        totalScoreSeparated[r.chartType] += r.score
    }
    return { activity, recentHighlightPlay, totalScore, totalScoreSeparated }
}
const readRecords: C.C<RbRequest, RbMusicRecordResponse<V>[]> = async data => {
    const result: { [K in number]: RbMusicRecordResponse<V> } = {}
    const records = await DBH.find<Rb6MusicRecord>(data.rid, { collection: "rb.rb6.playData.musicRecord" })
    for (const record of records) {
        const el: RbMusicRecordResponse<V> = result[record.musicId] ?? {
            version,
            musicId: record.musicId,
            music: await findMusicInfo(record.musicId, version),
            charts: await findCharts(record.musicId, version),
            scores: {}
        }
        if (!el.music) continue
        result[record.musicId] = el
        el.scores[record.chartType] = {
            score: record.score,
            clearType: toLiteralClearType(version, record.clearType, record.missCount, record.achievementRateTimes100),
            achievementRate: record.achievementRateTimes100 / 100,
            combo: record.combo,
            miss: record.missCount,
            playCount: record.playCount,
            battleStat: undefined,
            justCollectRate: {
                red: record.justCollectionRateTimes100Red / 100,
                blue: record.justCollectionRateTimes100Blue / 100
            },
            skillPoint: await calculateSkillPoint(record),
            lastPlay: new Date(record.time * 1000),
            update: new Date(Math.max(record.bestComboUpdateTime, record.bestScoreUpdateTime, record.bestMissCountUpdateTime, record.bestAchievementRateUpdateTime) * 1000)
        }
    }
    return Object.keys(result).map(k => result[k])
}
const readClasschecks: C.C<RbRequest, RbClasscheckResponse<V>[]> = async data => {
    const result: RbClasscheckResponse<V>[] = []
    const classchecks = await DBH.find<Rb6Classcheck>(data.rid, { collection: "rb.rb6.playData.classcheck" })
    classchecks.sort((l, r) => r.class - l.class)
    for (const c of classchecks) {
        const r: RbClasscheckResponse<V> = {
            version,
            class: c.class,
            clearType: c.clearType,
            totalScore: c.totalScore,
            averageAchievementRate: c.averageAchievementRateTimes100 / 100,
            playCount: c.playCount,
            lastPlay: new Date(c.lastPlayTime * 1000),
            update: new Date(c.recordUpdateTime * 1000),
            examination: undefined
        }
        result.push(r)
    }
    return result
}
const readStageLogs: C.C<RbRequest, RbStageLogResponse<V, Rb6ChartType>[]> = async data => await Promise.all((await DBH.find<Rb6PlayerStageLog>(data.rid, { collection: "rb.rb6.playData.stageLog" }))
    .sort((l, r) => r.time - l.time || r.stageIndex - l.stageIndex)
    .map(toStageLogResponse))
const readSettings: C.C<RbRequest, Rb6SettingsResponse> = async data => {
    const account = await DBH.findOne<Rb6PlayerAccount>(data.rid, { collection: "rb.rb6.player.account" })
    const base = await DBH.findOne<Rb6PlayerBase>(data.rid, { collection: "rb.rb6.player.base" })
    const custom = await DBH.findOne<Rb6PlayerCustom>(data.rid, { collection: "rb.rb6.player.custom" })
    const config = await DBH.findOne<Rb6PlayerConfig>(data.rid, { collection: "rb.rb6.player.config" })
    const lobbySettings = await DBH.findOne<RbLobbySettings<6>>(undefined, { collection: "rb.rb6.player.lobbySettings#userId", userId: account.userId }) ?? new RbLobbySettings(version, account.userId)
    const miscSettings = await DBH.findOne<Rb6MiscSettings>(data.rid, { collection: "rb.rb6.player.misc" }) ?? new Rb6MiscSettings()
    const mylist = await DBH.findOne<Rb6Mylist>(data.rid, { collection: "rb.rb6.player.mylist" })
    return {
        name: base.name,
        comment: base.comment ?? "",
        bywordLeft: config.bywordLeft,
        bywordRight: config.bywordRight,
        isAutoBywordLeft: config.isAutoBywordLeft,
        isAutoBywordRight: config.isAutoBywordRight,
        highSpeed: parseFloat((custom.stageHighSpeed / 10 + 1).toFixed(1)),
        clearGaugeType: custom.stageClearGaugeType,
        achievementRateDisplayingType: custom.stageAchievementRateDisplayingType,
        objectSize: custom.stageObjectSize,
        sameTimeObjectsDisplayingType: custom.stageSameTimeObjectsDisplayingType,
        shotSound: custom.stageShotSound,
        shotVolume: custom.stageShotVolume,
        explodeEffect: custom.stageExplodeType,
        frame: custom.stageFrameType,
        background: custom.stageBackground,
        backgroundBrightness: custom.stageBackgroundBrightness,
        backgroundMusic: config.musicSelectBgm,
        bigbangEffectPerformingType: custom.stageBigBangEffectPerformingType,
        rivalObjectsDisplayingType: custom.stageRivalObjectsDisplayingType,
        topAssistDisplayingType: custom.stageTopAssistDisplayingType,
        chatSoundSwitch: custom.stageChatSoundSwitch,
        colorSpecified: custom.stageColorSpecified,
        isLobbyEnabled: lobbySettings.isEnabled,
        rankingQuestIndex: miscSettings.rankingQuestIndex,
        pastelParts: base.pastelParts,
        characterCardId: config.characterCardId,
        mylist: mylist?.mylist ?? []
    }
}
const itemTypesAdditional = [6, 7, 9, 10, 11, 12] // [characard, byword, pastel_head, pastel_top, pastel_under, pastel_arms]
const defaultUnlockedItemsAdditional = [[], [0, 1], [0], [0], [0], [0]]
const readAvailableItems: C.C<RbRequest, RbAvailableItemResponse[]> = async data => {
    const released = await DBH.find<Rb6PlayerReleasedInfo>(data.rid, { collection: "rb.rb6.player.releasedInfo" })
    const result = (await rbItems).filter(i => i.version === version && (i.isUnlockedByDefault || released.some(r => r.type === i.typeId && r.id === i.value))).map(i => ({ typeId: i.typeId, value: i.value }))
    const additional = released.filter(r => itemTypesAdditional.includes(r.type)).map(r => ({ typeId: r.type, value: r.id }))
    for (let i = 0; i < itemTypesAdditional.length; i++) {
        for (const u of defaultUnlockedItemsAdditional[i]) {
            if (!additional.some(a => a.typeId === itemTypesAdditional[i] && a.value === u)) {
                additional.push({ typeId: itemTypesAdditional[i], value: u })
            }
        }
    }
    // it seems default character cards won't be saved as released info
    const defaultCharaCards = await DBH.find<Rb6CharacterCard>(data.rid, { collection: "rb.rb6.player.characterCard", characterCardId: { $gte: 0, $lte: 2 } })
    for (const charaCard of defaultCharaCards) if (!additional.find(c => c.typeId === 6 && c.value === charaCard.characterCardId)) additional.push({
        typeId: 6,
        value: charaCard.characterCardId
    })

    return [...result, ...additional]
}
const readEquips: C.C<{}, Rb6EquipmentInfo[]> = () => rb6Equips
const readCharacterCards: C.C<{}, Rb6CharacterCardInfo[]> = () => rb6CharacterCards

const readRankingQuests: C.C<{}, Rb6RankingQuestResponse[]> = async () => {
    const quests = await rb6RankingQuests
    return quests.map(q => ({
        id: q.rankingId,
        charts: [
            { musicId: q.musicId0, chartType: q.chartType0 },
            { musicId: q.musicId1, chartType: q.chartType1 },
            { musicId: q.musicId2, chartType: q.chartType2 }
        ]
    }))
}

async function toStageLogResponse(l: Rb6PlayerStageLog): Promise<RbStageLogResponse<V, Rb6ChartType>> {
    return {
        version,
        stageIndex: l.stageIndex,
        musicId: l.musicId,
        chartType: l.chartType,
        music: await findMusicInfo(l.musicId, version),
        chart: await findChartInfoResponse(l.musicId, version, l.chartType),
        color: l.color,
        matchingGrade: l.matchingGrade,
        score: l.score,
        achievementRate: l.achievementRateTimes100 / 100,
        clearType: toLiteralClearType(version, l.clearType, l.missCount, l.achievementRateTimes100),
        combo: l.combo,
        justCount: l.justCount,
        justReflecCount: l.justReflecCount,
        greatCount: l.greatCount,
        goodCount: l.goodCount,
        missCount: l.missCount,
        keepCount: l.keepCount,

        rivalStageIndex: l.stageIndex,
        rivalCpuId: l.rivalCpuId,
        rivalUserId: l.rivalUserId,
        rivalPlayerId: l.rivalPlayerId,
        rivalUserName: l.rivalUserId.toString(),
        rivalMatchingGrade: l.rivalMatchingGrade,
        rivalClearType: toLiteralClearType(version, l.rivalClearType, "RIVAL", l.rivalAchievementRateTimes100),
        rivalScore: l.rivalScore,
        rivalAchievementRate: l.rivalAchievementRateTimes100 / 100,

        time: new Date(l.time * 1000)
    }
}
async function statActivity(rid: string): Promise<Record<number, number>> {
    const result: Record<number, number> = {}
    const now = new Date()
    const queryStartDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (hasLeapDay() ? 365 : 364))
    const logs = await DBH.find<Rb6PlayerStageLog>(rid, { collection: "rb.rb6.playData.stageLog", stageIndex: 0, time: { $exists: true, $gte: queryStartDate.valueOf() / 1000 } })
    const offset = 86400 - (now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds() + now.getMilliseconds() / 1000)
    for (const l of logs) {
        const d = Math.floor((now.valueOf() / 1000 + offset - l.time) / 86400)
        if (result[d] === undefined) result[d] = 1
        else result[d]++
    }
    return result
}
async function calculateSkillPoint(record: Rb6MusicRecord): Promise<number> {
    const chart = (await rbChartInfo).find(ci => ci.musicId === record.musicId && ci.chartType === record.chartType)
    if (!chart || chart.maxJustReflec < 0) return -1
    // formulae are come from bemaniwiki.com
    const maxScore = (chart.maxCombo - chart.maxKeepCount) * 6 + chart.maxKeepCount + chart.maxJustReflec * 10 + 50
    const result = Math.min((record.score / maxScore) * (record.combo / chart.maxCombo) * chart.skillRate * 2, chart.skillRate * 2) // a very little charts can break up the max score limit like refrain (HARD, Reflesia). So cap it.
    return parseFloat(result.toFixed(2))
}