"use strict"

const qs = (selectors) => document.querySelector(selectors)
const qsa = (selectors) => document.querySelectorAll(selectors)

function initializePaginatedContent() {
    let containers = qsa(".paginated-container")

    for (let container of containers) {
        let pageSizeInput = container.querySelector("input.page-size")
        let paginations = container.querySelectorAll(".pagination")
        let contents = container.querySelectorAll(".paginated-content")
        let group = container.getAttribute("pagination-group")
        let flags = { isFirst: true }
        let refreshEllipsis = (param) => {
            if (flags.isFirst) return
            let maxWidth = container.offsetWidth / 1.6
            for (let pagination of paginations) {
                let buttons = pagination.querySelector("ul.pagination-list")
                if (buttons.childElementCount == 0) return
                let show = (index) => buttons.querySelector("li[tab-index=\"" + index + "\"]").style.display = "block"
                let hide = (index) => buttons.querySelector("li[tab-index=\"" + index + "\"]").style.display = "none"
                let previousButton = pagination.querySelector("a.pagination-previous")
                let nextButton = pagination.querySelector("a.pagination-next")
                let leftEllipsis = buttons.querySelector("li.ellipsis-left")
                let rightEllipsis = buttons.querySelector("li.ellipsis-right")
                let count = buttons.childElementCount - 2
                let maxButtonCount = Math.max((buttons.firstChild.offsetWidth == 0) ? 5 : Math.trunc(maxWidth / buttons.firstChild.offsetWidth), 5)
                let current = (param instanceof HTMLElement) ? param : buttons.querySelector("li.is-active")
                let index = parseInt((current == null) ? 0 : current.getAttribute("tab-index"))
                if (index == 0) previousButton.setAttribute("disabled", "")
                else previousButton.removeAttribute("disabled")
                if (index == (count - 1)) nextButton.setAttribute("disabled", "")
                else nextButton.removeAttribute("disabled")
                if (count <= maxButtonCount) {
                    for (let i = 0; i < count; i++) buttons.querySelector("li[tab-index=\"" + i + "\"]").style.display = "block"
                    leftEllipsis.style.display = "none"
                    rightEllipsis.style.display = "none"
                } else {
                    maxButtonCount = Math.trunc((maxButtonCount - 1) / 2) * 2 + 1
                    let maxSurroundingButtonCount = (maxButtonCount - 5) / 2
                    let maxNoEllipsisIndex = maxButtonCount - 2 - maxSurroundingButtonCount - 1

                    if (index <= maxNoEllipsisIndex) {
                        for (let i = 0; i <= (maxNoEllipsisIndex + maxSurroundingButtonCount); i++) show(i)
                        for (let i = (maxNoEllipsisIndex + maxSurroundingButtonCount) + 1; i < count - 1; i++) hide(i)
                        show(count - 1)
                        leftEllipsis.style.display = "none"
                        rightEllipsis.style.display = "block"
                    } else if (index >= (count - maxNoEllipsisIndex - 1)) {
                        for (let i = 1; i < (count - maxNoEllipsisIndex - maxSurroundingButtonCount - 1); i++) hide(i)
                        for (let i = (count - maxNoEllipsisIndex - maxSurroundingButtonCount - 1); i < count; i++) show(i)
                        show(0)
                        leftEllipsis.style.display = "block"
                        rightEllipsis.style.display = "none"
                    } else {
                        for (let i = 1; i < (index - maxSurroundingButtonCount); i++) hide(i)
                        for (let i = (index - maxSurroundingButtonCount); i <= (index + maxSurroundingButtonCount); i++) show(i)
                        for (let i = (index + maxSurroundingButtonCount) + 1; i < count - 1; i++) hide(i)
                        show(0)
                        show(count - 1)
                        leftEllipsis.style.display = "block"
                        rightEllipsis.style.display = "block"
                    }
                }
            }
        }
        let refresh = () => {
            if ((pageSizeInput == null) || (parseInt(pageSizeInput.value) <= 0)) {
                for (let pagination of paginations) pagination.style.display = "none"
                return
            }
            let pageSize = parseInt(pageSizeInput.value)
            let pageCount = Math.ceil(contents.length / pageSize)
            if (!flags.isFirst && (flags.pageSize == pageSize) && (flags.pageCount == pageCount)) return
            for (let pagination of paginations) {
                let buttons = pagination.querySelector("ul.pagination-list")
                buttons.innerHTML = ""
                buttons.id = "tabs"
            }
            for (let i = 0; i < pageCount; i++) {
                for (let j = i * pageSize; j < (i + 1) * pageSize; j++) {
                    if (contents[j] == null) break
                    contents[j].classList.add("tab-content")
                    contents[j].setAttribute("tab-group", group)
                    contents[j].setAttribute("tab-index", i)
                    if ((i == 0) && (flags.isFirst || (flags.pageCount != pageCount))) contents[j].classList.add("is-active")
                    if (j == ((i + 1) * pageSize - 1)) for (let td of contents[j].querySelectorAll("td")) td.style.borderBottom = "0"
                }
                if (pageCount > 1) for (let pagination of paginations) {
                    let buttons = pagination.querySelector("ul.pagination-list")
                    let a = document.createElement("a")
                    a.classList.add("pagination-link")
                    if (i >= 999) a.innerHTML = `<span style="font-size: 0.5em !important">${i + 1}</span>`
                    else a.innerText = i + 1
                    let li = document.createElement("li")
                    li.appendChild(a)
                    if ((i == 0) && (flags.isFirst || (flags.pageCount != pageCount))) {
                        li.classList.add("is-active")
                        a.classList.add("is-current")
                    }
                    li.setAttribute("tab-group", group)
                    li.setAttribute("tab-index", i)
                    buttons.appendChild(li)
                    li.addEventListener("click", () => {
                        refreshEllipsis(li)
                    })
                }
            }
            if (pageCount > 1) for (let pagination of paginations) {
                pagination.style.display = "flex"
                let buttons = pagination.querySelector("ul.pagination-list")
                let leftEllipsis = document.createElement("li")
                leftEllipsis.style.display = "none"
                leftEllipsis.classList.add("ellipsis-left", "ignore")
                leftEllipsis.innerHTML = "<span class=\"pagination-ellipsis\">&hellip;</span>"
                let rightEllipsis = document.createElement("li")
                rightEllipsis.style.display = "none"
                rightEllipsis.classList.add("ellipsis-right", "ignore")
                rightEllipsis.innerHTML = "<span class=\"pagination-ellipsis\">&hellip;</span>"
                buttons.firstChild.after(leftEllipsis)
                buttons.lastChild.before(rightEllipsis)

                let previousButton = pagination.querySelector("a.pagination-previous")
                let nextButton = pagination.querySelector("a.pagination-next")
                previousButton.addEventListener("click", () => {
                    let current = buttons.querySelector("li.is-active")
                    let index = parseInt(current.getAttribute("tab-index"))
                    if (index <= 0) return
                    let prev = buttons.querySelector("li[tab-index=\"" + (index - 1) + "\"]")
                    prev.dispatchEvent(new Event("click"))
                })
                nextButton.addEventListener("click", () => {
                    let current = buttons.querySelector("li.is-active")
                    let index = parseInt(current.getAttribute("tab-index"))
                    if (index >= (buttons.childElementCount - 3)) return // includes left & right ellipsis
                    let next = buttons.querySelector("li[tab-index=\"" + (index + 1) + "\"]")
                    next.dispatchEvent(new Event("click"))
                })
            } else for (let pagination of paginations) pagination.style.display = "none"
            flags.pageCount = pageCount
            flags.pageSize = pageSize
            flags.isFirst = false
        }
        refresh()
        pageSizeInput.addEventListener("change", refresh)
        let o = new ResizeObserver(refreshEllipsis)
        o.observe(container)
    }
}

