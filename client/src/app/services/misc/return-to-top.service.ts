import { Service, signal } from "@angular/core"

@Service()
export class ReturnToTopService {
    private readonly canReturnToTopInternal = signal(false)
    readonly canReturnToTop = this.canReturnToTopInternal.asReadonly()

    private readonly scrollHost: HTMLElement = document.querySelector("#main-content .simplebar-content-wrapper") ?? document.querySelector(".simplebar-content-wrapper")!
    private readonly resizeObserver = new ResizeObserver(() => this.onScroll())

    constructor() {
        this.scrollHost?.addEventListener("scroll", e => this.onScroll())
        this.resizeObserver.observe(this.scrollHost)
    }

    private onScroll() {
        const viewportHeight = this.scrollHost.getBoundingClientRect().height
        const bodyScrollTop = this.scrollHost.scrollTop ?? 0
        this.canReturnToTopInternal.set(bodyScrollTop > viewportHeight * 1.25) 
    }

    returnToTop() {
        if (this.canReturnToTop()) this.scrollHost.scrollTo({ top: 0 })
    }
}
