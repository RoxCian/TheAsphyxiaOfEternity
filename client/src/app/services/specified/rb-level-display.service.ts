import { Service, signal } from "@angular/core"

@Service()
export class RbLevelDisplayService {
    readonly levelDisplay = signal<"level" | "skillRate">("level")

    toggle() {
        this.levelDisplay.set(this.levelDisplay() == "level" ? "skillRate" : "level")
    }
    set(value: "level" | "skillRate") {
        if (this.levelDisplay() == value) return
        this.levelDisplay.set(value)
    }
}
