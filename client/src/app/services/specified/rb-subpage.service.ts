import { Service, signal, Type } from "@angular/core"

@Service()
export class RbSubpageService {
    readonly componentType = signal<Type<unknown> | null>(null)
}
