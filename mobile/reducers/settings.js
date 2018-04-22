import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';

import * as types from '../actions/types';

const settingsPersistConfig = {
    key: 'settings',
    storage: AsyncStorage,
    whitelist: ['account', 'password']
}

const initState = {
    account: null,
    password: null,
    latitude: 25.073691,
    longitude: 121.575602,
    days: null,
    loading: false,
    saving: false,
    error: false,
    companyName: 'techlink',
    changing: false,
}

const reducer = (state = initState, action) => {
    switch (action.type) {
        case types.pending(types.SAVE_SETTINGS):
            return {
                ...state,
                saving: true,
                error: false,
                changing: false
            }
        case types.fulfilled(types.SAVE_SETTINGS):
            return {
                ...state,
                ...action.payload,
                saving: false,
            }
        case types.rejected(types.SAVE_SETTINGS):
            return {
                ...state,
                saving: false,
                error: true
            }
        case types.pending(types.FETCH_SETTINGS):
            return {
                ...state,
                loading: true,
                error: false,
                changing: false
            }
        case types.fulfilled(types.FETCH_SETTINGS):
            return {
                ...state,
                ...action.payload,
                loading: false
            }
        case types.rejected(types.FETCH_SETTINGS):
            return {
                ...state,
                loading: false,
                error: true
            }
        case types.CHANGE_SETTINGS:
            return {
                ...state,
                ...action.payload,
                changing: true
            }
        case types.RETRIEVE_SETTINGS:
            return {
                ...state,
                ...action.payload,
                changing: false
            }
        default:
            return state;
    }
}


export default persistReducer(settingsPersistConfig, reducer);