import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";


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
    totalCost: number | null;
    code: number;
}

export interface LicensePlateRecognitionResponse {
    plate: string;
}

export interface CreateParkingLotRequest {
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
    ownerId: number;
}

export interface UpdateParkingLotRequest extends CreateParkingLotRequest {
    id: number;
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
    endpoints: builder => ({
        createParkingEntry: builder.mutation<ParkingEntryResponse, FormData>({
            query: formData => ({
                url: "/entry",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["Parking"],
        }),
        createParkingExit: builder.mutation<ParkingEntryResponse, { code: string, licensePlate: string, formData: FormData }>({
            query: ({ code, licensePlate, formData }) => {
                formData.append('licensePlate', licensePlate);
                return {
                    url: `/exit/${code}`,
                    method: "POST",
                    body: formData
                };
            },
            invalidatesTags: ["Parking"],
        }),
        recognizeLicensePlate: builder.mutation<LicensePlateRecognitionResponse, FormData>({
            query: (imageFormData) => ({
                url: "/recognize",
                method: "POST",
                body: imageFormData,
            }),
        }),

        getAllParkingEntries: builder.query<ParkingEntryResponse[], void>({
            query: () => ({
                url: "/sessions",
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getAllParkingEntriesActive: builder.query<ParkingEntryResponse[], void>({
            query: () => ({
                url: "/sessions/active",
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getParkingEntriesByLotId: builder.query<ParkingEntryResponse[], number>({
            query: (lotId) => ({
                url: `/sessions/parkingLot/${lotId}`,
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getParkingEntriesByUserId: builder.query<ParkingEntryResponse[], number>({
            query: (userId) => ({
                url: `/sessions/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getSessionByCode: builder.query<ParkingEntryResponse, string>({
            query: (code) => ({
                url: `/sessions/code/${code}`,
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getSessionByLicensePlate: builder.query<ParkingEntryResponse, string>({
            query: (licensePlate) => ({
                url: `/sessions/license-plate/${licensePlate}`,
                method: "GET",
            }),
            providesTags: ["Parking"],
        }),
        getParkingEntriesByDatetime: builder.query<ParkingEntryResponse[], { dateStart: string; dateEnd: string }>({
            query: ({ dateStart, dateEnd }) => ({
                url: `/sessions/datetime`,
                method: "GET",
                params: {
                    dateStart,
                    dateEnd,
                },
            }),
            providesTags: ["Parking"],
        }),
    }),
});

export const {
    useCreateParkingEntryMutation,
    useCreateParkingExitMutation,
    useGetAllParkingEntriesQuery,
    useGetSessionByLicensePlateQuery,
    useGetSessionByCodeQuery,
    useGetParkingEntriesByLotIdQuery,
    useGetParkingEntriesByUserIdQuery,
    useRecognizeLicensePlateMutation,
    useGetAllParkingEntriesActiveQuery,
    useGetParkingEntriesByDatetimeQuery,
    useLazyGetSessionByCodeQuery,
} = apiParking;
