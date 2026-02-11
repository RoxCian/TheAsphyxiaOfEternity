import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"

const routes: Routes = [
    { path: "profile", loadComponent: () => import("./pages/test/test-page/test-page.component").then(file => file.TestProfilePageComponent) }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
