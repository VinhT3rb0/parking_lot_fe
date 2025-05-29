import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Select, message, Button, Descriptions, Tag, Typography, Table, DatePicker, Tabs } from 'antd';
import { CreateParkingLotRequest, UpdateParkingLotRequest, useCreateParkingLotMutation, useUpdateParkingLotMutation, ParkingLot } from '../../../api/app_parkinglot/apiParkinglot';
import { useGetCurrentUserQuery } from '../../../api/app_home/apiAuth';
import { EditOutlined } from '@ant-design/icons';
import CreateAndUpdateParkingLot from './CreateAndUpdateParkingLot';
import { useGetEmployeeShiftByParkingLotIdQuery } from '../../../api/app_employee/apiEmployeeShifts';
import { useGetParkingEntriesByLotIdQuery, ParkingEntryResponse } from '../../../api/app_parking/apiParking';
import dayjs from 'dayjs';
import ParkingHistoryDetail from './ParkingHistoryDetail';
import { useAuth } from '../../../contexts/AuthContext';

interface ParkingEntry {
    id: number;
    lotId: number;
    vehicleId: number;
    licensePlate: string;
    entryTime: string;
    exitTime: string | null;
    licensePlateImageEntry: string;
    licensePlateImageExit: string | null;
    status: string;
    totalCost: number | null;
    code: number;
}

interface ParkingLotDetailProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (values: CreateParkingLotRequest | UpdateParkingLotRequest) => Promise<void>;
    initialValues?: ParkingLot;
    isEditing: boolean;
}

const EmployeeShiftsTable: React.FC<{ parkingLotId: number }> = ({ parkingLotId }) => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const { data: employeeShifts, isLoading } = useGetEmployeeShiftByParkingLotIdQuery(
        {
            parkingLotId: parkingLotId,
            workDate: selectedDate.format('YYYY-MM-DD')
        },
        {
            skip: !parkingLotId
        }
    );

    const columns = [
        {
            title: 'Nhân viên',
            dataIndex: 'employeeName',
            key: 'employeeName',
        },
        {
            title: 'Ca làm việc',
            dataIndex: 'shiftName',
            key: 'shiftName',
        },
        {
            title: 'Thời gian',
            dataIndex: 'shiftTime',
            key: 'shiftTime',
        },
        {
            title: 'Ngày trong tuần',
            dataIndex: 'dayOfWeek',
            key: 'dayOfWeek',
            render: (dayOfWeek: string) => {
                const dayConfig = {
                    MONDAY: { color: 'blue', label: 'Thứ hai' },
                    TUESDAY: { color: 'green', label: 'Thứ ba' },
                    WEDNESDAY: { color: 'purple', label: 'Thứ tư' },
                    THURSDAY: { color: 'orange', label: 'Thứ năm' },
                    FRIDAY: { color: 'red', label: 'Thứ sáu' },
                    SATURDAY: { color: 'cyan', label: 'Thứ bảy' },
                    SUNDAY: { color: 'magenta', label: 'Chủ nhật' }
                };

                const config = dayConfig[dayOfWeek as keyof typeof dayConfig] || { color: 'default', label: dayOfWeek };

                return (
                    <Tag color={config.color}>
                        {config.label}
                    </Tag>
                );
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const statusConfig = {
                    SCHEDULED: { color: 'blue', label: 'Đã lên lịch' },
                    IN_PROGRESS: { color: 'processing', label: 'Đang thực hiện' },
                    COMPLETED: { color: 'green', label: 'Hoàn thành' },
                    ABSENT: { color: 'red', label: 'Vắng mặt' }
                };

                const config = statusConfig[status as keyof typeof statusConfig] || { color: 'default', label: status };

                return (
                    <Tag color={config.color}>
                        {config.label}
                    </Tag>
                );
            },
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => date && setSelectedDate(date)}
                    style={{ width: 200 }}
                />
            </div>
            <Table
                columns={columns}
                dataSource={employeeShifts}
                rowKey="id"
                loading={isLoading}
            />
        </div>
    );
};

const ParkingHistoryTable: React.FC<{ parkingLotId: number }> = ({ parkingLotId }) => {
    const { data: parkingEntries, isLoading } = useGetParkingEntriesByLotIdQuery(parkingLotId);
    const [selectedEntry, setSelectedEntry] = useState<ParkingEntryResponse | null>(null);

    const columns = [
        {
            title: 'Mã xe',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: 'Biển số xe',
            dataIndex: 'licensePlate',
            key: 'licensePlate',
        },
        {
            title: 'Thời gian vào',
            dataIndex: 'entryTime',
            key: 'entryTime',
            render: (time: string) => dayjs(time).format('DD/MM/YYYY HH:mm:ss'),
        },
        {
            title: 'Thời gian ra',
            dataIndex: 'exitTime',
            key: 'exitTime',
            render: (time: string | null) => time ? dayjs(time).format('DD/MM/YYYY HH:mm:ss') : '-',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'blue'}>
                    {status === 'ACTIVE' ? 'Đang gửi' : 'Đã lấy'}
                </Tag>
            ),
        },
        {
            title: 'Chi phí',
            dataIndex: 'totalCost',
            key: 'totalCost',
            render: (cost: number | null) => cost ? `${cost.toLocaleString()} VNĐ` : '-',
        },
    ];

    // Kiểm tra và chuyển đổi dữ liệu
    const tableData = React.useMemo(() => {
        if (!parkingEntries) return [];
        if (Array.isArray(parkingEntries)) return parkingEntries;
        // Kiểm tra nếu dữ liệu nằm trong trường data
        const entries = parkingEntries as { data?: ParkingEntry[] };
        if (entries.data && Array.isArray(entries.data)) return entries.data;
        return [];
    }, [parkingEntries]);

    return (
        <>
            <Table
                columns={columns}
                dataSource={tableData}
                rowKey="id"
                loading={isLoading}
                onRow={(record) => ({
                    onClick: () => setSelectedEntry(record),
                    style: { cursor: 'pointer' }
                })}
            />
            <ParkingHistoryDetail
                visible={!!selectedEntry}
                onClose={() => setSelectedEntry(null)}
                parkingEntry={selectedEntry}
            />
        </>
    );
};

