import { Rb6CharacterCardInfo } from "../../models/rb6/types"
import { loadCsv } from "../../utils/csv"

export const rb6CharacterCards = loadCsv<Rb6CharacterCardInfo>("rb6_characards")