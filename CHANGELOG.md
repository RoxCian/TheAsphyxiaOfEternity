- v0.5.1-beta

  Fixed a webui issue.

  Fixed a bug about save mylist on webui. If you have the issue, modifying mylist through the webui should resolve it. (Thanks to @Xiao_ku)

- v0.5.0-beta

  Added webui for RB VOLZZA 2. You can view your VOLZZA play data on browser.

  Fixed a bug about no Great count in VOLZZA stage logs (again).

  Database entry changes
    - justReflectCount -> justReflecCount (again, breaking change)
    - averagePrecisionTimes100 -> abilityPointTimes100

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