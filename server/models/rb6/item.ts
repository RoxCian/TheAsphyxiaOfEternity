import { XD } from "../../utils/x"

type MonthDateIndex = {
    nextYear?: boolean
    month: number
    date: number
}

export class Rb6ItemControl {
    @XD.s32("item_type") type = 0
    @XD.s32("item_id") id = 0
    @XD.s32("item_param") param = 0
    @XD.bool("notice") isNoticing = true
    @XD.bool("card_only") isCardOnly = true
    // time limited items unlocking
    unlockableTimeStart?: MonthDateIndex
    unlockableTimeEnd?: MonthDateIndex
}