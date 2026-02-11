import { Rb6CharacterCardInfo } from "../../models/rb6/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb6CharacterCards = loadCsvAsync<Rb6CharacterCardInfo>("rb6_characards")