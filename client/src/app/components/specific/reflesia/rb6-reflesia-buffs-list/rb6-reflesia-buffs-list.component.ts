import { Component, computed, input } from "@angular/core"
import { Rb6DungeonBuffFlag } from "rbweb"
import { hasFlag } from "../../../../utils/functions"

@Component({
    selector: "rb6-reflesia-buffs-list",
    standalone: false,
    templateUrl: "./rb6-reflesia-buffs-list.component.html",
    styleUrl: "./rb6-reflesia-buffs-list.component.sass",
})
export class Rb6ReflesiaBuffsListComponent {
    readonly buffs = input.required<Rb6DungeonBuffFlag>()
    protected readonly hasMasterJudge = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.masterJudge))
    protected readonly hasJrInfMode = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.jrInfMode))
    protected readonly hasGreatAsGood = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.greatAsGood))
    protected readonly hasOnlyJrDamage = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.onlyJrDamage))
    protected readonly hasRivalJrGreatDamage = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.rivalJrGreatDamage))
    protected readonly hasNoTopColor = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.noTopColor))
    protected readonly hasLowSpeed = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.lowSpeed))
    protected readonly hasNoRecovery = computed(() => hasFlag(this.buffs(), Rb6DungeonBuffFlag.noRecovery))
}
