/* eslint-disable eqeqeq */
import { BooleanField, Button, DeleteButton, EditButton, EmailField, Form, NumberField, ShowButton, Space, Switch, TextField } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IParticipant, IUser } from "interfaces";

interface UserTableColumns {
    participants?: IParticipant[];
    isSessionUsers?: boolean;
    isEditing?: (id: string) => boolean;
    saveButtonProps: any;
    cancelButtonProps: any;
    editButtonProps: any;
    handleDeleteUser(record: any): void;
    handleShowModal(record: IUser, modalRole: "show" | "create"): void;
    handlePaymentStatusChange(id: string, newStatus: boolean): void;
    paymentStatusLoading: boolean;
}

export default function getUserTableColumns({
    handleShowModal, isEditing, participants, isSessionUsers, paymentStatusLoading,
    handleDeleteUser, cancelButtonProps, editButtonProps, handlePaymentStatusChange
}: UserTableColumns) {

    let userTableColumns: Array<any> = [
        {
            dataIndex: "nameSurname",
            title: MLTextHelper("00018"),
            render: (value: string) => <TextField value={value} />,
            sorter: true
        }, {
            dataIndex: "email",
            title: MLTextHelper("00019"),
            render: (value: string) => <EmailField value={value} />,
            sorter: true
        }, {
            dataIndex: "phone",
            title: MLTextHelper("00020"),
            render: (value: string) => <TextField value={value} />,
        },
    ];

    if (isSessionUsers) {
        userTableColumns.push({
            dataIndex: "id",
            title: MLTextHelper("00024"),
            sorter: true,
            render: (_: boolean, record: any) =>
                <Space>
                    {isEditing?.(record.id)
                        ? <Form.Item
                            name="isPaymentCompleted"
                            style={{ margin: 0 }}
                        >
                            <Switch loading={paymentStatusLoading} onChange={(value) => handlePaymentStatusChange(record.id, value)} checked={participants?.find(user => user.participantId === record.id)?.isPaymentCompleted} />
                        </Form.Item>
                        : <BooleanField valueLabelTrue="OK" valueLabelFalse="X" value={participants?.find(user => user.participantId === record.id)?.isPaymentCompleted} />

                    }

                    {isEditing?.(record.id)
                        ? (
                            <Space>
                                <Button
                                    {...cancelButtonProps}
                                    size="small"
                                >
                                    X
                                </Button>
                            </Space>)
                        : (
                            <Space>
                                <EditButton
                                    hideText
                                    {...editButtonProps(record.id)}
                                    size="small"
                                />
                            </Space>
                        )
                    }
                </Space>,
        });
    } else {
        userTableColumns.push({
            dataIndex: "actions",
            title: MLTextHelper("00001"),
            render: (value: string[], record: IUser) => (
                <Space>
                    <NumberField value={value?.length || 0} />
                    {value?.length ? <ShowButton hideText size="small" onClick={() => handleShowModal(record, "show")} /> : null}
                </Space>
            ),
            sorter: true
        });
    }

    userTableColumns.push({
        dataIndex: "workshops",
        title: MLTextHelper("00011"),
        render: (_: any, record: any) => (
            <Space>
                <DeleteButton size="small" onSuccess={() => handleDeleteUser(record)} resourceName="sessions" recordItemId={record.id} />
            </Space>
        )
    });

    return userTableColumns;
}