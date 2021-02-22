import { readFile, writeFile } from "fs"
import { IRb6JustCollection, Rb6JustCollectionMap } from "../models/rb6/just_collection"
import { IRb6Player, Rb6PlayerWriteMap } from "../models/rb6/profile"
import { KRb6ShopInfo, KRb6ShopInfoOriginal } from "../models/rb6/shop_info"
import { Ea3Config, Ea3ConfigMap } from "./ea3_config"
import { BufferArray, getCollectionMappingElement, KITEM2, KObjectMappingRecord, mapBackKObject, mapKObject } from "./mapping"
import { ICollection } from "../models/utility/definitions"

export let test0 = () => {
    let j: { ea3: Ea3Config }
    readFile("utility/xmltest.json", { encoding: "ascii" }, (err, data) => {
        let k: KITEM2<{ ea3: Ea3Config }> = JSON.parse(<string>data)
        j = mapBackKObject(k, { ea3: Ea3ConfigMap })[0]
        let l = mapKObject(j.ea3, Ea3ConfigMap)
    })
}

export let test1 = () => {
    let r = JSON.stringify(KRb6ShopInfo)
    r += "\n\n"
    r += JSON.stringify(KRb6ShopInfoOriginal)
    IO.WriteFile("utility/koriginaltest.json", r)
}

export let test2 = async () => {
    let k: KITEM2<{ call: { player: IRb6Player } }>
    let p
    readFile("rb@asphyxia/xmltest2_k.json", { encoding: "utf8" }, (e, d) => {
        k = JSON.parse(d)
        p = mapBackKObject(k, { call: { player: Rb6PlayerWriteMap } })
        writeFile("rb@asphyxia/xmltest2.json", JSON.stringify(p, null, 4), () => { })
    })
}

export let test2_2 = async () => {
    if (!IO.Exists("./xmltest2_2.xml")) throw new Error("xmltest2 not exist")
    let x = await IO.ReadFile("./xmltest2_2.xml", "utf8")
    let j: KITEM2<{ list: IRb6JustCollection }> = U.parseXML(x, false)
    await IO.WriteFile("./xmltest2_2_k.json", JSON.stringify(j))
    let p = mapBackKObject(j, { list: Rb6JustCollectionMap })
    if ((p[0].list.blueData instanceof Buffer) || (p[0].list.redData instanceof Buffer)) await IO.WriteFile("./xmltest2_2.json", JSON.stringify(p))
    else await IO.WriteFile("./xmltest2_2.json", "?")
}

export interface IRb6JustCollectionElement2 extends ICollection<"rb.rb6.playData.justCollection"> {
    userId?: number
    musicId: number
    chartType: number
    blueData?: BufferArray
    redData?: BufferArray
}
export const Rb6JustCollectionElement2MappingRecord: KObjectMappingRecord<IRb6JustCollectionElement2> = {
    collection: getCollectionMappingElement<IRb6JustCollectionElement2>("rb.rb6.playData.justCollection"),
    userId: { $type: "s32", $targetKey: "user_id" },
    musicId: { $type: "s32", $targetKey: "music_id" },
    chartType: { $type: "s8", $targetKey: "note_grade" },
    blueData: { $type: "s8", $targetKey: "item_blue_data_bin" },
    redData: { $type: "s8", $targetKey: "item_red_data_bin" }
}
export let test2_3 = async () => {
    if (!IO.Exists("./xmltest2_3.xml")) throw new Error("xmltest2 not exist")
    let x = await IO.ReadFile("./xmltest2_3.xml", "utf8")
    let j: KITEM2<{ list: IRb6JustCollection }> = U.parseXML(x, false)
    await IO.WriteFile("./xmltest2_3_k.json", JSON.stringify(j))
    let p = mapBackKObject(j, { list: Rb6JustCollectionMap })
    await IO.WriteFile("./xmltest2_2.json", JSON.stringify(p))
}

export let test3 = async () => {
    let b = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
    let k = K.ITEM("bin", b)
    let a = K.ARRAY("s8", b)
    await IO.WriteFile("./xmltest3.json", JSON.stringify([k, a]))
}