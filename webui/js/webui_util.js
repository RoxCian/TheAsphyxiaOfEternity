

let getTabs = () => document.querySelectorAll("#tabs li")
let getTabContents = () => document.querySelectorAll("#tab-content #tab-content-body")
function initializeTabs() {
    getTabs().forEach((t) => {
        t.addEventListener("click", (e) => {
            if (t.classList.contains("disabled")) return
            let group = t.getAttribute("tab-group")
            let index = t.getAttribute("tab-index")
            updateActiveTab(group, t)
            updateActiveContent(group, index)
        })
    })
}
function updateActiveTab(tabGroup, tab) {
    getTabs().forEach((t) => {
        if (t && t.classList.contains("is-active") && (t.getAttribute("tab-group") == tabGroup)) t.classList.remove("is-active")
    })
    tab.classList.add("is-active")
}

function updateActiveContent(tabGroup, tabIndex) {
    getTabContents().forEach((item) => {
        let group = item.getAttribute("tab-group")
        let index = item.getAttribute("tab-index")
        if (item && item.classList.contains("is-active") && (group == tabGroup)) item.classList.remove("is-active")
        if ((index == tabIndex) && (group == tabGroup)) item.classList.add("is-active")
    })
}

function initializeToggles() {
    let headers = document.querySelectorAll(".card-header .card-toggle")
    let contents = document.querySelectorAll(".card-content")

    for (let h of headers) {
        let card = h.getAttribute("card")
        if (card == null) continue
        let cc = []
        for (let c of contents) if (c.getAttribute("card") == card) cc.push(c)
        h.addEventListener("click", (e) => {
            if (e.currentTarget.style.transform == "rotate(180deg)") {
                e.currentTarget.style.transform = ""
                for (let c of cc) c.classList.remove("is-hidden")
            } else {
                e.currentTarget.style.transform = "rotate(180deg)"
                for (let c of cc) c.classList.add("is-hidden")
            }
        })
    }
}

function initializeModals() {
    let modaltriggers = $(".modal-trigger")
    for (let t of modaltriggers) {
        let m = t.querySelector(".modal")
        let c = m.querySelectorAll("#close")
        t.addEventListener("click", (e) => { m.style.display = "flex" })
        for (let v of c) v.addEventListener("click", (e) => {
            m.style.display = "none"
            e.stopPropagation()
        })
    }
}

function initializeFormSelects() {
    let formSelects = document.querySelectorAll("#form-select")
    for (let s of formSelects) {
        let input = s.querySelector("input#form-select-input")
        let select = s.querySelector("select#form-select-select")
        let options = select.querySelectorAll("option")
        for (let i = 0; i < options.length; i++) {
            let o = options[i]
            let value = (o.getAttribute("value") == null) ? i : o.getAttribute("value")
            if (value == input.value) {
                select.selectedIndex = i
                break
            }
        }
        select.addEventListener("change", () => {
            for (let i = 0; i < options.length; i++) {
                let o = options[i]
                if (o.selected) {
                    input.value = (o.getAttribute("value") == null) ? i : o.getAttribute("value")
                    input.dispatchEvent(new Event("change"))
                    break
                }
            }
        })
    }
}

function initializeFormPaginations() {
    let formPags = document.querySelectorAll("#form-pagination")
    for (let p of formPags) {
        let input = p.querySelector("input#form-pagination-input")
        let options = p.querySelectorAll("ul.pagination-list li a.pagination-link")
        for (let i = 0; i < options.length; i++) {
            let o = options[i]
            let value = (o.getAttribute("value") == null) ? i : o.getAttribute("value")
            if (value == input.value) {
                if (!o.classList.contains("is-current")) o.classList.add("is-current")
            } else o.classList.remove("is-current")
            o.addEventListener("click", () => {
                for (let i = 0; i < options.length; i++) options[i].classList.remove("is-current")
                if (!o.classList.contains("is-current")) o.classList.add("is-current")
                input.value = (o.getAttribute("value") == null) ? i : o.getAttribute("value")
            })
        }
    }
}

