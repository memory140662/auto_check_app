import { createAction } from 'redux-actions';
import firebase from 'react-native-firebase';
import _ from 'lodash';

import * as types from './types';

const transformAccout = account => (
    _.chain(account)
    .replace(/\./g, '_')
    .toUpper()
    .value()
);

export const changeSettings = createAction(
    types.CHANGE_SETTINGS,
    settings => settings
);

export const saveSettings = createAction(
    types.SAVE_SETTINGS,
    async settings => {
        try {
            await firebase.database()
                .ref('users/' + transformAccout(settings.account))
                .set(settings);
            return settings;
        } catch (e) {
            throw new Error('');
        }
    }
)

export const fetchSettings = createAction(
    types.FETCH_SETTINGS,
    async account => {
        const res = await firebase.database()
            .ref('users/' + transformAccout(account))
            .once();
        return res.val();
    }
)

export const retrieveSettings = createAction(
    types.RETRIEVE_SETTINGS,
    settings => settings
)