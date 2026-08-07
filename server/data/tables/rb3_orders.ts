import { Rb3OrderInfo, Rb3OrderShopLevel } from "../../models/rb3/types"
import { loadCsv } from "../../utils/csv"

export const rb3OrdersInfo = loadCsv<Rb3OrderInfo>("rb3_orders")
export const rb3OrderShopLevelList = loadCsv<Rb3OrderShopLevel>("rb3_order_shop_level")
export function getOrderShopLevel(experiences: number): Rb3OrderShopLevel {
    const list = rb3OrderShopLevelList
    for (let i = 0; i < list.length; i++) {
        const l = list[i]
        if (experiences >= l.experiences && experiences < l.experiences + l.experiencesToNextLevel) return l
    }
    return {
        level: 201,
        experiences: -1,
        experiencesToNextLevel: -1
    }
}