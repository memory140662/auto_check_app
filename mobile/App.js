import React from 'react';
import { Provider, connect } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store';
import AppNavigator from './components/Navigator';

const app = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor} >
      <AppNavigator />
    </PersistGate>
  </Provider>
);

export default app;



