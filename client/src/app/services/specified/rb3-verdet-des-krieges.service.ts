import { computed, effect, inject, Service, signal } from "@angular/core"
import { RbVersionService } from "./rb-version.service"
import { rbData } from "../../signals/rb-data"
import { RbProfileService } from "./rb-profile.service"
import { Rb3VerdetDesKriegesAppearance, Rb3VerdetDesKriegesContent, Rb3VerdetDesKriegesNote, Rb3VerdetDesKriegesResponse, Rb3VerdetDesKriegesUnlockRequestType, RbMusicResponse, RbRequest } from "rbweb"
import { BungNotificationService } from "../bung/notification.service"
import { rbEmitJSON } from "../../utils/rb-functions"
import { HttpResourceRef } from "@angular/common/http"

enum ClaudiaAbnormalType {
    none, playerIcon, playerName, musicRecords, stageLogs
}

@Service()
export class Rb3VerdetDesKriegesService {
    private readonly versionService = inject(RbVersionService)
    private readonly profileService = inject(RbProfileService)
    private readonly notificationService = inject(BungNotificationService)
    readonly verdetDesKrieges = rbData<Rb3VerdetDesKriegesResponse>(() => this.versionService.version() === 3 ? "rb3ReadVerdetDesKrieges" : undefined, this.profileService.ridRequest)
    readonly pageCount = rbData<{ pageCount: number }>(() => this.isActivated() ? "rb3ReadVerdetDesKriegesPageCount" : undefined, computed(() => ({
        rid: this.profileService.rid(),
        chapter: this.chapter() < 0 ? 0 : this.chapter()
    })))
    private readonly pageInternal = signal(-1)
    private readonly chapterInternal = signal(-1)
    private readonly pageContentInternal = signal<Rb3VerdetDesKriegesContent[]>([])
    private readonly isActivatedInternal = signal(false)

    readonly isActivated = computed(() => this.versionService.version() === 3 && this.isActivatedInternal())

    readonly page = this.pageInternal.asReadonly()
    readonly chapter = this.chapterInternal.asReadonly()
    readonly pageContent = this.pageContentInternal.asReadonly()
    readonly notes = rbData<Rb3VerdetDesKriegesNote[]>(() => this.isActivated() ? "rb3ReadVerdetDesKriegesNotes" : undefined, {} as RbRequest)
    readonly appearances = rbData<Rb3VerdetDesKriegesAppearance[]>(() => this.isActivated() && this.chapter() >= 1 && this.chapter() <= 3 ? "rb3ReadVerdetDesKriegesAppearances" : undefined, computed(() => ({ chapter: this.chapter() } as unknown as RbRequest)))
    readonly canNavigateToNextPage = computed(() => {
        const data = this.verdetDesKrieges.value()
        if (!data) return true
        const pageCount = this.pageCount.value()?.pageCount ?? 0
        const chapter = this.chapter()
        const page = this.page()
        if (chapter < data.chapter) return true
        if (chapter > data.chapter) return false
        if (page < data.page) return true
        if (page > data.page) return false
        if (page >= 3) return data.progress[0] === 60 && data.progress[1] === 60 && data.progress[2] === 60 && data.progress[3] === 60 && data.lastReadPage < pageCount
        return true
    })
    readonly canNavigateToNextChapter = computed(() => {
        const data = this.verdetDesKrieges.value()
        if (!data) return true
        return this.chapter() < data.chapter || (this.chapter() === data.chapter && data.chapter < 3 && data.progress.every(p => p === 60))
    })
    readonly canUnlockMusic = computed(() => {
        const data = this.verdetDesKrieges.value()
        return data?.progress.every(p => p === 60)
    })
    readonly claudiaAbnormal = computed(() => {
        const data = this.verdetDesKrieges.value()
        return (data?.chapter === 2 && data?.progress?.[0] !== 60) || this.claudiaAbnormalClicked() ? Rb3VerdetDesKriegesService.claudiaAbnormalType : ClaudiaAbnormalType.none
    })
    readonly isShowPastel = computed(() => {
        const data = this.verdetDesKrieges.value()
        return data && data.chapter >= 1 && data.page >= 3
    })
    private readonly claudiaAbnormalClicked = signal(false)
    private readonly isLoadingInternal = signal(false)
    readonly isLoading = computed(() => this.verdetDesKrieges.isLoading() || this.pageCount.isLoading() || this.appearances.isLoading() || this.isLoadingInternal())

    private static readonly claudiaAbnormalType: ClaudiaAbnormalType = Math.random() > (2 / 3) ? 1 + Math.round(Math.random() * 3) : ClaudiaAbnormalType.none