function initializeTabs() {
    let tabs = qsa("#tabs li, #tabs #tab")
    let tabsSelect = qsa(".select select#select-tabs")
    let tabContents = qsa("#tab-content, .tab-content")
    let updateActiveTab = (tabGroup, tabIndex) => {
        for (let t of tabs) if (t && (t.getAttribute("tab-group") == tabGroup)) {
            if (t.getAttribute("tab-index") != tabIndex) {
                t.classList.remove("is-active")
                for (let a of t.querySelectorAll("a")) a.classList.remove("is-current")
            } else {
                t.classList.add("is-active")
                for (let a of t.querySelectorAll("a")) a.classList.add("is-current")
            }
        }
        for (let s of tabsSelect) for (let t of s.querySelectorAll("option")) if (t && (t.getAttribute("tab-group") == tabGroup)) {
            if (t.getAttribute("tab-index") == tabIndex) t.selected = true
            else t.selected = null
        }
    }

    let updateActiveContent = (tabGroup, tabIndex) => {
        for (let item of tabContents) {
            let group = item.getAttribute("tab-group")
            let index = item.getAttribute("tab-index")
            let indexAlternate = item.getAttribute("tab-index-alternate")
            if (item && (group == tabGroup)) item.classList.remove("is-active")
            if (((index == tabIndex) || (indexAlternate == tabIndex)) && (group == tabGroup)) item.classList.add("is-active")
        }
    }
    for (let t of tabs) {
        if (!t.classList.contains("disabled") && !t.classList.contains("ignore")) t.addEventListener("click", () => {
            let group = t.getAttribute("tab-group")
            let index = t.getAttribute("tab-index")
            updateActiveTab(group, index)
            updateActiveContent(group, index)
        })
    }
    for (let s of tabsSelect) {
        s.addEventListener("change", (e) => {
            let tab = e.target.options[e.target.selectedIndex]
            let group = tab.getAttribute("tab-group")
            let index = tab.getAttribute("tab-index")
            tab.onclick(tab)
            updateActiveTab(group, index)
            updateActiveContent(group, index)
        })
    }
}

