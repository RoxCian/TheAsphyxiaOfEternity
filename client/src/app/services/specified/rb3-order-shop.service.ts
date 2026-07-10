import { computed, inject, Service, signal } from "@angular/core"
import { Rb3OrderDetailsParamFlag, Rb3OrderType, Rb3OrderResponse, Rb3OrderShopResponse, Rb3OrderSlot } from "rbweb"
import { RbActivatableServiceBase } from "./rb.service"
import { rbData } from "../../signals/rb-data"
import { rbEmitJSON } from "../../utils/rb-functions"
import { BungNotificationService } from "../bung/notification.service"
import { HttpResourceRef } from "@angular/common/http"
import { hasFlag } from "../../utils/functions"

@Service()
export class Rb3OrderShopService extends RbActivatableServiceBase<Rb3OrderShopResponse> {
    readonly orderShop = rbData<Rb3OrderShopResponse>(() => this.isActivated() && this.dataVersion() === 3 ? `rb3ReadOrderShop` : undefined, this.profileService.ridRequest())
    readonly maxSlots = computed(() => {
        const level = this.orderShop.value()?.level
        if (!level || level < 30) return 3
        if (level < 100) return 4
        return 5
    })
    readonly grouped = computed<Partial<Record<Rb3OrderType, Rb3OrderResponse[]>>>(() => this.orderShop.value()?.details.reduce((prev, next) => {
        if (!prev[next.info.orderType]) prev[next.info.orderType] = []
        prev[next.info.orderType].push(next)
        return prev
    }, {} as Record<Rb3OrderType, Rb3OrderResponse[]>) ?? {})
    readonly clearedOrderCount = computed(() => this.orderShop.value()?.details.reduce((prev, next) => next.clearedCount > 0 ? prev + 1 : prev, 0) ?? 0)
    readonly firstEmptySlot = computed(() => {
        const slotVisited = new Array(this.maxSlots).map(() => false)
        for (const d of this.orderShop.value()?.details ?? []) {
            if (d.slot >= 0) slotVisited[d.slot] = true
        }
        return slotVisited.findIndex(s => !s)
    })
    private readonly isLoadingInternal = signal(false)
    private readonly loadingOrderInternal = signal(-1)
    readonly loadingOrder = computed(() => this.isLoadingInternal() || this.orderShop.isLoading() ? this.loadingOrderInternal() : -1)

    private readonly notificationService = inject(BungNotificationService)

    protected override onActivate(): HttpResourceRef<Rb3OrderShopResponse | undefined> {
        return this.orderShop
    }
    async acceptOrder(index: number) {
        if (!this.isActivated()) return
        this.isLoadingInternal.set(true)
        try {
            const firstEmptySlot = this.firstEmptySlot()
            if (firstEmptySlot < 0) {
                this.notificationService.notify("No order slot left", "danger")
                return
            }
            this.loadingOrderInternal.set(index)
            const d = (this.orderShop.value()?.details ?? []).find(d => d.info.id === index)
            const result = await rbEmitJSON<{ modified: boolean }>("rb3WriteOrderSlot", {
                rid: this.profileService.rid(),
                index, slot: firstEmptySlot, isLocked: hasFlag(d?.param ?? Rb3OrderDetailsParamFlag.none, Rb3OrderDetailsParamFlag.lockedToSlot)
            } as Rb3OrderSlot)
            if (result.modified) this.orderShop.reload()
        } catch (ex) {
            if (ex instanceof Error) this.notificationService.notify(ex.message, "danger")
        }
        this.isLoadingInternal.set(false)
        // this.loadingOrderInternal.set(-1) × do not set to -1
    }
    async removeOrder(index: number) {
        if (!this.isActivated()) return
        this.isLoadingInternal.set(true)
        try {
            const d = (this.orderShop.value()?.details ?? []).find(d => d.info.id === index)
            if ((d?.slot ?? -1) < 0) {
                this.notificationService.notify("Order is not accepted", "danger")
                return
            }
            const result = await rbEmitJSON<{ modified: boolean }>("rb3WriteOrderSlot", {
                rid: this.profileService.rid(),
                index, slot: -1, isLocked: false
            } as Rb3OrderSlot)
            if (result.modified) this.orderShop.reload()
        } catch (ex) {
            if (ex instanceof Error) this.notificationService.notify(ex.message, "danger")
        }
        this.isLoadingInternal.set(false)
        // this.loadingOrderInternal.set(-1) × do not set to -1
    }
    async toggleOrderLock(slot: number) {
        if (!this.isActivated()) return
        this.isLoadingInternal.set(true)
        try {
            const d = (this.orderShop.value()?.details ?? []).find(d => d.slot === slot)
            if (!d) {
                this.notificationService.notify(`No order in slot ${slot}`, "danger")
                return
            }
            this.loadingOrderInternal.set(d.info.id)
            const result = await rbEmitJSON<{ modified: boolean }>("rb3WriteOrderSlot", {
                rid: this.profileService.rid(),
                index: d.info.id, slot, isLocked: !hasFlag(d.param, Rb3OrderDetailsParamFlag.lockedToSlot)
            } as Rb3OrderSlot)
            if (result.modified) this.orderShop.reload()
        } catch (ex) {
            if (ex instanceof Error) this.notificationService.notify(ex.message, "danger")
        }
        // this.loadingOrderInternal.set(-1) × do not set to -1
        this.isLoadingInternal.set(false)
    }
}
