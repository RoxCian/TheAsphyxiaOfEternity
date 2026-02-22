import { Pipe, PipeTransform } from "@angular/core"
import { RbChartType, RbVersion } from "rbweb"
import { toRbChartTypeLiteral } from "../../utils/rb-functions"

@Pipe({
    name: "rbChartTypeLiteral",
    standalone: false
})
export class RbChartTypeLiteralPipe implements PipeTransform {
    transform<TVersion extends RbVersion>(value: RbChartType<TVersion>, version: TVersion): "BASIC" | "MEDIUM" | "HARD" | "SPECIAL" | "WHITEHARD" | undefined {
        return toRbChartTypeLiteral(value, version)
    }
}
