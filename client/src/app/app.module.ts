import { NgModule, provideZonelessChangeDetection } from "@angular/core"
import { AppComponent } from "./app.component"
import { APP_BASE_HREF } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"
import { AppRoutingModule } from "./app-routing.module"
import { provideHttpClient, withFetch } from "@angular/common/http";


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule
    ],
    providers: [
        provideZonelessChangeDetection(),
        provideHttpClient(withFetch()),
        { provide: APP_BASE_HREF, useValue: location.pathname.substring(0, location.pathname.lastIndexOf("/")) }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
