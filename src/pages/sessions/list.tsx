/* eslint-disable eqeqeq */
import React, { useState } from "react";
import {
    List, Table, useTable, IResourceComponentsProps, useMany, useModal, CreateButton,
    RefreshButton, usePermissions, Tabs, Authenticated
} from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshop, TModalRole, workshopType } from "interfaces";
import { CrudFilter } from "refine-firebase/lib/interfaces/IDataContext";
import SessionModal from "./components/SessionModal";
import getSessionColumns from "./components/getSessionColumns";
const { TabPane } = Tabs;

export const SessionList: React.FC<IResourceComponentsProps> = () => {
    const [currentRow, setCurrentRow] = useState<ISession | null>(null);
    const [modalRole, setModalRole] = useState<TModalRole>("show");

    const [activeWorkshopType, setWorkshopType] = useState<workshopType>("group");
    const isAdmin = usePermissions().data?.role === "admin";
    const [permanentFilter, setPermanentFilter] = useState(getPermanentFilter(isAdmin));

    const { modalProps, show, close } = useModal();
    const { tableProps, tableQueryResult } = useTable<ISession>({ permanentFilter });

    if (!isAdmin && activeWorkshopType !== "private") {
        tableProps.dataSource = tableProps?.dataSource?.filter(data => data.quota > data.participants?.length);
    }

    let workshopIds = tableProps?.dataSource?.map((item) => item.workshopId) ?? [];
    workshopIds = workshopIds.filter((item, i) => workshopIds.indexOf(item) === i);
    const { data: workshopsData, isLoading } = useMany<IWorkshop>({
        resource: "workshops",
        ids: workshopIds,
        queryOptions: {
            enabled: workshopIds.length > 0,
        },
    });

    function handleTabChange(activeKey: string) {
        let filter: CrudFilter = {
            field: "type",
            operator: "eq",
            value: activeKey
        };
        let newFilter = permanentFilter.filter(crudFilter => crudFilter.field != "type");
        newFilter.push(filter);
        setPermanentFilter(newFilter);
        setWorkshopType(activeKey as workshopType);
    }

    function handleShowModal(record: ISession, newModalRole: TModalRole) {
        setCurrentRow(record);
        setModalRole(newModalRole);
        show();
    }

    function renderModal() {
        if (currentRow) {
            return (
                <SessionModal
                    modalRole={modalRole}
                    currentRow={currentRow}
                    refetch={tableQueryResult.refetch}
                    modalProps={modalProps}
                    close={close}
                />);
        }
    }

    function getListHeaderButtons() {
        return (<><RefreshButton />{isAdmin ? <CreateButton /> : null}</>);
    }

    function renderTable() {
        const sessionColumns = getSessionColumns({ isAdmin, isLoading, activeWorkshopType, handleShowModal, workshops: workshopsData?.data, });

        return (
            <List
                pageHeaderProps={{ extra: getListHeaderButtons() }}
                canCreate={isAdmin}
            >
                <Table columns={sessionColumns} {...tableProps} rowKey="id" />
            </List>
        );
    }

    return (
        <Authenticated>
            <Tabs onChange={handleTabChange}>
                <TabPane tab={MLTextHelper("00057")} key="group">
                    {renderTable()}
                    {renderModal()}
                </TabPane>
                <TabPane tab={MLTextHelper("00058")} key="private">
                    {renderTable()}
                    {renderModal()}
                </TabPane>
            </Tabs>
        </Authenticated>
    );
};

function getPermanentFilter(isAdmin: boolean) {
    const permanentFilter: CrudFilter[] = [{
        field: "type",
        operator: "eq",
        value: "group"
    }];

    if (!isAdmin) {
        permanentFilter.push({
            field: "status",
            operator: "eq",
            value: "published"
        });
    }
    return permanentFilter;
}