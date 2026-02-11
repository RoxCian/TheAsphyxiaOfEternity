import { ICollection } from "../../utils/db/db_types"
import { XD } from "../../utils/x"

export class Rb6Mylist implements ICollection<"rb.rb6.player.mylist"> {
    readonly collection = "rb.rb6.player.mylist"
    @XD.s16("idx") index = 0
    @XD.s16("mlst") mylist = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
}