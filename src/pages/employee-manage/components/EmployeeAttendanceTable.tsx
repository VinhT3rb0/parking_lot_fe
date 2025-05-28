import React, { useState } from 'react';
import { Table, Tag, DatePicker, Space } from 'antd';
import { Attendance, useGetAttendancesByEmployeeIdQuery } from '../../../api/app_employee/apiAttendance';
import dayjs from 'dayjs';

interface EmployeeAttendanceTableProps {
    employeeId: string;
}

const EmployeeAttendanceTable: React.FC<EmployeeAttendanceTableProps> = ({
    employeeId
}) => {
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
    const [endDate, setEndDate] = useState(dayjs());

    const { data: attendances, isLoading } = useGetAttendancesByEmployeeIdQuery({
        employeeId,
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD')
    });

    const columns = [
        {
            title: 'Ngày',
            dataIndex: 'checkInTime',
            key: 'date',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY'),
        },
        {
            title: 'Giờ check-in',
            dataIndex: 'checkInTime',
            key: 'checkInTime',
            render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : '-',
        },
        {
            title: 'Giờ check-out',
            dataIndex: 'checkOutTime',
            key: 'checkOutTime',
            render: (time: string) => time ? dayjs(time).format('HH:mm:ss') : '-',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const getStatusColor = (status: string) => {
                    switch (status) {
                        case 'PRESENT':
                            return 'success';
                        case 'ABSENT':
                            return 'error';
                        case 'LATE':
                            return 'warning';
                        case 'EARLY':
                            return 'warning';
                        default:
                            return 'default';
                    }
                };

                const getStatusText = (status: string) => {
                    switch (status) {
                        case 'PRESENT':
                            return 'Có mặt';
                        case 'ABSENT':
                            return 'Vắng mặt';
                        case 'LATE':
                            return 'Đi muộn';
                        case 'EARLY':
                            return 'Về Sớm';
                        default:
                            return status;
                    }
                };

                return (
                    <Tag color={getStatusColor(status)}>
                        {getStatusText(status)}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div>
            <Space style={{ marginBottom: 16 }}>
                <DatePicker
                    value={startDate}
                    onChange={(date) => date && setStartDate(date)}
                    format="DD/MM/YYYY"
                />
                <DatePicker
                    value={endDate}
                    onChange={(date) => date && setEndDate(date)}
                    format="DD/MM/YYYY"
                />
            </Space>
            <Table
                columns={columns}
                dataSource={attendances}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                scroll={{ y: 300 }}
                loading={isLoading}
            />
        </div>
    );
};

export default EmployeeAttendanceTable; 