    constructor() {
        effect(() => {
            if (this.verdetDesKrieges.isLoading() || !this.isActivated()) return
            const data = this.verdetDesKrieges.value()
            if (!data && this.chapterInternal() < 0) this.navigateTo(0, 0)
            else if (data && (data.lastReadChapter !== this.chapterInternal() || data.lastReadPage !== this.pageInternal())) this.navigateTo(data.lastReadChapter, data.lastReadPage)
        })
    }
    activate(): HttpResourceRef<Rb3VerdetDesKriegesResponse | undefined> {
        this.isActivatedInternal.set(true)
        return this.verdetDesKrieges
    }
    deactivate() {
        this.isActivatedInternal.set(false)
    }

    async navigateTo(chapter: number, page: number) {
        if (this.isLoading()) return
        const pageBackup = this.pageInternal()
        const chapterBackup = this.chapterInternal()
        try {
            // check locally
            const data = this.verdetDesKrieges.value()
            if (data && (chapter !== data.lastReadChapter || page !== data.lastReadPage)) {
                if (chapter > data.chapter || (chapter === data.chapter && page > data.page + 1)) {
                    this.notificationService.notify("The page is not unlocked. Play to increase unlock progress.")
                    return
                } else if (chapter === data?.chapter && page >= 4 && (data.progress[0] !== 60 || data.progress[1] !== 60 || data.progress[2] !== 60 || data.progress[3] !== 60)) {
                    this.notificationService.notify("The page is not unlocked. Play to increase unlock progress.")
                    return
                }
            } else if (!data && (chapter > 1 || page > 0)) {
                this.notificationService.notify("The page is not unlocked. Play to increase unlock progress.")
                return
            }
            // local check end
            this.isLoadingInternal.set(true)
            this.chapterInternal.set(chapter)
            this.pageInternal.set(page)
            const pageData = await rbEmitJSON<Rb3VerdetDesKriegesContent[]>("rb3ReadVerdetDesKriegesPage", { rid: this.profileService.rid(), chapter, page })
            this.verdetDesKrieges.reload()
            this.pageContentInternal.set(pageData)
            this.isLoadingInternal.set(false)
        } catch (ex) {
            this.chapterInternal.set(chapterBackup)
            this.pageInternal.set(pageBackup)
            this.notificationService.notify((ex as Error).message, "danger")
        }
    }
    clickClaudia(): Promise<RbMusicResponse<3> | undefined> {
        this.claudiaAbnormalClicked.set(true)
        return this.unlock(Rb3VerdetDesKriegesUnlockRequestType.hiddenLink2)
    }
    async unlock(type: Rb3VerdetDesKriegesUnlockRequestType): Promise<RbMusicResponse<3> | undefined> {
        if (this.isLoading()) return undefined
        const data = this.verdetDesKrieges.value()
        if (!data && type === Rb3VerdetDesKriegesUnlockRequestType.start) {
            this.isLoadingInternal.set(true)
            const modified = await rbEmitJSON<{ modified: boolean }>("rb3UnlockVerdetDesKrieges", { rid: this.profileService.rid(), type })
            if (modified.modified) {
                this.verdetDesKrieges.reload()
            }
            this.isLoadingInternal.set(false)
        }
        if (type >= Rb3VerdetDesKriegesUnlockRequestType.chapterFinish1) {
            if (!data || !data.progress.every(p => p === 60)) {
                this.notificationService.notify("The page is not unlocked. Play to increase unlock progress.")
                return undefined
            }
            this.isLoadingInternal.set(true)
        }
        const modified = await rbEmitJSON<{ modified: boolean }>("rb3UnlockVerdetDesKrieges", { rid: this.profileService.rid(), type })
        if (!modified.modified) {
            return undefined
        }
        if (type < Rb3VerdetDesKriegesUnlockRequestType.chapterFinish1) {
            this.verdetDesKrieges.reload()
            return undefined
        }
        if (type === Rb3VerdetDesKriegesUnlockRequestType.hiddenLink2) {
            this.notificationService.notify("You investigated Claudia, but found nothing worthy.", "warning")
        }
        const music = await rbEmitJSON<RbMusicResponse<3>>("rbGetMusic", { version: 3, musicId: type })
        this.isLoadingInternal.set(false)
        // if (this.verdetDesKrieges.value()?.chapter === 3) this.verdetDesKrieges.reload()
        // else await this.navigateTo(this.verdetDesKrieges.value()!.chapter + 1, 0)
        return music
    }
    async reset() {
        await rbEmitJSON("rb3DebugResetVerdetDesKrieges", this.profileService.ridRequest)
        location.reload()
    }
}
