import React from 'react';
import {
    Table,
    Button,
    Space,
    Input,
    Modal,
    Form,
    Popconfirm,
    Tag,
    Typography,
    Card,
} from 'antd';
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
} from '@ant-design/icons';
import { Employee } from '../../../api/app_employee/apiEmployee';
import CreateAndUpdateEmployee from './CreateAndUpdateEmployee';
import ViewEmployeeDetails from './ViewEmployeeDetails';
import { EmployeeShifts } from '../../../api/app_employee/apiEmployeeShifts';

const { Title } = Typography;

interface EmployeeManageViewProps {
    employees: Employee[] | undefined;
    employeeShifts: EmployeeShifts[] | undefined;
    isLoading: boolean;
    searchText: string;
    isModalVisible: boolean;
    isViewModalVisible: boolean;
    editingMode: 'create' | 'edit';
    selectedEmployee: Employee | null;
    form: any;
    onSearch: (value: string) => void;
    onModalOpen: (mode: 'create' | 'edit', employee?: Employee) => void;
    onModalClose: () => void;
    onViewModalOpen: (employee: Employee) => void;
    onViewModalClose: () => void;
    onSubmit: (values: any) => void;
    onDelete: (id: string) => void;
}

const EmployeeManageView: React.FC<EmployeeManageViewProps> = ({
    employees,
    employeeShifts,
    isLoading,
    searchText,
    isModalVisible,
    isViewModalVisible,
    editingMode,
    selectedEmployee,
    form,
    onSearch,
    onModalOpen,
    onModalClose,
    onViewModalOpen,
    onViewModalClose,
    onSubmit,
    onDelete,
}) => {
    const columns = [
        {
            title: 'Họ tên',
            dataIndex: ['userResponse', 'fullname'],
            key: 'fullname',
        },
        {
            title: 'Email',
            dataIndex: ['userResponse', 'email'],
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: ['userResponse', 'phoneNumber'],
            key: 'phoneNumber',
        },
        {
            title: 'Ngày sinh',
            dataIndex: ['userResponse', 'dateOfBirth'],
            key: 'dateOfBirth',
        },
        {
            title: 'Ngày gia nhập',
            dataIndex: 'joinDate',
            key: 'joinDate',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
                    {status === 'ACTIVE' ? 'Đang hoạt động' : 'Không hoạt động'}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_: any, record: Employee) => (
                <Space size="middle">
                    <Button
                        icon={<EditOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onModalOpen('edit', record);
                        }}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhân viên này?"
                        onConfirm={(e) => {
                            e?.stopPropagation();
                            onDelete(record.id);
                        }}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button
                            danger
                            icon={<DeleteOutlined />}
                            onClick={(e) => e.stopPropagation()}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <Title level={4}>Quản lý nhân viên</Title>
                <Space>
                    <Input
                        placeholder="Tìm kiếm..."
                        prefix={<SearchOutlined />}
                        onChange={(e) => onSearch(e.target.value)}
                        style={{ width: 200 }}
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => onModalOpen('create')}
                    >
                        Thêm nhân viên
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={employees}
                loading={isLoading}
                rowKey="id"
                onRow={(record) => ({
                    onClick: () => onViewModalOpen(record),
                    style: { cursor: 'pointer' }
                })}
            />

            <CreateAndUpdateEmployee
                isModalVisible={isModalVisible}
                editingMode={editingMode}
                selectedEmployee={selectedEmployee}
                form={form}
                onClose={onModalClose}
                onSubmit={onSubmit}
            />

            <ViewEmployeeDetails
                isModalVisible={isViewModalVisible}
                selectedEmployee={selectedEmployee}
                employeeShifts={employeeShifts}
                employeeAttendances={[]}
                onClose={onViewModalClose}
                onEdit={(employee) => {
                    onViewModalClose();
                    onModalOpen('edit', employee);
                }}
            />
        </div>
    );
};

export default EmployeeManageView;
