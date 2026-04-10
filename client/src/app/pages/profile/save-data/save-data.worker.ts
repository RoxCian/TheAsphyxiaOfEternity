/// <reference lib="webworker" />

import { RbRequest } from "rbweb"
import { rbEmitJSON } from "../../../utils/rb-functions"
import { ImportAsphyxiaData } from "./save-data.type"

addEventListener("message", (ev: MessageEvent<ImportAsphyxiaData>) => uploadAsphyxiaData(ev.data))

const retry = 5
const maxChunkSize = 20 * 1024 * 1024

export async function uploadAsphyxiaData(data: ImportAsphyxiaData) {
    let result: string | undefined = undefined
    try {
        const uploadRequest: RbRequest & { file: "profile" | "scores", chunk: string } = {
            rid: data.rid,
            file: "profile",
            chunk: ""
        }
        if (data.profileProgress < data.profileFile.byteLength) {
            let chunkBin = new Uint8Array(data.profileFile)
            let chunkASCII = ""
            for (let i = data.profileProgress; i < chunkBin.length; i++) chunkASCII += String.fromCharCode(chunkBin[i])
            uploadRequest.chunk = btoa(chunkASCII)
            for (let i = 0; i < retry; i++) {
                try {
                    await rbEmitJSON("rb6UploadAsphyxia", uploadRequest)
                    result = undefined
                    break
                } catch (ex) {
                    if (ex instanceof Error) result = ex.message
                }
            }
            if (result != undefined) {
                postMessage(result)
                return
            }
        }
        if (data.scoresProgress < data.scoresFile.byteLength) {
            uploadRequest.file = "scores"
            let chunkBin = new Uint8Array(data.scoresFile)
            let chunkASCII = ""
            for (let i = data.profileProgress; i < chunkBin.length; i += maxChunkSize) {
                for (let j = i; j < Math.min(i + maxChunkSize, data.scoresFile.byteLength); j++) chunkASCII += String.fromCharCode(chunkBin[j])
                uploadRequest.chunk = btoa(chunkASCII)
                for (let j = 0; j < retry; j++) {
                    try {
                        await rbEmitJSON("rb6UploadAsphyxia", uploadRequest)
                        result = undefined
                        break
                    } catch (ex) {
                        if (ex instanceof Error) result = ex.message
                    }
                }
                if (result != undefined) {
                    postMessage(result)
                    return
                }
            }
        }
        for (let i = 0; i < retry; i++) {
            try {
                await rbEmitJSON("rb6ImportAsphyxia", { rid: data.rid })
                result = undefined
                break
            } catch (ex) {
                if (ex instanceof Error) result = ex.message
            }
        }
        postMessage(result)
    } catch (ex) {
        if (ex instanceof Error) postMessage(ex.message)
    }
}