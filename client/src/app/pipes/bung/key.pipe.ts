import { Pipe, PipeTransform } from "@angular/core"

@Pipe({
    name: "key",
    pure: false,
    standalone: false
})
export class BungKeyPipe implements PipeTransform {
    transform<T extends object>(value?: T, sortFn?: (left: keyof T, right: keyof T) => number): (keyof T)[] {
        if (!value) return []
        let keys = <(keyof T)[]>Object.keys(value)
        if (Array.isArray(value)) keys = keys.map(k => {
            if (typeof k != "string") return k
            const i = parseInt(k)
            if (isNaN(i) || i >= keys.length || i < 0) return k
            return i as keyof T
        })
        if (!sortFn) return keys
        return keys.sort(sortFn)
    }
}
