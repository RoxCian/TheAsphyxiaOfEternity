import { Rb3PastelAdventureEvent, Rb3PastelAdventureEventType } from "../../models/rb3/types"
import { loadCsv } from "../../utils/csv"

export const rb3PastelAdventureEvents = loadCsv<Rb3PastelAdventureEvent>("rb3_pastel_adventure")
export const rb3PastelAdventureFinalEvents = rb3PastelAdventureEvents.filter(e => e.eventType === Rb3PastelAdventureEventType.final)
export const rb3PastelAdventureNormalEvents = rb3PastelAdventureEvents.filter(e => e.eventType === Rb3PastelAdventureEventType.normal)