function initializeToggles() {
    let toggles = qsa(".card-header .card-toggle")
    let contents = qsa(".card-content")

    for (let t of toggles) {
        let card = t.getAttribute("card")
        if (card == null) continue
        let cc = []
        for (let c of contents) if (c.getAttribute("card") == card) cc.push(c)
        t.style.transition = "0.2s linear"
        t.addEventListener("click", (e) => {
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

let modalImageBuffer = []
let maxModalImageBufferSize = 50
function initializeModals(trigger, modal) {
    if (trigger && modal) {
        let c = modal.querySelectorAll("#close")
        trigger.addEventListener("click", () => { modal.style.display = "flex" })
        for (let v of c) v.addEventListener("click", (e) => {
            modal.style.display = "none"
            e.stopPropagation()
        })
    } else {
        let modaltriggers = qsa(".modal-trigger")
        for (let t of modaltriggers) {
            let m = t.querySelector(".modal")
            let c = m.querySelectorAll("#close")
            let imgs = t.querySelectorAll("img")
            t.addEventListener("click", () => {
                m.style.display = "flex"
                for (let img of imgs) {
                    let src = img.getAttribute("src")
                    let lateSrc = img.getAttribute("late-src")
                    if (lateSrc && (!src || (src != lateSrc))) {
                        img.setAttribute("src", img.getAttribute("late-src"))
                        if (modalImageBuffer.length >= Math.max(maxModalImageBufferSize, imgs.length)) {
                            modalImageBuffer[0].setAttribute("src", modalImageBuffer[0].getAttribute("placeholder-src"))
                            modalImageBuffer.splice(0, 1)
                        }
                        modalImageBuffer.push(img)
                    }
                }
            })
            for (let v of c) v.addEventListener("click", (e) => {
                m.style.display = "none"
                e.stopPropagation()
            })
            c = null
        }
    }
}

function initializeFormSelects() {
    let formSelects = qsa("#form-select")
    for (let s of formSelects) {
        let input = s.querySelector("input#form-select-input")
        let select = s.querySelector("select#form-select-select")
        let options = select.querySelectorAll("option")
        for (let i = 0; i < options.length; i++) {
            let o = options[i]
            let value = (o.getAttribute("value") == null) ? i : o.getAttribute("value")
            let enabled = (o.getAttribute("disabled") == null) ? true : false
            if (value == input.value) select.selectedIndex = i
            if (!enabled) o.style.display = "none"
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
    let formPags = qsa("#form-pagination")
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

function clipFloat(v) {
    if (typeof v == "string") return Math.round((typeof v == "string" ? parseFloat(v) : v) * 100000000000) / 100000000000
}

function initializeFormValidation() {
    let forms = qsa("form#validatable")
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
                isNumeric: (input.getAttribute("numeric") != null) || (input.getAttribute("int") != null) || (input.getAttribute("gt") != null) || (input.getAttribute("gte") != null) || (input.getAttribute("lt") != null) || (input.getAttribute("lte") != null) || (input.getAttribute("eq") != null),
                isInt: input.getAttribute("int") != null,
                gt: (parseFloat(input.getAttribute("gt")).toString() == input.getAttribute("gt")) ? parseFloat(input.getAttribute("gt")).toString() : null,
                gte: (parseFloat(input.getAttribute("gte")).toString() == input.getAttribute("gte")) ? parseFloat(input.getAttribute("gte")).toString() : null,
                lt: (parseFloat(input.getAttribute("lt")).toString() == input.getAttribute("lt")) ? parseFloat(input.getAttribute("lt")).toString() : null,
                lte: (parseFloat(input.getAttribute("lte")).toString() == input.getAttribute("lte")) ? parseFloat(input.getAttribute("lte")).toString() : null,
                eq: (parseFloat(input.getAttribute("eq")).toString() == input.getAttribute("eq")) ? parseFloat(input.getAttribute("eq")).toString() : null
            }
        }
        let isValid = (value, params) => {
            let t = value.trim()
            if (params.minLength != null) if (t.length < parseInt(params.minLength)) return false
            if (params.maxLength != null) if (t.length > parseInt(params.maxLength)) return false
            if (params.minPattern != null) if (!(new RegExp(params.minPattern).test(t))) return false
            if (value == "") return true
            if (params.isNumeric == true) if (clipFloat(t).toString() != t) return false
            if (params.isFloat) if (parseInt(t).toString() != t) return false
            if ((params.gte != null) && (clipFloat(t) < params.gte)) return false
            if ((params.gt != null) && (clipFloat(t) <= params.gt)) return false
            if ((params.lte != null) && (clipFloat(t) > params.lte)) return false
            if ((params.lt != null) && (clipFloat(t) >= params.lt)) return false
            if ((params.eq != null) && (clipFloat(t) != params.eq)) return false
            return true
        }

        let isFormValid = () => {
            for (let field of validatableFields) for (let i of field.querySelectorAll("input#validatable")) if (!isValid(i.value, getParams(i))) return false
            return true
        }

        for (let field of validatableFields) {
            let inputs = field.querySelectorAll("input#validatable")
            let labels = field.querySelectorAll("span, p")
            for (let i of inputs) {
                i.addEventListener("change", () => {
                    let params = getParams(i)
                    // inputs
                    if (isValid(i.value, params)) {
                        i.classList.remove("is-danger")
                        for (let l of labels) l.classList.remove("is-danger")
                    } else if (!i.classList.contains("is-danger")) {
                        i.classList.add("is-danger")
                        for (let l of labels) l.classList.add("is-danger")
                    }
                    // buttons
                    if (isFormValid()) {
                        for (let b of validatableButtons) b.removeAttribute("disabled")
                    } else {
                        for (let b of validatableButtons) if (b.getAttribute("disabled") == null) b.setAttribute("disabled", "")
                    }
                })
                if (isValid(i.value, getParams(i))) {
                    i.classList.remove("is-danger")
                    for (let l of labels) l.classList.remove("is-danger")
                } else if (!i.classList.contains("is-danger")) {
                    i.classList.add("is-danger")
                    for (let l of labels) l.classList.add("is-danger")
                }
            }
        }
        if (isFormValid()) {
            for (let b of validatableButtons) b.removeAttribute("disabled")
        } else {
            for (let b of validatableButtons) if (b.getAttribute("disabled") == null) b.setAttribute("disabled", "")
        }
    }
}

function initializeFormCollections() {
    let collections = qsa("#form-collection")
    for (let c of collections) {
        let maxLength = parseInt(c.getAttribute("max-length"))
        let fallbackValue = JSON.parse(c.getAttribute("fallback"))
        let input = c.querySelector("#form-collection-input")
        let tags = c.querySelectorAll("#form-collection-tag")
        let modButton = c.querySelector("#form-collection-modify")
        let modTable = c.querySelector("table#multi-select")
        let modInput = modTable.querySelector("input#multi-select-input")
        let modTitle = modTable.querySelector("input#multi-select-title")
        let deleteButtonClickEventListener = (tag) => () => {
            let tvalue = JSON.parse(tag.getAttribute("value"))
            let value = JSON.parse(input.value)
            value.splice(value.indexOf(tvalue), 1)
            if (fallbackValue != null) value.push(fallbackValue)
            input.value = JSON.stringify(value)
            modInput.value = input.value
            modInput.dispatchEvent(new Event("change"))
            tag.remove()
        }

        for (let t of tags) {
            let d = t.querySelector(".delete, .is-delete")
            d.addEventListener("click", deleteButtonClickEventListener(t))
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
                let tag = document.createElement("div")
                tag.classList.add("control")
                tag.id = "form-collection-tag"
                tag.setAttribute("value", newValue[n])
                tag.innerHTML = "<span class=\"tags has-addons\"><span class=\"tag is-link is-light\" id=\"form-collection-tag-title\">" + JSON.parse(modTitle.value)[n] + "</span><a class=\"tag is-delete\" /></span>"
                tag.querySelector("a.is-delete").addEventListener("click", deleteButtonClickEventListener(tag))
                modButton.before(tag)
            }
            input.value = modInput.value
        })
    }
}

function initializeFormSlotedArrays() {
    let arrays = qsa("#form-sloted-array")
    for (let a of arrays) {
        let elements = a.querySelectorAll("#form-array-slot")
        let fallbackValue = JSON.parse(a.getAttribute("fallback"))
        let modModal = a.querySelector(".modal#mod-modal")
        let modTable = modModal.querySelector("table#single-select")
        let modInput = modTable.querySelector("input#select-input")
        let modCurrentIndex = modTable.querySelector("input#select-current-index")
        let modTitle = modTable.querySelector("input#select-title")
        let input = a.querySelector("#form-array-input")

        let deleteButtonClickEventListener = (objIndex) => () => {
            let value = JSON.parse(input.value)
            value[objIndex.index] = fallbackValue
            input.value = JSON.stringify(value)
            modInput.value = input.value
            modInput.dispatchEvent(new Event("change"))
        }

        for (let i = 0; i < elements.length; i++) {
            let e = elements[i]
            let tag = e.querySelector("#form-array-tag")
            let modButton = e.querySelector("#form-array-modify")

            let d = tag.querySelector(".delete, .is-delete")
            d.addEventListener("click", deleteButtonClickEventListener({ index: i }))
            modButton.addEventListener("click", () => {
                modCurrentIndex.value = i
                modCurrentIndex.dispatchEvent(new Event("change"))
            })
            initializeModals(modButton, modModal)
        }
        modInput.value = input.value
        modInput.setAttribute("fallback", JSON.stringify(fallbackValue))
        modInput.addEventListener("change", () => {
            let fallbackValue = JSON.parse(a.getAttribute("fallback"))
            let newValue = JSON.parse(modInput.value)
            let newTitle = JSON.parse(modTitle.value)
            for (let i = 0; i < elements.length; i++) {
                let e = elements[i]
                let tag = e.querySelector("#form-array-tag")
                let modButton = e.querySelector("#form-array-modify")
                if (newValue[i] == fallbackValue) {
                    modButton.style.display = "block"
                    tag.style.display = "none"
                    tag.querySelector("#form-array-tag-title").innerHTML = ""
                    tag.setAttribute("value", newValue[i])
                } else {
                    modButton.style.display = "none"
                    tag.style.display = "block"
                    tag.querySelector("#form-array-tag-title").innerHTML = newTitle[i]
                    tag.setAttribute("value", newValue[i])
                }
            }
            input.value = JSON.stringify(newValue)
            input.dispatchEvent(new Event("change"))
        })
    }
}

function initializeSingleSelectTables() {
    let tables = qsa("table#single-select")
    for (let table of tables) {
        let valueInput = table.querySelector("input#select-input")
        let titleInput = table.querySelector("input#select-title")
        let currentIndexInput = table.querySelector("input#select-current-index")
        let lines = table.querySelectorAll("tbody tr")
        let refresh = () => {
            let value = JSON.parse(valueInput.value)
            let currentIndex = currentIndexInput.value
            let isAllowSameSelection = table.getAttribute("allow-same-selection") != null
            let title = []
            for (let l of lines) {
                let lvalue = JSON.parse(l.getAttribute("select-value"))
                if (value.includes(lvalue)) {
                    let ltitle = l.getAttribute("select-title")
                    if (lvalue == value[currentIndex]) l.classList.add("is-selected")
                    else if (!isAllowSameSelection) l.classList.add("is-hidden")
                    title[value.indexOf(lvalue)] = ltitle
                } else {
                    l.classList.remove("is-selected")
                    l.classList.remove("is-hidden")
                }
            }
            titleInput.value = JSON.stringify(title)
        }

        for (let l of lines) {
            l.onclick = () => {
                let fallbackValue = JSON.parse(valueInput.getAttribute("fallback"))
                let value = JSON.parse(valueInput.value)
                let currentIndex = currentIndexInput.value
                let lvalue = JSON.parse(l.getAttribute("select-value"))
                value[currentIndex] = lvalue
                valueInput.value = JSON.stringify(value, fallbackValue)
                refresh()
                valueInput.dispatchEvent(new Event("change"))
            }
            refresh()
        }
        valueInput.addEventListener("change", refresh)
        currentIndexInput.addEventListener("change", refresh)
    }
}

function initializeMultiSelectTables() {
    let tables = qsa("table#multi-select")
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
            let value = []
            try {
                value = trimValues(JSON.parse(valueInput.value), fallbackValue)
            } catch { }
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
    let numerics = qsa("#form-numeric")
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
    let uploaders = qsa("div#uploader")
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

function initializePastel() {
    let pastel = qs(".pastel")
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

function initializeMarqueeLabels(scope) {
    let marqueeContainers = (scope ? scope : document).querySelectorAll(".marquee-label-container")
    for (let c of marqueeContainers) {
        let marquees = c.querySelectorAll(".marquee-label")
        for (let marquee of marquees) {
            if (marquee.closest(".marquee-label-container") != c) continue
            let refresh = () => {
                let lpad = parseInt(window.getComputedStyle(c, null).getPropertyValue("padding-left"))
                if (lpad == NaN) lpad = 0
                let rpad = parseInt(window.getComputedStyle(c, null).getPropertyValue("padding-right"))
                if (rpad == NaN) rpad = 20
                let hpad = lpad + rpad
                let speed = marquee.getAttribute("speed")
                if (speed == null) speed = 1
                let stopingTime = 0.5
                let duration = (20 * (marquee.offsetWidth - c.offsetWidth + hpad)) / speed + 2 * stopingTime
                if ((marquee.offsetWidth > 0) && (marquee.offsetWidth > c.offsetWidth - hpad)) {
                    marquee.style.textAlign = "left"
                    c.style.justifyContent = "left"
                    marquee.style.transform = ""
                    marquee.animate([
                        { transform: "translateX(0)", offset: 0 },
                        { transform: "translateX(0)", easing: "cubic-bezier(0.67, 0, 0.33, 1)", offset: stopingTime / duration },
                        { transform: "translateX(" + (c.offsetWidth - marquee.offsetWidth - hpad) + "px)", easing: "cubic-bezier(0.67, 0, 0.33, 1)", offset: 1 - stopingTime / duration },
                        { transform: "translateX(" + (c.offsetWidth - marquee.offsetWidth - hpad) + "px)", offset: 1 }
                    ], { duration: (20 * (marquee.offsetWidth - c.offsetWidth) + 1000) / speed, direction: "alternate-reverse", iterations: Infinity })
                } else {
                    marquee.style.textAlign = null
                    c.style.justifyContent = null
                    marquee.style.setProperty("animation", "none")
                    marquee.style.setProperty("transform", "none", "important")
                }
            }
            let o = new ResizeObserver(refresh)
            o.observe(c)
        }
    }
}

function initializeNotificatioAnimation() {
    let notifications = qsa(".notification.temporary")
    for (let n of notifications) {
        let remove = n.querySelector(".delete")
        let startSubmitter = n.querySelector("form.start")
        let startPath = startSubmitter ? startSubmitter.getAttribute("action") : null

        let endSubmitter = n.querySelector("form.end")
        let endPath = endSubmitter ? endSubmitter.getAttribute("action") : null

        if (startPath != null) axios.post(startPath)
        let end = () => {
            n.remove()
            if (endPath != null) axios.post(endPath)
        }

        n.style.animationPlayState = "running"
        remove.addEventListener("click", end)
        n.addEventListener("animationend", end)
        n.addEventListener("webkitAnimationEnd", end)
    }
}

function initializeCheckBoxes() {
    let checks = qsa(".checkbox")
    for (let c of checks) {
        let input = c.querySelector("input[type=checkbox]")
        let mark = c.querySelector(".checkmark")
        let refresh = (value) => {
            value = input.getAttribute("checked")
            if (value == null) {
                input.removeAttribute("checked")
                mark.style.opacity = 0
                if (!c.classList.contains("is-light")) c.classList.add("is-light")
            } else {
                input.setAttribute("checked", "checked")
                mark.style.opacity = 100
                c.classList.remove("is-light")
            }
        }
        c.addEventListener("click", () => {
            let value = input.getAttribute("checked")
            if (value == null) input.setAttribute("checked", "checked")
            else input.removeAttribute("checked")
            refresh()
        })
        refresh()
    }
}

function removeLoadingModal() {
    var loading = qs(".loading")
    setTimeout(() => (loading == null) ? null : loading.remove(), 505)
    try {
        let a = loading.animate([
            { offset: 0, opacity: 1 },
            { offset: 0.25, opacity: 0 },
            { offset: 1, opacity: 0 }
        ], { duration: 2000 })
        a.onfinish = () => loading.remove ? loading.remove() : null
        a.play()
    } catch { }
}

function tryFunctions(...functions) {
    for (let f of functions) try {
        f()
    } catch { }
}

$(document).ready(() =>
    tryFunctions(
        initializeNotificatioAnimation,
        initializePaginatedContent,
        initializeTabs,
        initializeToggles,
        initializeModals,
        initializeFormSelects,
        initializeFormNumerics,
        initializeFormPaginations,
        initializeFormValidation,
        initializeFormCollections,
        initializeMultiSelectTables,
        initializeFormSlotedArrays,
        initializeSingleSelectTables,
        initializeUploader,
        initializePastel,
        initializeMarqueeLabels,
        initializeCheckBoxes,
        removeLoadingModal
    )
)