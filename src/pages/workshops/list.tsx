import {
    List,
    Table,
    TextField,
    useTable,
    IResourceComponentsProps,
    getDefaultSortOrder,
    TagField,
    FilterDropdown,
    Radio,
    MarkdownField,
    Space,
    EditButton,
    ShowButton,
    DeleteButton,
    useModalForm,
    Form,
    Modal,
    usePermissions,
    Authenticated,
    CrudFilter,
    useNavigation,
} from "@pankod/refine";
import getWorkshopType from "helpers/MLHelper/getWorkshopType";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IWorkshop, ISession } from "interfaces";
import { WorkshopCreate } from ".";

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {
    const { show: showWorkshop } = useNavigation();
    const { data: permissionsData } = usePermissions();
    const isAdmin = permissionsData?.role === "admin";

    const permanentFilter: CrudFilter[] = [];
    if (!isAdmin) {
        permanentFilter.push({
            field: "status",
            operator: "eq",
            value: "published"
        });
    }

    const { tableProps, sorter } = useTable<IWorkshop>({ permanentFilter });

    const { modalProps, formProps, show, close } = useModalForm<ISession>({ action: "create", redirect: "list" });

    function renderAdminColumns() {
        return (
            <>
                <Table.Column
                    dataIndex="status"
                    title={MLTextHelper("00009")}
                    render={(value: string) => <TagField value={value} />}
                    defaultSortOrder={getDefaultSortOrder("status", sorter)}
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
                <Table.Column<IWorkshop>
                    title={MLTextHelper("00011")}
                    dataIndex="actions"
                    render={(_, record) => (
                        <Space>
                            <ShowButton hideText size="small" recordItemId={record.id} />
                            <EditButton hideText size="small" recordItemId={record.id} />
                            <DeleteButton hideText size="small" recordItemId={record.id} />

                        </Space>
                    )}
                />
            </>);
    }

    return (
        <Authenticated>
            <List
                createButtonProps={{ onClick: () => show(), }}
                canCreate={isAdmin}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column<IWorkshop>
                        dataIndex="title"
                        title={MLTextHelper("00006")}
                        render={(value, record) => <TextField style={{ cursor: "pointer" }} onClick={() => showWorkshop("workshops", record.id)} value={value} />}
                        defaultSortOrder={getDefaultSortOrder("title", sorter)}
                        sorter
                    />
                    <Table.Column
                        dataIndex="category"
                        title={MLTextHelper("00007")}
                        render={(value) => <TextField value={value} />}
                        defaultSortOrder={getDefaultSortOrder("createdAt", sorter)}
                        sorter
                    />
                    <Table.Column
                        dataIndex="type"
                        title={MLTextHelper("00008")}
                        render={(value) => <TagField value={getWorkshopType(value)} />}
                        defaultSortOrder={getDefaultSortOrder("type", sorter)}
                        sorter
                        filterDropdown={(props) => (
                            <FilterDropdown {...props}>
                                <Radio.Group>
                                    <Radio value="private">Private</Radio>
                                    <Radio value="group">Group</Radio>
                                </Radio.Group>
                            </FilterDropdown>
                        )}
                    />
                    <Table.Column
                        dataIndex="description"
                        title={MLTextHelper("00010")}
                        render={(value) => <MarkdownField value={value} />}
                    />
                    {isAdmin ? renderAdminColumns() : null}

                </Table>
            </List>
            <Modal {...modalProps}>
                <Form {...formProps} layout="vertical">
                    <WorkshopCreate close={close} />
                </Form>
            </Modal>
        </Authenticated>
    );
};
