import { Component, computed, effect, inject, input, output, signal } from "@angular/core"
import { RbMusicResponse, RbVersion } from "rbweb"
import { RbSettingsService } from "../../../../services/specified/rb-settings.service"
import { RbVersionService } from "../../../../services/specified/rb-version.service"
import { BungIntersectionService } from "../../../../services/bung/intersection.service"
import { BungBreakpointService } from "../../../../services/bung/breakpoint.service"

@Component({
    selector: "rb-mylist-editor",
    templateUrl: "./rb-mylist-editor.component.html",
    styleUrl: "./rb-mylist-editor.component.sass",
    standalone: false,
})
export class RbMylistEditorComponent<TVersion extends RbVersion> {
    protected readonly settingsService = inject(RbSettingsService)
    protected readonly versionService = inject(RbVersionService)

    readonly mylist = this.versionService.version() >= 2 ? this.settingsService.cast(this.settingsService.settingsForm, 3).mylist : undefined
    readonly mylistCount = computed(() => this.mylist?.().value().filter(m => m >= 0).length ?? 0)
    readonly slot = input<number | undefined>()
    protected readonly musicsSorted = signal<RbMusicResponse<RbVersion>[]>([])

    readonly mylistSlotChanged = output()

    protected readonly breakpointService = inject(BungBreakpointService)

    #inited = false

    constructor(intersectionService: BungIntersectionService) {
        intersectionService.createGroup("rb-settings-mylist-editor")
        effect(() => {
            if (this.#inited) return
            const value = this.mylist?.()?.value()
            if (value) {
                this.#inited = true
                this.musicsSorted.set(this.toSortedMusics(value))
            }
        })
    }

    protected containInMylist(music: RbMusicResponse<TVersion>): boolean {
        return this.mylist?.().value().includes(music.musicId) ?? false
    }
    protected onRemoveMylist(musicId: number) {
        if (!this.mylist) return
        const oldList = this.mylist().value()
        const idInArray = oldList.indexOf(musicId)
        if (idInArray < 0) return
        const newList = [...oldList.slice(0, idInArray), -1, ...oldList.slice(idInArray + 1)]
        this.mylist().controlValue.set(newList)
    }
    protected onAddMylist(musicId: number) {
        if (!this.mylist || this.mylistCount() >= 30) return
        const oldList = this.mylist().value()
        let firstEmptySlot = oldList.indexOf(-1)
        if (firstEmptySlot < 0 && (oldList.length >= 30 || (oldList.length >= 5 && this.versionService.version() === 2))) return
        if (firstEmptySlot < 0) firstEmptySlot = oldList.length
        const newList = [...oldList.slice(0, firstEmptySlot), musicId, ...oldList.slice(firstEmptySlot + 1)]
        this.mylist().controlValue.set(newList)
    }
    protected onRemoveMylistSlot(slot: number) {
        if (!this.mylist) return
        const list = [...this.mylist().value()]
        list[slot] = -1
        this.mylist().controlValue.set(list)
        this.mylistSlotChanged.emit()
    }
    protected onSetMylistSlot(slot: number, musicId: number) {
        if (!this.mylist) return
        const list = [...this.mylist().value()]
        list[slot] = musicId
        this.mylist().controlValue.set(list)
        this.mylistSlotChanged.emit()
    }
    protected toSortedMusics(mylist: number[]): RbMusicResponse<RbVersion>[] {
        const slot = this.slot()
        const musics = this.settingsService.musics.value()
        if (!mylist || !musics) return []
        if (slot != undefined) {
            const result = musics.filter(m => !mylist.includes(m.musicId))
            if (mylist[slot] ?? -1 > 0) {
                const slotMusic = musics.find(m => m.musicId === mylist[slot])
                if (slotMusic) result.splice(0, 0, slotMusic)
            }
            return result
        }
        return this.settingsService.musics.value()?.sort((l, r) => {
            const li = mylist.includes(l.musicId)
            const ri = mylist.includes(r.musicId)
            if ((li && ri) || (!li && !ri)) return l.musicId - r.musicId
            if (li) return -1
            return 1
        }) ?? []
    }
}
