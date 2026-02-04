import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export interface Invoice {
    id: number;
    memberId: number;
    sessionId?: number | null;
    parkingPlanId?: number | null;
    type: 'MEMBERSHIP' | 'PARKING_FEE' | string;
    invoiceCode: string;
    amount: number;
    description: string;
    status: 'UNPAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
    paymentDeadline: string;
    createdAt: string;
    paidAt?: string | null;
}

export const apiInvoice = createApi({
    reducerPath: "apiInvoice",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/invoices`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Invoice"],
    endpoints: (builder) => ({
        getInvoicesByMember: builder.query<Invoice[], number>({
            query: (memberId) => `member/${memberId}`,
            providesTags: ["Invoice"],
        }),
        getUnpaidInvoicesByMember: builder.query<Invoice[], number>({
            query: (memberId) => `member/${memberId}/unpaid`,
            providesTags: ["Invoice"],
        }),
        getInvoiceByCode: builder.query<Invoice, string>({
            query: (invoiceCode) => `code/${invoiceCode}`,
            providesTags: ["Invoice"],
        }),
        createMembershipInvoice: builder.mutation<void, number>({
            query: (memberId) => ({
                url: `membership/${memberId}`,
                method: "POST",
            }),
            invalidatesTags: ["Invoice"],
        }),
        markInvoicePaid: builder.mutation<void, number>({
            query: (invoiceId) => ({
                url: `${invoiceId}/mark-paid`,
                method: "PUT",
            }),
            invalidatesTags: ["Invoice"],
        }),
        cancelInvoice: builder.mutation<void, number>({
            query: (invoiceId) => ({
                url: `${invoiceId}/cancel`,
                method: "PUT",
            }),
            invalidatesTags: ["Invoice"],
        }),
        getAllInvoices: builder.query<Invoice[], void>({
            query: () => "",
            providesTags: ["Invoice"],
        }),
        createPayment: builder.mutation<{ payUrl: string }, number>({
            query: (invoiceId) => ({
                url: `create-payment?invoiceId=${invoiceId}`,
                method: "POST",
            }),
        }),
        getInvoicesByUser: builder.query<Invoice[], number>({
            query: (userId) => `user/${userId}`,
            providesTags: ["Invoice"],
        }),
    }),
});

export const {
    useGetInvoicesByMemberQuery,
    useGetUnpaidInvoicesByMemberQuery,
    useGetInvoiceByCodeQuery,
    useCreateMembershipInvoiceMutation,
    useMarkInvoicePaidMutation,
    useCancelInvoiceMutation,
    useGetAllInvoicesQuery,
    useCreatePaymentMutation,
    useGetInvoicesByUserQuery,
} = apiInvoice;
