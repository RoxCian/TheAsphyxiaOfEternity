import { ICollection } from "../../utils/db/db_types"
import { XD, XM, XSubMap } from "../../utils/x"

type Rb3MylistSlot = {
    slotId: number
    musicId: number
}

export class Rb3Mylist implements ICollection<"rb.rb3.player.mylist"> {
    readonly collection = "rb.rb3.player.mylist"
    @XD.a(XM.obj({ slotId: XM.u8(), musicId: XM.s16() } as XSubMap<Rb3MylistSlot>))
    slot?: Rb3MylistSlot[] = []
}
