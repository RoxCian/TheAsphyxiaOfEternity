import { AnimationCallbackEvent, Component, computed, effect, inject, linkedSignal, OnInit, signal, untracked } from "@angular/core"
import { Rb3VerdetDesKriegesService } from "../../../../services/specified/rb3-verdet-des-krieges.service"
import { Rb3VerdetDesKriegesPhrasePart, Rb3VerdetDesKriegesUnlockRequestType } from "rbweb"
import { timeout } from "../../../../utils/functions"
import { BungPopupService } from "../../../../services/bung/popup.service"
import { RbMusicUnlockPopupComponent } from "../../music-unlock-modal-content/rb-music-unlock-modal-content/rb-music-unlock-popup.component"

@Component({
    selector: "rb3-verdet-des-krieges-storyboard",
    standalone: false,
    templateUrl: "./rb3-verdet-des-krieges-storyboard.component.html",
    styleUrls: ["./rb3-verdet-des-krieges-storyboard.component.sass", "./rb3-verdet-des-krieges-storyboard.animation.sass"],
})
export class Rb3VerdetDesKriegesStoryboardComponent implements OnInit {
    protected readonly service = inject(Rb3VerdetDesKriegesService)
    protected readonly viewState = signal<"init" | "cover" | "contents" | "page" | "transit-page" | "transit-chapter" | "transit-non-page">("init")
    protected readonly showPastel = linkedSignal(computed(() => this.service.chapter() === 1 && ((this.service.verdetDesKrieges.value()?.chapter ?? 0) > 1 || (this.service.verdetDesKrieges.value()?.page ?? 0) >= 3)))
    protected readonly pastelProperty = {
        pastelId: Math.random() > 0.5 ? Math.round(Math.random() * 4) : -1, // 50% probability
        side: (["left", "right", "top", "bottom"] as const)[Math.round(Math.random() * 3)],
        position: Math.random()
    }
    protected readonly notUnlockNow = signal(false)
    protected readonly isUnlocking = signal(false)
    protected readonly isShowUnlockMusicModal = signal(false)
    protected readonly isUnlocked = signal(false)
    protected readonly showUnlockScreen = computed(() => this.service.isActivated() && !this.notUnlockNow() && ((this.service.canUnlockMusic() && this.service.chapter() === this.service.verdetDesKrieges.value()?.chapter) || this.isShowUnlockMusicModal() || this.isUnlocking()))

    private readonly popupService = inject(BungPopupService)
    private viewStateBackup?: "cover" | "contents" | "page"

    constructor() {
        effect(() => {
            if (this.service.isLoading() || !this.service.isActivated()) return
            const state = untracked(() => this.viewState())
            if (!this.service.verdetDesKrieges.value() || this.service.chapter() === 0) {
                if (state === "transit-page" || state === "transit-non-page") this.viewStateBackup = "cover"
                else if (state !== "contents") this.viewState.set("cover")
                return
            }
            if (state === "transit-page" || state === "transit-non-page") this.viewStateBackup = "page"
            else if (state !== "contents") this.viewState.set("page")
        })
    }

    ngOnInit(): void {
        this.notUnlockNow.set(false)
    }

