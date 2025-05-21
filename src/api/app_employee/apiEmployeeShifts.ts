import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_URL } from "../../config";
import { getAccessTokenFromCookie } from "../../utils/token";

export interface EmployeeShifts {
    employeeId: number;
    employeeName: string;
    shiftId: number;
    shiftName: string;
    shiftTime: string;
    workDate: string;
    dayOfWeek: string;
    isRecurring: boolean;
    status: string;
    parkingLotId: number;
    parkingLotName: string;
}
export interface CreateEmployeeShiftsRequest {
    shiftId: string;
    shiftName: string;
    shiftType: string;
    employeeId: number;
    employeeName: string;
    shiftTime: string;
    workDate: string;
    dayOfWeek: string;
    isRecurring: boolean;
    status: string;
    parkingLotId: number;
}

export const employeeShiftsApi = createApi({
    reducerPath: 'employeeShiftsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/employee-shifts`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['EmployeeShifts'],
    endpoints: (builder) => ({
        createEmployeeShifts: builder.mutation<CreateEmployeeShiftsRequest, CreateEmployeeShiftsRequest>({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['EmployeeShifts'],
        }),
        getEmployeeShifts: builder.query<EmployeeShifts[], void>({
            query: () => '',
            providesTags: ['EmployeeShifts'],
        }),
        getEmployeeShiftById: builder.query<EmployeeShifts, { id: number }>({
            query: ({ id }) => `/${id}`,
            providesTags: ['EmployeeShifts'],
        }),
        getEmployeeShiftByShiftId: builder.query<EmployeeShifts[], { shiftId: number }>({
            query: ({ shiftId }) => `/shift/${shiftId}`,
            providesTags: ['EmployeeShifts'],
        }),
        getEmployeeShiftByParkingLotId: builder.query<EmployeeShifts[], { parkingLotId: number, workDate: string }>({
            query: ({ parkingLotId, workDate }) => `/parking-lot/${parkingLotId}/date/${workDate}`,
            providesTags: ['EmployeeShifts'],
        }),
        getEmployeeShiftByEmployeeId: builder.query<EmployeeShifts[], { employeeId: number }>({
            query: ({ employeeId }) => `/employee/${employeeId}`,
            providesTags: ['EmployeeShifts'],
        }),
        getEmployeeShiftByDate: builder.query<EmployeeShifts[], { workDate: string }>({
            query: ({ workDate }) => `/date/${workDate}`,
            providesTags: ['EmployeeShifts'],
        }),
        generateRecurringShifts: builder.mutation<void, { fromDate: string, toDate: string }>({
            query: ({ fromDate, toDate }) => ({
                url: `/generate-recurring-shifts?fromDate=${fromDate}&toDate=${toDate}`,
                method: 'POST',
            }),
            invalidatesTags: ['EmployeeShifts'],
        }),
        updateEmployeeShift: builder.mutation<void, { id: number, data: EmployeeShifts }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['EmployeeShifts'],
        }),
        deleteEmployeeShift: builder.mutation<void, { id: number }>({
            query: ({ id }) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const {
    useCreateEmployeeShiftsMutation,
    useGetEmployeeShiftsQuery,
    useGenerateRecurringShiftsMutation,
    useUpdateEmployeeShiftMutation,
    useGetEmployeeShiftByShiftIdQuery,
    useGetEmployeeShiftByIdQuery,
    useGetEmployeeShiftByEmployeeIdQuery,
    useGetEmployeeShiftByDateQuery,
    useGetEmployeeShiftByParkingLotIdQuery,
    useDeleteEmployeeShiftMutation,
} = employeeShiftsApi;
