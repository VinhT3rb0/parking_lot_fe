import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export const apiPayment = createApi({
    reducerPath: "apiPayment",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/payments`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Payment"],
    endpoints: (builder) => ({
        getMemberPaymentHistory: builder.query<any, number>({
            query: (memberId) => `member/${memberId}/history`,
        }),
        getInvoicePaymentHistory: builder.query<any, number>({
            query: (invoiceId) => `invoices/${invoiceId}/history`,
        }),
        getMemberInvoices: builder.query<any, number>({
            query: (memberId) => `invoices/member/${memberId}`,
        }),
        getMemberUnpaidInvoices: builder.query<any, number>({
            query: (memberId) => `invoices/member/${memberId}/unpaid`,
        }),
        createMemberPayment: builder.mutation<{ payUrl: string }, { memberId: number; data: any }>({
            query: ({ memberId, data }) => ({
                url: `member/${memberId}`,
                method: "POST",
                body: data,
            }),
        }),
        remindPayment: builder.mutation<void, number>({
            query: (memberId) => ({
                url: `member/${memberId}/remind`,
                method: "POST",
            }),
        }),
        confirmInvoicePayment: builder.mutation<void, number>({
            query: (invoiceId) => ({
                url: `invoice/${invoiceId}/confirm`,
                method: "POST",
            }),
        }),
        checkOverdue: builder.mutation<void, void>({
            query: () => ({
                url: `check-overdue`,
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetMemberPaymentHistoryQuery,
    useGetInvoicePaymentHistoryQuery,
    useGetMemberInvoicesQuery,
    useGetMemberUnpaidInvoicesQuery,
    useCreateMemberPaymentMutation,
    useRemindPaymentMutation,
    useConfirmInvoicePaymentMutation,
    useCheckOverdueMutation,
} = apiPayment;
