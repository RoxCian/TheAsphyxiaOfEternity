import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core'

@Component({
    selector: 'rb-battle-stat',
    templateUrl: './rb-battle-stat.component.html',
    styleUrls: ['./rb-battle-stat.component.sass'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class RbBattleStatComponent {
    readonly win = input(0)
    readonly lose = input(0)
    readonly draw = input(0)
    readonly total = computed(() => this.win() + this.lose() + this.draw())
}
