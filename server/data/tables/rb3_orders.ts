import { Rb3OrderInfo, Rb3OrderShopLevel } from "../../models/rb3/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb3OrdersInfo = loadCsvAsync<Rb3OrderInfo>("rb3_orders")
export const rb3OrderShopLevelList = loadCsvAsync<Rb3OrderShopLevel>("rb3_order_shop_level")
export async function getOrderShopLevel(experiences: number): Promise<Rb3OrderShopLevel> {
    const list = await rb3OrderShopLevelList
    for (let i = 0; i < list.length; i++) {
        const l = list[i]
        if (experiences >= l.experiences && experiences < l.experiences + l.experiencesToNextLevel) return l
    }
    return {
        level: 101,
        experiences: -1,
        experiencesToNextLevel: -1
    }
}