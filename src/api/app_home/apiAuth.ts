import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

interface LoginRequest {
    username: string;
    password: string;
}

interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        username: string;
        email: string;
        role: string;
    };
}

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    role: string;
    active: boolean;
}

interface VerifyRequest {
    email: string;
    verificationCode: string;
}

export const apiLogin = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/users/`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            console.log('API URL:', API_URL);
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    reducerPath: "loginApi",
    tagTypes: ["Auth"],
    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => ({
                url: "login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["Auth"],
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: "logout",
                method: "POST",
            }),
            invalidatesTags: ["Auth"],
        }),
        getCurrentUser: builder.query<LoginResponse["user"], void>({
            query: () => "me",
            providesTags: ["Auth"],
        }),
        register: builder.mutation<void, RegisterRequest>({
            query: (userData) => ({
                url: "create",
                method: "POST",
                body: userData,
            }),
        }),
        verifyEmail: builder.mutation<void, VerifyRequest>({
            query: (verifyData) => ({
                url: "verify",
                method: "POST",
                body: verifyData,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
    useRegisterMutation,
    useVerifyEmailMutation,
} = apiLogin;
