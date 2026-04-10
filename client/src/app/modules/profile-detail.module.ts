import { CommonModule } from "@angular/common"
import { NgModule } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { BungModule } from "./bung.module"
import { VersionNavComponent } from "../components/misc/version-nav/version-nav.component"
import { RbBattleStatComponent } from "../components/specific/battle-stat/rb-battle-stat/rb-battle-stat.component"
import { RbBywordTagComponent } from "../components/specific/byword-tag/rb-byword-tag/rb-byword-tag.component"
import { RbChartLightComponent } from "../components/specific/chart-light/rb-chart-light/rb-chart-light.component"
import { RbClasscheckPanelComponent } from "../components/specific/classcheck-panel/rb-classcheck-panel/rb-classcheck-panel.component"
import { Rb6JustCollectRateComponent } from "../components/specific/just-collect-rate/rb6-just-collect-rate/rb6-just-collect-rate.component"
import { RbLevelDisplaySwitchComponent } from "../components/specific/level-display-switch/rb-level-display-switch/rb-level-display-switch.component"
import { RbLevelPromptComponent } from "../components/specific/level-prompt/rb-level-prompt/rb-level-prompt.component"
import { RbMatchingGradeComponent } from "../components/specific/matching-grade/rb-matching-grade/rb-matching-grade.component"
import { RbMusicTitleComponent } from "../components/specific/music-title/rb-music-title/rb-music-title.component"
import { RbPlayerTagComponent } from "../components/specific/player-tag/rb-player-tag/rb-player-tag.component"
import { RbRankBadgeComponent } from "../components/specific/rank-badge/rb-rank-badge/rb-rank-badge.component"
import { RbRankLabelComponent } from "../components/specific/rank-label/rb-rank-label/rb-rank-label.component"
import { RbRecordPanelComponent } from "../components/specific/record-panel/rb-record-panel/rb-record-panel.component"
import { RbRecordPopupContentAllChartComponent } from "../components/specific/record-popup/rb-record-popup-content-all-chart/rb-record-popup-content-all-chart.component"
import { RbRecordPopupContentSingleChartComponent } from "../components/specific/record-popup/rb-record-popup-content-single-chart/rb-record-popup-content-single-chart.component"
import { RbRecordPopupComponent } from "../components/specific/record-popup/rb-record-popup/rb-record-popup.component"
import { RbRenewalLabelComponent } from "../components/specific/renewal-label/rb-renewal-label/rb-renewal-label.component"
import { RbStageLogJudgeGridComponent } from "../components/specific/stage-log-judge-grid/rb-stage-log-judge-grid/rb-stage-log-judge-grid.component"
import { RbStageLogPanelComponent } from "../components/specific/stage-log-panel/rb-stage-log-panel/rb-stage-log-panel.component"
import { RbStageLogPopupComponent } from "../components/specific/stage-log-popup/rb-stage-log-popup/rb-stage-log-popup.component"
import { Rb1StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb1-stage-log-popup-content/rb1-stage-log-popup-content.component"
import { Rb2StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb2-stage-log-popup-content/rb2-stage-log-popup-content.component"
import { Rb3StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb3-stage-log-popup-content/rb3-stage-log-popup-content.component"
import { Rb4StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb4-stage-log-popup-content/rb4-stage-log-popup-content.component"
import { Rb5StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb5-stage-log-popup-content/rb5-stage-log-popup-content.component"
import { Rb6StageLogPopupContentComponent } from "../components/specific/stage-log-popup/rb6-stage-log-popup-content/rb6-stage-log-popup-content.component"
import { RbChartTypeDirective } from "../directives/specific/rb-chart-type.directive"
import { RbColorDirective } from "../directives/specific/rb-color.directive"
import { ClampPipe } from "../pipes/misc/clamp.pipe"
import { DecimalPartPipe } from "../pipes/misc/decimal-part.pipe"
import { RelativeTimePipe } from "../pipes/misc/relative-time.pipe"
import { FriendlyFileSizePipe } from "../pipes/misc/friendly-file-size.pipe"
import { TruncPipe } from "../pipes/misc/trunc.pipe"
import { RbBywordRarityLiteralPipe } from "../pipes/specific/rb-byword-rarity-literal.pipe"
import { RbChartTypeLiteralPipe } from "../pipes/specific/rb-chart-type-to-name.pipe"
import { RbFormatBpmPipe } from "../pipes/specific/rb-format-bpm.pipe"
import { RbJacketPipe } from "../pipes/specific/rb-jacket.pipe"
import { RbRankPipe } from "../pipes/specific/rb-rank.pipe"
import { RbStageIndexPipe } from "../pipes/specific/rb-stage-index.pipe"
import { RbTitlePipe } from "../pipes/specific/rb-title.pipe"
import { Rb2LevelLiteralPipe } from "../pipes/specific/rb2-level-literal.pipe"
import { RbVersionNavigatorComponent } from "../components/specific/version-navigator/rb-version-navigator/rb-version-navigator.component"
import { RbMissCountPipe } from "../pipes/specific/rb-miss-count.pipe"
import { AutoLoadPanelComponent } from "../components/misc/auto-load-panel/auto-load-panel.component"
import { RbActivityGridComponent } from "../components/specific/activity-grid/rb-activity-grid/rb-activity-grid.component"
import { RbPlayerCardComponent } from "../components/specific/player-card/rb-player-card/rb-player-card.component"
import { RbPlayDataSubpage } from "../pages/profile/play-data/play-data.component"
import { RbSettingsSubpage } from "../pages/profile/settings/settings.component"
import { FormField } from "@angular/forms/signals"
import { RbDefaultCommentPipe } from "../pipes/specific/rb-default-comment.pipe"
import { RbSettingsSectionComponent } from "../components/specific/settings-section/rb-settings-section/rb-settings-section.component"
import { RbObjectSizeSelectComponent } from "../components/specific/object-size-select/rb-object-size-select/rb-object-size-select.component"
import { Rb5HiSpeedSelectComponent } from "../components/specific/hi-speed-select/rb5-hi-speed-select/rb5-hi-speed-select.component"
import { Rb6ColorSpecificationSelectComponent } from "../components/specific/color-specification-select/rb6-color-specification-select/rb6-color-specification-select.component"
import { RbSkillPointPanelComponent } from "../components/specific/skill-point-panel/rb-skill-point-panel/rb-skill-point-panel.component"
import { RbMusicIconComponent } from "../components/specific/music-icon/rb-music-icon/rb-music-icon.component";
import { RbMylistEditorComponent } from '../components/specific/mylist-editor/rb-mylist-editor/rb-mylist-editor.component'
import { RbSharedComponentsModule } from "./rb-shared-components.module"
import { RbSaveDataSubpage } from "../pages/profile/save-data/save-data.component";
import { RbChartLightBadgeComponent } from '../components/specific/chart-light/rb-chart-light-badge/rb-chart-light-badge.component'

@NgModule({
    declarations: [
        VersionNavComponent,
        RbBywordTagComponent,
        RbLevelPromptComponent,
        RbPlayerTagComponent,
        RbRecordPanelComponent,
        RbRenewalLabelComponent,
        RbMusicTitleComponent,
        RbLevelDisplaySwitchComponent,
        RbRecordPopupComponent,
        RbChartLightComponent,
        RbTitlePipe,
        RbChartTypeDirective,
        Rb6JustCollectRateComponent,
        RelativeTimePipe,
        FriendlyFileSizePipe,
        RbRankLabelComponent,
        RbBattleStatComponent,
        RbRankBadgeComponent,
        RbJacketPipe,
        RbChartTypeLiteralPipe,
        RbRecordPopupContentSingleChartComponent,
        RbRecordPopupContentAllChartComponent,
        RbStageLogPanelComponent,
        RbMatchingGradeComponent,
        TruncPipe,
        ClampPipe,
        Rb6StageLogPopupContentComponent,
        RbRankPipe,
        RbColorDirective,
        RbStageLogPopupComponent,
        RbStageLogJudgeGridComponent,
        Rb5StageLogPopupContentComponent,
        DecimalPartPipe,
        Rb4StageLogPopupContentComponent,
        Rb2LevelLiteralPipe,
        Rb3StageLogPopupContentComponent,
        Rb2StageLogPopupContentComponent,
        Rb1StageLogPopupContentComponent,
        RbClasscheckPanelComponent,
        RbSkillPointPanelComponent,
        RbVersionNavigatorComponent,
        RbMusicIconComponent,
        AutoLoadPanelComponent,
        RbActivityGridComponent,
        RbPlayerCardComponent,
        RbObjectSizeSelectComponent,
        Rb5HiSpeedSelectComponent,
        Rb6ColorSpecificationSelectComponent,
        RbSettingsSectionComponent,
        RbFormatBpmPipe,
        RbStageIndexPipe,
        RbBywordRarityLiteralPipe,
        RbMissCountPipe,
        RbDefaultCommentPipe,
        RbPlayDataSubpage,
        RbSettingsSubpage,
        RbSaveDataSubpage,
        RbMylistEditorComponent,
        RbChartLightBadgeComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BungModule,
        FormField,
        RbSharedComponentsModule
    ],
    exports: [
        RbSharedComponentsModule,
        VersionNavComponent,
        RbBywordTagComponent,
        RbLevelPromptComponent,
        RbPlayerTagComponent,
        RbRecordPanelComponent,
        RbRenewalLabelComponent,
        RbMusicTitleComponent,
        RbLevelDisplaySwitchComponent,
        RbRecordPopupComponent,
        RbChartLightComponent,
        RbTitlePipe,
        RbChartTypeDirective,
        Rb6JustCollectRateComponent,
        RelativeTimePipe,
        FriendlyFileSizePipe,
        RbRankLabelComponent,
        RbBattleStatComponent,
        RbRankBadgeComponent,
        RbJacketPipe,
        RbChartTypeLiteralPipe,
        RbRecordPopupContentSingleChartComponent,
        RbRecordPopupContentAllChartComponent,
        RbStageLogPanelComponent,
        RbMatchingGradeComponent,
        TruncPipe,
        ClampPipe,
        Rb6StageLogPopupContentComponent,
        RbRankPipe,
        RbColorDirective,
        RbStageLogPopupComponent,
        RbStageLogJudgeGridComponent,
        Rb5StageLogPopupContentComponent,
        DecimalPartPipe,
        Rb4StageLogPopupContentComponent,
        Rb2LevelLiteralPipe,
        Rb3StageLogPopupContentComponent,
        Rb2StageLogPopupContentComponent,
        Rb1StageLogPopupContentComponent,
        RbClasscheckPanelComponent,
        RbSkillPointPanelComponent,
        RbVersionNavigatorComponent,
        RbMusicIconComponent,
        AutoLoadPanelComponent,
        RbActivityGridComponent,
        RbPlayerCardComponent,
        RbObjectSizeSelectComponent,
        Rb5HiSpeedSelectComponent,
        Rb6ColorSpecificationSelectComponent,
        RbSettingsSectionComponent,
        RbFormatBpmPipe,
        RbStageIndexPipe,
        RbBywordRarityLiteralPipe,
        RbMissCountPipe,
        RbDefaultCommentPipe,
        RbPlayDataSubpage,
        RbSettingsSubpage,
        RbSaveDataSubpage,
        RbMylistEditorComponent,
        RbChartLightBadgeComponent
    ],
})
export class ProfileDetailModule { }
