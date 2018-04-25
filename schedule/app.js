const firebase = require('firebase');
const request = require('request');
const _ = require('lodash');

const { config, govOpen } = require('./config');
const PushCard = require('./Models/PushCard');

const DAYS = [
    'sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'
];

let now = new Date();

const tasks = [];

const app = firebase.initializeApp(config);

const check = async (account, password, companyName, latitude, longitude) => {
    try {
        let pushCard = new PushCard(account, password, companyName, latitude, longitude);
        await pushCard.login();
        let status = null;
        if (now.getHours() <= 10) {
            status = await pushCard.checkIn();
        } else if (now.getHours() >= 18) {
            status = await pushCard.checkOut();
        }
        return status;
    } catch (e) {
        console.error('check err:', e);
        return { status: 'failed' };
    }
}

const wirteLog = (status, account, password, companyName, latitude, longitude, path, days) => {
    return app.database()
        .ref('users').child(path).set({
            account, password, companyName, latitude, longitude, days,
            logger: {
                status,
                time: now.toLocaleString()
            }
        });
}

let holiday = null;
const checkHoliday = async (today) => {
    if (holiday !== null) {
        return holiday;
    }
    return new Promise((resolve, reject) => {
        request.get(govOpen.calendarUrl, (err, res, body) => {
            if (err || res.statusCode !== 200) {
                console.err('checkHoliday error: ', res.statusCode, err);
                return reject('checkHoliday error:' + (err || 'status code: ' + res.statusCode ));
            }
            const { success, result: { records } } = JSON.parse(body);
            if (success) {
                holiday = _.filter(records, ({ date, isHoliday }) =>
                    date === `${today.getFullYear()}/${today.getMonth() + 1}/${today.getDate()}`
                    && isHoliday === '是'
                ).length > 0;
                resolve(holiday);
            } else {
                reject('check holiday falied');
            }
        });
    });
}

const main = async () => {
    let pushCard;
    let snapshot = await app.database()
        .ref('users')
        .orderByChild(`days/${DAYS[now.getDay()]}`)
        .equalTo(true)
        .once('value');
    let isHoliday;
    _.mapKeys(snapshot.val(), async ({ account, password, companyName, latitude, longitude, days, isCalendar }, path) => {
        try {
            isHoliday = null;
            if (isCalendar) {
                isHoliday = await checkHoliday(now);
            }
            if (isHoliday !== false) {
                let task = check(account, password, companyName, latitude, longitude)
                    .then(({ status }) => {
                        return wirteLog(status, account, password, companyName, latitude, longitude, path, days);
                    }).catch(err => {
                        return wirteLog({ status: 'failed:' + err }, account, password, companyName, latitude, longitude, path, days);
                    });
                tasks.push(task);
            }
        } catch (e) {
            return wirteLog({ status: 'failed:' + e }, account, password, companyName, latitude, longitude, path, days);
        }
    });
    return {};
}

console.log('start app!', new Date().toLocaleString());
main().then(async () => {
    console.log("count:", tasks.length);
    while (tasks.length) {
        let task = tasks.pop();
        await task;
    }
    console.log('finish app!', new Date().toLocaleString());
    process.exit(0);
}, err => console.log("main err:", err));
