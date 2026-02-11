import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "rbMissCount",
    standalone: false
})
export class RbMissCountPipe implements PipeTransform {
    transform(value?: number): string {
        if (value == undefined) return "-"
        else if (value < 0) return "Failed"
        return `${value}`
    }
}
