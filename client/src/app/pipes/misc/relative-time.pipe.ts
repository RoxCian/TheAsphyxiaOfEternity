import { Pipe, PipeTransform } from "@angular/core"
import { toRelativeTimeString } from "../../utils/functions"

@Pipe({
    name: "relativeTime",
    standalone: false
})
export class RelativeTimePipe implements PipeTransform {
    transform(value?: Date): string {
        return value ? toRelativeTimeString(value) : ""
    }
}
