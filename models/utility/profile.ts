import { IRb1PlayerBase } from "../rb1/profile"
import { IRb2PlayerBase } from "../rb2/profile"
import { IRb3PlayerAccount, IRb3PlayerBase } from "../rb3/profile"
import { IRb4PlayerAccount, IRb4PlayerBase } from "../rb4/profile"
import { IRb5PlayerAccount, IRb5PlayerBase } from "../rb5/profile"
import { IRb6PlayerAccount, IRb6PlayerBase } from "../rb6/profile"

export type IRbPlayerAccount = IRb6PlayerAccount | IRb5PlayerAccount | IRb4PlayerAccount | IRb3PlayerAccount
export type IRbPlayerBase = IRb6PlayerBase | IRb5PlayerBase | IRb4PlayerBase | IRb3PlayerBase | IRb2PlayerBase | IRb1PlayerBase