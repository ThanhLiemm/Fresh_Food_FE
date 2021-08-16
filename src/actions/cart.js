export const addCart = (number) => {
    return {
        type: 'ADD_CART',
        number: number
    }
}

export const subCart = (number) => {
    return {
        type: 'SUB_CART',
        number:number
    }
}