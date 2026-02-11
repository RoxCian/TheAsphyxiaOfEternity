import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import "node:process"
import * as rl from "node:readline"
import { execSync as run, spawn } from "node:child_process"
import { relative, resolve } from "node:path"

const log = console.log
const cd = process.chdir
const envPath = "./dev/config/env.conf.json"

const isWindows = process.platform === "win32"

let debugging = true
let serverHasError = false

log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
log("🔵 Starting debug session.")

log("🔵 Loading environment configurations.")
const envConfig = existsSync(envPath) ? JSON.parse(readFileSync(envPath)) : undefined
if (!envConfig) {
    log("😟 Cannot find the configuration file. Maybe run restore once again.")
    process.exit(1)
}
const asphyxiaRegex =
    isWindows ?
        process.arch === "x64" ? /^asphyxia-core(-(win-)?x64)?.exe$/ : /^asphyxia-core(-(win-)?x86)?.exe$/ :
    process.arch === "arm" ? /^asphyxia-core-armv7$/ :
    process.arch === "arm64" ? /^asphyxia-core-arm64$/ :
    /^asphyxia-core$/
const asphyxia = readdirSync(envConfig.asphyxiaDirectory, { withFileTypes: true }).find(f => f.name.match(asphyxiaRegex))
if (!asphyxia) {
    log("😟 Cannot find the Asphyxia CORE program.")
    process.exit(1)
}
let serverProcess = undefined
const serverPromise = debugServerDaemon()
log(`🔵 Starting webui debugger.`)
cd("./client")
const webuiProcess = spawn("ng serve", {
    stdio: "pipe",
    shell: true,
    windowsHide: false,
})
cd("..")
webuiProcess.stdout.pipe(process.stdout)
webuiProcess.stderr.pipe(process.stderr)
let debugResolver
const debugPromise = new Promise(res => debugResolver = res)
webuiProcess.on("close", debugResolver)
webuiProcess.on("exit", debugResolver)
webuiProcess.on("error", debugResolver)
if (isWindows) rl.createInterface({ input: process.stdin, output: process.stdoutn }).on("SIGINT", () => process.emit("SIGINT"))
process.on("SIGINT", () => {
    close()
    process.exit()
})
process.on("exit", () => close())
await debugPromise
await serverPromise

function close() {
    if (!debugging) return
    debugging = false
    if (isWindows) {
        if (serverProcess) spawn("taskkill", ["/f", "/t", "/pid", serverProcess.pid], { detached: true })
    } else {
        if (serverProcess) process.kill(serverProcess.pid)
    }
    log("🔵 Debug aborted.")
}
async function debugServerDaemon() {
    const serverDaemonCycle = async () => {
        let errorCounter = 0
        while (debugging && !serverHasError) {
            csvRemoveBom()
            cloneServer()
            log(`🔵 Starting Asphyxia CORE.`)
            let cycleResolver
            const processPromise = new Promise(res => cycleResolver = res)
            serverProcess = spawn(`${resolve(envConfig.asphyxiaDirectory, asphyxia.name)} --dev`, {
                cwd: envConfig.asphyxiaDirectory,
                shell: true,
                detached: true,
                windowsHide: false,
            })
            serverProcess.on("close", cycleResolver)
            serverProcess.on("exit", cycleResolver)
            serverProcess.on("error", (err) => {
                errorCounter++
                if (errorCounter >= 5) {
                    serverHasError = true
                    log(`🔵 Asphyxia CORE crushed (${err})`)
                }
                cycleResolver()
            })
            await processPromise
        }
        if (serverHasError) process.exit()
    }
    return serverDaemonCycle()
}
function cloneServer() {
    const files = readdirSync("./server", { withFileTypes: true, recursive: true })
    const targetPluginDir = resolve(envConfig.asphyxiaDirectory, `plugins/${envConfig.pluginNameDev}`)
    const filesInTargetDir = readdirSync(targetPluginDir, { withFileTypes: true, recursive: true })
    for (const file of files) {
        if (file.isDirectory()) continue
        const relativeFileName = `${relative("./server", file.parentPath)}/${file.name}`
        const getTargetRelativeFileName = f => `${relative(targetPluginDir, f.parentPath)}/${f.name}`
        const existedFile = filesInTargetDir.find(f => isWindows ? (relativeFileName.toLowerCase() === getTargetRelativeFileName(f).toLowerCase()) : (relativeFileName === getTargetRelativeFileName(f)))
        const parentDirInTargetDir = `${targetPluginDir}/${relative("./server", file.parentPath)}`
        let shouldClone = false
        if (!existedFile) shouldClone = true
        else {
            const stat = statSync(`${file.parentPath}/${file.name}`)
            const statTargetFile = statSync(`${parentDirInTargetDir}/${existedFile.name}`)
            shouldClone = stat.mtimeMs !== statTargetFile.mtimeMs || stat.size !== statTargetFile.size
        }
        if (!shouldClone) continue
        if (!existsSync(parentDirInTargetDir)) mkdirSync(parentDirInTargetDir, { recursive: true })
        copyFileSync(`./${file.parentPath}/${file.name}`, `${parentDirInTargetDir}/${file.name}`)
    }
}
function csvRemoveBom() {
    const files = readdirSync("./server/data/contents", { withFileTypes: true })
    for (const file of files) {
        if (!file.name.endsWith(".csv")) continue
        const data = readFileSync(`${file.parentPath}/${file.name}`)
        if (data.subarray(0, 3).toString("latin1") === "ï»¿") writeFileSync(`${file.parentPath}/${file.name}`, data.subarray(3))
    }
}