// import { state, style, group, AUTO_STYLE, transition, animate, keyframes, trigger } from "@angular/animations"
// import { BungAnimationDuration, BungFloat } from "../../../utils/bung"

// const locationOffset = "calc(-100% - 2em)"
// const duration = "{{ duration }}ms"
// const defaultOption = { params: { duration: BungAnimationDuration } }

// const getTranslateDirection = (float: BungFloat) => {
//     switch (float) {
//         case "left":
//         case "top-left":
//         case "bottom-left":
//             return "left"
//         case "right": case "top-right": case "bottom-right":
//             return "right"
//         case "top": case "bottom":
//             return float
//         default:
//             return "inset"
//     }
// }
// const getStates = (float: BungFloat) => [
//     state(`${float}-in`, style({ transform: "scale(0.8)", [getTranslateDirection(float)]: locationOffset, filter: "none", opacity: ((float == "top") || (float == "bottom") || (float == "none")) ? 0 : 1, transition: `0.25s, opacity 0s, transform 0s, ${getTranslateDirection(float)} 0s` })),
//     state(`${float}-out`, style({ transform: "scale(0.8)", [getTranslateDirection(float)]: locationOffset, filter: "none", opacity: ((float == "top") || (float == "bottom") || (float == "none")) ? 0 : 1, transition: `0.25s, opacity 0s, transform 0s, ${getTranslateDirection(float)} 0s` })),
//     state(`${float}-show`, style({ transform: "none", [getTranslateDirection(float)]: 0, filter: AUTO_STYLE, opacity: 1 })),
// ]
// const getTransitions = (float: BungFloat) => [
//     transition(`${float}-in => ${float}-show`, [
//         group([
//             animate(duration, keyframes([
//                 style({ transform: "scale(0.8)", filter: "none", offset: 0.75 }),
//                 style({ transform: "none", filter: AUTO_STYLE, offset: 1 })
//             ])),
//             animate(`${duration} ease-out`, keyframes([
//                 style({ [getTranslateDirection(float)]: 0, opacity: 1, offset: 0.55 })
//             ]))
//         ])
//     ], defaultOption),
//     transition(`${float}-show => ${float}-out`, [
//         group([
//             animate(duration, keyframes([
//                 style({ transform: "scale(0.8)", filter: "none", offset: 0.25 })
//             ])),
//             animate(`${duration} ease-in`, keyframes([
//                 style({ [getTranslateDirection(float)]: 0, opacity: 1, offset: 0.35 }),
//                 style({ [getTranslateDirection(float)]: locationOffset, opacity: ((float == "top") || (float == "bottom") || (float == "none")) ? 0 : 1, offset: 1 })
//             ]))
//         ])
//     ], defaultOption)
// ]

// export function getDefaultPopupAnimations() {
//     return [
//         trigger("transition", [
//             state("none-in", style({ opacity: 0, transform: "scale(0.8)", transition: "0.25s, opacity 0s, transform 0s" })),
//             state("none-out", style({ opacity: 0, transform: "scale(0.8)", transition: "0.25s, opacity 0s, transform 0s" })),
//             state("none-show", style({ opacity: 1, transform: "none", transition: "0.25s, opacity 0s, transform 0s" })),
//             ...getStates("left"), ...getStates("right"), ...getStates("top"), ...getStates("bottom"),
//             ...getStates("top-left"), ...getStates("top-right"), ...getStates("bottom-left"), ...getStates("bottom-right"),
//             transition("none-in => none-show", [
//                 animate(duration,
//                     keyframes([
//                         style({ opacity: 1, transform: "scale(0.8)", offset: 0.5 }),
//                         style({ transform: "none", offset: 1 })
//                     ])
//                 )
//             ], defaultOption),
//             transition("none-show => none-out", [
//                 animate(duration,
//                     keyframes([
//                         style({ opacity: 1, transform: "scale(0.8)", offset: 0.5 }),
//                         style({ opacity: 0, offset: 1 })
//                     ])
//                 )
//             ], defaultOption),
//             ...getTransitions("left"), ...getTransitions("right"), ...getTransitions("top"), ...getTransitions("bottom"),
//             ...getTransitions("top-left"), ...getTransitions("top-right"), ...getTransitions("bottom-left"), ...getTransitions("bottom-right"),
//         ]),
//         trigger("closeButtonTransition", [
//             transition(":enter", [style({ opacity: 0, transform: "scale(0.5)" }), animate(duration, keyframes([
//                 style({ opacity: 1, transform: "scale(0.8)", offset: 0.5 }),
//                 style({ transform: "scale(1)", offset: 1 })
//             ]))], defaultOption),
//             transition(":leave", [style({ opacity: 1, transform: "scale(1)" }), animate(duration, keyframes([
//                 style({ opacity: 1, transform: "scale(0.8)", offset: 0.5 }),
//                 style({ opacity: 0, offset: 1 })
//             ]))], defaultOption)
//         ]),
//         trigger("overlayTransition", [
//             state("in", style({ opacity: 1, pointerEvents: "all" })),
//             state("out", style({ opacity: 0, pointerEvents: "none" })),
//             state("*", style({ opacity: 1, pointerEvents: "all" })),
//             state("void", style({ opacity: 0, pointerEvents: "none" })),
//             transition("* <=> *", animate(duration), defaultOption),
//             transition("* <=> void", animate(duration), defaultOption)
//         ]),
//         trigger("fixedElementTransition", [
//             state("*", style({ height: AUTO_STYLE, paddingTop: AUTO_STYLE, paddingBottom: AUTO_STYLE })),
//             state("void", style({ height: 0, paddingTop: 0, paddingBottom: 0 })),
//             transition(":enter", animate(`${duration} ease-out`), defaultOption),
//             transition(":leave", animate(`${duration} ease-in`), defaultOption),
//         ])
//     ]
// }