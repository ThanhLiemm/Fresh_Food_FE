import cartReducer from './cart'
import { combineReducers } from 'redux' 
import userReducer from './user';

const rootReducer = combineReducers ({
    cart : cartReducer,
    user : userReducer
})

export default rootReducer;