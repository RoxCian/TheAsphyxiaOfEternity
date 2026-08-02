import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { BungModule } from "./bung.module"
import { RbSharedComponentsModule } from "./rb-shared-components.module"
import { RbCommentBalloonComponent } from '../components/specific/comment-balloon/rb-comment-balloon/rb-comment-balloon.component'

@NgModule({
    declarations: [
        RbCommentBalloonComponent
    ],
    imports: [
        CommonModule,
        BungModule,
        RbSharedComponentsModule
    ],
    exports: [
        RbSharedComponentsModule,
        RbCommentBalloonComponent,
    ],
})
export class IngameCommentsModule { }
