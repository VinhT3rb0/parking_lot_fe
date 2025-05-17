import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export interface ParkingLot {
    id: number;
    ownerId: number;
    name: string;
    address: string;
    capacity: number;
    availableSlots: number;
    operatingHours: string;
    hourlyRate: number;
    dailyRate: number;
    vehicleTypes: string;
    isCovered: boolean;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateParkingLotRequest {
    ownerId: number;
    name: string;
    address: string;
    capacity: number;
    operatingHours: string;
    hourlyRate: number;
    dailyRate: number;
    vehicleTypes: string;
    isCovered: boolean;
    status: string;
}

export interface UpdateParkingLotRequest {
    name?: string;
    address?: string;
    capacity?: number;
    operatingHours?: string;
    hourlyRate?: number;
    dailyRate?: number;
    vehicleTypes?: string;
    isCovered?: boolean;
    status?: string;
}

export interface ApiResponse<T> {
    status: string;
    message: string;
    data: T;
}

export interface ParkingLotFilter {
    name?: string;
    vehicleTypes?: string;
    isCovered?: boolean;
    status?: string;
}

export const apiParkinglot = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/parking-lots`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    reducerPath: "parkingLotApi",
    tagTypes: ["ParkingLot"],
    endpoints: (builder) => ({
        getAllParkingLots: builder.query<ParkingLot[], ParkingLotFilter>({
            query: (filters) => ({
                url: "",
                params: filters
            }),
            providesTags: ["ParkingLot"],
        }),
        getParkingLotById: builder.query<ParkingLot, number>({
            query: (id) => `${id}`,
            providesTags: ["ParkingLot"],
        }),
        createParkingLot: builder.mutation<ParkingLot, CreateParkingLotRequest>({
            query: (parkingLot) => ({
                url: "",
                method: "POST",
                body: parkingLot,
            }),
            invalidatesTags: ["ParkingLot"],
        }),
        updateParkingLot: builder.mutation<ParkingLot, { id: number; data: UpdateParkingLotRequest }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: ["ParkingLot"],
        }),
        deleteParkingLot: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["ParkingLot"],
        }),
    }),
});

export const {
    useGetAllParkingLotsQuery,
    useGetParkingLotByIdQuery,
    useCreateParkingLotMutation,
    useUpdateParkingLotMutation,
    useDeleteParkingLotMutation,
} = apiParkinglot; 