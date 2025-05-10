import { configureStore } from '@reduxjs/toolkit';
import { apiLogin } from '../api/app_home/apiAuth';

export const store = configureStore({
    reducer: {
        [apiLogin.reducerPath]: apiLogin.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiLogin.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 