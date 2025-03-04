export const numberRegex = /^\d*$/

export const isNumber=(value:string):boolean=>{
    return numberRegex.test(value)
}
