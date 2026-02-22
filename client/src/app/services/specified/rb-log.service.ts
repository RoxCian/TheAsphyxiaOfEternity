import { inject, Injectable } from "@angular/core"
import { RbVersionService } from "./rb-version.service"
import { RbVersion } from "rbweb"

@Injectable({ providedIn: "root" })
export class RbLogService {
    readonly versionService = inject(RbVersionService)

    private getText(version: RbVersion) {
        switch (version) {
            case 1: return "%cREFLEC BEAT"
            case 2: return "%c  limelight"
            case 3: return "%c  colette  "
            case 4: return "%c groovin'!!"
            case 5: return "%c   VOLZZA  "
            case 6: return "%c  REFLESIA "
        }
    }
    private getStyle(version: RbVersion) {
        switch (version) {
            case 1: return `
                padding: 0 1em;
                background: #5c30b4;
                color: #EFEDE1;
                border-radius: 9999px;
            `
            case 2: return `
                padding: 0 1em;
                background: linear-gradient(90deg, #FFF014 0.43em, #17D4FF 0.43em, #17D4FF 0.86em, #FF04F3 0.86em, #FF04F3 1.5em, #82FF00 1.5em);
                color: #49533F;
                border-radius: 0 9999px 9999px 0;
            `
            case 3: return `
                padding: 0 1em;
                background: linear-gradient(161deg, #F2F2FA 37.3%, #EAE3DA 43.2%, #DFEDF1 43.2%, #DFEBDD 46.62%, #F0DDBD 46.62%, #F0DDBD 49.95%, #F3EAC2 49.95%, #F3EAC2 53.28%, #D5E1DF 53.28%, #D5E1DF 56.61%, #E7ECC5 56.61%, #E7ECC5 59.94%, #F3E7DB 59.94%, #F2F0E6 63.27%);
                color: #ae8192ff;
                border-radius: 9999px;
            `
            case 4: return `
                padding: 0 1em;
                background: #F6EB00;
                color: #D8058C;
                border-radius: 9999px;
            `
            case 5: return `
                padding: 0 1.5em 0 0.5em;
                background: #209CEE;
                color: white;
            `
            case 6: return `
                padding: 0 1.5em 0 0.5em;
                background: linear-gradient(to right bottom, #FFFFFF 8%, 30%, #8EACE2 52%, 66%, #ADB4BB 77%, 88%, #95C77E);
                color: #681DDB;
                border-radius: 9999px;
            `
        }
    }
    log(...text: any[]) {
        console.log(this.getText(this.versionService.version()), this.getStyle(this.versionService.version()), ...text)
    }
    logByVersion(version: RbVersion, ...text: any[]) {
        console.log(this.getText(version), this.getStyle(version), ...text)
    }
}
