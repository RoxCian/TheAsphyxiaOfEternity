import { DBH } from "../utils/db/dbh"
import { Batch } from "./batch"
import { Rb6JustCollection } from "../models/rb6/just_collection"
import { Rb3Equip, Rb3Order, Rb3OrderDetails, Rb3PlayerAccount } from "../models/rb3/profile"
import { Rb6Ghost } from "../models/rb6/ghost"
import { Rb6PlayerAccount, Rb6PlayerBase, Rb6PlayerConfig, Rb6PlayerStageLog, Rb6QuestRecord } from "../models/rb6/profile"
import { Rb6MusicRecord } from "../models/rb6/music_record"
import { Rb4Classcheck } from "../models/rb4/classcheck"
import { Rb5Classcheck } from "../models/rb5/classcheck"
import { Rb6Classcheck } from "../models/rb6/classcheck"
import { Rb4PlayerStageLog } from "../models/rb4/profile"
import { Rb5PlayerConfig, Rb5PlayerStageLog } from "../models/rb5/profile"
import { Rb3OrderDetailsParamFlag, Rb4DojoIndex, RbVersionWithClasscheck } from "../models/shared/rb_types"
import { rb3OrdersInfo } from "../data/tables/rb3_orders"
import { ICollection } from "../utils/db/db_types"

