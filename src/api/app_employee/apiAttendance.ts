import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';
import { getAccessTokenFromCookie } from '../../utils/token';

// Types
export interface Attendance {
    id: string;
    employeeId: string;
    employeeName: string;
    checkInTime: string;
    checkOutTime: string | null;
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY_LEAVE';
    note: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface ShiftAttendance {
    employeeShiftId: number;
    employeeId: number;
    employeeName: string;
    shiftName: string;
    shiftTime: string;
    workDate: string;
    checkInTime: string;
    checkOutTime: string;
    notes: string;
    status: string;
    parkingLotId: number;
    parkingLotName: string;
}

export interface CreateAttendanceRequest {
    note?: string;
}

export interface CreateShiftAttendanceRequest {
    employeeId: number;
    employeeShiftId: number;
    shiftName: string;
    shiftTime: string;
    workDate: string;
    notes?: string;
    parkingLotId: number;
}

export interface UpdateAttendanceRequest {
    note?: string;
}

// API
export const attendanceApi = createApi({
    reducerPath: 'attendanceApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/attendances`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),

    tagTypes: ['Attendance'],
    endpoints: (builder) => ({
        getAllAttendances: builder.query<Attendance[], { startDate?: string; endDate?: string }>({
            query: ({ startDate, endDate }) => {
                let url = '';
                if (startDate && endDate) {
                    url = `?startDate=${startDate}&endDate=${endDate}`;
                }
                return url;
            },
            providesTags: ['Attendance'],
        }),

        getAttendancesByEmployeeId: builder.query<Attendance[], { employeeId: string; startDate?: string; endDate?: string }>({
            query: ({ employeeId, startDate, endDate }) => {
                let url = `/employee/${employeeId}`;
                if (startDate && endDate) {
                    url += `?startDate=${startDate}T00:00:00&endDate=${endDate}T23:59:59`;
                }
                return url;
            },
            providesTags: (result, error, { employeeId }) => [{ type: 'Attendance', id: employeeId }],
        }),

        getAttendanceById: builder.query<Attendance, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Attendance', id }],
        }),

        checkIn: builder.mutation<Attendance, { employeeShiftId: number; data?: CreateAttendanceRequest }>({
            query: ({ employeeShiftId, data }) => ({
                url: `/check-in?employeeShiftId=${employeeShiftId}`,
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance'],
        }),

        checkOut: builder.mutation<Attendance, string>({
            query: (id) => ({
                url: `/check-out/${id}`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Attendance', id }],
        }),

        updateAttendance: builder.mutation<Attendance, { id: string; data: UpdateAttendanceRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Attendance', id }],
        }),

        deleteAttendance: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Attendance'],
        }),

        createShiftAttendance: builder.mutation<ShiftAttendance, CreateShiftAttendanceRequest>({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Attendance'],
        }),
    }),
});

// Export hooks
export const {
    useGetAllAttendancesQuery,
    useGetAttendancesByEmployeeIdQuery,
    useGetAttendanceByIdQuery,
    useCheckInMutation,
    useCheckOutMutation,
    useUpdateAttendanceMutation,
    useDeleteAttendanceMutation,
    useCreateShiftAttendanceMutation,
} = attendanceApi;
