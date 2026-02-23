import { copyFileSync, existsSync, statSync, lstatSync, mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import "node:process"
import { execSync as run, spawn } from "node:child_process"
import { relative } from "node:path"
import { argv0 } from "node:process"

const log = console.log
const cd = process.chdir

const isWindows = process.platform === "win32"

log("🔵 悠久のアスフィクシア -The Asphyxia of Eternity-")
log("🔵 Project building...")

log("🔵 Loading environment configurations.")
const pluginNameProd = "rb" // please do not change this
log("🔵 Fixing csv files.")
csvRemoveBom()
log("🔵 Building client.")
cd("./client")
const buildProcess = spawn("ng b -c production --output-hashing=none", {
    stdio: "pipe",
    shell: true,
    windowsHide: false,
})
cd("..")
buildProcess.stdout.pipe(process.stdout)
buildProcess.stderr.pipe(process.stderr)
let buildResolver
const buildPromise = new Promise(res => buildResolver = res)
buildProcess.on("close", buildResolver)
buildProcess.on("exit", buildResolver)
buildProcess.on("error", buildResolver)
try {
    await buildPromise
} catch (ex) {
    log("😟 Failed to build client.")
    process.exit(1)
}
log("🔵 Cloning files to ./dist")
cloneServer()
cloneClient()
log("🔵 Working on README.md")
const readme = readFileSync("./README.md", { encoding: "utf8" })
const icon = readFileSync("./icon.svg")
const modifiedReadme = readme.replace(/(?<=<img src=")[^"]+/, `data:image/svg+xml;base64,${icon.toString("base64")}`)
writeFileSync(`./dist/${pluginNameProd}/README.md`, modifiedReadme, { encoding: "utf8" })
log("🔵 Packing")
const version = readFileSync("./dev/version", { encoding: "utf8" }).replaceAll(/[\r\n]/g, "")
const distPack = `the-asphyxia-of-eternity-${version}.zip`
cd("./dist")
run(`tar -c -f ./${distPack} ./${pluginNameProd}`)
cd("..")
log("🔵 -> ./dist/" + distPack)
log("🔵 Completed.")
if (argv0.toLowerCase() === "-ghci") {
    run(`echo "dist_file_name=${distPack}" >> "$GITHUB_OUTPUT"`)
    run(`echo "version=${version}" >> "$GITHUB_OUTPUT"`)
}

function cloneServer() {
    cloneDir("./server", `./dist/${pluginNameProd}`)
}
function cloneClient() {
    const distDir = `./dist/${pluginNameProd}/webui`
    // clean chunk files
    if (!existsSync(distDir)) mkdirSync(distDir, { recursive: true })
    const distFiles = readdirSync(distDir, { withFileTypes: true, recursive: true })
    for (const file of distFiles) {
        if (file.name.match(/.+\.js/)) unlinkSync(`${file.parentPath}/${file.name}`)
    }
    // clone builded client directory
    cloneDir("./client/dist/webuiv2/browser", distDir, [/.html?$/, /asphyxia-styles.css$/, /media\//, /^dev-/])
    // copy pug file
    copyFileSync(`./client/pug/template.pug`, `${distDir}/profile_detail.pug`) // underscore please
    copyFileSync(`./client/pug/template.pug`, `${distDir}/ingame_comment.pug`)
}
function cloneDir(fromDir, toDir, excludes) {
    if (!existsSync(toDir) || !lstatSync(toDir).isDirectory()) mkdirSync(toDir, { recursive: true })
    const files = readdirSync(fromDir, { withFileTypes: true, recursive: true })
    const filesInToDir = readdirSync(toDir, { withFileTypes: true, recursive: true })
    for (const file of files) {
        if (file.isDirectory()) continue
        if (excludes && excludes.some(p => `${file.parentPath}/${file.name}`.match(p))) continue
        const relativeFileName = `${relative(fromDir, file.parentPath)}/${file.name}`
        const getToRelativeFileName = f => `${relative(toDir, f.parentPath)}/${f.name}`
        const existedFile = filesInToDir.find(f => isWindows ? (relativeFileName.toLowerCase() === getToRelativeFileName(f).toLowerCase()) : (relativeFileName === getToRelativeFileName(f)))
        const parentDirOfToDir = `${toDir}/${relative(fromDir, file.parentPath)}`
        let shouldClone = false
        if (!existedFile) shouldClone = true
        else {
            const stat = statSync(`${file.parentPath}/${file.name}`)
            const statTargetFile = statSync(`${parentDirOfToDir}/${existedFile.name}`)
            shouldClone = stat.mtimeMs !== statTargetFile.mtimeMs || stat.size !== statTargetFile.size
        }
        if (!shouldClone) continue
        if (!existsSync(parentDirOfToDir)) mkdirSync(parentDirOfToDir, { recursive: true })
        copyFileSync(`${file.parentPath}/${file.name}`, `${parentDirOfToDir}/${file.name}`)
    }
    for (const file of filesInToDir) {
        if (file.isDirectory()) continue
        if (excludes && excludes.some(p => `${file.parentPath}/${file.name}`.match(p))) {
            unlinkSync(`${file.parentPath}/${file.name}`)
            continue
        }
        const relativeFileName = `${relative(toDir, file.parentPath)}/${file.name}`
        const getFromRelativeFileName = f => `${relative(fromDir, f.parentPath)}/${f.name}`
        const existedFile = files.find(f => isWindows ? (relativeFileName.toLowerCase() === getFromRelativeFileName(f).toLowerCase()) : (relativeFileName === getFromRelativeFileName(f)))
        if (!existedFile) unlinkSync(`${file.parentPath}/${file.name}`)
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