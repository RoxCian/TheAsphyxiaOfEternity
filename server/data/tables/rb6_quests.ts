import { Rb6Quest } from "../../models/rb6/quest"
import { Rb6DungeonInfo, Rb6QuestInfo } from "../../models/rb6/types"
import { loadCsv } from "../../utils/csv"

export const rb6Quests = loadCsv("rb6_quests", Rb6Quest)
export const rb6QuestsInfo = loadCsv<Rb6QuestInfo>("rb6_quests_info")
export const rb6DungeonsInfo = loadCsv<Rb6DungeonInfo>("rb6_dungeons_info")