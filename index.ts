import { Rb1Rb2Rb3HandlersDispatcher } from "./handlers/utility/rb1rb2rb3_dispatcher"
import { Rb4HandlersCommon } from "./handlers/rb4/common"
import { Rb5HandlersCommon } from "./handlers/rb5/common"
import { Rb6HandlersCommon } from "./handlers/rb6/common"
import { Rb1HandlersWebUI } from "./handlers/rb1/webui"
import { Rb2HandlersWebUI } from "./handlers/rb2/webui"
import { Rb4HandlersWebUI } from "./handlers/rb4/webui"
import { Rb5HandlersWebUI } from "./handlers/rb5/webui"
import { Rb6HandlersWebUI } from "./handlers/rb6/webui"
import { UtilityHandlersCommon } from "./handlers/utility/common"
import { UtilityHandlersWebUI } from "./handlers/utility/webui"
import { initialize } from "./handlers/utility/initialize"
import { Rb3HandlersWebUI } from "./handlers/rb3/webui"
import { Rb2HandlersCommon } from "./handlers/rb2/common"

export function register() {
    R.GameCode("KBR")
    R.GameCode("LBR")
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    R.Config("unlock_all_songs", { type: "boolean", default: false })
    R.Config("unlock_all_items", { type: "boolean", default: false })
    R.Config("comment_feature", { type: "boolean", default: true })

    R.WebUIEvent("removeWebUIMessage", UtilityHandlersWebUI.removeWebUIMessage)

    routeRb6()
    routeRb5()
    routeRb4()
    routeRb1Rb2Rb3()

    R.Unhandled()

    initialize()
}

function routeRb6() {
    R.Route("package.list", Rb6HandlersCommon.ListPackage)
    R.Route("message.get", Rb6HandlersCommon.GetMessage)
    R.Route("facility.get", Rb6HandlersCommon.GetFacility)
    R.Route("info.rb6_info_read", Rb6HandlersCommon.ReadInfo)
    R.Route("info.rb6_info_read_hit_chart", Rb6HandlersCommon.ReadHitChartInfo)
    R.Route("pcb.rb6_pcb_boot", Rb6HandlersCommon.BootPcb)
    R.Route("player.rb6_player_start", Rb6HandlersCommon.StartPlayer)
    R.Route("player.rb6_player_read", Rb6HandlersCommon.ReadPlayer)
    R.Route("player.rb6_player_write", Rb6HandlersCommon.WritePlayer)
    R.Route("player.rb6_player_delete", Rb6HandlersCommon.DeletePlayer)
    R.Route("player.rb6_player_read_score", Rb6HandlersCommon.ReadPlayerScore)
    R.Route("player.rb6_player_read_jc", Rb6HandlersCommon.ReadPlayerJustCollections)
    R.Route("player.rb6_player_succeed", Rb6HandlersCommon.PlayerSucceeded)
    R.Route("player.rb6_player_read_gs", Rb6HandlersCommon.ReadGhostScore)
    R.Route("player.rb6_player_read_rank", Rb6HandlersCommon.ReadRank)
    R.Route("lobby.rb6_lobby_entry", UtilityHandlersCommon.getAddLobbyHandler(6))
    R.Route("lobby.rb6_lobby_read", UtilityHandlersCommon.getReadLobbyHandler(6))
    R.Route("lobby.rb6_lobby_delete_entry", UtilityHandlersCommon.getDeleteLobbyHandler(6))
    R.Route("shop.rb6_shop_write_info", UtilityHandlersCommon.WriteShopInfo)
    R.Route("info.rb6pzlcmt_read", UtilityHandlersCommon.getReadCommentHandler(6))
    R.Route("info.rb6pzlcmt_write", UtilityHandlersCommon.getWriteCommentHandler(6))

    R.WebUIEvent("rb6UpdateSettings", Rb6HandlersWebUI.updateSettings)
}