function initializeFormValidation() {
    let forms = document.querySelectorAll("form#validatable")
    for (let f of forms) {
        let validatableFields = f.querySelectorAll(".field#validatable")
        let validatableButtons = f.querySelectorAll("button#validatable")

        let getParams = (input) => {
            return {
                minLength: input.getAttribute("min-length"),
                maxLength: input.getAttribute("max-length"),
                recommendedLength: input.getAttribute("recommended-length"),
                minPattern: input.getAttribute("min-pattern"),
                recommendedPattern: input.getAttribute("recommended-pattern"),
                isNumeric: (input.getAttribute("numeric") != null) ? true : false
            }
        }
        let isValid = (value, params) => {
            let t = value.trim()
            if (params.minLength != null) if (t.length < parseInt(params.minLength)) return false
            if (params.maxLength != null) if (t.length > parseInt(params.maxLength)) return false
            if (params.minPattern != null) if (!(new RegExp(params.minPattern).test(t))) return false
            if (params.isNumeric == true) if (parseInt(t).toString() != t) return false
            return true
        }

        let isFormValid = () => {
            for (let field of validatableFields) for (let i of field.querySelectorAll("input#validatable")) if (!isValid(i.value, getParams(i))) return false
            return true
        }

        for (let field of validatableFields) {
            let inputs = field.querySelectorAll("input#validatable")
            let tips = field.querySelectorAll(".help")
            for (let i of inputs) i.addEventListener("change", () => {
                let params = getParams(i)
                // inputs
                if (isValid(i.value, params)) {
                    i.classList.remove("is-danger")
                    for (let t of tips) t.classList.remove("is-danger")
                } else if (!i.classList.contains("is-danger")) {
                    i.classList.add("is-danger")
                    for (let t of tips) t.classList.add("is-danger")
                }
                // buttons
                if (isFormValid()) {
                    for (let b of validatableButtons) b.removeAttribute("disabled")
                } else {
                    for (let b of validatableButtons) if (b.getAttribute("disabled") == null) b.setAttribute("disabled", "")
                }
            })
        }
    }
}

function initializeFormCollections() {
    let collections = document.querySelectorAll("#form-collection")
    for (let c of collections) {
        let maxLength = parseInt(c.getAttribute("max-length"))
        let fallbackValue = JSON.parse(c.getAttribute("fallback"))
        let input = c.querySelector("#form-collection-input")
        let tags = c.querySelectorAll("#form-collection-tag")
        let modButton = c.querySelector("#form-collection-modify")
        let modTable = c.querySelector("table#multi-select")
        let modInput = modTable.querySelector("input#multi-select-input")
        let modTitle = modTable.querySelector("input#multi-select-title")
        let deleteButtonClickEventListener = (e) => {
            let t = e.target.parentElement
            let tvalue = JSON.parse(t.getAttribute("value"))
            let value = JSON.parse(input.value)
            value.splice(value.indexOf(tvalue), 1)
            if (fallbackValue != null) value.push(fallbackValue)
            input.value = JSON.stringify(value)
            modInput.value = input.value
            modInput.dispatchEvent(new Event("change"))
            t.remove()
            modButton.removeAttribute("disabled")
        }
        for (let t of tags) {
            let d = t.querySelector(".delete")
            d.addEventListener("click", deleteButtonClickEventListener)
        }
        modInput.value = input.value
        modInput.setAttribute("max-length", maxLength)
        modInput.setAttribute("fallback", JSON.stringify(fallbackValue))
        modInput.addEventListener("change", () => {
            let fallbackValue = JSON.parse(c.getAttribute("fallback"))
            let oldValue = JSON.parse(input.value)
            let newValue = JSON.parse(modInput.value)
            let tags = c.querySelectorAll("#form-collection-tag")
            for (let o of oldValue) if (!newValue.includes(o) && (o != fallbackValue)) {
                for (let t of tags) if (JSON.parse(t.getAttribute("value")) == o) t.remove()
            }
            for (let n = 0; n < newValue.length; n++) if (!oldValue.includes(newValue[n]) && (newValue[n] != fallbackValue)) {
                let tag = document.createElement("span")
                tag.classList.add("tag")
                tag.id = "form-collection-tag"
                tag.setAttribute("value", newValue[n])
                let title = document.createElement("span")
                title.id = "form-collection-tag-title"
                title.innerText = JSON.parse(modTitle.value)[n]
                let button = document.createElement("button")
                button.classList.add("delete")
                button.classList.add("is-small")
                button.addEventListener("click", deleteButtonClickEventListener)
                tag.appendChild(title)
                tag.appendChild(button)
                modButton.before(tag)
            }
            input.value = modInput.value
        })
    }
}

