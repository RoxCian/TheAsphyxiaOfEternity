import { Component, input, ChangeDetectionStrategy } from "@angular/core"
import { RbComment, RbVersion } from "rbweb"

@Component({
    selector: "rb-comment-balloon",
    standalone: false,
    templateUrl: "./rb-comment-balloon.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./rb-comment-balloon.component.sass",
})
export class RbCommentBalloonComponent<TVersion extends RbVersion> {
    readonly comment = input.required<RbComment<TVersion>>()
}
