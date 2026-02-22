import { Pipe, PipeTransform } from "@angular/core"
import { RbBywordRarity } from "rbweb"

@Pipe({
    name: "rbBywordRarityLiteral",
    standalone: false
})
export class RbBywordRarityLiteralPipe implements PipeTransform {

    transform(value: RbBywordRarity): string {
        switch (value) {
            case RbBywordRarity.bronze: return "bronze"
            case RbBywordRarity.silver: return "silver"
            case RbBywordRarity.gold: return "gold"
            case RbBywordRarity.platinum: return "platinum"
            default: return ""
        }
    }

}
