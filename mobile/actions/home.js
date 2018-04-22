import { createAction } from 'redux-actions';
import cio from 'cheerio-without-node-native';
import axios from 'react-native-axios';
import _ from 'lodash';

import * as types from './types';


export const fetchStatus = createAction(
    types.FETCH_STATUS,
    async ({account, password}) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (account === 'benson.lee' && password === '27571256') {
                    let data = [
                        { date: '04-22(日)', checkInTime: ' ', checkOutTime: ' ' },
                        { date: '04-21(六)', checkInTime: ' ', checkOutTime: ' ' },
                        { date: '04-20(五)', checkInTime: ' ', checkOutTime: ' ' },
                        { date: '04-19(四)', checkInTime: ' ', checkOutTime: ' ' },
                        { date: '04-18(三)', checkInTime: ' ', checkOutTime: ' ' }
                    ];
                    resolve(data);
                } else {
                    reject([]);
                }
            }, 3000);
        });

        // try {
        //  res = await fetch("https://femascloud.com/techlink/Accounts/login", {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/x-www-form-urlencoded'
        //     },
        //     body: `data[Account][username]=${account}&data[Account][passwd]=${password}`
        // });
        // const text = await res.text();
        // const $ = cio.load(text);
        // const statusList = [];
        // let date, checkInTime, checkOutTime;
        // $('div#att_status_listing .ebtr').each((index, tr) => {
        //     date = checkInTime = checkOutTime = null;
        //     $(tr).children('.ebtd').each((index, td) => {
        //         let { data } = td.children[0];
        //         switch (index) {
        //             case 0: // 日期
        //                 date = data;
        //                 break;
        //             case 2: // 上班
        //                 checkInTime = data;
        //                 break;
        //             case 3: // 下班
        //                 checkOutTime = data;
        //                 break;
        //             default:
        //             //TODO OTHERS
        //         }
        //     });
        //     statusList.push({ date, checkInTime, checkOutTime });
        // });

        // return statusList;
    // } catch (e) {
    //     throw new Error('Login failed');
    // }
    }
);

export const checkIn = createAction(
    types.CHECK_IN,
    async (
        { account, password, companyName, latitude, longitude }, 
        data, 
        type
    ) => {
        const queryUrl = 'https://femashr-app-api.femascloud.com/'
                + companyName + '/fsapi/V1/punch_card_query.json';
        let res = await axios.post(queryUrl, data);
        const { buttons } = res.data.response;
        if (!buttons) {
            throw new Error('Check Failed.');
        }
        const action = _.map(buttons, ({value}) => value)[type];
        const checkUrl = 'https://femashr-app-api.femascloud.com/'
                + companyName + '/fsapi/V1/punch_card.json';
        res = await axios.post(checkUrl, {
            ...data, latitude, longitude, value: action
        });
        return {status: res.data.response.status};
    }
);
