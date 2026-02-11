import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "rb2LevelLiteral",
    standalone: false
})
export class Rb2LevelLiteralPipe implements PipeTransform {
    transform(value: number): string {
        return value <= 10 ? `${value}` : "10⁺"
    }
}
