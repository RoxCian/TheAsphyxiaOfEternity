import { Rb6Common } from "./handlers/rb6_common"
import { Rb6WebUI } from "./handlers/rb6_webui";

export function register() {
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    R.Config("unlock_all_songs", { type: "boolean", default: false });
    R.Config("unlock_all_character_cards", { type: "boolean", default: false });

    R.WebUIEvent("rb6UpdateSettings", Rb6WebUI.updateSettings)

    routeRb6()

    R.Unhandled()
}

function routeRb6() {
    R.Route("info.rb6_info_read", Rb6Common.ReadInfo)
    R.Route("info.rb6_info_read_hit_chart", Rb6Common.ReadHitChartInfo)
    R.Route("pcb.rb6_pcb_boot", Rb6Common.BootPcb)
    R.Route("player.rb6_player_start", Rb6Common.StartPlayer)
    R.Route("player.rb6_player_read", Rb6Common.ReadPlayer)
    R.Route("player.rb6_player_write", Rb6Common.WritePlayer)
    R.Route("player.rb6_player_delete", Rb6Common.DeletePlayer)
    R.Route("player.rb6_player_read_score", Rb6Common.ReadPlayerScore)
    R.Route("player.rb6_player_read_jc", Rb6Common.ReadPlayerJustCollections)
    R.Route("eventlog.write", true)
}