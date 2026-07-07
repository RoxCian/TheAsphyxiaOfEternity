import { Service, signal } from "@angular/core"

@Service()
export class RbLanguageService {
    readonly currentLanguage = signal<"en" | "orig">("en")
}