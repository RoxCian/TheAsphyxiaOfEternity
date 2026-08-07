import { RbItemResponse } from "../../models/shared/web"
import { loadCsv } from "../../utils/csv"

export const rbItems = loadCsv<RbItemResponse>("rb_items")
