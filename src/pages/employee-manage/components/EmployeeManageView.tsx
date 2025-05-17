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

const { Title } = Typography;

interface EmployeeManageViewProps {
    employees: Employee[] | undefined;
    isLoading: boolean;
    searchText: string;
    isModalVisible: boolean;
    isPasswordModalVisible: boolean;
    editingMode: 'create' | 'edit';
    selectedEmployee: Employee | null;
    form: any;
    passwordForm: any;
    onSearch: (value: string) => void;
    onModalOpen: (mode: 'create' | 'edit', employee?: Employee) => void;
    onModalClose: () => void;
    onPasswordModalOpen: (employee: Employee) => void;
    onPasswordModalClose: () => void;
    onSubmit: (values: any) => void;
    onDelete: (id: string) => void;
    onChangePassword: (values: { currentPassword: string; newPassword: string }) => void;
}

const EmployeeManageView: React.FC<EmployeeManageViewProps> = ({
    employees,
    isLoading,
    searchText,
    isModalVisible,
    isPasswordModalVisible,
    editingMode,
    selectedEmployee,
    form,
    passwordForm,
    onSearch,
    onModalOpen,
    onModalClose,
    onPasswordModalOpen,
    onPasswordModalClose,
    onSubmit,
    onDelete,
    onChangePassword,
}) => {
    const columns = [
        {
            title: 'Tên đăng nhập',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Họ và tên',
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Vai trò',
            dataIndex: 'position',
            key: 'position',
            render: (position: string) => (
                <Tag color={position === 'OWNER' ? 'red' : position === 'CUSTOMER' ? 'blue' : 'green'}>
                    {position === 'OWNER' ? 'Chủ sở hữu' : position === 'CUSTOMER' ? 'Khách hàng' : 'Nhân viên'}
                </Tag>
            ),
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
                        type="primary"
                        icon={<EditOutlined />}
                        onClick={() => onModalOpen('edit', record)}
                    >
                        Sửa
                    </Button>
                    <Button
                        icon={<LockOutlined />}
                        onClick={() => onPasswordModalOpen(record)}
                    >
                        Đổi mật khẩu
                    </Button>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa nhân viên này?"
                        onConfirm={() => onDelete(record.id)}
                        okText="Có"
                        cancelText="Không"
                    >
                        <Button danger icon={<DeleteOutlined />}>
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const filteredEmployees = employees?.filter((employee) =>
        Object.values(employee).some((value) =>
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
    );

    return (
        <div className="p-6">
            <Card>
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
                    dataSource={filteredEmployees}
                    loading={isLoading}
                    rowKey="id"
                />
            </Card>

            <CreateAndUpdateEmployee
                isModalVisible={isModalVisible}
                editingMode={editingMode}
                selectedEmployee={selectedEmployee}
                form={form}
                onClose={onModalClose}
                onSubmit={onSubmit}
            />

            {/* Modal for Change Password */}
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
