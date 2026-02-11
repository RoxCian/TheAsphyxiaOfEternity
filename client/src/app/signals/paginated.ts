import { effect, Injector, runInInjectionContext, signal, Signal, WritableSignal } from "@angular/core"

export type PaginatedSignal<T> = Signal<T[]> & {
    load(): void
    location: Signal<number>
    pageSize: WritableSignal<number>
    isFinished: Signal<boolean>
    destroy(): void
}

export function paginated<T>(listComputation: () => T[] | undefined, injector: Injector, preloadCount = 0): PaginatedSignal<T> {
    const pageSize = signal(20)
    let listBackup: T[] = listComputation() ?? []
    const writable = signal<T[]>(listBackup.slice(0, preloadCount))
    const location = signal(Math.min(preloadCount, listBackup.length))
    const allLoaded = signal((listComputation()?.length ?? 0) < preloadCount)
    const result = writable.asReadonly() as PaginatedSignal<T>
    result.pageSize = pageSize
    result.location = location.asReadonly()
    result.isFinished = allLoaded.asReadonly()
    const eff = runInInjectionContext(injector, () => effect(() => {
        const newList = listComputation() ?? []
        if (newList === listBackup || (newList.length === 0 && listBackup.length === 0)) return
        location.set(0)
        allLoaded.set(newList?.length === 0)
        writable.set([])
        listBackup = newList
    }))
    result.load = () => {
        if (allLoaded()) return
        const to = location() + pageSize()
        location.set(Math.min(to, listBackup.length))
        allLoaded.set(to >= listBackup.length)
        writable.set(listBackup.slice(0, to))
    }
    result.destroy = eff.destroy
    return result
}