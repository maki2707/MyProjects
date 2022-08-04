import {
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    USER_LOADED_SUCCESS,
    USER_LOADED_FAIL,
    AUTHENTICATED_SUCCESS,
    AUTHENTICATED_FAIL,
    LOGOUT,
    PASSWORD_RESET_SUCCESS,
    PASSWORD_RESET_FAIL,
    PASSWORD_RESET_CONFIRM_SUCCESS,
    PASSWORD_RESET_CONFIRM_FAIL,
    SIGNUP_SUCCESS,
    SIGNUP_FAIL,
    ACTIVATION_SUCCESS,
    ACTIVATION_FAIL,
    DELETION_FAIL,
    DELETION_SUCCESS
}
from '../actions/types';

const initialState = {
    access: localStorage.getItem('access'),
    refresh: localStorage.getItem('refresh'),
    isAuthenticated: null,
    isLogged: null,
    user: null,
    isSuperuser: null

};



export default function(state = initialState, action){
    
    const { type, payload } = action;

    switch(type) {

        case AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: true
            }

           

        case LOGIN_SUCCESS:
            localStorage.setItem('access', payload.access);
            localStorage.setItem('refresh', payload.refresh);
            return{
                ...state,
                isAuthenticated: true,
                access: payload.access,
                refresh: payload.refresh

            }

        case SIGNUP_SUCCESS:
            return {
                ...state,
                isAuthenticated: false
            }

        case USER_LOADED_SUCCESS:
            return {
                ...state,
                user: payload,
                isSuperuser: payload.is_superuser
            }

        case AUTHENTICATED_FAIL:
            return {
                ...state,
                isAuthenticated: false,
                isSuperuser: false
            }

        case USER_LOADED_FAIL:
            return {
                ...state,
                user: null,
                isSuperuser: false
            }

        case LOGIN_FAIL:
            return{
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                isLogged: false,
                isSuperuser: false
            } 
        case SIGNUP_FAIL:
        case LOGOUT:
        case DELETION_SUCCESS:
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            return{
                ...state,
                access: null,
                refresh: null,
                isAuthenticated: false,
                user: null,
                isSuperuser: false
            } 

        case PASSWORD_RESET_SUCCESS:
        case PASSWORD_RESET_FAIL:
        case PASSWORD_RESET_CONFIRM_SUCCESS:
        case PASSWORD_RESET_CONFIRM_FAIL:
        case ACTIVATION_SUCCESS:
        case ACTIVATION_FAIL:
        case DELETION_FAIL:
            return {
                ...state
            }
        
        default:
            return state
        
    }
}