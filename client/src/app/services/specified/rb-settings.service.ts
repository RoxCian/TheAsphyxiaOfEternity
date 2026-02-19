import { computed, effect, inject, Injectable, linkedSignal, signal } from "@angular/core"
import { createRbSettingsResponse, Rb6CharacterCardInfo, Rb6EquipmentInfo, Rb6RankingQuestResponse, RbAvailableItemResponse, RbByword, RbItemResponse, RbMusicResponse, RbRequest, RbSettingsResponse, RbVersion, RbWriteSettingsResponse } from "server/models/shared/web"
import { rbData } from "../../signals/rb-data"
import { RbVersionService } from "./rb-version.service"
import { RbProfileService } from "./rb-profile.service"
import { FieldTree, form, max, maxLength, min, minLength, PathKind, required, SchemaPathTree, submit, validate } from "@angular/forms/signals"
import { isInShiftJISCharset } from "../../utils/functions"

@Injectable({ providedIn: "root" })
export class RbSettingsService {
    private readonly versionService = inject(RbVersionService)
    private readonly profileService = inject(RbProfileService)
    private readonly submittedInternal = signal(false)
    private readonly submissionErrorInternal = signal<string | undefined>(undefined)
    private readonly settingsResource = rbData<RbSettingsResponse<RbVersion>>(computed(() => `rb${this.versionService.version()}ReadSettings`), this.profileService.ridRequest)
    readonly settings = linkedSignal(computed(() => this.settingsResource.hasValue() ? this.settingsResource.value() : createRbSettingsResponse(this.versionService.version())))
    readonly settingsForm = form(this.settings, path => {
        required(path.name)
        minLength(path.name, 2, { message: "Name length is less than 2." })
        maxLength(path.name, 8, { message: "Name length is more than 8." })
        validate(path.name, ctx => ctx.value() ? undefined : { kind: "", context: ctx, message: "Name is empty." })
        validate(path.name, ctx => isInShiftJISCharset(ctx.value()) ? undefined : { kind: "", context: ctx, message: "Some of characters in name cannot convert to ShiftJIS." })
        maxLength(path.comment, 50)
        min(path.shotVolume, 0)
        max(path.shotVolume, 100)
        min(path.backgroundBrightness, 0)
        max(path.backgroundBrightness, 100)
        if (this.versionService.version() === 5) {
            const casted = this.cast(path, 5)
            min(casted.voiceMessageSet, 0)
            max(casted.voiceMessageSet, 100)
        }
        if (this.versionService.version() === 6) {
            const casted = this.cast(path, 6)
            min(casted.highSpeed, 1)
            max(casted.highSpeed, 3)
        }
    })
    readonly submitted = this.submittedInternal.asReadonly()
    readonly submissionError = this.submissionErrorInternal.asReadonly()
    readonly items = rbData<RbItemResponse[], { version: RbVersion }>("rbReadItems", computed(() => ({ version: this.versionService.version() })))
    readonly bywords = rbData<RbByword[], { version: RbVersion }>("rbReadBywords", computed(() => ({ version: this.versionService.version() })))
    readonly availableItems = rbData<RbAvailableItemResponse[]>(computed(() => `rb${this.versionService.version()}ReadAvailableItems`), this.profileService.ridRequest)
    readonly musics = rbData<RbMusicResponse<RbVersion>[], { version: RbVersion }>("rbReadMusics", computed(() => ({ version: this.versionService.version() })))
    readonly rankingQuests = rbData<Rb6RankingQuestResponse[], {}>(computed(() => this.versionService.version() === 6 ? "rb6ReadRankingQuests" : undefined), {})
    readonly equips = rbData<Rb6EquipmentInfo[], {}>(computed(() => this.versionService.version() === 6 ? "rb6ReadEquips" : undefined), {})
    readonly characterCards = rbData<Rb6CharacterCardInfo[], {}>(computed(() => this.versionService.version() === 6 ? "rb6ReadCharacterCards" : undefined), {})

    constructor() {
        effect(() => {
            if (this.settingsForm().dirty()) this.submittedInternal.set(false)
        })
    }
    cast<T, TVersion extends RbVersion>(value: T, _: TVersion): CastToVersion<T, TVersion> {
        return value as CastToVersion<T, TVersion>
    }
    resetForm() {
        this.settingsForm().reset()
    }
    async submit() {
        if (this.settingsForm().invalid() || !this.settingsForm().dirty()) return
        const form = this.settingsForm().value() as RbRequest & RbSettingsResponse<RbVersion>
        form.rid = this.profileService.rid()
        try {
            console.log(JSON.stringify(form))
            const version = this.versionService.version()
            const result = await (await fetch(`emit/rb${version}WriteSettings`, {
                method: "POST",
                body: JSON.stringify(form),
                headers: {
                    "content-type": "application/json;charset=UTF-8"
                }
            })).json() as RbWriteSettingsResponse
            if (result.state === "succeeded") {
                this.settingsResource.reload()
                this.settingsForm().reset()
                this.submittedInternal.set(true)
                this.profileService.reload(this.versionService.version())
            } else {
                this.submissionErrorInternal.set(result.reason ? result.reason.join(", ") : "Unknown reason")
            }
        } catch (ex) {
            if (ex instanceof Error) this.submissionErrorInternal.set(ex.message)
        }
    }
}

type CastToVersion<T, TVersion extends RbVersion> = 
    T extends FieldTree<RbSettingsResponse<RbVersion>, string | number> ? FieldTree<RbSettingsResponse<TVersion>, string | number> :
    T extends SchemaPathTree<RbSettingsResponse<RbVersion>, PathKind.Root> ? SchemaPathTree<RbSettingsResponse<TVersion>, PathKind.Root> : 
    T extends RbSettingsResponse<RbVersion> ? RbSettingsResponse<TVersion> :
    never