import { Rb1HandlersCommon } from "../rb1/common"
import { Rb2HandlersCommon } from "../rb2/common"

export namespace Rb1Rb2HandlersDispatcher {
    export const DispatchBootPcb: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.BootPcb(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.BootPcb(info, data, send)
        else send.deny()
    }
    export const DispatchStartPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.StartPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.StartPlayer(info, data, send)
        else send.deny()
    }
    export const DispatchReadPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.ReadPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.ReadPlayer(info, data, send)
        else send.deny()
    }
    export const DispatchWritePlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.WritePlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.WritePlayer(info, data, send)
        else send.deny()
    }
    export const DispatchLogPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.LogPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.LogPlayer(info, data, send)
        else send.deny()
    }
}