function initializeMultiSelectTables() {
    let tables = document.querySelectorAll("table#multi-select")
    for (let table of tables) {
        let valueInput = table.querySelector("input#multi-select-input")
        let titleInput = table.querySelector("input#multi-select-title")
        let trimValues = (values, fallback) => {
            while (values.includes(fallback)) values.splice(values.indexOf(fallback), 1)
            return values
        }
        let fillValues = (values, fallback) => {
            let maxLength = (valueInput.getAttribute("max-length") == null) ? -1 : parseInt(valueInput.getAttribute("max-length"))
            while (values.length < maxLength) values.push(fallback)
            return values
        }
        let lines = table.querySelectorAll("tbody tr")
        let refresh = () => {
            let fallbackValue = JSON.parse(valueInput.getAttribute("fallback"))
            let value = trimValues(JSON.parse(valueInput.value), fallbackValue)
            let title = []
            for (let l of lines) {
                let lvalue = JSON.parse(l.getAttribute("multi-select-value"))
                if (value.includes(lvalue)) {
                    if (!l.classList.contains("is-selected")) l.classList.add("is-selected")
                    title[value.indexOf(lvalue)] = l.getAttribute("multi-select-title")
                    l.style.fontWeight = "bold"
                } else {
                    l.classList.remove("is-selected")
                    l.style.fontWeight = ""
                }
            }
            titleInput.value = JSON.stringify(title)
        }

        for (let l of lines) {
            l.onclick = () => {
                let fallbackValue = JSON.parse(valueInput.getAttribute("fallback"))
                let maxLength = (valueInput.getAttribute("max-length") == null) ? -1 : parseInt(valueInput.getAttribute("max-length"))
                let value = trimValues(JSON.parse(valueInput.value), fallbackValue)
                let lvalue = JSON.parse(l.getAttribute("multi-select-value"))
                if (value.includes(lvalue)) value.splice(value.indexOf(lvalue), 1)
                else if (maxLength >= 0) {
                    if (value.length < maxLength) value.push(lvalue)
                    else alert("Cannot add more items, items are up to " + maxLength + ".")
                } else value.push(lvalue)
                valueInput.value = JSON.stringify(fillValues(value, fallbackValue))
                refresh()
                valueInput.dispatchEvent(new Event("change"))
            }
            refresh()
        }
        valueInput.addEventListener("change", refresh)
    }
}

function initializeFormNumerics() {
    let numerics = document.querySelectorAll("#form-numeric")
    for (let n of numerics) {
        let add = n.querySelector("#form-numeric-add")
        let sub = n.querySelector("#form-numeric-sub")
        let inputs = n.querySelectorAll("#form-numeric-input")
        add.addEventListener("click", (e) => {
            for (let i of inputs) {
                let maxValue = parseFloat(i.getAttribute("max-value"))
                let step = parseFloat(i.getAttribute("step"))
                let digitCount = (i.getAttribute("digit-count") == null) ? -1 : parseInt(i.getAttribute("digit-count"))
                let value = (parseFloat(i.value) * 10 + step * 10) / 10
                if (value <= maxValue) i.value = (digitCount >= 0) ? value.toFixed(digitCount) : value
            }
            e.stopPropagation()
        })
        sub.addEventListener("click", (e) => {
            for (let i of inputs) {
                let minValue = parseFloat(i.getAttribute("min-value"))
                let step = parseFloat(i.getAttribute("step"))
                let digitCount = (i.getAttribute("digit-count") == null) ? -1 : parseInt(i.getAttribute("digit-count"))
                let value = (parseFloat(i.value) * 10 - step * 10) / 10
                if (value >= minValue) i.value = (digitCount >= 0) ? value.toFixed(digitCount) : value
            }
            e.stopPropagation()
        })
        for (let i of inputs) {
            let digitCount = (i.getAttribute("digit-count") == null) ? -1 : parseInt(i.getAttribute("digit-count"))
            let value = parseFloat(i.value)
            i.value = (digitCount >= 0) ? value.toFixed(digitCount) : value
        }
    }
}

function initializeUploader() {
    let uploaders = document.querySelectorAll("div#uploader")
    for (let uploader of uploaders) {
        let input = uploader.querySelector("input#uploader-input")
        let text = uploader.querySelector("input#uploader-text")
        let placeholder = uploader.querySelector("#uploader-placeholder")
        let remove = uploader.querySelector("#uploader-delete")
        let reader = new FileReader()
        input.addEventListener("change", () => {
            if (input.files.length > 0) {
                remove.style.display = "block"
                placeholder.innerText = input.files[0].name
                reader.readAsText(input.files[0])
                reader.onload = () => text.value = reader.result
            } else {
                placeholder.innerText = ""
                remove.style.display = "none"
                text.value = null
            }
        })
        remove.addEventListener("click", (e) => {
            e.stopPropagation()
            input.value = null
            input.dispatchEvent(new Event("change"))
        })

        remove.style.display = "none"
    }
}

