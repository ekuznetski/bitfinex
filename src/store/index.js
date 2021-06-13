import { combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { appStoreReducer, initAppStore } from "./_app.reducer";
import { dataStoreReducer, initDataStore } from "./_data.reducer";

export const reducers = combineReducers({
  data: dataStoreReducer,
  app: appStoreReducer,
});
export const initStore = {
  data: initDataStore,
  app: initAppStore,
};

// const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  reducers,
  {},
  composeWithDevTools()
  // composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Object.keys(sagaMiddlewareRunners).forEach((runner) => {
//   sagaMiddleware.run(sagaMiddlewareRunners[runner]);
// });

// export * from "./store.enum";
// export * from "./actions";
// export * from "./store.interface";
// export * from "./_app.reducer";
// export * from "./_data.reducer";
