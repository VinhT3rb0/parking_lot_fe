import React, { useState, useEffect } from 'react';
import { Form, message, Tabs } from 'antd';
import {
    useGetAllEmployeesQuery,
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
    useDeleteEmployeeMutation,
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
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [editingMode, setEditingMode] = useState<'create' | 'edit'>('create');
    const debouncedSearchText = useDebounce(searchText, 500);
    const [selectedShift, setSelectedShift] = useState<EmployeeShifts | null>(null);
    const [isShiftModalVisible, setIsShiftModalVisible] = useState(false);
    const [shiftForm] = Form.useForm();
    const [shiftEditingMode, setShiftEditingMode] = useState<'create' | 'edit'>('create');
    const [selectedDate, setSelectedDate] = useState<string>(dayjs().format('YYYY-MM-DD'));
    const [selectedShiftId, setSelectedShiftId] = useState<number | null>(null);

    const { data: employees, isLoading, refetch } = useGetAllEmployeesQuery(debouncedSearchText);
    const { data: employeeShifts, isLoading: isLoadingShifts, refetch: refetchShifts } = useGetEmployeeShiftsQuery({
        workDate: selectedDate || undefined,
        shiftId: selectedShiftId || undefined
    });
    const { data: shifts } = useGetAllShiftsQuery('');
    const { data: parkingLots } = useGetAllParkingLotsQuery({});
    const [createEmployee] = useCreateEmployeeMutation();
    const [updateEmployee] = useUpdateEmployeeMutation();
    const [deleteEmployee] = useDeleteEmployeeMutation();
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
            const userDtoPayload = {
                ...values.userDTO,
                fullName: values.userDTO.fullName || values.userDTO.fullname,
                dateOfBirth: values.userDTO.dateOfBirth.format('YYYY-MM-DD'),
            };

            let formattedValues: any;

            if (editingMode === 'create') {
                formattedValues = {
                    ...values,
                    parkingLotId: 1, // Default parkingLotId for creation
                    userDTO: userDtoPayload, // Use userDTO for creation
                    joinDate: new Date().toISOString(),
                };
                await createEmployee(formattedValues as CreateEmployeeRequest).unwrap();
                message.success('Tạo nhân viên thành công!');
            } else { // editingMode === 'edit'
                if (selectedEmployee) {
                    formattedValues = {
                        ...values,
                        parkingLotId: values.parkingLotId, // Keep existing parkingLotId for edit
                        updateUserDTO: userDtoPayload, // Use updateUserDTO for update
                        joinDate: new Date().toISOString(), // Keep joinDate as per original logic, if API expects it
                    };
                    await updateEmployee({
                        id: selectedEmployee.id,
                        data: formattedValues as UpdateEmployeeRequest,
                    }).unwrap();
                    message.success('Cập nhật nhân viên thành công!');
                    refetch();
                }
            }
            handleModalClose();
        } catch (error: any) {
            if (error?.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Có lỗi xảy ra!');
            }
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
            const workDate = values.workDate.format('YYYY-MM-DD');

            if (shiftEditingMode === 'create') {
                const createRequest: CreateEmployeeShiftsRequest = {
                    employeeId: values.employeeId,
                    employeeName: selectedEmployee?.userResponse.fullname || '',
                    shiftId: values.shiftId.toString(),
                    shiftName: selectedShift?.shiftName || '',
                    shiftType: selectedShift?.shiftName || '',
                    shiftTime: `${selectedShift?.startTime} - ${selectedShift?.endTime}`,
                    workDate: workDate,
                    dayOfWeek: values.workDate.format('dddd').toUpperCase(),
                    isRecurring: values.isRecurring,
                    status: "SCHEDULED",
                    parkingLotId: values.parkingLotId
                };

                const response = await createEmployeeShift(createRequest).unwrap();
                message.success('Tạo ca làm việc thành công!');
                refetchShifts();
                return response as unknown as EmployeeShifts;
            } else {
                const updateRequest: EmployeeShifts = {
                    id: Number(values.employeeId),
                    employeeId: values.employeeId,
                    employeeName: selectedEmployee?.userResponse.fullname || '',
                    shiftId: values.shiftId,
                    shiftName: selectedShift?.shiftName || '',
                    shiftTime: `${selectedShift?.startTime} - ${selectedShift?.endTime}`,
                    workDate: workDate,
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
                    refetchShifts();
                    return updateRequest;
                }
            }
            handleShiftModalClose();
            throw new Error('Không thể xử lý yêu cầu');
        } catch (error: any) {
            if (error?.data?.message?.includes('Employee shift already exists')) {
                message.error('Nhân viên đã có ca làm việc này trong ngày');
            } else if (error?.data?.message) {
                message.error(error.data.message);
            } else {
                message.error('Có lỗi xảy ra!');
            }
            throw error;
        }
    };

    const handleShiftDelete = async (id: number) => {
        try {
            await deleteEmployeeShift({ id }).unwrap();
            message.success('Xóa ca làm việc thành công!');
            refetchShifts();
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa ca làm việc!');
        }
    };

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
    };

    const handleShiftChange = (shiftId: number | null) => {
        setSelectedShiftId(shiftId);
    };

    // Add useEffect to handle refetch when filters change
    useEffect(() => {
        refetchShifts();
    }, [selectedDate, selectedShiftId]);

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
                    isViewModalVisible={isViewModalVisible}
                    editingMode={editingMode}
                    selectedEmployee={selectedEmployee}
                    form={form}
                    onSearch={handleSearch}
                    onModalOpen={handleModalOpen}
                    onModalClose={handleModalClose}
                    onViewModalOpen={handleViewModalOpen}
                    onViewModalClose={handleViewModalClose}
                    onSubmit={handleSubmit}
                    onDelete={handleDelete}
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
                    onDateChange={handleDateChange}
                    onShiftChange={handleShiftChange}
                    selectedDate={selectedDate}
                    selectedShiftId={selectedShiftId}
                    dataSource={employeeShifts}
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