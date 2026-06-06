import { Rb3VerdetDesKriegesContent, Rb3VerdetDesKriegesContentOriginal, Rb3VerdetDesKriegesNote } from "../../models/rb3/types"
import { loadCsvAsync } from "../../utils/csv"

export const rb3VerdetDesKriegesContents = loadCsvAsync<Rb3VerdetDesKriegesContentOriginal>("rb3_verdet_des_krieges_content").then(d => d.map(el => {
    const result = {
        chapter: el.chapter,
        page: el.page,
    } as Rb3VerdetDesKriegesContent
    const phraseParts = el.phrase.split("$")
    const phraseOrigParts = el.phraseOrig.split("$")
    if (phraseParts.length <= 1) {
        try {
            result.phrase = JSON.parse(el.phrase)
        } catch {
            result.phrase = el.phrase
        }
    } else {
        result.phrase = []
        for (const ph of phraseParts) {
            try {
                result.phrase.push(JSON.parse(ph))
            } catch {
                result.phrase.push(ph)
            }
        }
    }
    if (phraseOrigParts.length <= 1) {
        try {
            result.phraseOrig = JSON.parse(el.phraseOrig)
        } catch {
            result.phraseOrig = el.phraseOrig
        }
    } else {
        result.phraseOrig = []
        for (const ph of phraseOrigParts) {
            try {
                result.phraseOrig.push(JSON.parse(ph))
            } catch {
                result.phraseOrig.push(ph)
            }
        }
    }
    return result
}))
export const rb3VerdetDesKriegesNotes = loadCsvAsync<Rb3VerdetDesKriegesNote>("rb3_verdet_des_krieges_notes")

export async function getVerdetDesKriegesPage(chapter: number, page: number): Promise<Rb3VerdetDesKriegesContent[]> {
    return (await rb3VerdetDesKriegesContents).filter(c => c.chapter === chapter && c.page === page)
}
export async function getVerdetDesKriegesPageCount(chapter: number): Promise<number> {
    return (await rb3VerdetDesKriegesContents).filter(c => c.chapter === chapter).reduce((prev, next) => next.page > prev ? next.page : prev, 0) + 1
}