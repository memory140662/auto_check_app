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
            status = await pc.checkIn();
        } else if (now.getHours() >= 18) {
            status = await pc.checkOut();
        }
        return status;
    } catch (e) {
        return { status: 'failed' };
    }
}

const wirteLog = (status, account, password, companyName, latitude, longitude, path) => {
    return app.database()
        .ref('users').child(path).set({
            account, password, companyName, latitude, longitude,
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
    _.mapKeys(snapshot.val(), ({ account, password, companyName, latitude, longitude }, path) => {
        let task = check(account, password, companyName, latitude, longitude)
            .then(({ status }) => {
                return wirteLog(status, account, password, companyName, latitude, longitude, path);
            }).catch(err => {
                return wirteLog({ status: 'failed:' + err }, account, password, companyName, latitude, longitude, path);
            });
    });
}


main().then(async () => {
    while (tasks.length) {
        let task = tasks.pop();
        await task;
    }
    console.log('finish app!');
    process.exit(0);
});