const ParkingLotDetail: React.FC<ParkingLotDetailProps> = ({
    visible,
    onClose,
    onSubmit,
    initialValues,
    isEditing
}) => {
    const [form] = Form.useForm();
    const [createParkingLot] = useCreateParkingLotMutation();
    const [updateParkingLot] = useUpdateParkingLotMutation();
    const { data: userData } = useGetCurrentUserQuery();
    const [isEditMode, setIsEditMode] = useState(false);
    const { isAdmin } = useAuth();

    useEffect(() => {
        if (visible) {
            if (isEditing && initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    vehicleTypes: initialValues.vehicleTypes
                        .replace(/[\[\]]/g, '')
                        .split(',')
                });
                setIsEditMode(false);
            } else {
                form.resetFields();
                form.setFieldsValue({
                    status: 'ACTIVE',
                    isCovered: false
                });
                setIsEditMode(true);
            }
        }
    }, [visible, isEditing, initialValues, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const formattedValues = {
                ...values,
                ownerId: userData?.data?.id,
                vehicleTypes: Array.isArray(values.vehicleTypes)
                    ? values.vehicleTypes.join(',')
                    : values.vehicleTypes
            };

            await onSubmit(formattedValues);
            form.resetFields();
            setIsEditMode(false);
        } catch (error) {
            console.error('Submission failed:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    if (!isEditing || !initialValues) {
        return (
            <CreateAndUpdateParkingLot
                visible={visible}
                onClose={onClose}
                onSubmit={onSubmit}
                initialValues={undefined}
                isEditing={isEditing}
            />
        );
    }

    if (isEditMode) {
        return (
            <CreateAndUpdateParkingLot
                visible={visible}
                onClose={() => setIsEditMode(false)}
                onSubmit={onSubmit}
                initialValues={initialValues}
                isEditing={true}
            />
        );
    }

    const items = [
        {
            key: '1',
            label: 'Ca làm việc',
            children: <EmployeeShiftsTable parkingLotId={initialValues.id} />,
        },
        {
            key: '2',
            label: 'Lịch sử gửi xe',
            children: <ParkingHistoryTable parkingLotId={initialValues.id} />,
        },
    ];

    return (
        <Modal
            title="Chi tiết bãi đỗ"
            open={visible}
            onCancel={onClose}
            footer={[
                isAdmin && (
                    <Button
                        key="edit"
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => setIsEditMode(true)}
                    >
                        Sửa thông tin
                    </Button>
                ),
                <Button
                    key="close"
                    onClick={onClose}
                >
                    Đóng
                </Button>
            ]}
            width={1000}
        >
            <Descriptions bordered column={2}>
                <Descriptions.Item label="Tên bãi đỗ" span={2}>
                    {initialValues.name}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                    {initialValues.address}
                </Descriptions.Item>
                <Descriptions.Item label="Sức chứa">
                    {initialValues.capacity}
                </Descriptions.Item>
                <Descriptions.Item label="Chỗ trống">
                    {initialValues.availableSlots}
                </Descriptions.Item>
                <Descriptions.Item label="Giờ hoạt động">
                    {initialValues.operatingHours}
                </Descriptions.Item>
                <Descriptions.Item label="Có mái che">
                    {initialValues.isCovered ? 'Có' : 'Không'}
                </Descriptions.Item>
                <Descriptions.Item label="Giá theo giờ">
                    {initialValues.hourlyRate.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Giá theo ngày">
                    {initialValues.dailyRate.toLocaleString()} VNĐ
                </Descriptions.Item>
                <Descriptions.Item label="Loại xe" span={2}>
                    {initialValues.vehicleTypes
                        .replace(/[\[\]]/g, '')
                        .split(',')
                        .map((type: string, index: number) => (
                            <Tag color="blue" key={index} style={{ margin: '2px' }}>
                                {type.trim()}
                            </Tag>
                        ))}
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={initialValues.status === 'ACTIVE' ? 'green' : 'red'}>
                        {initialValues.status === 'ACTIVE' ? 'Hoạt động' : 'Ngừng hoạt động'}
                    </Tag>
                </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
                <Tabs defaultActiveKey="1" items={items} />
            </div>
        </Modal>
    );
};

export default ParkingLotDetail;