import { ElementRef, Injectable } from "@angular/core"

export type BungIntersectionElement = {
    element: ElementRef<HTMLElement>
    onIntersectingChanged(isIntersecting: boolean): void
}
type BungIntersectionGroup = {
    observer?: IntersectionObserver
    elements: BungIntersectionElement[]
}
@Injectable({
    providedIn: "root"
})
export class BungIntersectionService {
    readonly intersectionGroups: Record<string, BungIntersectionGroup> = {}
    private readonly observerNameKey = "__Bung_observerNameKey__"
    private readonly intersectionHandler = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => this.onIntersect(entries, observer)

    createEmptyGroup(groupName: string): BungIntersectionGroup {
        this.intersectionGroups[groupName] ??= { elements: [] }
        return this.intersectionGroups[groupName]
    }
    createGroup(groupName: string, options?: IntersectionObserverInit): BungIntersectionGroup {
        let group = this.intersectionGroups[groupName]
        if (group && group.observer) return group
        const observer = new IntersectionObserver(this.intersectionHandler, options)
        { (observer as any)[this.observerNameKey] = groupName }
        if (!group) group = {
            observer, elements: []
        }
        else group.observer = observer
        this.intersectionGroups[groupName] = group
        for (const el of group.elements) observer.observe(el.element.nativeElement)
        return group
    }
    subscribe(element: BungIntersectionElement, groupName: string) {
        const group = this.intersectionGroups[groupName] ?? this.createEmptyGroup(groupName)
        if (group.elements.includes(element)) return
        group.elements.push(element)
        group.observer?.observe(element.element.nativeElement)
    }
    unsubscribe(element: BungIntersectionElement, groupName?: string) {
        let group: BungIntersectionGroup | undefined = undefined
        if (groupName != undefined) group = this.intersectionGroups[groupName]
        else {
            for (const groupName in this.intersectionGroups) {
                const g = this.intersectionGroups[groupName]
                if (g.elements.includes(element)) {
                    group = g
                    break
                }
            }
        }
        if (!group) return
        const index = group.elements.indexOf(element)
        if (index < 0) return
        group.elements.splice(index, 1)
        group.observer?.unobserve(element.element.nativeElement)
    }
    private onIntersect(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
        const groupName = (observer as any)[this.observerNameKey]
        if (groupName == undefined) return
        const group = this.intersectionGroups[groupName]
        if (!group || group.observer !== observer) return
        for (const entry of entries) {
            const element = group.elements.find(el => el.element.nativeElement === entry.target)
            if (!element) continue
            element.onIntersectingChanged(entry.isIntersecting)
        }
    }
}
