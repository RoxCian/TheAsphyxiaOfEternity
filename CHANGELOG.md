- v1.1.11

  Fixed webui bugs for newer version of RB Reflesia.

- v1.1.1

  Added a webui page for in-game comments.

  Fixed support for RB VOLZZA 1.

  Fixed bugs, webui can be loaded more quicker now.

- v1.1.0

  The in-game comment system is now available for RB limelight ~ RB Reflesia. The comments sended by everyone in any game can be showed in all RB titles.

  Fixed bugs on webui which can cause an error while loading data for RB colette / RB Reflesia.
    - Now you can change ar displaying type on webui for RB colette.

  Did more componentization works for the webui page.
    - Added a lovely game version select box for mobile devices.

  All of the jackets have received quality updates.

- v1.0.6

  Added the feature of view old scores for RB colette / RB groovin'!! / RB VOLZZA. You can view your highest score through RB1 to VOLZZA 2 (except the version you are playing) for each played charts.

  Added game settings for RB colette / RB VOLZZA on webui.

  Fixed the lobby feature and adjusted related settings on webui.

  Did some componentization works for webui and depleted the size of webui file.

  Added 6th KAC quests and ranking quests for RB Reflesia.
    - You can modify the ranking quest group on webui.

  Now the songs revived after 2018/04/05 are available by default for RB Reflesia.

  Optimize the webui for mobile devices.

  Data structure changes:
    - `stageClearGaugeType <-> stageAchievementRateDisplayingType` (swaped, breaking change)

- v1.0.5

  Fixed the lobby feature for all RB titles.
    - Now you can change lobby settings on webui (under the "Misc" tab).
  
  Added game settings for RB limelight on webui.

  Fixed webui bugs.

- v1.0.4

  Fixed a bug which can cause error while loading save data.

  Adjusted the webui.
    - Skill rate can be displayed now. (RB VOLZZA 2 & RB Reflesia)
    - Fixed scroll displaying for modals.
    - All bosses' name can be displayed. (RB groovin'!!)

- v1.0.3

  Fixed bugs about importing and database operation.

- v1.0.2

  Fixed a bug about inner types of mapping.

  Fixed some minor bugs for webui.

- v1.0.1

  Fixed an issue about not saving the highest score when played a chart multiple times.

  Improved webui experience.

- v1.0.0

  Added webui for RB groovin' (include settings). 
  - Due to some issues of data transfer, you cannot get your player name saved correctly in RB groovin' if you signed up with a new card or a card already has a player name with chinese characters/katakana & hiragana/symbols. You should edit your name on webui to solve it.

  Now Class 零 and 極 in class check mode of RB VOLZZA can be played.

  Fixed the logic of plugin settings.

  Fixed webui issues, organized webui codes.

  Database entry changes:
    - `averagePrecisionTimes100` (removed, breaking change)

- v0.12.0-beta

  Added RB groovin' support.

  Fixed bugs about play count, classcheck and comment.
  
  Database entry/data structure changes:
    - `dpc -> playCountToday` (compatible)
    - `tdc -> dayCount` (compatible)

- v0.11.11-beta

  Fixed bugs for RB Reflesia just collection, now the just collection rate on each color can be saved correctly and the data size of just collection entries are reduced dramatically.

  Fixed the data export feature on webui for RB1/RB Reflesia.

  Fixed a bug about not save dungeon quest flag for RB Reflesia.

  Fixed a bug about error while save class check mode for RB Reflesia/RB VOLZZA.

  Now Class 零 and 極 in class check mode of RB Reflesia can be played.

  Added all subjugation quests for RB Reflesia.

  Database entry/data structure changes:
    - `blueData` (RB Reflesia, removed from database, compatible)
    - `blueDattaArray -> blueDataBase64` (RB Reflesia, compatible)

- v0.11.1-beta

  Now all the non-breaking changes will keep compatible for 5 minor versions at least.

  Fixed event progress saving for RB colette.

  Added lobby feature for RB colette/RB VOLZZA, you can write comment in RB colette and play Reftis in RB VOLZZA 2 now, maybe you can matching also(not tested).

  Fixed some webui issues.

  Database entry/data structure changes:
    - `dpc -> playCountToday` (RB colette, compatible)
    - `tdc -> dayCount` (RB colette, compatible)

- v0.11.0-beta

  Added webui for RB colette.

  Fixed a bug about not saving the clear state in RB colette.

  Corrected the order of RB VOLZZA 2 bywords (manually).

- v0.10.0-beta

  Added RB colette support.

  Fixed an issue about saving bigint data.

  Fixed a bug about failed to save classcheck score if you had died on the 1st or the 2nd round.

- v0.9.0-beta

  Added webui for RB limelight.

  Fixed mylist (favorite musics) feature for RB limelight.

- v0.8.0-beta

  Added RB limelight support.

  Added settings for RB1.

  Added the feature of view old scores for limelight. You can view your highest score of RB1 and RB VOLZZA (and other versions to be supported in future) for each played charts.

  Fixed bugs.

- v0.7.0-beta

  Added webui for RB1. You can view your REFLEC BEAT play data on browser.

  Fixed bugs about RB1 play history.

  Fixed some webui bugs.

- v0.6.0-beta

  Added RB1 support.

- v0.5.1-beta

  Fixed a webui issue.

  Fixed a bug about saving mylist on webui. If you have the issue, modifying mylist through the webui should resolve it. (Thanks to @Xiao_ku)

- v0.5.0-beta

  Added webui for RB VOLZZA 2. You can view your VOLZZA play data on browser.

  Fixed a bug about no Great count in VOLZZA stage logs (again).

  Database entry changes
    - `justReflectCount -> justReflecCount` (again, breaking change)
    - `averagePrecisionTimes100 -> abilityPointTimes100` (compatible)

- v0.4.0-beta

  Added RB VOLZZA 2 support.

- v0.3.0-beta

  Added data import/export feature. You can import your Asphyxia save data now.

  Added more features into webui.

  Fixed a bug about no Great count in stage logs.

  Breaking changes:
  - Database entry changes
    - `rb.rb6.playData.justCollection -> rb.rb6.playData.justCollection#userId`
    - `stageColorRandom -> stageRandom`
    - `charactorCardId -> characterCardId`
    - `justReflectCount -> justReflecCount`
  - Changed name of some files, you can repair it by using TSLint.

- v0.2.1-alpha

  Fixed bug about Just Collection loading. All the Just Collection data saved by old version plugins can be loaded properly.

  Depleted the size of the webui file.

  Breaking changes:
  - Exported member changes
    - `IRb6JustCollectionElement -> IRb6ReadJustCollection`
    - `Rb6JustCollectionElementMappingRecord -> Rb6ReadJustCollectionElementMap`
  - Changed name of some files, you can repair it by using TSLint.

- v0.2.0-alpha

  Added webui support. Now you can view your play data and save settings on browser.

  Added features: quest progress saving, play history saving.

  Fixed some bugs.

  Breaking changes:
  - Database entry changes
    - `fullComboOrExcellentParam -> param`
    - `charactorCards -> characterCards`
  - Changed name of some files, you can repair it by using TSLint.

- v0.1.0-alpha

  Initial release.