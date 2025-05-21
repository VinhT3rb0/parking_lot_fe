import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';
import { getAccessTokenFromCookie } from '../../utils/token';

// Types
export interface TimeOfDay {
    hour: number;
    minute: number;
    second: number;
    nano: number;
}

export interface Shift {
    id: number;
    shiftName: string;
    startTime: string;
    endTime: string;
    description: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateShiftRequest {
    shiftName: string;
    startTime: string;
    endTime: string;
    description: string;
    status: string;
}

export interface UpdateShiftRequest {
    shiftName?: string;
    startTime?: string;
    endTime?: string;
    description?: string;
    status?: string;
}

// API
export const shiftsApi = createApi({
    reducerPath: 'shiftsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/shifts`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Shift'],
    endpoints: (builder) => ({
        // Get all shifts
        getAllShifts: builder.query<Shift[], string>({
            query: () => '',
            providesTags: ['Shift'],
        }),

        // Get shift by ID
        getShiftById: builder.query<Shift, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Shift', id }],
        }),

        // Create new shift
        createShift: builder.mutation<Shift, CreateShiftRequest>({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Shift'],
        }),

        // Update shift
        updateShift: builder.mutation<Shift, { id: string; data: UpdateShiftRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Shift', id }],
        }),

        // Delete shift
        deleteShift: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Shift'],
        }),
    }),
});

// Export hooks
export const {
    useGetAllShiftsQuery,
    useGetShiftByIdQuery,
    useCreateShiftMutation,
    useUpdateShiftMutation,
    useDeleteShiftMutation,
} = shiftsApi;
