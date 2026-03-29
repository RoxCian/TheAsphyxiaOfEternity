import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

const routes: Routes = [
    { path: "", loadComponent: () => import("./pages/dev-home/dev-home.component").then(file => file.DevHomePageComponent) },
    { path: "profile", loadComponent: () => import("./pages/profile/profile.component").then(file => file.ProfilePageComponent) },
    { path: "ingame_comments", loadComponent: () => import("./pages/comments/comments.component").then(file => file.CommentsPageComponent) }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
