import { RbPlayerIcon } from "../../models/shared/rb_types"
import { loadCsv } from "../../utils/csv"

export const rbPlayerIcon = loadCsv<RbPlayerIcon>("rb_player_icon")
