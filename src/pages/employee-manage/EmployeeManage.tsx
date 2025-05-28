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
    CreateEmployeeShiftsRequest,
} from '../../api/app_employee/apiEmployeeShifts';
import { useGetAllShiftsQuery } from '../../api/app_employee/apiShifts';
import { useGetAllParkingLotsQuery } from '../../api/app_parkinglot/apiParkinglot';
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
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [passwordForm] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editingMode, setEditingMode] = useState<'create' | 'edit'>('create');
    const debouncedSearchText = useDebounce(searchText, 500);
    const [selectedShift, setSelectedShift] = useState<EmployeeShifts | null>(null);
    const [isShiftModalVisible, setIsShiftModalVisible] = useState(false);
    const [shiftForm] = Form.useForm();
    const [shiftEditingMode, setShiftEditingMode] = useState<'create' | 'edit'>('create');
    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery(debouncedSearchText);
    const { data: employeeShifts, isLoading: isLoadingShifts, refetch: refetchShifts } = useGetEmployeeShiftsQuery();
    const { data: shifts } = useGetAllShiftsQuery('');
    const { data: parkingLots } = useGetAllParkingLotsQuery({});
    const [createEmployee] = useCreateEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();
    const [changePassword] = useChangePasswordMutation();
    const [createEmployeeShift] = useCreateEmployeeShiftsMutation();
    const [updateEmployeeShift] = useUpdateEmployeeShiftMutation();
    const [deleteEmployeeShift] = useDeleteEmployeeShiftMutation();
    const handleSearch = (value: string) => {
        setSearchText(value);
    };
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

    const handleViewModalOpen = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsViewModalVisible(true);
    };

    const handleViewModalClose = () => {
        setSelectedEmployee(null);
        setIsViewModalVisible(false);
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
            refetch();
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

    const handleShiftSubmit = async (values: any): Promise<EmployeeShifts> => {
        try {
            const selectedEmployee = employees?.find(emp => emp.id === values.employeeId);
            const selectedShift = shifts?.find(shift => shift.id === values.shiftId);
            const selectedParkingLot = parkingLots?.find(parkingLot => parkingLot.id === values.parkingLotId);

            if (shiftEditingMode === 'create') {
                const createRequest: CreateEmployeeShiftsRequest = {
                    employeeId: values.employeeId,
                    employeeName: selectedEmployee?.userResponse.fullname || '',
                    shiftId: values.shiftId.toString(),
                    shiftName: selectedShift?.shiftName || '',
                    shiftType: selectedShift?.shiftName || '',
                    shiftTime: `${selectedShift?.startTime} - ${selectedShift?.endTime}`,
                    workDate: values.workDate.format('YYYY-MM-DD'),
                    dayOfWeek: values.workDate.format('dddd').toUpperCase(),
                    isRecurring: values.isRecurring,
                    status: "SCHEDULED",
                    parkingLotId: values.parkingLotId
                };

                const response = await createEmployeeShift(createRequest).unwrap();
                message.success('Tạo ca làm việc thành công!');
                return response as unknown as EmployeeShifts;
            } else {
                const updateRequest: EmployeeShifts = {
                    id: Number(values.employeeId),
                    employeeId: values.employeeId,
                    employeeName: selectedEmployee?.userResponse.fullname || '',
                    shiftId: values.shiftId,
                    shiftName: selectedShift?.shiftName || '',
                    shiftTime: `${selectedShift?.startTime} - ${selectedShift?.endTime}`,
                    workDate: values.workDate.format('YYYY-MM-DD'),
                    dayOfWeek: values.workDate.format('dddd').toUpperCase(),
                    isRecurring: values.isRecurring,
                    status: values.status,
                    parkingLotId: values.parkingLotId,
                    parkingLotName: selectedParkingLot?.name || ''
                };

                if (selectedShift) {
                    await updateEmployeeShift({
                        id: Number(values.employeeId),
                        data: updateRequest,
                    }).unwrap();
                    message.success('Cập nhật ca làm việc thành công!');
                    return updateRequest;
                }
            }
            handleShiftModalClose();
            throw new Error('Không thể xử lý yêu cầu');
        } catch (error) {
            message.error('Có lỗi xảy ra!');
            throw error;
        }
    };

    const handleShiftDelete = async (id: number) => {
        try {
            await deleteEmployeeShift({ id }).unwrap();
            message.success('Xóa ca làm việc thành công!');
            refetch();
            refetchShifts();
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
                    employeeShifts={employeeShifts}
                    isLoading={isLoading}
                    searchText={searchText}
                    isModalVisible={isModalVisible}
                    isPasswordModalVisible={isPasswordModalVisible}
                    isViewModalVisible={isViewModalVisible}
                    editingMode={editingMode}
                    selectedEmployee={selectedEmployee}
                    form={form}
                    passwordForm={passwordForm}
                    onSearch={handleSearch}
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                    onViewModalOpen={handleViewModalOpen}
                    onViewModalClose={handleViewModalClose}
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
                    isLoading={isLoadingShifts}
                    isModalVisible={isShiftModalVisible}
                    editingMode={shiftEditingMode}
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