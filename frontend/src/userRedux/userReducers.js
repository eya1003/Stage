import { GET_USERS_FAILURE, GET_USERS_REQUEST, GET_USERS_SUCCESS, USER_LOGIN_FAIL, USER_LOGIN_REQUEST, USER_LOGIN_SUCCESS, USER_LOGOUT, USER_REGISTER_FAIL, USER_REGISTER_REQUEST, USER_REGISTER_SUCCESS } from "./userConstants";


export const userLoginReducer=(state={},action)=>{
   // eslint-disable-next-line default-case
   switch (action.type) {
       case USER_LOGIN_REQUEST : 
           return {loading : true}
       case USER_LOGIN_SUCCESS : 
           return {loading : false , userInfo : action.payload}
       case USER_LOGIN_FAIL :
           return {loading : false , error: action.payload }        
       case USER_LOGOUT:
           return {}
       default:
           return state    

   }
   
}

export const userRegisterReducer=(state={},action)=>{
    // eslint-disable-next-line default-case
    switch (action.type) {
        case USER_REGISTER_REQUEST : 
            return {loading : true}
        case USER_REGISTER_SUCCESS : 
            return {loading : false ,messageSuccess : "WE SENT YOU A VERIFICATION E-MAIL!"}
        case USER_REGISTER_FAIL :
            return {loading : false , error: action.payload }        
        default:
            return state    

    }
}


export const getUsersReducer = (state = { users: [], loading: false, error: null }, action) => {
    switch (action.type) {
      case GET_USERS_REQUEST:
        return {
          ...state,
          loading: true
        };
      case GET_USERS_SUCCESS:
        return {
          ...state,
          loading: false,
          users: action.payload
        };
      case GET_USERS_FAILURE:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
