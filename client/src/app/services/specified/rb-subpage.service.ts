import { Injectable, signal, Type } from "@angular/core"

@Injectable({ providedIn: "root" })
export class RbSubpageService {
    readonly componentType = signal<Type<unknown> | null>(null)
}
