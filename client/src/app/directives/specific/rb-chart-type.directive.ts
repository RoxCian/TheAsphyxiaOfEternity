import { Directive, ElementRef, computed, effect, input } from "@angular/core"
import { RbChartType, RbVersion } from "rbweb"
import { toRbChartTypeLiteral } from "../../utils/rb-functions"

@Directive({
    selector: "[rbChartType]",
    standalone: false
})
export class RbChartTypeDirective<TVersion extends RbVersion> {
    readonly chartType = input.required<RbChartType<TVersion>>({ alias: "rbChartType" })
    readonly version = input.required<TVersion>()
    readonly chartTypeLiteral = computed(() => toRbChartTypeLiteral(this.chartType(), this.version()))
    constructor(element: ElementRef<HTMLElement>) {
        const cl = element.nativeElement.classList
        let prevClass: string | undefined
        effect(() => {
            if (prevClass) cl.remove(prevClass)
            const currClass = `is-${this.chartTypeLiteral()?.toLowerCase()}-chart`
            cl.add(currClass)
            prevClass = currClass
        })
    }
}
