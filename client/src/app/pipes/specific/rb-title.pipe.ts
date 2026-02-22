import { Pipe, PipeTransform } from "@angular/core"
import { RbVersion, RbVersionLiteral } from "rbweb"

@Pipe({
    name: "rbTitle",
    standalone: false
})
export class RbTitlePipe implements PipeTransform {
    transform(version: RbVersion): RbVersionLiteral {
        switch (version) {
            case 1: return "rb"
            case 2: return "limelight"
            case 3: return "colette"
            case 4: return "groovin"
            case 5: return "volzza"
            case 6: return "reflesia"
            default: throw new Error("unknown version")
        }
    }
}
