import { DBH } from "../../utils/db/dbh"
import { RbStageLog, RbStageLogStandalone, RbStageLogStandaloneElement } from "../../models/shared/stage_log"

export class StageLogManager {
    private static subscriberList = <{ userId: number, rid: string, log: RbStageLog<string>, state: "pending" | "default", version: 1 | 2 }[]>[]
    private static triggerList = <{ userId: number, log: RbStageLogStandalone, triggeredIndex: number[], state: "pending" | "default", version: 1 | 2 }[]>[]

    private constructor() { }

    public static pushStageLog(rid: string, userId: number, log: RbStageLog<string>, version: 1 | 2) {
        this.subscriberList.push({ userId: userId, rid: rid, log: log, state: "default", version })
    }
    public static pushStandaloneStageLog(log: RbStageLogStandalone, version: 1 | 2) {
        this.triggerList.push({ userId: log.userId, log: log, triggeredIndex: <number[]>[], state: "default", version })
    }

    public static update() {
        const triggerRemoveIndex: number[] = []
        const subscriberRemoveIndex: number[] = []
        for (let i = 0; i < this.triggerList.length; i++) {
            const t = this.triggerList[i]
            if (t.state === "pending") continue
            for (let j = 0; j < this.subscriberList.length; j++) {
                const s = this.subscriberList[j]
                if (s.state === "pending") continue
                if (s.userId === t.userId && s.version === t.version) {
                    for (let e = 0; e < t.log.rec.length; e++) if (!t.triggeredIndex.includes(e) && this.checkLog(s.log, t.log.rec[e], t.log.play.stageCount)) {
                        s.state = "pending"
                        t.triggeredIndex.push(e)
                        s.log.stageIndex = t.log.play.stageCount - s.log.stageIndex - 1 // The stage indexes in play logs saved by player.write and the indexes saved by log.play are reversed.
                        s.log.standalone = t.log.rec[e]
                        DBH.insert(s.rid, s.log)
                        subscriberRemoveIndex.push(j)
                        break
                    }
                }
                if (t.triggeredIndex.length === t.log.play.stageCount) {
                    t.state = "pending"
                    triggerRemoveIndex.push(i)
                    break
                }
            }
        }

        for (const i of triggerRemoveIndex) this.triggerList.splice(i, 1)
        for (const i of subscriberRemoveIndex) this.subscriberList.splice(i, 1)
    }

    private static checkLog(subscriber: RbStageLog<string>, triggerElement: RbStageLogStandaloneElement, stageCount: number): boolean {
        if (subscriber.musicId !== triggerElement.musicId) return false
        if (subscriber.chartType !== triggerElement.chartType) return false
        if ((stageCount - subscriber.stageIndex - 1) !== triggerElement.stageIndex) return false // The stage indexes in play logs saved by player.write and the indexes saved by log.play are reverted.
        return true
    }
}