import { SecurityContext } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

const svgCollection: Record<string, Promise<string | undefined>> = {}
export async function iconUrlToSvg(url: string, sanitizer: DomSanitizer): Promise<SVGElement | undefined> {
    let iconText: string | undefined
    if (!!svgCollection[url]) iconText = await svgCollection[url]
    else {
        const sanitized = sanitizer.sanitize(SecurityContext.URL, url)
        if (!sanitized) return undefined
        svgCollection[url] = (async () => {
            const iconResponse = await fetch(sanitized)
            return (await iconResponse.text())?.match(/<svg(| [^>]+)>[\s\S]+<\/svg>/)?.[0]
        })()
        iconText = await svgCollection[url]
    }
    if (iconText) sanitizer.sanitize(SecurityContext.HTML, iconText)
    if (!iconText) return undefined
    const el = document.createElement("div")
    el.innerHTML = iconText ?? ""
    const result = el.firstElementChild
    if (result instanceof SVGElement) return result
    return undefined
}