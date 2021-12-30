/* eslint-disable eqeqeq */
import { CreateButton, CrudFilter, List, Table, usePermissions, useTable, useUpdate } from '@pankod/refine';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { ISession, IWorkshop, TModalRole } from 'interfaces';
import React, { useEffect, useState } from 'react';
import getPlanColumns from './getPlanColumns';

type AddSessionProps = React.PropsWithChildren<{
    record: IWorkshop;
    setCurrentPlan: (value: ISession) => void;
    setModalRole: (role: string) => void;
    showModal: (args: { role: TModalRole, record?: IWorkshop, plan?: ISession; }) => void;
}>;

export default function ShowPlans({ record, setCurrentPlan, setModalRole, showModal }: AddSessionProps) {
    const [statusList, setStatusList] = useState<Array<{ id: string, status: string; }>>([]);
    const { mutate, isLoading } = useUpdate();

    const isAdmin = usePermissions().data?.role === "admin";

    const { tableProps } = useTable<ISession>({ permanentFilter: getPermanentFilter(isAdmin, record.id) });

    function handleStatusChange(id: string, newStatus: string) {
        const isValueChanged = statusList.find(status => status.id == id)?.status != newStatus;
        if (isValueChanged) {
            setStatusList(statusList.map(status => status.id == id ? ({ id, status: newStatus }) : status));
        }
        mutate({ resource: "workshops", id, values: { status: newStatus } });
    }

    useEffect(() => {
        if (tableProps.dataSource) {
            setStatusList(tableProps.dataSource.map(({ id, status }) => ({ id, status })));
        }
    }, [tableProps.dataSource]);

    if (!isAdmin) {
        tableProps.dataSource = tableProps?.dataSource?.filter(data => data.quota > data.participants?.length);
    }

    function renderTable() {
        const planColumns = getPlanColumns({ isAdmin, showModal, isLoading, handleStatusChange, tableStatusList: statusList });

        return (
            <List
                pageHeaderProps={{ extra: isAdmin ? <CreateButton onClick={() => showModal({ role: "addPlan" })} /> : null }}
                canCreate={isAdmin}
                title={MLTextHelper("00065")}
            >
                <Table columns={planColumns} {...tableProps} rowKey="id" />
            </List>
        );
    }

    return (
        <>
            {renderTable()}
        </>
    );
}

export function getPermanentFilter(isAdmin: boolean, workshopId: string): CrudFilter[] {

    const permanentFilter: Array<CrudFilter> = [
        {
            field: "workshopId",
            operator: "eq",
            value: workshopId
        }];

    if (!isAdmin) {
        permanentFilter.push(
            {
                field: "status",
                operator: "eq",
                value: "published"
            },
        );
    }

    return permanentFilter;

}
