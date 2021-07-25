const list = JSON.parse(localStorage.getItem('shopcart')) || [];
const size = list.length;
const initialState = {
    number: size
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_CART': {
            return {
                number: state.number+1
            }
        }
        case 'SUB_CART': {
            return {
                number: state.number-1
            }
        }
        default: 
             return state;
    }
}

export default cartReducer;