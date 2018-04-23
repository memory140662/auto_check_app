const firebase = require('firebase');
const { config } = require('./config');
const _ = require('lodash');
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
        pushCard = await pushCard.login();
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

const test = (i) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(i)
        }, 3000 * Math.random());
    });
}

const main = async () => {
    let pushCard;
    let snapshot = await app.database()
        .ref('users')
        .orderByChild(`days/${DAYS[now.getDay()]}`)
        .equalTo(true)
        .once('value');
    _.mapKeys(snapshot.val(), ({ account, password, companyName, latitude, longitude, days }, path) => {
        let task = check(account, password, companyName, latitude, longitude)
            .then(({ status }) => {
                return wirteLog(status, account, password, companyName, latitude, longitude, path, days);
            }).catch(err => {
                return wirteLog({ status: 'failed:' + err }, account, password, companyName, latitude, longitude, path, days);
            });
        tasks.push(task);
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
