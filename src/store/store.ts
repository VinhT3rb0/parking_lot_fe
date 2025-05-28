import { configureStore } from '@reduxjs/toolkit';
import { apiParkinglot } from '../api/app_parkinglot/apiParkinglot';
import { apiLogin } from '../api/app_home/apiAuth';
import { employeeApi } from '../api/app_employee/apiEmployee';
import { employeeShiftsApi } from '../api/app_employee/apiEmployeeShifts';
import { apiParking } from '../api/app_parking/apiParking';
import { shiftsApi } from '../api/app_employee/apiShifts';
import { attendanceApi } from '../api/app_employee/apiAttendance';

export const store = configureStore({
    reducer: {
        [apiParkinglot.reducerPath]: apiParkinglot.reducer,
        [apiLogin.reducerPath]: apiLogin.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [employeeShiftsApi.reducerPath]: employeeShiftsApi.reducer,
        [apiParking.reducerPath]: apiParking.reducer,
        [shiftsApi.reducerPath]: shiftsApi.reducer,
        [attendanceApi.reducerPath]: attendanceApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiParkinglot.middleware)
            .concat(apiLogin.middleware)
            .concat(employeeApi.middleware)
            .concat(employeeShiftsApi.middleware)
            .concat(apiParking.middleware)
            .concat(shiftsApi.middleware)
            .concat(attendanceApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 