import { AppModule } from "./app/app.module"
import { platformBrowser } from "@angular/platform-browser"
import { PJ } from "./app/utils/pj"

JSON.stringify = PJ.stringify
JSON.parse = PJ.parse

platformBrowser().bootstrapModule(AppModule).catch(console.error)
