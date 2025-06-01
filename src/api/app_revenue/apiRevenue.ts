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
    parkingLotId: number;
    parkingLotName: string;
    totalSessions: number;
    totalRevenue: number;
    averageDurationMinutes: number;
    date: string;
    details: {
        time: string;
        vehicleType: 'car' | 'motorbike';
        licensePlate: string;
        amount: number;
        duration: string;
    }[];
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
        getRevenue: builder.query<Revenue[], { parkingLotId?: number; startDate: string; endDate: string }>({
            query: ({ parkingLotId, startDate, endDate }) => ({
                url: '',
                params: {
                    ...(parkingLotId && { parkingLotId }),
                    startDate,
                    endDate
                }
            }),
            providesTags: ['Revenue'],
        }),
    }),
});

export const {
    useGetRevenueQuery,
} = apiRevenue;