import { Rb1HandlersCommon } from "../rb1/common"
import { Rb2HandlersCommon } from "../rb2/common"
import { Rb3HandlersCommon } from "../rb3/common"
import { UtilityHandlersCommon } from "./common"

export namespace Rb1Rb2Rb3HandlersDispatcher {
    export const DispatchStartPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.StartPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.StartPlayer(info, data, send)
        else if (info.model.startsWith("MBR")) return await Rb3HandlersCommon.StartPlayer(info, data, send)
        else send.deny()
    }
    export const DispatchReadPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.ReadPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.ReadPlayer(info, data, send)
        else if (info.model.startsWith("MBR")) return await Rb3HandlersCommon.ReadPlayer(info, data, send)
        else send.deny()
    }
    export const DispatchWritePlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.WritePlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.WritePlayer(info, data, send)
        else if (info.model.startsWith("MBR")) return await Rb3HandlersCommon.WritePlayer(info, data, send)
        else send.deny()
    }
    export const DispatchLogPlayer: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await Rb1HandlersCommon.LogPlayer(info, data, send)
        else if (info.model.startsWith("LBR")) return await Rb2HandlersCommon.LogPlayer(info, data, send)
        else send.deny()
    }
    export const DispatchPlayerSucceeded: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR") || info.model.startsWith("LBR")) return await send.success()
        else if (info.model.startsWith("MBR")) return await Rb3HandlersCommon.PlayerSucceeded(info, data, send)
        else send.deny()
    }
    export const DispatchAddLobby: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await UtilityHandlersCommon.getAddLobbyHandler(1)(info, data, send)
        else if (info.model.startsWith("LBR")) return await UtilityHandlersCommon.getAddLobbyHandler(2)(info, data, send)
        else if (info.model.startsWith("MBR")) return await UtilityHandlersCommon.getAddLobbyHandler(3)(info, data, send)
        else send.deny()
    }
    export const DispatchReadLobby: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await UtilityHandlersCommon.getReadLobbyHandler(1)(info, data, send)
        else if (info.model.startsWith("LBR")) return await UtilityHandlersCommon.getReadLobbyHandler(2)(info, data, send)
        else if (info.model.startsWith("MBR")) return await UtilityHandlersCommon.getReadLobbyHandler(3)(info, data, send)
        else send.deny()
    }
    export const DispatchDeleteLobby: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await UtilityHandlersCommon.getDeleteLobbyHandler(1)(info, data, send)
        else if (info.model.startsWith("LBR")) return await UtilityHandlersCommon.getDeleteLobbyHandler(2)(info, data, send)
        else if (info.model.startsWith("MBR")) return await UtilityHandlersCommon.getDeleteLobbyHandler(3)(info, data, send)
        else send.deny()
    }
    export const DispatchReadComment: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await send.deny()
        else if (info.model.startsWith("LBR")) return await UtilityHandlersCommon.getReadCommentHandler(2)(info, data, send)
        else if (info.model.startsWith("MBR")) return await UtilityHandlersCommon.getReadCommentHandler(3)(info, data, send)
        else send.deny()
    }
    export const DispatchWriteComment: EPR = async (info, data, send) => {
        if (info.model.startsWith("KBR")) return await send.deny()
        else if (info.model.startsWith("LBR")) return await UtilityHandlersCommon.getWriteCommentHandler(2)(info, data, send)
        else if (info.model.startsWith("MBR")) return await UtilityHandlersCommon.getWriteCommentHandler(3)(info, data, send)
        else send.deny()
    }
}