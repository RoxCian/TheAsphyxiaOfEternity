import { computed, Pipe, PipeTransform, SecurityContext, Signal } from "@angular/core"
import { RbChartType, RbVersion } from "server/models/shared/web"
import { RbJacketsService } from "../../services/specified/rb-jackets.service"

// const jacketsIncluded: string[] = []
// const jacketsNotIncluded: string[] = []

@Pipe({
    name: "rbJacket",
    standalone: false
})
export class RbJacketPipe implements PipeTransform {
    constructor(private readonly jacketsService: RbJacketsService) { }
    transform<TVersion extends RbVersion>(musicUid: string, chartType?: RbChartType<TVersion>): Signal<string> {
        return computed(() => {
            const jackets = this.jacketsService.jackets.value()
            if (!jackets) return "./static/assets/jackets/nowloading.svg"
            const specicalJacket = `${musicUid}_${chartType}`
            const jacketUrl = `./static/assets/jackets/${musicUid}.webp`
            if (chartType == undefined) return jacketUrl
            const jacketUrlSpecial = `./static/assets/jackets/${specicalJacket}.webp`
            if (jackets.includes(specicalJacket)) return jacketUrlSpecial
            return jacketUrl
        })
        // const jackets = this.jacketsService.jackets.
        // if (jackets?.includes(`musicUid`))
        // const jacketUrl = `./static/assets/jackets/${musicUid}.webp`
        // if (chartType == undefined) return jacketUrl
        // const specicalJacket = `${musicUid}_${chartType}`
        // const jacketUrlSpecial = `./static/assets/jackets/${specicalJacket}.webp`
        // if (jacketsIncluded.includes(specicalJacket)) return jacketUrlSpecial
        // else if (jacketsNotIncluded.includes(specicalJacket)) return jacketUrl
        // try {
        //     const response = await fetch(jacketUrlSpecial)
        //     if (response.status >= 300) {
        //         jacketsNotIncluded.push(specicalJacket)
        //         return jacketUrl
        //     }
        //     jacketsIncluded.push(specicalJacket)
        //     return jacketUrlSpecial
        // } catch {
        //     jacketsNotIncluded.push(specicalJacket)
        //     return jacketUrl
        // }
    }
}
