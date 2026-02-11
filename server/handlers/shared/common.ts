import { H } from "../../utils/handler"

export function registerRb1Rb2Rb3HandlersDispatcher() {
    H.route("player.start", dispatchStartPlayer)
    H.route("player.succeed", dispatchPlayerSucceeded)
    H.route("player.write", dispatchWritePlayer)
    H.route("player.read", dispatchReadPlayer)
    H.route("log.play", dispatchLogPlayer)
    H.route("lobby.entry", dispatchAddLobby)
    H.route("lobby.read", dispatchReadLobby)
    H.route("lobby.delete", dispatchDeleteLobby)
    H.route("info.pzlcmt_read", dispatchReadComment)
    H.route("info.pzlcmt_write", dispatchWriteComment)
    H.route("event_w.add_comment", dispatchWriteComment)
    H.route("event_r.get_all", dispatchReadComment)
    H.route("event_w.update_status", dispatchUpdateEventStatus)
}

const dispatchStartPlayer: H.H = (data, info) => dispatch("player.start", data, info)
const dispatchReadPlayer: H.H = (data, info) => dispatch("player.read", data, info)
const dispatchWritePlayer: H.H = (data, info) => dispatch("player.write", data, info)
const dispatchLogPlayer: H.H = (data, info) => dispatch("log.player", data, info, [undefined, undefined, H.deny])
const dispatchPlayerSucceeded: H.H = (data, info) => dispatch("player.succeed", data, info, [H.success, H.success, undefined])
const dispatchAddLobby: H.H = (data, info) => dispatch("lobby.entry", data, info)
const dispatchReadLobby: H.H = (data, info) => dispatch("lobby.read", data, info)
const dispatchDeleteLobby: H.H = (data, info) => dispatch("lobby.delete", data, info)
const dispatchReadComment: H.H = (data, info) => dispatch("info.pzlcmt_read", data, info, [H.deny, undefined, undefined])
const dispatchWriteComment: H.H = (data, info) => dispatch("info.pzlcmt_write", data, info, [H.deny, undefined, undefined])
const dispatchUpdateEventStatus: H.H = (data, info) => dispatch("event_w.update_status", data, info, [H.deny, undefined, H.deny])

function dispatch(method: string, data: unknown, info: EamuseInfo, versionMasks: [H.HandlerResult | undefined, H.HandlerResult | undefined, H.HandlerResult | undefined] = [undefined, undefined, undefined]): object | H.HandlerResult | Promise<object | H.HandlerResult> {
    let version: 1 | 2 | 3
    if (info.model.startsWith("KBR")) {
        if (versionMasks[0]) return versionMasks[0]
        version = 1
    } else if (info.model.startsWith("LBR")) {
        if (versionMasks[1]) return versionMasks[1]
        version = 2
    } else if (info.model.startsWith("MBR")) {
        if (versionMasks[2]) return versionMasks[2]
        version = 3
    } else return H.deny
    method = method.replace(/\./, `.rb${version}`)
    return H.redirect(method, data, info)
}