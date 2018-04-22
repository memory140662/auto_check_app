import { createAction } from 'redux-actions';
import axios from 'react-native-axios';

import * as types from './types';

export {
    changeSettings,
    saveSettings,
    fetchSettings,
    retrieveSettings
} from './settings';

export {
    fetchStatus,
    checkIn
} from './home';

export const login = createAction(
    types.LOGIN,
    async ({account, password, companyName}) => {
        const url = 'https://femashr-app-api.femascloud.com/'
            + companyName
            + '/fsapi/V1';
        let res = await axios.post(url + '/login.json', {
            account: account,
            password: password,
            companyName: companyName,
            isAccount: 'true',
        });

        if (res.data.response.status === 'fail') {
            throw new Error('Login failed');
        }
        return { token , userId, accountId } = res.data.response;
    }
);