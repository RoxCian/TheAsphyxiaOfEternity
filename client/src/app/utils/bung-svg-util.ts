import { SecurityContext } from "@angular/core"
import { DomSanitizer } from "@angular/platform-browser"

const svgCollection: Record<string, string> = {}
export async function iconUrlToSvg(url: string, sanitizer: DomSanitizer): Promise<SVGElement | undefined> {
    let iconText: string | undefined
    if (svgCollection[url]) iconText = svgCollection[url]
    else {
        const sanitized = sanitizer.sanitize(SecurityContext.URL, url)
        if (!sanitized) return undefined
        const iconResponse = await fetch(sanitized)
        iconText = (await iconResponse.text())?.match(/<svg(| [^>]+)>[\s\S]+<\/svg>/)?.[0]
        if (iconText) sanitizer.sanitize(SecurityContext.HTML, iconText)
        if (!iconText) return undefined
        svgCollection[url] = iconText
    }
    const el = document.createElement("div")
    el.innerHTML = iconText
    const result = el.querySelector("svg")
    if (result instanceof SVGElement) return result
    return undefined
}