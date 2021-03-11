- v0.11.11-beta

  Fixed bugs for RB Reflesia just collection, now the just collection rate on each color can be saved correctly and the data size of just collection entries are reduced dramatically.

  Fixed the data export feature on webui for RB1/RB Reflesia.

  Fixed a bug about not save dungeon quest flag for RB Reflesia.

  Fixed a bug about error while save class check mode for RB Reflesia/RB VOLZZA.

  Now Class 零 and 極 in class check mode of RB Reflesia can be played.

  Added all subjugation quests for RB Reflesia.

  Database entry/data structure changes:
    - blueData (RB Reflesia, removed from database, compatible)
    - blueDattaArray -> blueDataBase64 (RB Reflesia, compatible)

- v0.11.1-beta

  Now all the non-breaking changes will keep compatible for 5 minor versions at least.

  Fixed event progress saving for RB colette.

  Added lobby feature for RB colette/RB VOLZZA, you can write comment in RB colette and play Reftis in RB VOLZZA 2 now, maybe you can matching also(not tested).

  Fixed some webui issues.

  Database entry/data structure changes:
    - dpc -> playCountToday (RB colette, compatible)
    - tdc -> dayCount (RB colette, compatible)

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

  Added feature of view old scores for limelight. You can view your highest score of RB1 and RB VOLZZA (and other versions to be supported in future) for each played charts.

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
    - justReflectCount -> justReflecCount (again, breaking change)
    - averagePrecisionTimes100 -> abilityPointTimes100 (compatible)

- v0.4.0-beta

  Added RB VOLZZA 2 support.

- v0.3.0-beta

  Added data import/export feature. You can import your Asphyxia save data now.

  Added more features into webui.

  Fixed a bug about no Great count in stage logs.

  Breaking changes:
  - Database entry changes
    - rb.rb6.playData.justCollection -> rb.rb6.playData.justCollection#userId
    - stageColorRandom -> stageRandom
    - charactorCardId -> characterCardId
    - justReflectCount -> justReflecCount
  - Changed name of some files, you can repair it by using TSLint.

- v0.2.1-alpha

  Fixed bug about Just Collection loading. All the Just Collection data saved by old version plugins can be loaded properly.

  Depleted the size of the webui file.

  Breaking changes:
  - Exported member changes
    - IRb6JustCollectionElement -> IRb6ReadJustCollection
    - Rb6JustCollectionElementMappingRecord -> Rb6ReadJustCollectionElementMap
  - Changed name of some files, you can repair it by using TSLint.

- v0.2.0-alpha

  Added webui support. Now you can view your play data and save settings on browser.

  Added features: quest progress saving, play history saving.

  Fixed some bugs.

  Breaking changes:
  - Database entry changes
    - fullComboOrExcellentParam -> param
    - charactorCards -> characterCards
  - Changed name of some files, you can repair it by using TSLint.

- v0.1.0-alpha

  Initial release.