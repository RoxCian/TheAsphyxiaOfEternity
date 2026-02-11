import { Component, computed, input } from "@angular/core"

type WeekInfo = {
    firstDay: number
}
function hasLeapDay(): boolean {
    const now = new Date()
    const year = now.getFullYear()
    if ((year % 100 !== 0 && year % 4 !== 0) || (year % 100 === 0 && year % 400 !== 0)) return false
    return now.getMonth() >= 2
}
const firstDayData: Record<`${number}`, string[]> = {
    // 1: omitted
    5: ["dv", "en-MV"],
    6: ["aa-DJ", "apc", "ar", "ar-AE", "ar-BH", "ar-DJ", "ar-DZ", "ar-EG", "ar-IQ", "ar-JO", "ar-KW", "ar-LY", "ar-OM", "ar-QA", "ar-SD", "ar-SY", "az-Arab", "az-Arab-IQ", "bgn-AE", "bgn-AF", "bgn-IR", "bgn-OM", "ckb", "ckb-IR", "en-AE", "en-SD", "fa", "fa-AF", "fr-DJ", "fr-DZ", "fr-SY", "ha-Arab-SD", "kab", "lrc", "lrc-IQ", "mzn", "ps", "sdh", "sdh-IQ", "so-DJ", "syr", "syr-SY", "uz-Arab"],
    7: ["aa", "af", "am", "ar-IL", "ar-SA", "ar-YE", "as", "bal", "bal-Arab", "bal-Latn", "bew", "bgc", "bgn", "bho", "bn", "bn-IN", "bo-IN", "brx", "cad", "ccp", "ccp-IN", "ceb", "cho", "chr", "cic", "csw", "dav", "doi", "dz", "ebu", "en", "en-AG", "en-AS", "en-BS", "en-BW", "en-BZ", "en-CA", "en-DM", "en-Dsrt", "en-GU", "en-HK", "en-ID", "en-IL", "en-IN", "en-JM", "en-KE", "en-MH", "en-MO", "en-MT", "en-PH", "en-PK", "en-PR", "en-SG", "en-TT", "en-UM", "en-VI", "en-WS", "en-ZA", "en-ZW", "es-BR", "es-BZ", "es-CO", "es-DO", "es-GT", "es-HN", "es-MX", "es-NI", "es-PA", "es-PE", "es-PH", "es-PR", "es-PY", "es-SV", "es-US", "es-VE", "fil", "fr-CA", "gez", "gn", "gu", "guz", "haw", "he", "hi", "hi-Latn", "hnj", "hnj-Hmnp", "id", "iu", "iu-Latn", "ja", "jv", "kam", "kgp", "ki", "kln", "km", "kn", "ko", "kok", "ks", "ks-Arab", "ks-Deva", "kxv", "kxv-Deva", "kxv-Latn", "kxv-Orya", "kxv-Telu", "lkt", "lo", "luo", "luy", "mai", "mas", "mer", "mgh", "mic", "ml", "mni", "mni-Beng", "mni-Mtei", "moh", "mr", "ms-ID", "ms-SG", "mt", "mus", "my", "nd", "ne", "ne-IN", "nr", "nso", "nv", "om", "om-KE", "or", "osa", "pa", "pa-Arab", "pa-Guru", "ps-PK", "pt", "pt-MO", "pt-MZ", "pt-PT", "qu", "quc", "raj", "rhg", "rhg-Rohg", "rhg-Rohg-BD", "sa", "saq", "sat", "sat-Deva", "sat-Olck", "sd", "sd-Arab", "sd-Deva", "seh", "shn", "shn-TH", "sid", "skr", "sn", "so-ET", "so-KE", "ss", "st", "su", "su-Latn", "sw-KE", "ta", "ta-SG", "te", "teo-KE", "th", "ti", "tn", "tn-BW", "trv", "trw", "ts", "und", "ur", "ur-IN", "ve", "vmw", "wal", "xh", "xnr", "yrl", "yrl-CO", "yrl-VE", "yue", "yue-Hant", "zh-Hans-HK", "zh-Hans-MO", "zh-Hans-SG", "zh-Hant", "zh-Hant-HK", "zh-Hant-MO", "zu"]
}
function getWeekInfo(): WeekInfo {
    const l = navigator.language
    let firstDay = 1
    for (const k in firstDayData) if (firstDayData[k as `${number}`].includes(l)) {
        firstDay = parseInt(k)
        break
    }
    return { firstDay }
}

@Component({
    selector: "rb-activity-grid",
    templateUrl: "./rb-activity-grid.component.html",
    styleUrl: "./rb-activity-grid.component.sass",
    host: {
        "[style.--weeks-count]": "totalWeeksCount"
    },
    standalone: false
})
export class RbActivityGridComponent {
    readonly activity = input.required<Record<number, number | undefined>>()
    readonly maxPlayCount = computed(() => {
        const activity = this.activity()
        return Object.keys(activity).map(k => activity[k as unknown as number]).reduce((prev, curr) => (curr ?? 0) > prev! ? (curr ?? 0) : prev, 0) ?? 0
    })
    readonly weekInfo: WeekInfo = getWeekInfo()
    readonly now = new Date()
    readonly totalDays = hasLeapDay() ? 366 : 365
    readonly daysArray = new Array(this.totalDays).fill(0).map((_, i) => i)
    readonly todayRow = (this.now.getDay() - this.weekInfo.firstDay + 7) % 7 
    readonly totalWeeksCount = (this.totalDays === 366 && this.todayRow === 0) ? 54 : 53

    protected getGridRowColumn(dateInGrid: number): { row: number, column: number } {
        const invertedValue = (this.totalWeeksCount - 1) * 7 + (this.todayRow - dateInGrid)
        return {
            row: invertedValue % 7 + 1,
            column: Math.floor(invertedValue / 7) + 1
        }
    }
    protected getActivityLevel(playCount: number): number {
        if (this.maxPlayCount() === 0 || playCount === 0) return 0
        return Math.round(playCount / this.maxPlayCount() * 4)
    }
    protected getDate(dateInGrid: number) {
        return new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate() - dateInGrid)
    }
}
