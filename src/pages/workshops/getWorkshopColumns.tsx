import {
    Radio, Space, TextField, TagField, FilterDropdownProps, FilterDropdown,
    MarkdownField, ShowButton, EditButton, DeleteButton, HistoryType
} from "@pankod/refine";
import getWorkshopType from "helpers/MLHelper/getWorkshopType";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IWorkshop, workshopType } from "interfaces";

interface WorkshopColumnProps {
    isAdmin: boolean;
    showWorkshop: (resource: string, id: string, type?: HistoryType | undefined) => void;
}

export default function getWorkshopColumns({ isAdmin, showWorkshop }: WorkshopColumnProps) {
    const workshopColumns: Array<any> = [{
        dataIndex: "title",
        title: MLTextHelper("00006"),
        sorter: true,
        render: (value: string, record: IWorkshop) => <TextField style={{ cursor: "pointer" }} onClick={() => showWorkshop("workshops", record.id)} value={value} />,
    }, {
        dataIndex: "category",
        title: MLTextHelper("00007"),
        sorter: true,
        render: (value: string) => <TextField value={value} />,
    }, {
        dataIndex: "type",
        title: MLTextHelper("00008"),
        sorter: true,
        render: (value: workshopType) => <TagField value={getWorkshopType(value)} />,
        filterDropdown: (props: FilterDropdownProps) => (
            <FilterDropdown {...props}>
                <Radio.Group>
                    <Radio value="private">Private</Radio>
                    <Radio value="group">Group</Radio>
                </Radio.Group>
            </FilterDropdown>
        )
    }, {
        dataIndex: "description",
        title: MLTextHelper("00010"),
        sorter: true,
        render: (value: string) => <MarkdownField value={value} />,
    },
    ];

    if (isAdmin) {
        workshopColumns.push(
            {
                dataIndex: "status",
                title: MLTextHelper("00009"),
                sorter: true,
                render: (value: string) => <TagField value={value} />,
                filterDropdown: (props: FilterDropdownProps) => (
                    <FilterDropdown {...props}>
                        <Radio.Group>
                            <Radio value="published">Published</Radio>
                            <Radio value="draft">Draft</Radio>
                            <Radio value="rejected">Rejected</Radio>
                        </Radio.Group>
                    </FilterDropdown>
                )
            }, {
            dataIndex: "actions",
            title: MLTextHelper("00011"),
            render: (_: any, record: IWorkshop) => (
                <Space>
                    <ShowButton hideText size="small" recordItemId={record.id} />
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            )
        }
        );
    }

    return workshopColumns;
}