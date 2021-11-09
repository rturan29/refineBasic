/* eslint-disable react-hooks/exhaustive-deps */
import { Table, List, useEditableTable, useDelete, useUpdate, RefreshButton, CreateButton, Form, } from '@pankod/refine';
import { IParticipant, IUser } from 'interfaces';
import getUserTableColumns from "./getUserTableColumns";
import React, { useEffect, useState } from 'react';
import _ from "lodash";

type UserTableProps = React.PropsWithChildren<{
    participants?: IParticipant[];
    isSessionUsers?: boolean;
    sessionId?: string;
    showWorkshops?: (id?: string | undefined) => void;
    setUserCurrentRow?: (value: IUser) => void;
    resetSessionData?: () => void;
}>;

export default function UserTable({ participants: _participants, isSessionUsers, sessionId, showWorkshops, setUserCurrentRow, resetSessionData }: UserTableProps) {

    const [participants, setParticipants] = useState<IParticipant[]>([]);

    const participantList = _participants?.map(({ participantId }) => participantId) || [];

    const { tableProps, tableQueryResult, formProps, isEditing, saveButtonProps, cancelButtonProps, editButtonProps, } = useEditableTable<IUser>({ resource: "users", });

    useEffect(() => {
        if (_participants) {
            setParticipants(_participants);
        }
    }, []);

    if (isSessionUsers) {
        tableProps.dataSource = tableProps.dataSource?.filter(user => participantList?.includes(user.id));
    }

    const { mutate: deleteData } = useDelete();
    const { mutate: updateData, isLoading } = useUpdate();

    function handleShowModal(record: IUser) {
        setUserCurrentRow?.(record);
        showWorkshops?.();
    }

    function handleDeleteUser(record: IUser) {
        if (isSessionUsers && sessionId && participants) {

            updateData({ resource: `sessions`, id: sessionId, values: { participants: _.pullAllBy(participants, [{ participantId: record.id }], "participantId") } });
            updateData({ resource: `users`, id: record.id, values: { workshops: _.pull(record.workshops, sessionId) } });

            setTimeout(() => {
                resetSessionData?.();
            }, 1000);

        } else {
            deleteData({ resource: "users", id: record.id, });
            setTimeout(() => {
                tableQueryResult.refetch();
            }, 1000);
        }
    }

    function handlePaymentStatusChange(id: string, newStatus: boolean) {
        if (sessionId && _participants) {
            _participants = _.unionBy([{ participantId: id, isPaymentCompleted: newStatus }], _participants, "participantId");

            updateData({ resource: "sessions", id: sessionId, values: { participants: _participants } });

            setParticipants(_participants);

            setTimeout(() => {
                tableQueryResult.refetch();
            }, 1000);
        }
    }

    return (
        <List
            canCreate={!isSessionUsers}
            title={"Users"}
            pageHeaderProps={{ extra: <><RefreshButton /><CreateButton /></> }}
        >
            <Form {...formProps}>

                <Table
                    columns={getUserTableColumns({
                        participants,
                        isSessionUsers,
                        isEditing,
                        saveButtonProps,
                        cancelButtonProps,
                        editButtonProps,
                        handleDeleteUser,
                        handleShowModal,
                        handlePaymentStatusChange,
                        paymentStatusLoading: isLoading
                    })}
                    {...tableProps} rowKey="id">


                </Table>

            </Form>
        </List>
    );
}