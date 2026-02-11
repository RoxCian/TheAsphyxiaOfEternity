import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "clamp",
    standalone: false
})
export class ClampPipe implements PipeTransform {
    transform(value: number, min: number, max: number): number {
        return Math.max(Math.min(value, max), min)
    }
}
