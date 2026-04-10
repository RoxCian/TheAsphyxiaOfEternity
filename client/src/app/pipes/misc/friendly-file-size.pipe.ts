import { Pipe, PipeTransform } from "@angular/core"
import { toFriendlyFileSize } from "../../utils/functions"

@Pipe({
    name: "friendlyFileSize",
    standalone: false
})
export class FriendlyFileSizePipe implements PipeTransform {
    transform(value?: number): string {
        return value ? toFriendlyFileSize(value) : ""
    }
}
