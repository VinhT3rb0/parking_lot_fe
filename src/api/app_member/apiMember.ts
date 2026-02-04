import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
import { API_URL } from "../../config";

export interface MemberDetail {
    status: string;
    message: string;
    data: {
        id: number;
        userId: number;
        memberCode: string; // Removed ? as it seems always present in example
        username: string;
        email: string;
        fullname: string; // Removed | null
        phoneNumber: string; // Removed | null
        dateOfBirth: string | null;
        parkingLotId: number;
        parkingLotName?: string;
        planId: number;
        planName?: string;
        memberStatus?: string; // e.g., PENDING
        membershipStartDate?: string | null;
        membershipExpiryDate?: string | null;
        membershipFee?: number;
        lockedAt?: string;
        lockReason?: string;
        createdAt?: string;
        updatedAt?: string;
        daysRemaining?: number | null;
        isValid?: boolean;
        vehicles: {
            id: number;
            licensePlate: string;
            vehicleType: string;
        }[];
        role: string;
        employeeId: number | null;
        address?: string;
        roomNumber?: string;
    }
}

export interface MemberSearchRequest {
    keyword?: string;
    status?: string;
    page?: number;
    size?: number;
}

export interface RegisterMemberRequest {
    parkingLotId: number;
    planId: number;
    licensePlate: string;
    vehicleType: string;
    dateOfBirth: string | null;
    address: string;
    phoneNumber: string;
    email: string;
    fullname: string;
    roomNumber: string;
}

export const apiMember = createApi({
    reducerPath: "apiMember",
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_URL}/api/members`,
        prepareHeaders: (headers) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    tagTypes: ["Member"],
    endpoints: (builder) => ({
        getMemberById: builder.query<MemberDetail, number>({
            query: (id) => `${id}`,
            providesTags: (result, error, id) => [{ type: "Member", id }],
        }),
        getExpiringMembers: builder.query<any, void>({
            query: () => "expiring",
            providesTags: ["Member"],
        }),
        getMemberByCode: builder.query<MemberDetail, string>({
            query: (code) => `code/${code}`,
        }),
        checkUserMember: builder.query<MemberDetail, number>({
            query: (userId) => `check/${userId}`,
            providesTags: ["Member"],
        }),
        unlockMember: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}/unlock`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Member", id }],
        }),
        renewMember: builder.mutation<void, { id: number; data?: any }>({
            query: ({ id, data }) => ({
                url: `${id}/renew`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Member", id }],
        }),
        rejectMember: builder.mutation<void, { id: number; reason?: string }>({
            query: ({ id, reason }) => ({
                url: `${id}/reject`,
                method: "POST",
                params: { reason },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Member", id }],
        }),
        lockMember: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}/lock`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Member", id }],
        }),
        cancelMember: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}/cancel`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Member", id }],
        }),
        approveMember: builder.mutation<void, number>({
            query: (id) => ({
                url: `${id}/approve`,
                method: "POST",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Member", id }],
        }),
        // ... existing endpoints
        getAllMembers: builder.query<any, { page: number; size: number }>({
            query: ({ page, size }) => `?page=${page}&size=${size}`,
            providesTags: ["Member"],
        }),
        getMemberStatistics: builder.query<any, void>({
            query: () => "statistics",
        }),
        getMemberByPhone: builder.query<MemberDetail, string>({
            query: (phoneNumber) => `search/phone/${phoneNumber}`,
        }),
        getMemberByLicensePlate: builder.query<MemberDetail, string>({
            query: (licensePlate) => `search/license-plate/${licensePlate}`,
        }),
        getPricingForPlan: builder.query<any, number>({
            query: (planId) => `pricing/plan/${planId}`,
        }),
        getPendingMembers: builder.query<any, void>({
            query: () => "pending",
            providesTags: ["Member"],
        }),
        getPendingMembersByParkingLot: builder.query<any, number>({
            query: (parkingLotId) => `pending/parking-lot/${parkingLotId}`,
            providesTags: ["Member"],
        }),
        searchMembers: builder.mutation<any, MemberSearchRequest>({
            query: (filters) => ({
                url: "search",
                method: "POST",
                body: filters,
            }),
        }),
        registerMember: builder.mutation<void, { userId: number; data: RegisterMemberRequest }>({
            query: ({ userId, data }) => ({
                url: `register/${userId}`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Member"],
        }),
        updateMember: builder.mutation<void, { id: number; data: any }>({
            query: ({ id, data }) => ({
                url: `${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Member", id }],
        }),
        getMemberByUserId: builder.query<MemberDetail, number>({
            query: (userId) => `user/${userId}`,
        }),
    }),
});

export const {
    useGetMemberByIdQuery,
    useGetExpiringMembersQuery,
    useGetMemberByCodeQuery,
    useCheckUserMemberQuery,
    useUnlockMemberMutation,
    useRenewMemberMutation,
    useRejectMemberMutation,
    useLockMemberMutation,
    useCancelMemberMutation,
    useApproveMemberMutation,
    useSearchMembersMutation,
    useRegisterMemberMutation,
    useUpdateMemberMutation,
    useGetAllMembersQuery,
    useGetMemberStatisticsQuery,
    useGetMemberByPhoneQuery,
    useGetMemberByLicensePlateQuery,
    useGetPricingForPlanQuery,
    useGetPendingMembersQuery,
    useGetPendingMembersByParkingLotQuery,
    useGetMemberByUserIdQuery,
} = apiMember;
