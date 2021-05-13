let versionSelect
let switchCheck
let optionsBox
let options
let dupBox

function initializeVariables() {
    versionSelect = document.querySelector(".version-select")
    switchCheck = versionSelect.querySelector("input.switch")
    optionsBox = versionSelect.querySelector(".options")
    options = optionsBox.querySelectorAll(".option")
    dupBox = versionSelect.querySelector(".select-button .option-dup-box")
}

function initializeOptions() {
    for (let o of options) {
        let dup = o.cloneNode(true)
        dupBox.appendChild(dup)
        getRefreshSwitchOption(dup)
    }
    document.addEventListener("click", (e) => (e.target != switchCheck) ? switchCheck.checked = false : null)
    versionSelect.classList.add("finished")
}

function getRefreshSwitchOption(option) {
    return () => {
        let oldOption = dupBox.querySelectorAll(".option.is-active")
        oldOption.forEach((o) => o.classList.remove("is-active"))
        option.classList.add("is-active")
        let content = option.querySelector(".option-content")
        if (content.classList.contains("disabled")) versionSelect.classList.add("disabled")
        else versionSelect.classList.remove("disabled")
    }
}

function switchVersion(refid, version) {
    window.history.replaceState(null, null, `?refid=${refid}&version=${version}`)
    versionSelect.setAttribute("version", version)
    getRefreshSwitchOption(dupBox.querySelector(`.option[value="${version}"]`))()
}

$(document).ready(() => {
    initializeVariables()
    initializeOptions()
})

