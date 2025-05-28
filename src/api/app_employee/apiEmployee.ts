import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';
import { getAccessTokenFromCookie } from '../../utils/token';

// Types
export interface Employee {
    id: string;
    name: string;
    email: string;
    phone: string;
    parkingLotId: number;
    parkingLotName: string;
    userId: number;
    userResponse: {
        id: number;
        fullname: string;
        phoneNumber: string;
        dateOfBirth: string;
        username: string;
        email: string;
    };
    joinDate: string;
    status: string;
}

export interface CreateEmployeeRequest {
    parkingLotId: number;
    parkingLotName: string;
    userDTO: {
        username: string;
        password: string;
        email: string;
        fullname: string;
        dateOfBirth: string;
        phoneNumber: string;
        role: string;
    };
    joinDate: string;
    status: string;
}

export interface UpdateEmployeeRequest {
    parkingLotId?: number;
    parkingLotName?: string;
    userDTO?: {
        email?: string;
        fullname?: string;
        dateOfBirth?: string;
        phoneNumber?: string;
        role?: string;
    };
    status?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
// API
export const employeeApi = createApi({
    reducerPath: 'employeeApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/employees`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Employee'],
    endpoints: (builder) => ({
        // Get all employees
        getAllEmployees: builder.query<Employee[], string>({
            query: (name = '') => `?name=${encodeURIComponent(name)}`,
            providesTags: ['Employee'],
        }),

        // Get employee by ID
        getEmployeeById: builder.query<Employee, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Employee', id }],
        }),
        getEmployeeByUserId: builder.query<Employee, string>({
            query: (userId) => `/user/${userId}`,
            providesTags: (result, error, userId) => [{ type: 'Employee', userId }],
        }),
        // Create new employee
        createEmployee: builder.mutation<Employee, CreateEmployeeRequest>({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),

        // Update employee
        updateEmployee: builder.mutation<Employee, { id: string; data: UpdateEmployeeRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Employee', id }],
        }),

        // Delete employee
        deleteEmployee: builder.mutation<void, string>({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Employee'],
        }),

        // Change employee password
        changePassword: builder.mutation<void, { id: string; data: ChangePasswordRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}/change-password`,
                method: 'POST',
                body: data,
            }),
        }),

        // Get current employee profile
        getCurrentEmployee: builder.query<Employee, void>({
            query: () => '/me',
            providesTags: ['Employee'],
        }),
        // Update current employee profile
        updateCurrentEmployee: builder.mutation<Employee, UpdateEmployeeRequest>({
            query: (data) => ({
                url: '/me',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Employee'],
        }),
    }),
});

// Export hooks
export const {
    useGetAllEmployeesQuery,
    useGetEmployeeByIdQuery,
    useGetEmployeeByUserIdQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useChangePasswordMutation,
    useGetCurrentEmployeeQuery,
    useUpdateCurrentEmployeeMutation,
} = employeeApi;
