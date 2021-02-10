import { appendMappingElement, KObjectMappingRecord } from "./mapping"

export type Ea3Config = {
    meta: "ea3config"
    timezone: number
    id: EaId
    soft: EaSoftwareVersion
    encoding: string
    format: string
    network: EaNetworkConfig
    eacoin: EaCoinConfig
    pos: EaPaymentConfig
    facility: EaFacility
    pkglist: EaPackageList
    share: EaShareConfig
    proxy: EaProxy
    option: EaOption
    service: EaService
}


export type EaId = {
    pcbid: string
    hardid: string
}

export let EaIdMap: KObjectMappingRecord<EaId> = {
    pcbid: { $type: "str" },
    hardid: { $type: "str" }
}

export type EaSoftwareVersion = {
    model: string
    dest: string
    spec: string
    rev: string
    ext: string
}

export let EaSoftwareVersionMap: KObjectMappingRecord<EaSoftwareVersion> = {
    model: { $type: "str" },
    dest: { $type: "str" },
    spec: { $type: "str" },
    rev: { $type: "str" },
    ext: { $type: "str" }
}

export type EaNetworkConfig = {
    timeout: number
    szXrpcBuf: number
    ssl: boolean
    services: string
    urlSlash: boolean
}

export let EaNetworkConfigMap: KObjectMappingRecord<EaNetworkConfig> = {
    timeout: { $type: "u32" },
    szXrpcBuf: { $type: "u32", $targetKey: "sz_xrpc_buf" },
    ssl: { $type: "bool" },
    services: { $type: "str" },
    urlSlash: { $type: "bool", $targetKey: "url_slash" }
}

export type EaCoinConfig = {
    enable: boolean
    controlRef: string
    nrVslot: number
    szOptBuf: number
}

export let EaCoinConfigMap: KObjectMappingRecord<EaCoinConfig> = {
    enable: { $type: "bool" },
    controlRef: { $type: "str", $targetKey: "control_ref" },
    nrVslot: { $type: "u32", $targetKey: "nr_vslot" },
    szOptBuf: { $type: "u32", $targetKey: "sz_opt_buf" }
}

export type EaPaymentConfig = {
    nrCoinslot: number
    nrArticle: number
    nrPayment: number
    incomeDelay: number
    incomeMaxDelay: number
    szOptBuf: number
    coin: EaIIDXCoinConfig
    eacoin: EaIIDXEacoinConfig
}

export type EaIIDXCoinConfig = {
    freeplayRef: string
    sp1pStart: EaIIDXCoinConfigElement
    sp2pStart: EaIIDXCoinConfigElement
    dp1Start: EaIIDXCoinConfigElement
    dp2Start: EaIIDXCoinConfigElement
    service: EaIIDXCoinConfigElement
    slot1: EaIIDXCoinConfigElement
    read: EaIIDXCoinConfigElement
    write: EaIIDXCoinConfigElement
    end: EaIIDXCoinConfigElement
    eacoinStart: EaIIDXCoinConfigElement
    hddSp: EaIIDXCoinConfigElement
    hdd2pp: EaIIDXCoinConfigElement
    hddDp1: EaIIDXCoinConfigElement
    hddDp2: EaIIDXCoinConfigElement
    ppEventCPlay: EaIIDXCoinConfigElement
    ppEventPPlay: EaIIDXCoinConfigElement
    ppEventPPlay2: EaIIDXCoinConfigElement
    ppEventPVipGold: EaIIDXCoinConfigElement
    ppEventPVipPlatinum: EaIIDXCoinConfigElement
    ppEventPPremiumFree: EaIIDXCoinConfigElement
    ppEventACPlay: EaIIDXCoinConfigElement
    ppEventAPPlay: EaIIDXCoinConfigElement
    ppEventKCPlay: EaIIDXCoinConfigElement
    ppEventKCPlay2: EaIIDXCoinConfigElement
    ppEventKCPlay3: EaIIDXCoinConfigElement
    ppEventYCPlay: EaIIDXCoinConfigElement
}

