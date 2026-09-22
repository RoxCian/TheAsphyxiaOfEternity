import { NgModule, provideZonelessChangeDetection } from "@angular/core"
import { APP_BASE_HREF } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"
import { provideHttpClient } from "@angular/common/http"
import { AppComponent } from "./app.component"
import { AppRoutingModule } from "./app-routing.module"

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
        provideHttpClient(),
        { provide: APP_BASE_HREF, useValue: location.pathname.startsWith("/plugin/") ? location.pathname.substring(0, location.pathname.indexOf("/", 8)) : "/" }
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
