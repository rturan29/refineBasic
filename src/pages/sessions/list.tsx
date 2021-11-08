/* eslint-disable eqeqeq */
import React, { useState } from "react";
import {
    List, Table, TextField, useTable, IResourceComponentsProps, Space, DateField, NumberField,
    useMany, useModal, CreateButton, RefreshButton, usePermissions,
    Authenticated, Col, Row, Tabs,
} from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshop, sessionModalRole, workshopType } from "interfaces";
import moment, { weekdays } from "moment";
import { CrudFilter } from "refine-firebase/lib/interfaces/IDataContext";
import AdminColumns from "./components/AdminColumns";
import SessionModal from "./components/SessionModal";
const { TabPane } = Tabs;


export const SessionList: React.FC<IResourceComponentsProps> = () => {
    const [currentRow, setCurrentRow] = useState<ISession | null>(null);
    const [modalRole, setModalRole] = useState<sessionModalRole>("show");

    const [activeWorkshopType, setWorkshopType] = useState<workshopType>("group");
    const isAdmin = usePermissions().data?.role === "admin";
    const [permanentFilter, setPermanentFilter] = useState(getPermanentFilter(isAdmin));

    const { modalProps, show, close } = useModal();
    const { tableProps, tableQueryResult } = useTable<ISession>({ permanentFilter });

    if (!isAdmin) {
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

    function handleShowModal(record: ISession, newModalRole: sessionModalRole) {
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

    function getParticipantColumns() {
        return (<Table.Column<ISession>
            title={MLTextHelper("00011")}
            dataIndex="actions"
            render={(_, record) => (
                <Space>
                    <CreateButton onClick={() => handleShowModal(record, "apply")} size="small">{MLTextHelper("00045")}</CreateButton>
                </Space>
            )}
        />);
    }

    function getSessionColumns() {
        return (
            <>
                <Table.Column
                    dataIndex="workshopId"
                    title={MLTextHelper("00012")}
                    render={value => isLoading
                        ? <TextField value="Loading..." />
                        : <TextField value={workshopsData?.data?.find((item) => item.id === value)?.title} />}
                    sorter
                />
                <Table.Column
                    dataIndex="teacher"
                    title={MLTextHelper("00013")}
                    render={(value) => <TextField value={value} />}
                    sorter
                />
                <Table.Column
                    dataIndex="period"
                    title={MLTextHelper("00014")}
                    render={(value) => <> <DateField format="DD-MM-YYYY" value={value?.[0]} /> - <DateField format="DD-MM-YYYY" value={value?.[1]} /></>}
                    sorter
                />
                <Table.Column
                    dataIndex="plans"
                    title={MLTextHelper("00051")}
                    render={(value: ISession["plans"]) => value?.map((plan, i) => (
                        <Row key={i}>
                            <Col span="10">
                                <TextField value={`${weekdays(plan.day)}  `} />
                            </Col>
                            <Col>
                                <TextField value={moment(plan?.time?.[0])?.format("HH:mm")} />
                                {" - "}
                                <TextField value={moment(plan?.time?.[1])?.format("HH:mm")} />
                            </Col>
                        </Row>
                    ))
                    }
                    sorter
                />
                <Table.Column
                    dataIndex="paymentAmount"
                    title={MLTextHelper("00017")}
                    render={(value) => <NumberField locale="tr" options={{ style: 'currency', currency: 'TRY' }} value={value} />}
                    sorter
                />
            </>
        );
    }

    function getListHeaderButtons() {
        return (<><RefreshButton />{isAdmin ? <CreateButton /> : null}</>);
    }

    function renderTable() {
        return (
            <List
                pageHeaderProps={{ extra: getListHeaderButtons() }}
                canCreate={isAdmin}
            >
                <Table {...tableProps} rowKey="id">
                    {getSessionColumns()}
                    {getParticipantColumns()}
                    <AdminColumns activeWorkshopType={activeWorkshopType} handleShowModal={handleShowModal} />
                </Table>
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