    protected computeHighlightPhraseLength(phrase: string | (string | Rb3VerdetDesKriegesPhrasePart)[]): number {
        if (typeof phrase === "string") return phrase.length
        else return phrase.reduce((prev, next) => prev + (typeof next === "string" ? next.length : this.computeHighlightPhraseLength(next.text)), 0)
    }
    protected async onContentTransitionEnd(e: AnimationCallbackEvent) {
        await timeout(400)
        if (this.viewState() === "transit-non-page" || this.viewState() === "transit-chapter") {
            this.notUnlockNow.set(false)
        }
        if (this.viewStateBackup) this.viewState.set(this.viewStateBackup)
        else if (this.viewState() === "contents") return e.animationComplete()
        else if (!this.service.verdetDesKrieges.value() || this.service.chapter() === 0) this.viewState.set("cover")
        else this.viewState.set("page")
        this.viewStateBackup = undefined
        e.animationComplete()
    }
    protected onEnter() {
        const data = this.service.verdetDesKrieges.value()
        this.viewState.set("transit-non-page")
        if (!data) this.service.unlock(Rb3VerdetDesKriegesUnlockRequestType.start)
        else this.service.navigateTo(data?.chapter ?? 1, data?.page ?? 0)
    }
    protected onGotoCover() {
        this.isUnlocked.set(false)
        this.viewState.set("transit-non-page")
        this.service.navigateTo(0, 0)
    }
    protected onGotoContents() {
        this.isUnlocked.set(false)
        this.viewState.set("contents")
    }
    protected onNavigateToPage(page: number) {
        this.isUnlocked.set(false)
        this.viewState.set("transit-page")
        this.service.navigateTo(this.service.chapter(), page)
    }
    protected onNavigateToPrevious() {
        this.isUnlocked.set(false)
        if (this.service.page() === 0) {
            this.viewState.set("transit-chapter")
            this.service.navigateTo(this.service.chapter() - 1, 4)
        } else {
            this.viewState.set("transit-page")
            this.service.navigateTo(this.service.chapter(), this.service.page() - 1)
        }
    }
    protected onNavigateToNext() {
        this.isUnlocked.set(false)
        if (this.service.page() === (this.service.pageCount.value()?.pageCount ?? 0) - 1) {
            if (this.service.chapter() === this.service.verdetDesKrieges.value()?.chapter && this.service.canUnlockMusic()) {
                this.notUnlockNow.set(false)
            } else {
                this.viewState.set("transit-chapter")
                this.service.navigateTo(this.service.chapter() + 1, 0)
            }
        } else {
            this.viewState.set("transit-page")
            this.service.navigateTo(this.service.chapter(), this.service.page() + 1)
        }
    }
    protected onNavigateToChapter(chapter: number) {
        this.isUnlocked.set(false)
        if (this.service.chapter() === chapter && this.service.page() === 0) this.viewState.set("page")
        else {
            this.viewState.set("transit-non-page")
            this.service.navigateTo(chapter, 0)
        }
    }
    protected onPastelClicked() {
        this.service.unlock(Rb3VerdetDesKriegesUnlockRequestType.hiddenLink1)
        this.showPastel.set(false)
    }
    protected async onUnlock() {
        if (this.isUnlocking() || this.isUnlocked() || !this.service.canUnlockMusic()) return
        this.isUnlocking.set(true)
        const data = this.service.verdetDesKrieges.value()
        if (!data) {
            this.isUnlocking.set(false)
            return
        }
        let unlockFlag: Rb3VerdetDesKriegesUnlockRequestType
        switch (data.chapter) {
            case 1:
                unlockFlag = Rb3VerdetDesKriegesUnlockRequestType.chapterFinish1
                break
            case 2:
                unlockFlag = Rb3VerdetDesKriegesUnlockRequestType.chapterFinish2
                break
            case 3:
                unlockFlag = Rb3VerdetDesKriegesUnlockRequestType.chapterFinish3
                break
            default:
                this.isUnlocking.set(false)
                return
        }
        const music = await this.service.unlock(unlockFlag)
        if (!music) {
            this.isUnlocking.set(false)
            return
        }
        this.isShowUnlockMusicModal.set(true)
        this.isUnlocking.set(false)
        this.isUnlocked.set(true)
        const popup = this.popupService.popup(undefined, undefined, RbMusicUnlockPopupComponent, {
            duration: Infinity,
            layer: "rb-music-score",
            bindings: {
                version: 3,
                music
            }
        })
        const closeHandle = popup.closing.subscribe(() => {
            this.isShowUnlockMusicModal.set(false)
            closeHandle.unsubscribe()
        })
    }
}
