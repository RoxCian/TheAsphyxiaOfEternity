import { HttpResourceRef } from "@angular/common/http"
import { effect, Injector, runInInjectionContext } from "@angular/core"

export function asPromise<T>(httpResource: HttpResourceRef<T>, injector: Injector): Promise<T> {
    let resolve: ((result: T) => void) | undefined = undefined
    let reject: ((reason: any) => void) | undefined = undefined
    const result = new Promise<T>((res, rej) => {
        resolve = res
        reject = rej
    })
    const eff = runInInjectionContext(injector, () => effect(() => {
        // try {
        //     const value = httpResource.value()
        //     resolve?.(value)
        //     delete (result as any).__SIGNAL__
        //     eff.destroy()
        // } catch (ex) {
        //     reject?.(ex)
        // }
        const error = httpResource.error()
        if (error) {
            reject?.(error)
            return
        }
        if (!httpResource.hasValue()) return
        const value = httpResource.value()
        resolve?.(value)
        delete (result as any).__SIGNAL__
        eff.destroy()
    }, { manualCleanup: true }))
    { (result as any).__SIGNAL__ = eff }
    return result
}
