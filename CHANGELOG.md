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