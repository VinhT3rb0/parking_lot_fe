import React from 'react';
import TimekeepingView from './components/TimekeepingView';
import BreadcrumbFunction from '../../components/Breadcrumb/BreadcrumbFunction';

const Timekeeping: React.FC = () => {
    return (
        <>
            <BreadcrumbFunction functionName="Chấm công" title="Chấm công" />
            <TimekeepingView />
        </>
    );
};

export default Timekeeping;
