import { Pipe, PipeTransform } from "@angular/core"
import { RbVersion } from "server/models/shared/web"
import { getRbDefaultComment } from "../../utils/rb-functions"

@Pipe({
    name: "rbDefaultComment",
    standalone: false
})
export class RbDefaultCommentPipe implements PipeTransform {
    transform(value?: RbVersion): string {
        if (value == undefined) return ""
        return getRbDefaultComment(value)
    }
}
