/* eslint-disable eqeqeq */
import {
    Radio, Space, TextField, FilterDropdownProps, FilterDropdown,
    MarkdownField, EditButton, DeleteButton, HistoryType, Select
} from "@pankod/refine";
import { statusList } from "helpers/MLHelper";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IWorkshop } from "interfaces";

interface WorkshopColumnProps {
    isAdmin: boolean;
    isLoading: boolean;
    tableStatusList: Array<{ id: string, status: string; }>;
    showWorkshop: (resource: string, id: string, type?: HistoryType | undefined) => void;
    handleStatusChange: (id: string, newStatus: string) => void
}


export default function getWorkshopColumns({ isAdmin, showWorkshop, tableStatusList, handleStatusChange, isLoading }: WorkshopColumnProps) {


    const workshopColumns: Array<any> = [{
        dataIndex: "title",
        title: MLTextHelper("00006"),
        sorter: true,
        render: (value: string, record: IWorkshop) =>
            <TextField
                style={{ cursor: "pointer" }}
                onClick={() => showWorkshop("workshops", record.id)}
                value={value}
            />,

    }, {
        dataIndex: "description",
        title: MLTextHelper("00010"),
        sorter: true,
        render: (value: string, record: IWorkshop) =>
            <div style={{ cursor: "pointer" }} onClick={() => showWorkshop("workshops", record.id)} >
                <MarkdownField
                    value={value}
                />
            </div>,
    },
    ];

    if (isAdmin) {
        workshopColumns.push(
            {
                dataIndex: "status",
                title: MLTextHelper("00009"),
                sorter: true,
                render: (value: string, record: IWorkshop) =>
                    <Select
                        options={statusList.map(status => ({ value: status.value, label: status.caption }))}
                        onChange={value => handleStatusChange(record.id, value)}
                        value={tableStatusList.find(status => status.id == record.id)?.status}
                        style={{ minWidth: "120px" }}
                        loading={isLoading}
                    />,
                filterDropdown: (props: FilterDropdownProps) => (
                    <FilterDropdown {...props}>
                        <Radio.Group>
                            {statusList.map(status => <Radio value={status.value}>{status.caption}</Radio>)}
                        </Radio.Group>
                    </FilterDropdown>
                )
            }, {
            dataIndex: "actions",
                title: "",
            render: (_: any, record: IWorkshop) => (
                <Space>
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            )
        }
        );
    } else {
        workshopColumns.push();
    }

    return workshopColumns;
}
