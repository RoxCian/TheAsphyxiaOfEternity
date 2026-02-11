import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "rbFormatBpm",
    standalone: false
})
export class RbFormatBpmPipe implements PipeTransform {
    transform(value: number | number[]): string {
        if (typeof value === "number") return `${value}`
        else if (value.length <= 1) return `${value[0] ?? -1}`
        return `${value[0]} - ${value[1]}`
    }
}
