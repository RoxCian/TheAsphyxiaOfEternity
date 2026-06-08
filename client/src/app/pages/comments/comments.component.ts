import { CommonModule } from "@angular/common"
import { IngameCommentsModule } from "../../modules/ingame-comments.module"
import { Component } from "@angular/core"
import { rbData } from "../../signals/rb-data"
import { RbComment, RbCommentBalloon, RbCommentResponse, RbRequest, RbVersion } from "rbweb"

@Component({
    selector: "app-comments",
    imports: [CommonModule, IngameCommentsModule],
    templateUrl: "./comments.component.html",
    styleUrl: "./comments.component.sass",
})
export class CommentsPageComponent {
    protected readonly comments = rbData<RbCommentResponse<RbVersion>[]>("rbGetComments", {} as RbRequest)
}
