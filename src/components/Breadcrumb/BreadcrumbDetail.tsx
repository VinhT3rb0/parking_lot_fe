import { Breadcrumb } from "antd";
import React from "react";
import { Link } from "react-router-dom";


export default function BreadcrumbDetail({
    functionName,
    pageName,
    title,
    pageLink,
}: {
    functionName: string;
    pageName: string;
    title: string;
    pageLink: string;
}) {
    return (
        <div className="flex justify-between px-5 my-5 items-center">
            <div className="text-xl font-semibold text-white">{title}</div>

            <Breadcrumb
                className="text-lg max-md:hidden"
                separator=">"
                items={[
                    {
                        title: functionName,
                    },
                    {
                        title: (
                            <>
                                <Link to={pageLink}>{pageName}</Link>
                            </>
                        ),
                    },
                    {
                        title: title,
                    },
                ]}
            />
        </div>
    );
}
