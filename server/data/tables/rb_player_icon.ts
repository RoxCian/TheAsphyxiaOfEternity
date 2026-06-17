import { RbPlayerIcon } from "../../models/shared/rb_types"
import { loadCsvAsync } from "../../utils/csv"

export const rbPlayerIcon = loadCsvAsync<RbPlayerIcon>("rb_player_icon")
