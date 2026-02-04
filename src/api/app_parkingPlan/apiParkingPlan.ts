import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export interface ParkingPlan {
    id: number;
    name: string;
    price: number;
    priceUnit: string; // Changed from period to priceUnit based on JSON ("DAY", "HOUR")
    description: string;
    // features: string[]; // Removed
    isPopular: boolean;
    isActive: boolean;
    // New fields from JSON
    isUnlimitedParking: boolean;
    hasFixedSpot: boolean;
    hasValetService: boolean;
    hasCarWash: boolean;
    hasCoveredParking: boolean;
    hasSecurity247: boolean;
    planType?: string;
    parkingLotId?: number;
    parkingLotName?: string;
    sortOrder?: number;
}

export interface CreateParkingPlanRequest {
    name: string;
    price: number;
    priceUnit: string;
    description: string;
    isPopular: boolean;
    isActive: boolean;
    isUnlimitedParking: boolean;
    hasFixedSpot: boolean;
    hasValetService: boolean;
    hasCarWash: boolean;
    hasCoveredParking: boolean;
    hasSecurity247: boolean;
    parkingLotId?: number;
    planType: string;
    sortOrder: number;
}

export interface UpdateParkingPlanRequest {
    name?: string;
    price?: number;
    priceUnit?: string;
    description?: string;
    isPopular?: boolean;
    isActive?: boolean;
    isUnlimitedParking?: boolean;
    hasFixedSpot?: boolean;
    hasValetService?: boolean;
    hasCarWash?: boolean;
    hasCoveredParking?: boolean;
    hasSecurity247?: boolean;
    parkingLotId?: number;
    planType?: string;
    sortOrder?: number;
}

export const apiParkingPlan = createApi({
    reducerPath: "apiParkingPlan", // Unique key for the reducer
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/parking-plans`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ["ParkingPlan"],
    endpoints: (builder) => ({
        getAllParkingPlans: builder.query<ParkingPlan[], { parkingLotId?: number } | void>({
            query: (params) => {
                if (params && 'parkingLotId' in params && params.parkingLotId) {
                    return `/parking-lot/${params.parkingLotId}`;
                }
                return "";
            },
            providesTags: ["ParkingPlan"],
        }),
        getParkingPlansByLotId: builder.query<ParkingPlan[], number>({
            query: (parkingLotId) => `/parking-lot/${parkingLotId}`,
            providesTags: ["ParkingPlan"],
        }),
        getParkingPlanById: builder.query<ParkingPlan, number>({
            query: (id) => `${id}`,
            providesTags: ["ParkingPlan"],
        }),
        getPopularParkingPlans: builder.query<ParkingPlan[], void>({
            query: () => "popular",
            providesTags: ["ParkingPlan"],
        }),
        createParkingPlan: builder.mutation<ParkingPlan, CreateParkingPlanRequest>({
            query: (plan) => ({
                url: "",
                method: "POST",
                body: plan,
            }),
            invalidatesTags: ["ParkingPlan"],
        }),
        updateParkingPlan: builder.mutation<ParkingPlan, { id: number; data: UpdateParkingPlanRequest }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ParkingPlan"],
        }),
        deleteParkingPlan: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ParkingPlan"],
        }),
    }),
});

export const {
    useGetAllParkingPlansQuery,
    useGetParkingPlansByLotIdQuery,
    useGetParkingPlanByIdQuery, 
    useGetPopularParkingPlansQuery,
    useCreateParkingPlanMutation,
    useUpdateParkingPlanMutation,
    useDeleteParkingPlanMutation,
} = apiParkingPlan;
