import { CommonModule } from "@angular/common"
import { Component } from "@angular/core"
import { RbCommentResponse, RbRequest, RbVersion } from "rbweb"
import { IngameCommentsModule } from "../../modules/ingame-comments.module"
import { rbData } from "../../signals/rb-data"

@Component({
    selector: "app-comments",
    imports: [CommonModule, IngameCommentsModule],
    templateUrl: "./comments.component.html",
    styleUrl: "./comments.component.sass",
})
export class CommentsPageComponent {
    protected readonly comments = rbData<RbCommentResponse<RbVersion>[]>("rbGetComments", {} as RbRequest)
}
