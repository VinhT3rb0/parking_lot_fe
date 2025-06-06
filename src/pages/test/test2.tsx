import React from "react";
import { useGetCurrentUserQuery } from "../../api/app_home/apiAuth";
import { getAccessTokenFromCookie } from "../../utils/token";

const Test = () => {
    console.log("Test2 component has been rendered");
    const { data: user } = useGetCurrentUserQuery(undefined, {
        skip: !getAccessTokenFromCookie()
    });
    console.log("444", user);
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-blue-500">
            <h1 className="text-4xl font-bold text-white mb-4 uppercase">Tailwind CSS is working!</h1>
            <button className="px-6 py-2 bg-white text-blue-500 font-semibold rounded-lg shadow-md hover:bg-gray-100 font-bold uppercase">
                Click Me
            </button>
        </div>
    );
};

export default Test;