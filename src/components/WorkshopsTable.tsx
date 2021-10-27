import { Table, TextField, List, useTable, RefreshButton, DateField, useMany } from '@pankod/refine';
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
            title={"Workshops"}
            pageHeaderProps={{ extra: <RefreshButton /> }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="workshopId"
                    title="Workshop Name"
                    render={value => isLoading
                        ? <TextField value="Loading..." />
                        : <TextField value={workshopsData?.data?.find((item) => item.id === value)?.title} />}
                    sorter
                />

                <Table.Column
                    dataIndex="teacher"
                    title="Teacher"
                    render={(value) => <TextField value={value} />}
                    sorter
                />
                <Table.Column
                    dataIndex="startDate"
                    title="Start Date"
                    render={(value) => <DateField format="DD-MM-YYYY" value={value} />}
                    sorter
                />
                <Table.Column
                    dataIndex="endDate"
                    title="End Date"
                    render={(value) => <DateField format="DD-MM-YYYY" value={value} />}
                    sorter
                />
            </Table>
        </List>
    );
}