function routeRb5() {
    R.Route("pcb.rb5_pcb_boot", Rb5HandlersCommon.BootPcb)
    R.Route("player.rb5_player_start", Rb5HandlersCommon.StartPlayer)
    R.Route("player.rb5_player_read", Rb5HandlersCommon.ReadPlayer)
    R.Route("player.rb5_player_read_score_5", Rb5HandlersCommon.ReadPlayerScore) // VOLZZA 2
    R.Route("player.rb5_player_read_score", Rb5HandlersCommon.ReadPlayerScore) // VOLZZA
    R.Route("player.rb5_player_read_score_old_5", Rb5HandlersCommon.ReadPlayerScoreOldVersion)
    R.Route("player.rb5_player_write_5", Rb5HandlersCommon.WritePlayer) // VOLZZA 2
    R.Route("player.rb5_player_write", Rb5HandlersCommon.WritePlayer) // VOLZZA
    R.Route("lobby.rb5_lobby_entry", UtilityHandlersCommon.getAddLobbyHandler(5))
    R.Route("lobby.rb5_lobby_read", UtilityHandlersCommon.getReadLobbyHandler(5))
    R.Route("lobby.rb5_lobby_delete", UtilityHandlersCommon.getDeleteLobbyHandler(5))
    R.Route("info.rb5pzlcmt_read", UtilityHandlersCommon.getReadCommentHandler(5))
    R.Route("info.rb5pzlcmt_write", UtilityHandlersCommon.getWriteCommentHandler(5))

    R.WebUIEvent("rb5UpdateSettings", Rb5HandlersWebUI.updateSettings)
}

function routeRb4() {
    R.Route("pcb.rb4boot", Rb4HandlersCommon.BootPcb)
    R.Route("player.rb4start", Rb4HandlersCommon.StartPlayer)
    R.Route("player.rb4write", Rb4HandlersCommon.WritePlayer)
    R.Route("player.rb4read", Rb4HandlersCommon.ReadPlayer)
    R.Route("player.rb4readepisode", Rb4HandlersCommon.ReadEpisode)
    R.Route("player.rb4readscore", Rb4HandlersCommon.ReadPlayerScore)
    R.Route("lobby.rb4entry", UtilityHandlersCommon.getAddLobbyHandler(4))
    R.Route("lobby.rb4read", UtilityHandlersCommon.getReadLobbyHandler(4))
    R.Route("lobby.rb4delete", UtilityHandlersCommon.getDeleteLobbyHandler(4))
    R.Route("player.rb4succeed", Rb4HandlersCommon.PlayerSucceeded)
    R.Route("info.rb4pzlcmt_read", UtilityHandlersCommon.getReadCommentHandler(4))
    R.Route("info.rb4pzlcmt_write", UtilityHandlersCommon.getWriteCommentHandler(4))

    R.WebUIEvent("rb4UpdateSettings", Rb4HandlersWebUI.updateSettings)
}

function routeRb1Rb2Rb3() {
    R.Route("player.start", Rb1Rb2Rb3HandlersDispatcher.DispatchStartPlayer)
    R.Route("player.succeed", Rb1Rb2Rb3HandlersDispatcher.DispatchPlayerSucceeded)
    R.Route("player.write", Rb1Rb2Rb3HandlersDispatcher.DispatchWritePlayer)
    R.Route("player.read", Rb1Rb2Rb3HandlersDispatcher.DispatchReadPlayer)
    R.Route("log.play", Rb1Rb2Rb3HandlersDispatcher.DispatchLogPlayer)
    R.Route("lobby.entry", Rb1Rb2Rb3HandlersDispatcher.DispatchAddLobby)
    R.Route("lobby.read", Rb1Rb2Rb3HandlersDispatcher.DispatchReadLobby)
    R.Route("lobby.delete", Rb1Rb2Rb3HandlersDispatcher.DispatchDeleteLobby)
    R.Route("info.pzlcmt_read", Rb1Rb2Rb3HandlersDispatcher.DispatchReadComment)
    R.Route("info.pzlcmt_write", Rb1Rb2Rb3HandlersDispatcher.DispatchWriteComment)
    R.Route("event_w.add_comment", Rb1Rb2Rb3HandlersDispatcher.DispatchWriteComment)
    R.Route("event_r.get_all", Rb1Rb2Rb3HandlersDispatcher.DispatchReadComment)
    R.Route("event_w.update_status", Rb2HandlersCommon.UpdateEventStatus)

    R.WebUIEvent("rb3UpdateSettings", Rb3HandlersWebUI.updateSettings)
    R.WebUIEvent("rb2UpdateSettings", Rb2HandlersWebUI.updateSettings)
    R.WebUIEvent("rb1UpdateSettings", Rb1HandlersWebUI.updateSettings)
}
