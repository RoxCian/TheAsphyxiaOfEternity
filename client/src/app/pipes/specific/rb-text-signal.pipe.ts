import { computed, inject, Injector, Pipe, PipeTransform, Signal } from "@angular/core"
import { RbLanguageService } from "../../services/specified/rb-language.service"

type KeysOfOrig<T extends object> = {
    [K in `${Extract<keyof T, string>}Orig`]: K extends keyof T ? T[K] : never
}
type KeysOfHasOrig<T extends object> = keyof {
    [K in keyof (T | KeysOfOrig<T>)]: K extends `${infer TK}Orig` ? TK extends keyof T ? T[TK] : never : never
} extends `${infer TK}Orig` ? TK & keyof T : never

@Pipe({
    name: "rbText",
    standalone: false
})
export class RbTextSignalPipe implements PipeTransform {
    private readonly langService = inject(RbLanguageService)
    transform<T extends object, K extends KeysOfHasOrig<T>>(value: T, key: K): Signal<T[K]> {
        return computed(() => this.langService.currentLanguage() === "en" ? (value[key] ?? value[`${key}Orig` as K]) : (value[`${key}Orig` as K] ?? value[key]))
    }
}
