import { Component, inject, viewChild } from "@angular/core"
import { RbSettingsService } from "../../../services/specified/rb-settings.service"
import { RbVersionService } from "../../../services/specified/rb-version.service"
import { Rb6CharacterCardInfo, Rb6EquipmentInfo, Rb6EquipmentPart, RbByword, RbColor, RbItemResponse, RbMusicResponse, RbVersion } from "server/models/shared/web"
import { BungIntersectionService } from "../../../services/bung/intersection.service"
import { BungModalDirective } from "../../../directives/bung/modal.directive"

@Component({
    selector: "rb-settings",
    templateUrl: "./settings.component.html",
    styleUrl: "./settings.component.sass",
    standalone: false
})
export class RbSettingsSubpage<TVersion extends RbVersion> {
    protected readonly settingsService = inject(RbSettingsService)
    protected readonly versionService = inject(RbVersionService)
    private static readonly formatter1 = new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 1,
        useGrouping: false
    })
    protected readonly formatHighSpeed = RbSettingsSubpage.formatter1.format
    protected readonly selectOptionEq = (opt: number, v: number | undefined /** | string */) => opt === (typeof v === "string" ? parseInt(v) : v)

    private readonly mylistModalTrigger = viewChild("mylistModalTrigger", { read: BungModalDirective })

    #versionBackup?: TVersion

    constructor(intersectionService: BungIntersectionService) {
        intersectionService.createGroup("rb-settings-ranking-quest-dropdown")
        this.settingsService.resetForm()
    }

    protected filterItems(items: RbItemResponse[] | undefined, type: string | number): RbItemResponse[] {
        if (!items) return []
        if (typeof type === "string") return items.filter(i => i.type === type)
        else return items.filter(i => i.typeId === type)
    }
    protected isItemAvailable(item: RbItemResponse): boolean {
        return this.settingsService.availableItems.hasValue() && this.settingsService.availableItems.value().some(ai => ai.typeId === item.typeId && ai.value === item.value)
    }
    protected filterBywords(bywords: RbByword[] | undefined, side: RbColor): RbByword[] {
        if (!bywords) return []
        return bywords.filter(b => b.side === side)
    }
    protected isBywordAvailable(byword: RbByword, side: RbColor): boolean {
        return this.settingsService.availableItems.hasValue() && this.settingsService.availableItems.value().some(ai => ai.typeId === (side === RbColor.blue && (this.versionService.version() === 2 || this.versionService.version() === 3) ? 8 : 7) && ai.value === byword.id)
    }
    protected filterEquips(equips: Rb6EquipmentInfo[] | undefined, part: Rb6EquipmentPart): Rb6EquipmentInfo[] {
        if (!equips) return []
        return equips.filter(e => e.part === part)
    }
    protected isEquipAvailable(equip: Rb6EquipmentInfo): boolean {
        const typeId = equip.part + 9
        return this.settingsService.availableItems.hasValue() && this.settingsService.availableItems.value().some(ai => ai.typeId === typeId && ai.value === equip.id)
    }
    protected isCharacterCardAvailable(charaCard: Rb6CharacterCardInfo): boolean {
        return this.settingsService.availableItems.hasValue() && this.settingsService.availableItems.value().some(ai => ai.typeId === 6 && ai.value === charaCard.id)
    }
    protected notify() {
        alert("Toggle changed")
    }
    protected findMusic(musicId: number): RbMusicResponse<TVersion> | undefined {
        if (!this.settingsService.musics.hasValue()) return undefined
        return this.settingsService.musics.value().find(m => m.musicId === musicId && m.version === this.versionService.version()) as RbMusicResponse<TVersion>
    }
    protected filterMylist(mylist: number[]) {
        return mylist.filter(i => i >= 0)
    }
    protected onRemoveMylist(musicId: number) {
        const casted = this.settingsService.cast(this.settingsService.settingsForm, 3)
        const oldList = casted.mylist().value()
        const idInArray = oldList.indexOf(musicId)
        if (idInArray < 0) return
        const newList = [...oldList.slice(0, idInArray), -1, ...oldList.slice(idInArray + 1)]
        casted.mylist().setControlValue(newList)
    }
    protected onRemoveMylistSlot(slot: number) {
        const casted = this.settingsService.cast(this.settingsService.settingsForm, 2)
        const list: [number, number, number, number, number] = [...casted.mylist().value()]
        list[slot] = -1
        casted.mylist().setControlValue(list)
    }
    protected onMylistSlotChanged() {
        this.mylistModalTrigger()?.close()
    }
    protected onRb6ChangePastelPart(part: Rb6EquipmentPart, value: number | undefined) {
        if (this.versionService.version() !== 6) return
        if (value == undefined) return
        const partsField = this.settingsService.cast(this.settingsService.settingsForm, 6).pastelParts()
        const parts: [number, number, number, number] = [...partsField.value()]
        parts[part] = value
        partsField.setControlValue(parts)
    }
}
