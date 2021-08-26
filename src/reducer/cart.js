import { get } from "../httpHelper"

let count ;
if(localStorage.role=="ROLE_USER" && localStorage.accessToken){
    count = localStorage.count || 0;
}
else count = 0;
const initialState = {
    number: count
}

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_CART': {
            return {
                number: action.number
            }
        }
        case 'SUB_CART': {
            return {
                number: state.number-action.number
            }
        }
        default: 
             return state;
    }
}

export default cartReducer;