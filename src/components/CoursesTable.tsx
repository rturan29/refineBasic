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
                value: props.user?.courses
            }]
        });

    let courseIds = tableProps?.dataSource?.map((item) => item.courseId) ?? [];
    courseIds = courseIds.filter((item, i) => courseIds.indexOf(item) === i);
    const { data: coursesData, isLoading } = useMany<ICourse>({
        resource: "courses",
        ids: courseIds,
        queryOptions: {
            enabled: courseIds.length > 0,
        },
    });

    return (
        <List
            canCreate={false}
            title={"Courses"}
            pageHeaderProps={{ extra: <RefreshButton /> }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="courseId"
                    title="Course Name"
                    render={value => isLoading
                        ? <TextField value="Loading..." />
                        : <TextField value={coursesData?.data?.find((item) => item.id === value)?.title} />}
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
