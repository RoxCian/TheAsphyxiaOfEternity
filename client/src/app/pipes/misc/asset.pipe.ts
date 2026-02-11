import { Pipe, PipeTransform } from "@angular/core"
import { DomSanitizer, SafeUrl } from "@angular/platform-browser"
import { AssetsRoot } from "../../utils/const"

@Pipe({
    name: "asset"
})
export class AssetPipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) { }
    transform(path: string): SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(`${AssetsRoot}/${path}`)
    }
}
