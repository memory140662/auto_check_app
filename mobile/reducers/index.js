import { combineReducers } from 'redux';

import settingsReducer from './settings';
import homeReducer from './home';
import * as types from '../actions/types';

const initState = {
    token: null,
    userId: null,
    accountId: null,
    error: false,
    logining: false,
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case types.pending(types.LOGIN):
            return {
                ...initState,
                logining: true,
            }
        case types.fulfilled(types.LOGIN):
            return {
                ...state,
                ...action.payload,
                logining: false,
            }
        case types.rejected(types.LOGIN):
            return {
                ...state,
                error: true,
                logining: false,
            }
        default:
            return state;
    }
}


export default combineReducers({
    settings: settingsReducer,
    home: homeReducer,
    auth: authReducer
});

