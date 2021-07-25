const username = localStorage.username || "";
const accessToken = localStorage.accessToken || "";
const id = localStorage.id || "";
const role = localStorage.role || "";
const initialState = {
    username : username,
    accessToken : accessToken,
    id : id,
    role: role,
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN': {
            return {
                username : localStorage.username,
                accessToken: localStorage.accessToken,
                id: localStorage.id,
                role:localStorage.role
            }
        }
        case 'LOGOUT': {
            return {
                username:"",
                accessToken:"",
                id:"",
                role:""
            }
        }
        default: 
             return state;
    }
}

export default userReducer;