export type EaIIDXEacoinConfig = {
    spStart1p200: EaIIDXCoinConfigElement
    spStart2p200: EaIIDXCoinConfigElement
    dpStart1p1Credit200: EaIIDXCoinConfigElement
    dpStart2p1Credit200: EaIIDXCoinConfigElement
    dpStart1p2Credit200: EaIIDXCoinConfigElement
    dpStart2p2Credit200: EaIIDXCoinConfigElement
    spStart1p: EaIIDXCoinConfigElement
    spStart2p: EaIIDXCoinConfigElement
    dpStart1p1Credit: EaIIDXCoinConfigElement
    dpStart2p1Credit: EaIIDXCoinConfigElement
    dpStart1p2Credit: EaIIDXCoinConfigElement
    dpStart2p2Credit: EaIIDXCoinConfigElement
    premiumFree1p1: EaIIDXCoinConfigElement
    premiumFree1p2: EaIIDXCoinConfigElement
    premiumFree1p3: EaIIDXCoinConfigElement
    premiumFree2p1: EaIIDXCoinConfigElement
    premiumFree2p2: EaIIDXCoinConfigElement
    premiumFree2p3: EaIIDXCoinConfigElement
    vipPassGold1p: EaIIDXCoinConfigElement
    vipPassGold2p: EaIIDXCoinConfigElement
    vipPassPlatinum1p: EaIIDXCoinConfigElement
    vipPassPlatinum2p: EaIIDXCoinConfigElement
}

export type EaIIDXCoinConfigElement = {
    type: string
    article: number
    ssl: boolean
    event: string
    coinEvent?: string
    playerRef?: string
    creditRef?: string
    coinCreditRef?: string
    priceRef?: string
}

export let EaIIDXCoinConfigElementMap: KObjectMappingRecord<EaIIDXCoinConfigElement> = {
    type: { $type: "str" },
    article: { $type: "u8" },
    ssl: { $type: "bool" },
    event: { $type: "str" },
    coinEvent: { $type: "str", $targetKey: "coin_event" },
    playerRef: { $type: "str", $targetKey: "player_ref" },
    creditRef: { $type: "str", $targetKey: "credit_ref" },
    coinCreditRef: { $type: "str", $targetKey: "coin_credit_ref" },
    priceRef: { $type: "str", $targetKey: "price_ref" }
}

export let EaIIDXCoinConfigMap: KObjectMappingRecord<EaIIDXCoinConfig> = {
    freeplayRef: { $type: "str", $targetKey: "freeplay_ref" },
    sp1pStart: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_1p_start" }),
    sp2pStart: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_2p_start" }),
    dp1Start: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_1p_start" }),
    dp2Start: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_2p_start" }),
    service: EaIIDXCoinConfigElementMap,
    slot1: EaIIDXCoinConfigElementMap,
    read: EaIIDXCoinConfigElementMap,
    write: EaIIDXCoinConfigElementMap,
    end: EaIIDXCoinConfigElementMap,
    eacoinStart: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "eacoin_start" }),
    hddSp: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "hdd_sp" }),
    hdd2pp: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "hdd_2pp" }),
    hddDp1: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "hdd_dp1" }),
    hddDp2: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "hdd_dp2" }),
    ppEventCPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_c_play" }),
    ppEventPPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_p_play" }),
    ppEventPPlay2: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_p_play2" }),
    ppEventPVipGold: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_p_vip_gold" }),
    ppEventPVipPlatinum: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_p_vip_platinum" }),
    ppEventPPremiumFree: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_p_premium_free" }),
    ppEventACPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_a_c_play" }),
    ppEventAPPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_a_p_play" }),
    ppEventKCPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_k_c_play" }),
    ppEventKCPlay2: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_k_c_play2" }),
    ppEventKCPlay3: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_k_c_play3" }),
    ppEventYCPlay: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "pp_event_y_c_play" }),
}

