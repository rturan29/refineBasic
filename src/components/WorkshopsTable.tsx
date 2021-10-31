import { Table, TextField, List, useTable, RefreshButton, useMany, DateField } from '@pankod/refine';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { weekDays } from 'interfaces/lists';
import moment from 'moment';
import React from 'react';

type UserTableProps = React.PropsWithChildren<{ user?: IUser; }>;

export default function UserTable(props: UserTableProps) {


    const { tableProps } = useTable<ISession>(
        {
            resource: "sessions",
            permanentFilter: [{
                field: "id",
                operator: "in",
                value: props.user?.workshops
            }]
        });

    let workshopIds = tableProps?.dataSource?.map((item) => item.workshopId) ?? [];
    workshopIds = workshopIds.filter((item, i) => workshopIds.indexOf(item) === i);
    const { data: workshopsData, isLoading } = useMany<IWorkshop>({
        resource: "workshops",
        ids: workshopIds,
        queryOptions: {
            enabled: workshopIds.length > 0,
        },
    });

    return (
        <List
            canCreate={false}
            title={MLTextHelper("00001")}
            pageHeaderProps={{ extra: <RefreshButton /> }}
        >
            <Table {...tableProps} rowKey="id">
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
                    dataIndex="dayTime"
                    title={MLTextHelper("00015")}
                    render={(value) =>
                        <>
                            <TextField value={`${weekDays[value.day as number]} `} />
                            <TextField value={moment(value?.time?.[0])?.format("HH:mm")} />
                            {" - "}
                            <TextField value={moment(value?.time?.[1])?.format("HH:mm")} />
                        </>}
                    sorter
                />
            </Table>
        </List>
    );
}
