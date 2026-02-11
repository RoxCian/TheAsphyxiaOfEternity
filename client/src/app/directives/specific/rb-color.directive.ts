import { Directive, effect, ElementRef, input } from "@angular/core"
import { toggleTransform } from "../../signals/transforms"
import { RbColor } from "server/models/shared/web"

@Directive({
    selector: "[rbColor]",
    standalone: false
})
export class RbColorDirective {
    readonly color = input.required<RbColor>({ alias: "rbColor" })
    readonly isRival = input(false, { transform: toggleTransform })
    #oldColor?: RbColor

    constructor(element: ElementRef<HTMLElement>) {
        effect(() => {
            const color = this.color()
            let colorActually: RbColor
            if (this.isRival()) {
                colorActually = RbColor.blue - color
            } else {
                colorActually = color
            }
            if (this.#oldColor != null) {
                if (this.#oldColor === colorActually) return
                element.nativeElement.classList.remove(`is-${this.#oldColor === RbColor.red ? "red" : "blue"}-side`)
            }
            element.nativeElement.classList.add(`is-${colorActually === RbColor.red ? "red" : "blue"}-side`)
            this.#oldColor = colorActually
        })
    }
}
