import * as types from '../actions/types';

const initState = {
    statusList: null,
    loading: false,
    error: false,
    checkError: false
}

export default (state = initState, action) => {
    switch (action.type) {
        case types.pending(types.FETCH_STATUS):
            return {
                ...state,
                statusList: null,
                loading: true,
                error: false
            }
        case types.fulfilled(types.FETCH_STATUS):
            return {
                ...state,
                loading: false,
                statusList: action.payload
            }
        case types.rejected(types.FETCH_STATUS):
            return {
                ...state,
                loading: false,
                error: true
            }
        case types.pending(types.CHECK_IN):
            return {
                ...state,
                checkError: false
            }
        case types.rejected(types.CHECK_IN):
            return {
                ...state,
                checkError: true
            }
        default:
            return state;
    }
}

