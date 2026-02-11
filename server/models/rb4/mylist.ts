import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"

export class Rb4Mylist implements ICollection<"rb.rb4.player.mylist"> {
    readonly collection = "rb.rb4.player.mylist"
    @XD.s16("idx") index = 0
    @XD.s16("mlst") mylist = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
}