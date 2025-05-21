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
    LockOutlined,
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
    isPasswordModalVisible: boolean;
    isViewModalVisible: boolean;
    editingMode: 'create' | 'edit';
    selectedEmployee: Employee | null;
    form: any;
    passwordForm: any;
    onSearch: (value: string) => void;
    onModalOpen: (mode: 'create' | 'edit', employee?: Employee) => void;
    onModalClose: () => void;
    onViewModalOpen: (employee: Employee) => void;
    onViewModalClose: () => void;
    onPasswordModalOpen: (employee: Employee) => void;
    onPasswordModalClose: () => void;
    onSubmit: (values: any) => void;
    onDelete: (id: string) => void;
    onChangePassword: (values: { currentPassword: string; newPassword: string }) => void;
}

const EmployeeManageView: React.FC<EmployeeManageViewProps> = ({
    employees,
    employeeShifts,
    isLoading,
    searchText,
    isModalVisible,
    isPasswordModalVisible,
    isViewModalVisible,
    editingMode,
    selectedEmployee,
    form,
    passwordForm,
    onSearch,
    onModalOpen,
    onModalClose,
    onViewModalOpen,
    onViewModalClose,
    onPasswordModalOpen,
    onPasswordModalClose,
    onSubmit,
    onDelete,
    onChangePassword,
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
                    <Button
                        icon={<LockOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPasswordModalOpen(record);
                        }}
                    >
                        Đổi mật khẩu
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
                onClose={onViewModalClose}
                onEdit={(employee) => {
                    onViewModalClose();
                    onModalOpen('edit', employee);
                }}
            />

            <Modal
                title="Đổi mật khẩu"
                open={isPasswordModalVisible}
                onCancel={onPasswordModalClose}
                footer={null}
            >
                <Form
                    form={passwordForm}
                    layout="vertical"
                    onFinish={onChangePassword}
                >
                    <Form.Item
                        name="currentPassword"
                        label="Mật khẩu hiện tại"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="newPassword"
                        label="Mật khẩu mới"
                        rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Đổi mật khẩu
                            </Button>
                            <Button onClick={onPasswordModalClose}>Hủy</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default EmployeeManageView;
