import { Directive, ElementRef, effect, input } from "@angular/core"

@Directive({
    selector: "[bungAppendClass]"
})
export class BungAppendClassDirective {
    readonly appendClass = input("", { alias: "bungAppendClass" })
    #classListBackup: string[] = []
    constructor(element: ElementRef<HTMLElement>) {
        effect(() => {
            const cl = element.nativeElement.classList
            for (const c of this.#classListBackup) cl.remove(c)
            this.#classListBackup.splice(0, this.#classListBackup.length)
            const ncl = this.appendClass().split(" ")
            for (const c of ncl) {
                if (!c || cl.contains(c)) continue
                cl.add(c)
                this.#classListBackup.push(c)
            }
        })
    }
}