export function initializeBatch() {
    Batch.register("batch#0.11.11.part2", "2.0.0", async () => {
        const jc = await DBH.find<Rb6JustCollection>({ collection: "rb.rb6.playData.justCollection#userId" })
        for (const e of jc) {
            if (!e.userId) {
                await DBH.remove({ _id: e._id })
                continue
            }
            if (!e["redData"] && !e["blueData"] && !e["redDataArray"] && !e["blueDataArray"]) continue
            delete e["redData"]
            delete e["blueData"]
            delete e["redDataArray"]
            delete e["blueDataArray"]

            await DBH.update({ collection: "rb.rb6.playData.justCollection#userId", userId: e.userId, musicId: e.musicId, chartType: e.chartType }, e)
        }
    })
    Batch.register("batch#0.12.0.part2", "1.2.0", async () => {
        const a = await DBH.find<Rb3PlayerAccount>(undefined, { collection: "rb.rb3.player.account" })
        for (const account of a) {
            delete account["dpc"]
            delete account["tdc"]
            await DBH.update(account.rid, { collection: "rb.rb3.player.account", __refid: account.rid }, account)
        }
    })
    Batch.register("batch#1.2.0", "2.0.0", async () => {
        const g = await DBH.find<Rb6Ghost>({ collection: "rb.rb6.playData.ghost#userId" })
        const accountsCache = new Map<number, Rb6PlayerAccount>()
        for (const ghost of g) {
            if (!ghost.userId) continue
            const account = accountsCache.get(ghost.userId) || await DBH.findOne<Rb6PlayerAccount>(undefined, { collection: "rb.rb6.player.account", userId: ghost.userId })
            if (!account) continue
            accountsCache.set(ghost.userId, account)
            const rid = account.rid
            const update: Update<Rb6MusicRecord> = { $set: {} }
            if (ghost.blueDataBase64) update.$set!.isHasGhostBlue = true
            if (ghost.redDataBase64) update.$set!.isHasGhostRed = true
            DBH.update<Rb6MusicRecord>(rid, { collection: "rb.rb6.playData.musicRecord", musicId: ghost.musicId, chartType: ghost.chartType }, update)
        }
    })
    Batch.register("batch#2.0.0", "2.0.0", async () => {
        const records = await DBH.find<Rb6MusicRecord>(undefined, { collection: "rb.rb6.playData.musicRecord" })
        const modifiedRecords: Doc<Rb6MusicRecord>[] = []
        // fill justcol rate with 0
        for (const r of records) {
            if (r.justCollectionRateTimes100Red != undefined && r.justCollectionRateTimes100Blue != undefined) continue
            r.justCollectionRateTimes100Red ??= 0
            r.justCollectionRateTimes100Blue ??= 0
            modifiedRecords.push(r)
        }
        for (const r of modifiedRecords) await DBH.update((r as any).__refid, { _id: r._id }, r)

        // typo fix: classAchievrementRateTimes100 -> classAchievementRateTimes100
        await renameField<Rb6PlayerBase>("classAchievementRateTimes100", "classAchievrementRateTimes100", { collection: "rb.rb6.player.base" }, true)
    })
    Batch.register("batch#2.0.0.part2", "2.0.0", async () => {
        // append stage log into classcheck records
        const t = new DBH.T()
        const classchecks = await t.find(undefined, { collection: { $in: ["rb.rb4.playData.classcheck", "rb.rb5.playData.classcheck", "rb.rb6.playData.classcheck"] } } as Query<Rb4Classcheck | Rb5Classcheck | Rb6Classcheck>)
        for (const classcheck of classchecks) {
            if (classcheck.stageLogs) continue
            const rid: string = (classcheck as any).__refid
            if (!rid) continue
            const version = (classcheck.collection.charCodeAt(5) - 48) as RbVersionWithClasscheck
            const stageLogs = await t.find(rid, { collection: { $in: [`rb.rb${version}.playData.stageLog`] }, time: { $lte: classcheck.recordUpdateTime, $gte: classcheck.recordUpdateTime - 10 * 60 /** 10min offset */ } } as Query<Rb4PlayerStageLog | Rb5PlayerStageLog | Rb6PlayerStageLog>)
            stageLogs.sort((l, r) => l.time - r.time)
            for (let i = stageLogs.length - 1; i >= 0; i--) {
                if (stageLogs[i].stageIndex !== 0) continue
                if (classcheck.collection === "rb.rb4.playData.classcheck") {
                    t.update<Rb4Classcheck>(rid, { collection: "rb.rb4.playData.classcheck", class: classcheck.class as Rb4DojoIndex }, {
                        $set: {
                            stageLogs: stageLogs.splice(i) as Rb4PlayerStageLog[],
                            totalCompletionScore: (classcheck as any)["totalScore"],
                            averageCompletionRateTimes100: (classcheck as any)["averageAchievementRateTimes100"],
                            separateCompletionScore: (classcheck as any)["seperateScore"],
                            separateCompletionRateTimes100: (classcheck as any)["seperateAchievementRateTimes100"]
                        },
                        $unset: {
                            musicsId: true,
                            chartsType: true,
                            totalScore: true,
                            averageAchievementRateTimes100: true,
                            seperateScore: true,
                            seperateAchievementRateTimes100: true
                        }
                    })
                } else {
                    t.update<typeof classcheck>(rid, { collection: classcheck.collection, class: classcheck.class } as Query<Rb5Classcheck | Rb6Classcheck>, { $set: { stageLogs: stageLogs.splice(i) as any } })
                }
                break
            }
        }
        await t.commit()
    })
    Batch.register("batch#2.0.0.part2-1", "2.0.0", async () => {
        // append stage log into dungeon records for RB Reflesia
        const t = new DBH.T()
        const quests = await t.find<Rb6QuestRecord>(undefined, { collection: "rb.rb6.playData.quest" })
        for (const quest of quests) {
            if (quest.stageLogs) continue
            const rid: string = (quest as any).__refid
            if (!rid) continue
            const time = quest.updateTime ? quest.updateTime : quest.lastPlayTime
            const stageLogs = await t.find<Rb6PlayerStageLog>(rid, { collection: "rb.rb6.playData.stageLog", time: { $lte: time, $gte: time - 10 * 60 /** 10min offset */ } })
            stageLogs.sort((l, r) => l.time - r.time)
            for (let i = stageLogs.length - 1; i >= 0; i--) {
                if (stageLogs[i].stageIndex !== 0) continue
                t.update<Rb6QuestRecord>(rid, { collection: "rb.rb6.playData.quest", dungeonId: quest.dungeonId, dungeonGrade: quest.dungeonGrade, $and: (quest.dungeonId === 47) ? [{ rankingId: quest.rankingId }] : [] }, { $set: { stageLogs: stageLogs.splice(i) } })
                break
            }
        }
        await t.commit()
    })

    Batch.register("batch#2.0.0.part3", "2.0.0", async () => {
        // fix order shop / equip experiences for RB colette
        const t = new DBH.T()
        const orders = await t.find<Rb3Order>(undefined, { collection: "rb.rb3.player.order" })
        const ordersInfo = await rb3OrdersInfo
        for (const order of orders) {
            const orderDetailsToAddClearCount: Rb3OrderDetails[] = []
            const equipsToSetExp: Rb3Equip[] = []
            const rid: string = (order as any).__refid
            if (!rid) continue
            console.log(rid)
            const equips = await DBH.find<Rb3Equip>(rid, { collection: "rb.rb3.player.equip" })
            const details = order.details ?? []
            for (const d of details) {
                const info = ordersInfo.find(i => i.id === d.index)
                if (!info) continue
                const cond = info.unlockCondition
                if (cond.allOrdersCleared) {
                    for (const idClear of cond.allOrdersCleared) {
                        const detailToCheck = details.find(_d => _d.index === idClear) ?? new Rb3OrderDetails(idClear)
                        if (detailToCheck.clearedCount > 0 || orderDetailsToAddClearCount.find(_d => _d.index === idClear)) continue
                        orderDetailsToAddClearCount.push(detailToCheck)
                    }
                }
                if (cond.anyOrdersCleared) {
                    const clearedCount = new Set([
                        ...details.filter(_d => cond.anyOrdersCleared!.includes(_d.index) && _d.clearedCount > 0).map(_d => _d.index),
                        ...orderDetailsToAddClearCount.filter(_d => cond.anyOrdersCleared!.includes(_d.index)).map(_d => _d.index)
                    ]).size
                    if (clearedCount < (cond.anyOrdersClearedCount ?? 1)) {
                        let i = clearedCount
                        for (const idClear of cond.anyOrdersCleared) {
                            const detailToCheck = details.find(_d => _d.index === idClear) ?? new Rb3OrderDetails(idClear)
                            if (detailToCheck.clearedCount > 0) continue
                            if (!orderDetailsToAddClearCount.find(_d => _d.index === idClear)) orderDetailsToAddClearCount.push(detailToCheck)
                            i++
                            if (i >= (cond.anyOrdersClearedCount ?? 1)) break
                        }
                    }
                }
            }
            for (const d of details) {
                const info = ordersInfo.find(i => i.id === d.index)
                if (!info) continue
                const cond = info.unlockCondition
                if (!cond.equipCondition) continue
                const eq = equips.find(_eq => _eq.index === cond.equipCondition!.index && _eq.stype === cond.equipCondition!.season) ??
                    equipsToSetExp.find(_eq => _eq.index === cond.equipCondition!.index && _eq.stype === cond.equipCondition!.season) ??
                    new Rb3Equip(cond.equipCondition.season, cond.equipCondition.index, 0)
                let minExp = 0
                let previousOrdersId: number[] = []
                console.log(d.index, ",", JSON.stringify(cond.equipCondition))
                switch (cond.equipCondition!.experiences) {
                    case 0:
                        // orders for rank 2 equips
                        if (d.clearedCount > 0 && eq.experience < 1) minExp = 1
                        break
                    case 1:
                        // orders for rank 3 equips
                        minExp = d.clearedCount > 0 ? 2 : 1
                        previousOrdersId = [d.index - 1]
                        break
                    case 2:
                        // orders for rank 4 equips
                        minExp = d.clearedCount > 0 ? 4 : 2
                        previousOrdersId = [d.index - 1, d.index - 2]
                        break
                    case 4:
                        // orders for rank 5 equips
                        minExp = d.clearedCount > 0 ? 7 : 4
                        previousOrdersId = [d.index - 1, d.index - 2, d.index - 3]
                        break
                    case 7:
                        // orders for rank 6 equips
                        minExp = d.clearedCount > 0 ? 12 : 7
                        previousOrdersId = [d.index - 1, d.index - 2, d.index - 3, d.index - 4]
                        break
                }
                if (eq.experience < minExp) {
                    eq.experience = minExp
                    if (!equipsToSetExp.includes(eq)) equipsToSetExp.push(eq)
                }
                if (eq.index === 0 && eq.stype === 0) {
                    console.log("0, 0:", minExp, JSON.stringify(eq))
                }
                const previousOrders = previousOrdersId.map(_i => details.find(_d => _d.index === _i) ?? new Rb3OrderDetails(_i))
                for (const _o of previousOrders) if (_o.clearedCount < 1 && !orderDetailsToAddClearCount.find(_d => _d.index === _o.index)) {
                    orderDetailsToAddClearCount.push(_o)
                }
            }

            if (orderDetailsToAddClearCount.length > 0) {
                order.details ??= details
                for (const d of orderDetailsToAddClearCount) {
                    d.clearedCount = 1
                    d.param = d.param >= 1 ? d.param : Rb3OrderDetailsParamFlag.unlocked
                    const index = details.findIndex(_d => _d.index === d.index)
                    if (index < 0) details.push(d)
                    else details[index] = d
                }
                t.update(rid, { collection: "rb.rb3.player.order" }, order)
            }
            for (const eq of equipsToSetExp) {
                t.upsert(rid, { collection: "rb.rb3.player.equip", stype: eq.stype, index: eq.index }, eq)
            }
        }
        console.log(JSON.stringify(t))
        await t.commit()
    })
    Batch.register("batch#2.0.0.part4", "2.0.0", async () => {
        // field name fix
        // noteGrade -> chartType
        const t = new DBH.T()
        const rb6Configs = await t.find<Rb6PlayerConfig>(undefined, { collection: "rb.rb6.player.config" })
        const rb5Configs = await t.find<Rb5PlayerConfig>(undefined, { collection: "rb.rb5.player.config" })
        for (const conf of [...rb6Configs, ...rb5Configs]) {
            const rid = (conf as any).__refid as string
            if (!rid) continue
            conf.lastChartType = (conf as any)["lastNoteGrade"]
            conf.defaultChartType = (conf as any)["defaultNoteGrade"]
            delete (conf as any)["lastNoteGrade"]
            delete (conf as any)["defaultNoteGrade"]
            t.update(rid, { collection: conf.collection }, conf)
        }
        await t.commit()
    })
}

async function renameField<T extends ICollection<any>>(key: keyof T | (keyof T)[], oldKey: string | string[], query: Query<T>, hasRid: boolean, saveQueryCreator?: (data: T) => Query<T>) {
    const t = new DBH.T()
    const values = await t.find(undefined, query)
    for (const value of values) {
        if (typeof key === "string") {
            if (value[key] == undefined) value[key] = (value as any)[typeof oldKey === "string" ? oldKey : oldKey[0]]
            delete (value as any)[typeof oldKey === "string" ? oldKey : oldKey[0]]
            const saveQuery = saveQueryCreator?.(value) ?? query
            t.update(hasRid ? (value as any).__refid : undefined, saveQuery, value)
        } else if (Array.isArray(key)) {
            for (let i = 0; i < key.length; i++) {
                const k = key[i]
                if (value[k] == undefined) value[k] = (value as any)[typeof oldKey === "string" ? oldKey : oldKey[i]]
                delete (value as any)[typeof oldKey === "string" ? oldKey : oldKey[i]]
            }
            const saveQuery = saveQueryCreator?.(value) ?? query
            t.update(hasRid ? (value as any).__refid : undefined, saveQuery, value)
        }
    }
    await t.commit()
}