import { IWebUIMessage, WebUIMessageType } from "../../models/utility/webui_message"
import { DBM } from "../../utility/db_manager"

export namespace UtilityHandlersWebUI {
    export function pushMessage(message: string, type: WebUIMessageType, rid?: string) {
        DBM.upsert<IWebUIMessage>(null, { collection: "utility.webuiMessage" }, { collection: "utility.webuiMessage", message: message, type: type, refid: rid })
    }

    export const removeWebUIMessage = async () => {
        await DB.Remove<IWebUIMessage>({ collection: "utility.webuiMessage" })
    }
}