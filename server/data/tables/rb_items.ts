import { RbItemResponse } from "../../models/shared/web"
import { loadCsvAsync } from "../../utils/csv"

export const rbItems = loadCsvAsync<RbItemResponse>("rb_items")
