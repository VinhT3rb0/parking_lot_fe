import React from 'react';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';
import ParkVehicleForm from './components/ParkVehicleForm';

const ParkVehicle = () => {
    return (
        <>
            <BreadcrumbFunction functionName="Gửi xe" title="Gửi xe" />
            <ParkVehicleForm />
        </>
    );
}

export default ParkVehicle; 