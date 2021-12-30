/* eslint-disable eqeqeq */
import {
    Radio, Space, TextField, FilterDropdownProps, FilterDropdown,
    MarkdownField, EditButton, DeleteButton, Select, CreateButton
} from "@pankod/refine";
import { statusList } from "helpers/MLHelper";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshop, TModalRole } from "interfaces";

interface WorkshopColumnProps {
    isAdmin: boolean;
    isLoading: boolean;
    tableStatusList: Array<{ id: string, status: string; }>;
    handleStatusChange: (id: string, newStatus: string) => void;
    showModal: (args: { role: TModalRole, record?: IWorkshop, plan?: ISession; }) => void;
}


export default function getWorkshopColumns({ isAdmin, tableStatusList, handleStatusChange, isLoading, showModal }: WorkshopColumnProps) {


    const workshopColumns: Array<any> = [{
        dataIndex: "title",
        title: MLTextHelper("00006"),
        sorter: true,
        render: (value: string, record: IWorkshop) =>
            <TextField
                style={{ cursor: "pointer" }}
                onClick={() => showModal({ role: "show", record })}
                value={value}
            />,

    }, {
        dataIndex: "description",
        title: MLTextHelper("00010"),
        sorter: true,
        render: (value: string, record: IWorkshop) =>
            <div style={{ cursor: "pointer" }} onClick={() => showModal({ role: "show", record })} >
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
                    <CreateButton onClick={() => showModal({ role: "showPlans", record })} size="small">{MLTextHelper("00065")}</CreateButton>
                    <EditButton onClick={() => showModal({ role: "edit", record })} size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            )
        }
        );
    } else {
        workshopColumns.push({
            title: MLTextHelper("00011"),
            dataIndex: "actions",
            render: (_: any, record: IWorkshop) => (
                <Space>
                    <CreateButton onClick={() => showModal({ role: "showPlans", record })} size="small">{MLTextHelper("00065")}</CreateButton>
                </Space>
            )
        });
    }

    return workshopColumns;
}
