import { Pipe, PipeTransform } from "@angular/core"
import { RbVersion } from "server/models/shared/web"
import { getRbRank } from "../../utils/rb-functions"

@Pipe({
    name: "rbRank",
    standalone: false
})
export class RbRankPipe implements PipeTransform {
    transform(achievementRate: number, version: RbVersion): string {
        return getRbRank(achievementRate, version)
    }
}
