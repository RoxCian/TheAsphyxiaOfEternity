import { Component, effect, ElementRef, input, model, signal, viewChild, ViewEncapsulation } from "@angular/core"
import { FormValueControl } from "@angular/forms/signals";
import { toggleTransform } from "../../../signals/transforms";

@Component({
    selector: "bung-number-input",
    templateUrl: "./number-input.component.html",
    styleUrl: "./number-input.component.sass",
    standalone: false,
    encapsulation: ViewEncapsulation.None,
    host: {
        "[class.bung-input]": "true",
        "[class.is-disabled]": "disabled()",
        "[class.is-readonly]": "readonly()"
    }
})
export class BungNumberInputComponent implements FormValueControl<number> {
    readonly value = model<number>(0)
    /** @ts-ignore */
    readonly disabled = input(false, { transform: toggleTransform })
    /** @ts-ignore */
    readonly readonly = input(false, { transform: toggleTransform })
    readonly hideSpinButtons = input(false, { transform: toggleTransform })
    readonly min = model<number | undefined>(undefined)
    readonly max = model<number | undefined>(undefined)
    readonly step = model(1)
    readonly rounding = model<number | undefined>()
    readonly formatter = model((v: number) => `${v}`)

    protected readonly isInputFocused = signal(false)

    private readonly inputElement = viewChild<ElementRef<HTMLInputElement>>("input")

    // binding from Field
    /**
     * Binding from Field, shouldn't use it directly in templates.
     */
    readonly hidden = input(false)

    protected onChange(e: Event) {
        if (this.disabled()) return
        const target = e.target as HTMLInputElement
        const value = target.value
        if (!value) this.value.set(0)
        if (!value.match(/^([+-]?Infinity|\d+|(\d+)?\.\d*)$/)) {
            target.value = this.formatter()(this.value())
            return
        }
        const number = parseFloat(value)
        if (isNaN(number)) {
            target.value = this.formatter()(this.value())
            return
        }
        const max = this.max() ?? NaN
        const min = this.min() ?? NaN
        let rounded = 0
        const oldValue = this.value()
        if (number > max) rounded = round(max, this.rounding())
        else if (number < min) rounded = round(max, this.rounding())
        else rounded = round(number, this.rounding())
        target.value = this.formatter()(rounded)
        if (rounded !== oldValue) this.value.set(rounded)
    }
    protected onIncrease() {
        if (this.disabled()) return
        this.value.update(v => {
            const rounded = round(v + this.step(), this.rounding())
            return rounded > (this.max() ?? NaN) ? v : rounded
        })
    }
    protected onDecrease() {
        if (this.disabled()) return
        this.value.update(v => {
            const rounded = round(v - this.step(), this.rounding())
            return rounded < (this.min() ?? NaN) ? v : rounded
        })
    }
}

function round(n: number, p?: number): number {
    if (p == undefined) return n
    return Math.round(Math.round(n / p) * p * 10000000000000) / 10000000000000
}
