import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "range",
    standalone: false,
})
export class RangePipe implements PipeTransform {
    transform(length: number, step: number = 1): number[] {
        if (step < 1 && Math.trunc(step) != step) throw new Error("Step should be a positive integer")
        const result: number[] = []
        for (let i = 0; i < length; i += step) result.push(i)
        return result
    }
}
