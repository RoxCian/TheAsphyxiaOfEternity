import { Pipe, PipeTransform } from "@angular/core"
import { RbVersion } from "server/models/shared/web"

@Pipe({
    name: "rbStageIndex",
    standalone: false
})
export class RbStageIndexPipe implements PipeTransform {
    transform(value: number, version: RbVersion): string {
        let text: string = ""
        switch (version) {
            case 1: case 2:
                text = (value + 1).toString()
                if (text.endsWith("1") && !text.endsWith("11")) return `${text}ST`
                if (text.endsWith("2") && !text.endsWith("12")) return `${text}ND`
                if (text.endsWith("3") && !text.endsWith("13")) return `${text}RD`
                return `${text}TH`
            case 3: case 4: case 5:
                if (value === 0) return "1ST"
                if (value === 1) return "2ND"
                if (value === 2) return "FINAL"
                return "EXTRA"
            case 6:
                if (value === 0) return "1"
                if (value === 1) return "2"
                if (value === 2) return "FINAL"
                return "EXTRA"
        }
    }
}
