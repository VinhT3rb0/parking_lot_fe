import { configureStore } from '@reduxjs/toolkit';
import { apiParkinglot } from '../api/app_parkinglot/apiParkinglot';
import { apiLogin } from '../api/app_home/apiAuth';

export const store = configureStore({
    reducer: {
        [apiParkinglot.reducerPath]: apiParkinglot.reducer,
        [apiLogin.reducerPath]: apiLogin.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiParkinglot.middleware)
            .concat(apiLogin.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 