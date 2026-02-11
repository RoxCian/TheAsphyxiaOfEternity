import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "decimalPart",
    standalone: false
})
export class DecimalPartPipe implements PipeTransform {
    transform(value: number, digits: number = 1): string {
        if (digits <= 0) return ""
        let result = Math.round((value % 1) * 10 ** Math.min(digits, 15)).toString()
        const dotIndex = result.indexOf(".")
        if (dotIndex >= 0) result = result.substring(0, dotIndex)
        if (digits > 15) result = result.padEnd(digits, "0")
        return result
    }
}
