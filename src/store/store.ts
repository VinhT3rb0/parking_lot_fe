import { configureStore } from '@reduxjs/toolkit';
import { apiParkinglot } from '../api/app_parkinglot/apiParkinglot';
import { apiLogin } from '../api/app_home/apiAuth';
import { employeeApi } from '../api/app_employee/apiEmployee';
import { employeeShiftsApi } from '../api/app_employee/apiEmployeeShifts';
import { apiParking } from '../api/app_parking/apiParking';
import { shiftsApi } from '../api/app_employee/apiShifts';
import { attendanceApi } from '../api/app_employee/apiAttendance';
import { apiRevenue } from '../api/app_revenue/apiRevenue';
import { apiMember } from '../api/app_member/apiMember';
import { apiParkingPlan } from '../api/app_parkingPlan/apiParkingPlan';
import { apiPayment } from '../api/app_payment/apiPayment';
import { apiInvoice } from '../api/app_invoice/apiInvoice';

export const store = configureStore({
    reducer: {
        [apiParkinglot.reducerPath]: apiParkinglot.reducer,
        [apiLogin.reducerPath]: apiLogin.reducer,
        [employeeApi.reducerPath]: employeeApi.reducer,
        [employeeShiftsApi.reducerPath]: employeeShiftsApi.reducer,
        [apiParking.reducerPath]: apiParking.reducer,
        [shiftsApi.reducerPath]: shiftsApi.reducer,
        [attendanceApi.reducerPath]: attendanceApi.reducer,
        [apiRevenue.reducerPath]: apiRevenue.reducer,
        [apiMember.reducerPath]: apiMember.reducer,
        [apiParkingPlan.reducerPath]: apiParkingPlan.reducer,
        [apiPayment.reducerPath]: apiPayment.reducer,
        [apiInvoice.reducerPath]: apiInvoice.reducer,

    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(apiParkinglot.middleware)
            .concat(apiLogin.middleware)
            .concat(employeeApi.middleware)
            .concat(employeeShiftsApi.middleware)
            .concat(apiParking.middleware)
            .concat(shiftsApi.middleware)
            .concat(attendanceApi.middleware)
            .concat(apiRevenue.middleware)
            .concat(apiMember.middleware)
            .concat(apiParkingPlan.middleware)
            .concat(apiPayment.middleware)
            .concat(apiInvoice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 