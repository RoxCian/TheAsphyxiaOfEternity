import { Rb6Handlers } from "./handlers/rb6_handlers"

export function register() {
    R.GameCode("MBR")

    R.Contributor("Rox Cian", "https://github.com/RoxCian")

    routeRb6()

    R.Unhandled()
}

function routeRb6() {
    R.Route("info.rb6_info_read", Rb6Handlers.ReadInfo)
    R.Route("info.rb6_info_read_hit_chart", Rb6Handlers.ReadHitChartInfo)
    R.Route("pcb.rb6_pcb_boot", Rb6Handlers.BootPcb)
    R.Route("player.rb6_player_start", Rb6Handlers.StartPlayer)
    R.Route("player.rb6_player_read", Rb6Handlers.ReadPlayer)
    R.Route("player.rb6_player_write", Rb6Handlers.WritePlayer)
    R.Route("player.rb6_player_delete", Rb6Handlers.DeletePlayer)
    R.Route("player.rb6_player_read_score", Rb6Handlers.ReadPlayerScore)
    R.Route("player.rb6_player_read_jc", Rb6Handlers.ReadPlayerJustCollections)
    R.Route("eventlog.write", true)
}