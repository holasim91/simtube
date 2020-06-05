import { LOGIN_USER, REIGSTER_USER, AUTH_USER } from "../_actions/types";

export default function (state = {}, action) {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        loginSuccess: action.payload,
      };
    case REIGSTER_USER:
      return {
        ...state,
        register: action.payload,
      };
    case AUTH_USER:
        return{
            ...state,
            userData: action.payload
        }
    default:
      return state;
  }
}
