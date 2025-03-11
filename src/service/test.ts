export const numberRegex = /^\d*$/
export const floatRegex = /^\d*\.?\d+$/

export const isNumber=(value:string):boolean=>{
    return numberRegex.test(value)
}
export const isFloat=(value:string):boolean=>{
    return floatRegex.test(value)
}