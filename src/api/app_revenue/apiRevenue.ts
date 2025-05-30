import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

interface Revenue {
    id: number;
    name: string;
    description: string;
    amount: number;
    createdAt: string;
    updatedAt: string;
}

export const apiRevenue = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/revenue-stats`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Revenue'],
    endpoints: (builder) => ({
        getRevenue: builder.query<Revenue, void>({
            query: () => '',
            providesTags: ['Revenue'],
        }),
        getRevenueByDateRange: builder.query<Revenue, { startDate: string, endDate: string }>({
            query: ({ startDate, endDate }) => `/date-range?startDate=${startDate}&endDate=${endDate}`,
            providesTags: ['Revenue'],
        }),
    }),
});

export const {
    useGetRevenueQuery,
    useGetRevenueByDateRangeQuery,
} = apiRevenue;