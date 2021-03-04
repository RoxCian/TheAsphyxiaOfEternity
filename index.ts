import { Rb1HandlersWebUI } from "./handlers/rb1/webui"
import { Rb4HandlersCommon } from "./handlers/rb4/common"
import { Rb5HandlersCommon } from "./handlers/rb5/common"
import { Rb6HandlersCommon } from "./handlers/rb6/common"
import { Rb6HandlersWebUI } from "./handlers/rb6/webui"
import { Rb1Rb2Rb3HandlersDispatcher } from "./handlers/utility/rb1rb2rb3_dispatcher"
import { UtilityHandlersWebUI } from "./handlers/utility/webui"

export function register() {
    R.GameCode("KBR")
    R.GameCode("LBR")
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    R.Config("unlock_all_songs", { type: "boolean", default: false });
    R.Config("unlock_all_character_cards", { type: "boolean", default: false });

    R.WebUIEvent("rb6UpdateSettings", Rb6HandlersWebUI.updateSettings)
    R.WebUIEvent("rb1UpdateSettings", Rb1HandlersWebUI.updateSettings)
    R.WebUIEvent("removeWebUIMessage", UtilityHandlersWebUI.removeWebUIMessage)

    routeRb6()
    routeRb5()
    routeRb4()
    routeRb1Rb2Rb3()

    R.Unhandled()
}

function routeRb6() {
    R.Route("info.rb6_info_read", Rb6HandlersCommon.ReadInfo)
    R.Route("info.rb6_info_read_hit_chart", Rb6HandlersCommon.ReadHitChartInfo)
    R.Route("pcb.rb6_pcb_boot", Rb6HandlersCommon.BootPcb)
    R.Route("player.rb6_player_start", Rb6HandlersCommon.StartPlayer)
    R.Route("player.rb6_player_read", Rb6HandlersCommon.ReadPlayer)
    R.Route("player.rb6_player_write", Rb6HandlersCommon.WritePlayer)
    R.Route("player.rb6_player_delete", Rb6HandlersCommon.DeletePlayer)
    R.Route("player.rb6_player_read_score", Rb6HandlersCommon.ReadPlayerScore)
    R.Route("player.rb6_player_read_jc", Rb6HandlersCommon.ReadPlayerJustCollections)
    R.Route("eventlog.write", true)
}

function routeRb5() {
    R.Route("pcb.rb5_pcb_boot", Rb5HandlersCommon.BootPcb)
    R.Route("player.rb5_player_start", Rb5HandlersCommon.StartPlayer)
    R.Route("player.rb5_player_read", Rb5HandlersCommon.ReadPlayer)
    R.Route("player.rb5_player_read_score_5", Rb5HandlersCommon.ReadPlayerScore)
    R.Route("player.rb5_player_read_score_old_5", Rb5HandlersCommon.ReadPlayerScoreOldVersion)
    R.Route("player.rb5_player_write_5", Rb5HandlersCommon.WritePlayer)
    R.Route("lobby.rb5_lobby_read", Rb5HandlersCommon.ReadLobby)
    R.Route("lobby.rb5_lobby_entry", Rb5HandlersCommon.ReadLobby)
}

function routeRb4() {
    R.Route("pcb.rb4boot", Rb4HandlersCommon.BootPcb)
    R.Route("player.rb4_player_start", Rb4HandlersCommon.StartPlayer)
    // R.Route("player.rb5_player_read", Rb5HandlersCommon.ReadPlayer)
    // R.Route("player.rb5_player_read_score_5", Rb5HandlersCommon.ReadPlayerScore)
    // R.Route("player.rb5_player_read_score_old_5", Rb5HandlersCommon.ReadPlayerScoreOldVersion)
    // R.Route("player.rb5_player_write_5", Rb5HandlersCommon.WritePlayer)
    // R.Route("lobby.rb5_lobby_read", Rb5HandlersCommon.ReadLobby)
    // R.Route("lobby.rb5_lobby_entry", Rb5HandlersCommon.ReadLobby)
}

function routeRb1Rb2Rb3() {
    R.Route("pcbinfo.get", Rb1Rb2Rb3HandlersDispatcher.DispatchBootPcb)
    R.Route("player.start", Rb1Rb2Rb3HandlersDispatcher.DispatchStartPlayer)
    R.Route("player.succeed", Rb1Rb2Rb3HandlersDispatcher.DispatchPlayerSucceeded)
    R.Route("player.write", Rb1Rb2Rb3HandlersDispatcher.DispatchWritePlayer)
    R.Route("player.read", Rb1Rb2Rb3HandlersDispatcher.DispatchReadPlayer)
    R.Route("log.play", Rb1Rb2Rb3HandlersDispatcher.DispatchLogPlayer)
}