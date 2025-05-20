import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_URL } from '../../config';
import { getAccessTokenFromCookie } from '../../utils/token';

// Types
export interface Employee {
    id: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    position: 'CUSTOMER' | 'OWNER' | 'EMPLOYEE';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface CreateEmployeeRequest {
    username: string;
    password: string;
    fullName: string;
    email: string;
    phone: string;
}

export interface UpdateEmployeeRequest {
    fullName?: string;
    email?: string;
    phone?: string;
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
        getAllEmployees: builder.query<Employee[], void>({
            query: () => '',
            providesTags: ['Employee'],
        }),

        // Get employee by ID
        getEmployeeById: builder.query<Employee, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Employee', id }],
        }),

        // Create new employee
        createEmployee: builder.mutation<Employee, CreateEmployeeRequest>({
            query: (data) => ({
                url: '',
                method: 'POST',
                body: { ...data, position: 'EMPLOYEE' },
            }),
            invalidatesTags: ['Employee'],
        }),

        // Update employee
        updateEmployee: builder.mutation<Employee, { id: string; data: UpdateEmployeeRequest }>({
            query: ({ id, data }) => ({
                url: `/${id}`,
                method: 'PATCH',
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
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useChangePasswordMutation,
    useGetCurrentEmployeeQuery,
    useUpdateCurrentEmployeeMutation,
} = employeeApi;
