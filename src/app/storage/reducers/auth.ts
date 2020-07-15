import { User } from '../../models/user';
import { AuthActionTypes, ALL} from '../actions/auth';

export interface State {
    isAuthenticated: boolean;
    user: User | null;
    errorMessage: string | null;
}

export const initialState: State = {
    isAuthenticated: true,
    user: null,
    errorMessage: null
}

export function reducer(state = initialState, action: ALL): State {
    switch(action.type) {
        case AuthActionTypes.LOGIN_SUCCESS: {
            return {
                ...state,
                isAuthenticated: true,
                user: {
                    token: action.payload.token,
                    email: action.payload.email
                },
                errorMessage: null
            };
        }
        case AuthActionTypes.LOGIN_FAILURE: {
            return {
                ...state,
                errorMessage: 'Incorrect email and/or password.'
            }
        }
        case AuthActionTypes.SIGNUP_SUCCESS: {
            return {
                ...state,
                user: {

                },
                errorMessage: null
            }
        }
        case AuthActionTypes.SIGNUP_FAILURE: {
            return {
                ...state,
                errorMessage: 'Failed to signup.'
            }
        }
        default: {
            return state;
        }
    }
}