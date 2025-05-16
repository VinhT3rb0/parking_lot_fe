import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

interface LoginRequest {
    username: string;
    password: string;
}

export interface UserData {
    status: string;
    message: string;
    data: {
        id: number;
        fullname: string | null;
        phoneNumber: string | null;
        dateOfBirth: string | null;
        username: string;
        email: string;
    }
}

interface LoginResponse {
    status: string;
    message: string;
    data: {
        token: string;
        data: {
            id: number;
            fullname: string | null;
            phoneNumber: string | null;
            dateOfBirth: string | null;
            username: string;
            email: string;
        }
    }
}

interface RegisterRequest {
    username: string;
    password: string;
    email: string;
    role: string;
    active: boolean;
}

interface VerifyRequest {
    email: string;
    verificationCode: string;
}

interface ResendVerificationRequest {
    email: string;
}

export const apiLogin = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/users/`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
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
        getCurrentUser: builder.query<UserData, void>({
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
        resendVerification: builder.mutation<void, ResendVerificationRequest>({
            query: (data) => ({
                url: `resend-verification/${data.email}`,
                method: "POST",
                body: data,
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
    useResendVerificationMutation,
} = apiLogin;
