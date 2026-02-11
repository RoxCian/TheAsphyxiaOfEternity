import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "trunc",
    standalone: false
})
export class TruncPipe implements PipeTransform {
    transform(value: number): number {
        return Math.trunc(value)
    }
}
