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
} from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { WorkshopCreate } from ".";

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps, sorter } = useTable<IWorkshop>();

    const { modalProps, formProps, show } = useModalForm<ISession>({ action: "create", redirect: "list" });


    return (
        <>
            <List createButtonProps={{
                onClick: () => show(),
            }}
            >
                <Table {...tableProps} rowKey="id">
                    <Table.Column
                        dataIndex="title"
                        title={MLTextHelper("00006")}
                        render={(value) => <TextField value={value} />}
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
                        render={(value) => <TagField value={value} />}
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
                    <Table.Column
                        dataIndex="description"
                        title={MLTextHelper("00010")}
                        render={(value) => <MarkdownField value={value} />}
                    />
                    <Table.Column<IPost>
                        title={MLTextHelper("00011")}
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
            <Modal {...modalProps}>
                <Form {...formProps} layout="vertical">
                    <WorkshopCreate />
                </Form>
            </Modal>
        </>
    );
};
