import { Component, computed, input } from "@angular/core"
import { RbCommentBalloon, RbCommentResponse, RbVersion } from "rbweb"

function toHalfWidth(s: string) {
    let resultCharCodes = []
    for (let i = 0; i < s.length; i++) {
        let cc = s.charCodeAt(i)
        if ((cc >= 65281) && (cc <= 65374)) resultCharCodes.push(cc - 65281 + 33)
        else if (cc === 12288) resultCharCodes.push(32) // Full-width space
        else resultCharCodes.push(cc)
    }
    return String.fromCharCode(...resultCharCodes)
}

@Component({
    selector: "rb-comment-balloon",
    standalone: false,
    templateUrl: "./rb-comment-balloon.component.html",
    styleUrl: "./rb-comment-balloon.component.sass",
})
export class RbCommentBalloonComponent<TVersion extends RbVersion> {
    readonly comment = input.required<RbCommentResponse<TVersion>>()
    readonly playerName = computed(() => toHalfWidth(this.comment().name))
    readonly commentTime = computed(() => new Date(this.comment().time * 1000))
    protected readonly balloonMaskName = computed(() => {
        switch (this.comment().balloon) {
            case RbCommentBalloon.cloud: return "cloud"
            case RbCommentBalloon.think: return "think"
            case RbCommentBalloon.explode: return "explode"
            default: return undefined
        }
    })
}
