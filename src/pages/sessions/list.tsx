import { arrayUnion } from "@firebase/firestore";
import {
    List,
    Table,
    TextField,
    useTable,
    IResourceComponentsProps,
    TagField,
    FilterDropdown,
    Radio,
    MarkdownField,
    Space,
    EditButton,
    ShowButton,
    DeleteButton,
    DateField,
    NumberField,
    Modal,
    useMany,
    useModal,
    CreateButton,
    Form,
    useForm,
    useUpdate,
    RefreshButton,
} from "@pankod/refine";
import AddUserToSession from "components/UserTable/AddUserToSession";
import UserTable from "components/UserTable/UserTable";
import { useState } from "react";

export const SessionList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, tableQueryResult } = useTable<ISession>();
    const [currentRow, setCurrentRow] = useState<ISession | null>(null);
    const [modalRole, setModalRole] = useState<"show" | "create">("show");

    const { modalProps, show, close } = useModal();
    const { form, formProps } = useForm();
    const { mutate } = useUpdate();

    let courseIds = tableProps?.dataSource?.map((item) => item.courseId) ?? [];
    courseIds = courseIds.filter((item, i) => courseIds.indexOf(item) === i);
    const { data: coursesData, isLoading } = useMany<ICourse>({
        resource: "courses",
        ids: courseIds,
        queryOptions: {
            enabled: courseIds.length > 0,
        },
    });

    const customModalprops = {
        ...modalProps,
        onOk: handleCloseModal,
        closable: true,
        width: modalRole === "show" ? 1250 : 500,
        title: modalRole === "show" ? "Show Participants" : "Add Participant",
        footer: modalRole === "show" ? null : undefined
    };

    function handleShowModal(record: ISession, modalRole: "show" | "create") {
        setCurrentRow(record);
        setModalRole(modalRole);
        show();
    }

    function handleCloseModal() {
        close();
        if (modalRole === "create") {
            if (currentRow?.id) {
                const formContent: IParticipant = form.getFieldsValue() as any;

                mutate({
                    resource: `sessions`, id: currentRow?.id, values: { participants: arrayUnion(formContent) }
                });

                mutate({
                    resource: "users", id: formContent.participantId, values: { courses: arrayUnion(currentRow.id) }
                });

                form.resetFields();
                setTimeout(() => {
                    tableQueryResult.refetch();
                }, 1000);
            }
        }
    }

    return (
        <>
            <List
                pageHeaderProps={{ extra: <><RefreshButton /><CreateButton /></> }}
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
                        dataIndex="status"
                        title="Status"
                        render={value => <TagField value={value} />}
                        sorter
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Radio.Group>
                                    <Radio value="published">Published</Radio>
                                    <Radio value="draft">Draft</Radio>
                                    <Radio value="rejected">Rejected</Radio>
                                </Radio.Group>
                            </FilterDropdown>
                        )}
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

                    <Table.Column
                        dataIndex="quota"
                        title="Quata"
                        render={(value) => <NumberField value={value} />}
                        sorter
                    />
                    <Table.Column
                        dataIndex="paymentAmount"
                        title="PaymentAmount"
                        render={(value) => <NumberField locale="tr" options={{ style: 'currency', currency: 'TRY' }} value={value} />}
                        sorter
                    />

                    <Table.Column
                        dataIndex="description"
                        title="Description"
                        render={(value) => <MarkdownField value={value} />}
                    />
                    <Table.Column<ISession>
                        title="Participants"
                        dataIndex="participants"
                        render={(value, record) => (
                            <Space>
                                <NumberField value={value?.length || 0} />
                                {value?.length ? <ShowButton hideText size="small" onClick={() => handleShowModal(record, "show")} /> : null}
                                <CreateButton hideText size="small" onClick={() => handleShowModal(record, "create")} />
                            </Space>
                        )}
                    />
                    <Table.Column<ISession>
                        title="Actions"
                        dataIndex="actions"
                        render={(_, record) => (
                            <Space>
                                <EditButton hideText size="small" recordItemId={record.id} />
                                <ShowButton hideText size="small" recordItemId={record.id} />
                                <DeleteButton hideText size="small" recordItemId={record.id} />
                            </Space>
                        )}
                    />
                </Table>
            </List>
            <Modal {...customModalprops} >
                {modalRole === "show"
                    ? <UserTable participants={currentRow?.participants} isSessionUsers sessionId={currentRow?.id} resetSessionData={tableQueryResult.refetch} />
                    : (<Form {...formProps} onFinish={(values) => console.log(values)}>
                        <AddUserToSession participants={currentRow?.participants} />
                    </Form>)
                }
            </Modal>
        </>
    );
};
