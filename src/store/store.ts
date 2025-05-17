import { configureStore } from '@reduxjs/toolkit';
import { apiParkinglot } from '../api/app_parkinglot/apiParkinglot';
import { apiLogin } from '../api/app_home/apiAuth';
import { employeeApi } from '../api/app_employee/apiEmployee';

export const store = configureStore({
    reducer: {
        [apiParkinglot.reducerPath]: apiParkinglot.reducer,
        [apiLogin.reducerPath]: apiLogin.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiParkinglot.middleware)
            .concat(apiLogin.middleware)
            .concat(employeeApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 