import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getAccessTokenFromCookie } from "../../utils/token";
export const apiFunction = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/app-home/v1/`,
        prepareHeaders: (headers, { getState }) => {
            const accessToken = getAccessTokenFromCookie();
            if (accessToken) {
                headers.set("Authorization", `Bearer ${accessToken}`);
            }
            return headers;
        },
    }),
    reducerPath: "functionApi",
    tagTypes: ["Function"],
    endpoints: (builder) => ({
        availableFunctions: builder.query({
            query: () => "get-available-functions/",
            providesTags: [{ type: "Function" }],
        }),
    }),
});

export const { useAvailableFunctionsQuery } = apiFunction;