export let EaIIDXEacoinConfigMap: KObjectMappingRecord<EaIIDXEacoinConfig> = {
    spStart1p200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_1p_200" }),
    spStart2p200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_2p_200" }),
    dpStart1p1Credit200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_1p_1credit_200" }),
    dpStart2p1Credit200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_2p_1credit_200" }),
    dpStart1p2Credit200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_1p_2credit_200" }),
    dpStart2p2Credit200: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_2p_2credit_200" }),
    spStart1p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_1p" }),
    spStart2p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "sp_start_2p" }),
    dpStart1p1Credit: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_start_1p_1credit" }),
    dpStart2p1Credit: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_start_2p_1credit" }),
    dpStart1p2Credit: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_start_1p_2credit" }),
    dpStart2p2Credit: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "dp_start_2p_2credit" }),
    premiumFree1p1: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_1p_1" }),
    premiumFree1p2: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_1p_2" }),
    premiumFree1p3: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_1p_3" }),
    premiumFree2p1: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_2p_1" }),
    premiumFree2p2: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_2p_2" }),
    premiumFree2p3: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "premium_free_2p_3" }),
    vipPassGold1p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "vippass_gold_1p" }),
    vipPassGold2p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "vippass_gold_2p" }),
    vipPassPlatinum1p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "vippass_platinum_1p" }),
    vipPassPlatinum2p: appendMappingElement(EaIIDXCoinConfigElementMap, { $targetKey: "vippass_platinum_2p" })
}

export let EaPaymentConfigMap: KObjectMappingRecord<EaPaymentConfig> = {
    nrCoinslot: { $type: "u32", $targetKey: "nr_coinslot" },
    nrArticle: { $type: "u32", $targetKey: "nr_article" },
    nrPayment: { $type: "u32", $targetKey: "nr_payment" },
    incomeDelay: { $type: "u32", $targetKey: "income_delay" },
    incomeMaxDelay: { $type: "u32", $targetKey: "income_maxdelay" },
    szOptBuf: { $type: "u32", $targetKey: "sz_opt_buf" },
    coin: EaIIDXCoinConfigMap,
    eacoin: EaIIDXEacoinConfigMap
}

export type EaFacility = {
    szPropBuf: number
}

export let EaFacilityMap: KObjectMappingRecord<EaFacility> = {
    szPropBuf: { $type: "u32", $targetKey: "sz_prop_buf" }
}
export type EaPackageList = {
    period: bigint
}

export let EaPackageListMap: KObjectMappingRecord<EaPackageList> = {
    period: { $type: "u64" }
}

export type EaShareConfig = {
    configFile: string
}

export let EaShareConfigMap: KObjectMappingRecord<EaShareConfig> = {
    configFile: { $type: "str", $targetKey: "config_file" }
}

export type EaProxy = {
    cache: {
        maxSize: bigint
    }
}

export let EaProxyMap: KObjectMappingRecord<EaProxy> = {
    cache: {
        maxSize: { $type: "u64", $targetKey: "max_size" }
    }
}

export type EaOption = {
    service: number
    posevent: number
    pcbevent: number
    apsmanager: number
    antiresale: number
    autofactory: number
    bookkeeping: number
}

export let EaOptionMap: KObjectMappingRecord<EaOption> = {
    service: { $type: "u8" },
    posevent: { $type: "u8" },
    pcbevent: { $type: "u8" },
    apsmanager: { $type: "u8" },
    antiresale: { $type: "u8" },
    autofactory: { $type: "u8" },
    bookkeeping: { $type: "u8" }
}

export type EaService = {
    cardmng: number
    package: number
    userdata: number
    userid: number
}

export let EaServiceMap: KObjectMappingRecord<EaService> = {
    cardmng: { $type: "u8" },
    package: { $type: "u8" },
    userdata: { $type: "u8" },
    userid: { $type: "u8" }
}

export let Ea3ConfigMap: KObjectMappingRecord<Ea3Config> = {
    meta: { $type: "kignore", $fallbackValue: "ea3config" },
    timezone: { $type: "s32" },
    id: EaIdMap,
    soft: EaSoftwareVersionMap,
    encoding: { $type: "str" },
    format: { $type: "str" },
    network: EaNetworkConfigMap,
    eacoin: EaCoinConfigMap,
    pos: EaPaymentConfigMap,
    facility: EaFacilityMap,
    pkglist: EaPackageListMap,
    share: EaShareConfigMap,
    proxy: EaProxyMap,
    option: EaOptionMap,
    service: EaServiceMap
}