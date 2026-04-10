import { Component, ElementRef, inject, inputBinding, signal, TemplateRef, viewChild } from "@angular/core"
import { RbVersionService } from "../../../services/specified/rb-version.service"
import { RbProfileService } from "../../../services/specified/rb-profile.service"
import { BungModalService } from "../../../services/bung/modal.service"
import { BungModalComponent } from "../../../components/bung/modal/modal.component"
import { ImportAsphyxiaData } from "./save-data.type"
import { rbEmit, rbEmitJSON } from "../../../utils/rb-functions"
import { inverted } from "../../../signals/inverted"

@Component({
    selector: "rb-save-data-subpage",
    templateUrl: "./save-data.component.html",
    styleUrl: "./save-data.component.sass",
    standalone: false
})
export class RbSaveDataSubpage {
    protected readonly versionService = inject(RbVersionService)
    protected readonly profileService = inject(RbProfileService)
    protected readonly modalService = inject(BungModalService)
    protected readonly isDownloading = signal(false)
    protected readonly isUploading = signal(false)
    protected readonly isDeleting = signal(false)
    protected readonly uploadingProfileData = signal<File | undefined>(undefined)
    protected readonly uploadingScoresData = signal<File | undefined>(undefined)
    protected readonly uploadResult = signal<string | undefined>(undefined)
    protected readonly isUploaded = signal<boolean>(false)
    protected readonly finalConfirmModalInputValue = signal("")
    protected readonly confirmModalBodyTemplate = viewChild("confirmModal", { read: TemplateRef })
    protected readonly finalConfirmModalBodyTemplate = viewChild("finalConfirmModal", { read: TemplateRef })
    protected readonly deleteResult = signal<string | undefined>(undefined)
    protected readonly finalConfirmText = "I am aware of the consequences of this action. Delete my save data."

    protected readonly profileInput = viewChild<ElementRef<HTMLInputElement>>("profileInput")
    protected readonly scoresInput = viewChild<ElementRef<HTMLInputElement>>("scoresInput")
    #confirmDeleteModal?: BungModalComponent<void>
    #finalConfirmDeleteModal?: BungModalComponent<void>

    protected async onDownloadSaveFile() {
        if (this.isDownloading()) return
        this.isDownloading.set(true)
        const response = await rbEmit("rbExportSaveData", { rid: this.profileService.rid(), version: this.versionService.version() })
        const fileName = `RB${this.versionService.version()}-savedata-${this.profileService.rid()}-${new Date().toISOString().replace(/[-:.]/g, "")}.asphyxiacore`
        const a = document.createElement("a")
        a.download = fileName
        a.href = URL.createObjectURL(await response.blob())
        a.dispatchEvent(new MouseEvent("click"))
        this.isDownloading.set(false)
    }
    protected onChangeProfileDataToUpload(e: Event) {
        const fileInput = e.target as HTMLInputElement
        if (!fileInput.files?.length) return
        this.isUploaded.set(false)
        this.uploadResult.set(undefined)
        this.uploadingProfileData.set(fileInput.files?.[0])
    }
    protected onChangeScoresDataToUpload(e: Event) {
        const fileInput = e.target as HTMLInputElement
        if (!fileInput.files?.length) return
        this.isUploaded.set(false)
        this.uploadResult.set(undefined)
        this.uploadingScoresData.set(fileInput.files?.[0])
    }
    protected onClearProfileDataToUpload(e?: MouseEvent) {
        e?.stopImmediatePropagation()
        // no need to set isUploaded to false
        this.uploadResult.set(undefined)
        this.uploadingProfileData.set(undefined)
    }
    protected onClearScoresDataToUpload(e?: MouseEvent) {
        e?.stopImmediatePropagation()
        // no need to set isUploaded to false
        this.uploadResult.set(undefined)
        this.uploadingScoresData.set(undefined)
    }
    protected async onUploadAsphyxia() {
        this.isUploading.set(true)
        this.isUploaded.set(false)
        this.uploadResult.set(undefined)
        const profile = this.uploadingProfileData()
        const scores = this.uploadingScoresData()
        if (!profile || !scores) {
            this.uploadResult.set("Files are not provided.")
            return
        }
        if (profile.size > 10 * 1024 * 1024) {
            this.uploadResult.set("Profile is too large.")
            return
        }
        if (scores.size > 512 * 1024 * 1024) {
            this.uploadResult.set("Scores file is too large.")
            return
        }
        const worker = new Worker(new URL('./save-data.worker', import.meta.url))
        let workerResolver: (result: string) => void
        const workerPromise = new Promise<string>(res => workerResolver = res)
        worker.addEventListener("message", e => workerResolver(e.data?.toString()))

        const data: ImportAsphyxiaData = await rbEmitJSON<ImportAsphyxiaData>("rb6RequestAsphyxia", {
            rid: this.profileService.rid(),
            profileSize: profile.size,
            scoresSize: scores.size
        })
        data.rid = this.profileService.rid()
        data.profileFile = await profile.arrayBuffer()
        data.scoresFile = await scores.arrayBuffer()
        worker.postMessage(data, [data.profileFile, data.scoresFile])
        const result = await workerPromise
        this.uploadResult.set(result)
        this.isUploading.set(false)
        if (!result) {
            this.onClearProfileDataToUpload()
            this.onClearScoresDataToUpload()
            this.isUploaded.set(true)
        }
    }
    protected async onOpenConfirmDeleteSaveFile() {
        this.deleteResult.set("")
        this.#confirmDeleteModal = this.modalService.modal("Confirm delete save file", this.confirmModalBodyTemplate, undefined, undefined,
            { bindings: [inputBinding("isCard", () => true), inputBinding("hasDelete", inverted(this.isDeleting))] }
        )
    }
    protected async onOpenFinalConfirmDeleteSaveFile() {
        this.#finalConfirmDeleteModal = this.modalService.modal("LAST WARN", this.finalConfirmModalBodyTemplate, undefined, undefined,
            { bindings: [inputBinding("isCard", () => true), inputBinding("hasDelete", inverted(this.isDeleting))] }
        )
        const finalHandle = this.#finalConfirmDeleteModal.closing.subscribe(c => {
            finalHandle.unsubscribe()
            this.onCloseDeleteSaveFileModal()
        })
    }
    protected async onCloseDeleteSaveFileModal() {
        this.#finalConfirmDeleteModal?.close()
        this.#confirmDeleteModal?.close()
        this.finalConfirmModalInputValue.set("")
        this.deleteResult.set("")
    }
    protected onFinalConfirmModalInputValueChanged(e: Event) {
        this.finalConfirmModalInputValue.set((e.target as HTMLInputElement)?.value ?? "")
    }
    protected async onDeleteSaveFile() {
        this.deleteResult.set("")
        this.isDeleting.set(true)
        const handle1 = this.#finalConfirmDeleteModal?.closing.subscribe(e => e.isCanceled = true)
        const handle2 = this.#confirmDeleteModal?.closing.subscribe(e => e.isCanceled = true)
        const result = await this.profileService.delete(this.versionService.version())
        handle1?.unsubscribe()
        handle2?.unsubscribe()
        if (!result) this.onCloseDeleteSaveFileModal()
        else this.deleteResult.set(result)
        this.isDeleting.set(false)
    }
}
