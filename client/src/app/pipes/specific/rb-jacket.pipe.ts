import { computed, Pipe, PipeTransform, SecurityContext, Signal } from "@angular/core"
import { RbChartType, RbVersion } from "rbweb"
import { RbJacketsService } from "../../services/specified/rb-jackets.service"

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
    }
}
