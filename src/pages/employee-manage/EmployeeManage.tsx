import React, { useState } from 'react';
import { Form, message, Tabs } from 'antd';
import {
    useGetAllEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
    useChangePasswordMutation,
    Employee,
    CreateEmployeeRequest,
    UpdateEmployeeRequest,
} from '../../api/app_employee/apiEmployee';
import {
    useGetEmployeeShiftsQuery,
    useCreateEmployeeShiftsMutation,
    useUpdateEmployeeShiftMutation,
    useDeleteEmployeeShiftMutation,
    EmployeeShifts,
} from '../../api/app_employee/apiEmployeeShifts';
import EmployeeManageView from './components/EmployeeManageView';
import EmployeeShiftsView from './components/EmployeeShiftsView';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import dayjs from 'dayjs';
import { useDebounce } from '../../hooks/useDebounce';

const EmployeeManage: React.FC = () => {
    // Employee management states
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editingMode, setEditingMode] = useState<'create' | 'edit'>('create');
    const debouncedSearchText = useDebounce(searchText, 500);
    
    // Employee shifts states
    const [selectedShift, setSelectedShift] = useState<EmployeeShifts | null>(null);
    const [isShiftModalVisible, setIsShiftModalVisible] = useState(false);
    const [shiftForm] = Form.useForm();
    const [shiftEditingMode, setShiftEditingMode] = useState<'create' | 'edit'>('create');

    // Queries and mutations
    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery(debouncedSearchText);
    const { data: employeeShifts, isLoading: isLoadingShifts } = useGetEmployeeShiftsQuery();
    const [createEmployee] = useCreateEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [changePassword] = useChangePasswordMutation();
    const [createEmployeeShift] = useCreateEmployeeShiftsMutation();
    const [updateEmployeeShift] = useUpdateEmployeeShiftMutation();
    const [deleteEmployeeShift] = useDeleteEmployeeShiftMutation();

    // Employee management handlers
    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    console.log(5555, employeeShifts);
    

    const handleModalOpen = (mode: 'create' | 'edit', employee?: Employee) => {
        setEditingMode(mode);
        if (mode === 'edit' && employee) {
            setSelectedEmployee(employee);
            form.setFieldsValue({
                parkingLotId: employee.parkingLotId,
                userDTO: {
                    username: employee.userResponse.username,
                    fullname: employee.userResponse.fullname,
                    email: employee.userResponse.email,
                    phoneNumber: employee.userResponse.phoneNumber,
                    dateOfBirth: dayjs(employee.userResponse.dateOfBirth),
                },
                status: employee.status,
            });
        } else {
            form.resetFields();
            setSelectedEmployee(null);
        }
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        form.resetFields();
        setSelectedEmployee(null);
        setIsModalVisible(false);
    };

    const handlePasswordModalOpen = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsPasswordModalVisible(true);
    };

    const handlePasswordModalClose = () => {
        passwordForm.resetFields();
        setSelectedEmployee(null);
        setIsPasswordModalVisible(false);
    };

    const handleSubmit = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                parkingLotId: editingMode === 'create' ? 1 : values.parkingLotId,
                userDTO: {
                    ...values.userDTO,
                    fullName: values.userDTO.fullName || values.userDTO.fullname,
                    dateOfBirth: values.userDTO.dateOfBirth.format('YYYY-MM-DD'),
                },
                joinDate: new Date().toISOString(),
            };

            if (editingMode === 'create') {
                await createEmployee(formattedValues as CreateEmployeeRequest).unwrap();
                message.success('Tạo nhân viên thành công!');
            } else {
                if (selectedEmployee) {
                    await updateEmployee({
                        id: selectedEmployee.id,
                        data: formattedValues as UpdateEmployeeRequest,
                    }).unwrap();
                    message.success('Cập nhật nhân viên thành công!');
                    refetch();
                }
            }
            handleModalClose();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteEmployee(id).unwrap();
            message.success('Xóa nhân viên thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa nhân viên!');
        }
    };

    const handleChangePassword = async (values: { currentPassword: string; newPassword: string }) => {
        if (!selectedEmployee) return;
        try {
            await changePassword({
                id: selectedEmployee.id,
                data: values,
            }).unwrap();
            message.success('Đổi mật khẩu thành công!');
            handlePasswordModalClose();
        } catch (error) {
            message.error('Có lỗi xảy ra khi đổi mật khẩu!');
        }
    };

    // Employee shifts handlers
    const handleShiftModalOpen = (mode: 'create' | 'edit', shift?: EmployeeShifts) => {
        setShiftEditingMode(mode);
        if (mode === 'edit' && shift) {
            setSelectedShift(shift);
            shiftForm.setFieldsValue({
                ...shift,
                workDate: dayjs(shift.workDate),
            });
        } else {
            shiftForm.resetFields();
            setSelectedShift(null);
        }
        setIsShiftModalVisible(true);
    };

    const handleShiftModalClose = () => {
        shiftForm.resetFields();
        setSelectedShift(null);
        setIsShiftModalVisible(false);
    };

    const handleShiftSubmit = async (values: any) => {
        try {
            const formattedValues = {
                ...values,
                workDate: values.workDate.format('YYYY-MM-DD'),
            };

            if (shiftEditingMode === 'create') {
                await createEmployeeShift(formattedValues).unwrap();
                message.success('Tạo ca làm việc thành công!');
            } else {
                if (selectedShift) {
                    await updateEmployeeShift({
                        id: selectedShift.id,
                        data: formattedValues,
                    }).unwrap();
                    message.success('Cập nhật ca làm việc thành công!');
                }
            }
            handleShiftModalClose();
        } catch (error) {
            message.error('Có lỗi xảy ra!');
        }
    };

    const handleShiftDelete = async (id: number) => {
        try {
            await deleteEmployeeShift({ id }).unwrap();
            message.success('Xóa ca làm việc thành công!');
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa ca làm việc!');
        }
    };

    const items = [
        {
            key: '1',
            label: 'Quản lý nhân viên',
            children: (
                <EmployeeManageView
                    employees={employees}
                    isLoading={isLoading}
                    searchText={searchText}
                    isModalVisible={isModalVisible}
                    isPasswordModalVisible={isPasswordModalVisible}
                    editingMode={editingMode}
                    selectedEmployee={selectedEmployee}
                    form={form}
                    passwordForm={passwordForm}
                    onSearch={handleSearch}
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                    onPasswordModalOpen={handlePasswordModalOpen}
                    onPasswordModalClose={handlePasswordModalClose}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
                    onChangePassword={handleChangePassword}
                />
            ),
        },
        {
            key: '2',
            label: 'Quản lý ca làm việc',
            children: (
                <EmployeeShiftsView
                    employeeShifts={employeeShifts}
                    isLoading={isLoadingShifts}
                    isModalVisible={isShiftModalVisible}
                    editingMode={shiftEditingMode}
                    selectedShift={selectedShift}
                    form={shiftForm}
                    onModalOpen={handleShiftModalOpen}
                    onModalClose={handleShiftModalClose}
                    onSubmit={handleShiftSubmit}
                    onDelete={handleShiftDelete}
                />
            ),
        },
    ];

    return (
        <>
            <BreadcrumbFunction functionName="Quản lý nhân viên" title="Quản lý nhân viên" />
            <Tabs defaultActiveKey="1" items={items} />
        </>
    );
};

export default EmployeeManage;