import { CommonModule } from "@angular/common"
import { IngameCommentsModule } from "../../modules/ingame-comments.module"
import { Component, ChangeDetectionStrategy } from "@angular/core"
import { rbData } from "../../signals/rb-data"

@Component({
    selector: "app-comments",
    imports: [CommonModule, IngameCommentsModule],
    templateUrl: "./comments.component.html",
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: "./comments.component.sass",
})
export class CommentsPageComponent {
    protected readonly comments = rbData("rbGetComments", {})
}
