import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"

export class Rb5Mylist implements ICollection<"rb.rb5.player.mylist"> {
    readonly collection = "rb.rb5.player.mylist"
    @XD.s16("idx") index = 0
    @XD.s16("mlst") mylist = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
}