function checkImg() {
    let imgs = document.querySelectorAll("#exist-or-not")
    for (let img of imgs) {
        let general = img.querySelector("img#general")
        let specified = img.querySelector("img#specified")

        if (specified.width == 0) specified.style.display = "none"
        else general.style.display = "none"
    }
}

function initializePastel() {
    let pastel = document.querySelector(".pastel")
    if (pastel == null) return
    let body = pastel.querySelector(".pastel-body")
    let headInput = pastel.querySelector("input.pastel-head-input")
    let topInput = pastel.querySelector("input.pastel-top-input")
    let underInput = pastel.querySelector("input.pastel-under-input")
    let armInput = pastel.querySelector("input.pastel-arm-input")

    let refresh = () => {
        let headPath = "url(\"static/img/pastel_equips/head_" + headInput.getAttribute("value") + ".webp\")"
        let topPath = "url(\"static/img/pastel_equips/top_" + topInput.getAttribute("value") + ".webp\")"
        let underPath = "url(\"static/img/pastel_equips/under_" + underInput.getAttribute("value") + ".webp\")"
        let leftArmPath = "url(\"static/img/pastel_equips/arm_l_" + armInput.getAttribute("value") + ".webp\")"
        let rightArmPath = "url(\"static/img/pastel_equips/arm_r_" + armInput.getAttribute("value") + ".webp\")"
        let pastelPath = "url(\"static/img/pastel_equips/pastel.webp\")"

        body.style.backgroundImage = rightArmPath + ", " + leftArmPath + ", " + underPath + ", " + topPath + ", " + headPath + ", " + pastelPath
    }

    headInput.addEventListener("change", refresh)
    topInput.addEventListener("change", refresh)
    underInput.addEventListener("change", refresh)
    armInput.addEventListener("change", refresh)

    refresh()
}

function initializeMarqueeLabels() {
    let marquees = document.querySelectorAll(".marquee-label")
    for (let marquee of marquees) {
        let refresh = () => {
            if ((marquee.offsetWidth > 0) && (marquee.offsetWidth > marquee.parentElement.offsetWidth - 10)) {
                marquee.animate([
                    { transform: "translateX(0)", offset: 0 },
                    { transform: "translateX(0)", easing: "cubic-bezier(0.67, 0, 0.33, 1)", offset: 0.1 },
                    { transform: "translateX(" + (marquee.parentElement.offsetWidth - marquee.offsetWidth - 10) + "px)", easing: "cubic-bezier(0.67, 0, 0.33, 1)", offset: 0.9 },
                    { transform: "translateX(" + (marquee.parentElement.offsetWidth - marquee.offsetWidth - 10) + "px)", offset: 1 }
                ],
                    { duration: Math.max(20 * (marquee.offsetWidth - marquee.parentElement.offsetWidth), 2000), direction: "alternate-reverse", iterations: Infinity })
            } else marquee.style.animation = "none"
        }
        let o = new ResizeObserver(refresh)
        o.observe(marquee.parentElement)
    }
}

function initializeNotificatioAnimation() {
    let notifications = document.querySelectorAll(".notification.temporary")
    for (let n of notifications) {
        let remove = n.querySelector(".delete")
        let startSubmitter = n.querySelector("form.start")
        let startPath = startSubmitter.getAttribute("action")
        let startRequest = new XMLHttpRequest()
        startRequest.open("POST", startPath, true)
        startRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

        let endSubmitter = n.querySelector("form.end")
        let endPath = startSubmitter.getAttribute("action")
        let endRequest = new XMLHttpRequest()
        endRequest.open("POST", endPath, true)
        endRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded")

        if (startSubmitter != null) startRequest.send()
        let end = () => {
            n.style.display = "none"
            if (endSubmitter != null) endRequest.send()
        }
        remove.addEventListener("click", end)
        n.addEventListener("animationend", end)
        n.addEventListener("webkitAnimationEnd", end)
    }
}

$(document).ready(() => {
    initializeTabs()
    initializeToggles()
    initializeModals()
    initializeFormSelects()
    initializeFormNumerics()
    initializeFormPaginations()
    initializeFormValidation()
    initializeFormCollections()
    initializeMultiSelectTables()
    initializeUploader()
    checkImg()
    initializePastel()
    initializeMarqueeLabels()
    initializeNotificatioAnimation()
})
