import { Table, TextField, EmailField, Space, ShowButton, DeleteButton, List, useTable, BooleanField, useDelete, useUpdate, RefreshButton, CreateButton, NumberField } from '@pankod/refine';
import { arrayRemove } from 'firebase/firestore';
import React from 'react';
import { isNullOrUndefined } from 'util';

type UserTableProps = React.PropsWithChildren<{
    participants?: IParticipant[];
    isSessionUsers?: boolean;
    sessionId?: string;
    showCourses?: (id?: string | undefined) => void;
    setUserCurrentRow?: (value: IUser) => void;
    resetSessionData?: () => void;
}>;

export default function UserTable(props: UserTableProps) {


    const { tableProps, tableQueryResult } = useTable<IUser>(
        {
            resource: "users",
            permanentFilter: [{
                field: "id",
                operator: "in",
                value: props.participants?.map(participants => participants.participantId)?.filter(id => !isNullOrUndefined(id))
            }]
        });

    const { mutate: deleteData } = useDelete();
    const { mutate: updateData } = useUpdate();

    function handleDeleteUser(record: any) {
        if (props.isSessionUsers && props.sessionId && props.participants) {
            const participants = props.participants.filter(participant => participant.participantId !== record.id);
            updateData({ resource: `sessions`, id: props.sessionId, values: { participants } });
            updateData({ resource: `users`, id: record.id, values: { courses: arrayRemove(props.sessionId) } });
            setTimeout(() => {
                props.resetSessionData?.();
            }, 1000);

        } else {
            deleteData({ resource: "users", id: record.id, });
            setTimeout(() => {
                tableQueryResult.refetch();
            }, 1000);
        }
    }

    function handleShowModal(record: IUser, modalRole: "show" | "create") {
        props.setUserCurrentRow?.(record);
        props.showCourses?.();
    }

    return (
        <List
            canCreate={!props.isSessionUsers}
            title={"Users"}
            pageHeaderProps={{ extra: <><RefreshButton /><CreateButton /></> }}
        >
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    dataIndex="nameSurname"
                    title="Name Surname"
                    render={(value) => <TextField value={value} />}
                    sorter
                />
                <Table.Column
                    dataIndex="email"
                    title="Email"
                    render={value => <EmailField value={value} />}
                    sorter
                />
                <Table.Column
                    dataIndex="phone"
                    title="Phone"
                    render={(value) => <TextField value={value} />}
                    sorter
                />
                {props.isSessionUsers
                    ? <Table.Column<IUser>
                        dataIndex="paymentCompleted"
                        title="Payment Completed"
                        render={(_, record) => <BooleanField value={props.participants?.find(user => user.participantId === record.id)} />}
                        sorter
                    />
                    : <Table.Column<IUser>
                        dataIndex="courses"
                        title="Courses"
                        render={(value, record) => (
                            <Space>
                                <NumberField value={value?.length || 0} />
                                {value?.length ? <ShowButton hideText size="small" onClick={() => handleShowModal(record, "show")} /> : null}
                            </Space>
                        )}
                        sorter
                    />
                }

                <Table.Column<IUser>
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <DeleteButton size="small" onClick={() => handleDeleteUser(record)} resourceName="sessions" recordItemId={record.id} />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
}
