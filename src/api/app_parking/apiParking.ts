import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export interface ParkingEntryRequest {
    image: File | Blob;
}

export interface ParkingEntryResponse {
    id: number;
    lotId: number;
    vehicleId: number;
    licensePlate: string;
    entryTime: string;
    exitTime: string;
    licensePlateImageEntry: string;
    licensePlateImageExit: string;
    status: string;
    totalCost: number;
}

export const apiParking = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/parking`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    reducerPath: "parkingApi",
    tagTypes: ["Parking"],
    endpoints: (builder) => ({
        createParkingEntry: builder.mutation<ParkingEntryResponse, { parkingLotId: number; data: ParkingEntryRequest }>({
            query: ({ parkingLotId, data }) => ({
                url: `/entry/${parkingLotId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Parking"],
        }),
    }),
});

export const {
    useCreateParkingEntryMutation,
} = apiParking;
