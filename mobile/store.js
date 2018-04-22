import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import { persistStore } from 'redux-persist';

import reducers from './reducers';

let middlewares = [
    thunk, promise()
];

export const store = createStore(
    reducers,
    applyMiddleware(
        ...middlewares
    )
);

export const persistor = persistStore(store);