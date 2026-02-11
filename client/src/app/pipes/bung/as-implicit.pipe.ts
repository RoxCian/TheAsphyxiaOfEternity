import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "implicit",
    standalone: false
})
export class BungAsImplicitPipe implements PipeTransform {
    transform<T>(value: T): { $implicit: T } {
        return { $implicit: value }
    }
}
