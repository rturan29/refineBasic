/* eslint-disable eqeqeq */
import {
    Col, CreateButton, DateField, DeleteButton, EditButton, FilterDropdown,
    FilterDropdownProps,
    NumberField, Radio, Row, Select, ShowButton, Space, TagField, TextField
} from "@pankod/refine";
import { statusList } from "helpers/MLHelper";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { Colors, IParticipant, ISession, IWorkshop, StatusType, TModalRole } from "interfaces";
import moment, { weekdays } from "moment";

interface SessionColumns {
    isAdmin: boolean;
    isLoading: boolean;
    tableStatusList: Array<{ id: string, status: string; }>;
    handleStatusChange: (id: string, newStatus: string) => void;
    showModal: (args: { role: TModalRole, record?: IWorkshop, plan?: ISession; }) => void;
}

export default function getPlanColumns({ isAdmin, showModal, isLoading, tableStatusList, handleStatusChange }: SessionColumns) {

    function renderStatusField(value: string, record: IWorkshop) {
        return value == "past" || value == "quotaFull"
            ? <Select
                options={statusList.map(status => ({ value: status.value, label: status.caption }))}
                onChange={value => handleStatusChange(record.id, value)}
                value={tableStatusList.find(status => status.id == record.id)?.status}
                style={{ minWidth: "120px" }}
                loading={isLoading}
            />
            : <TagField color={getStatusColor(value as StatusType)} value={value}></TagField>;
    }

    let sessionColumns: any[] = [
        {
            dataIndex: "period",
            title: MLTextHelper("00014"),
            render: (value: ISession["period"]) => <> <DateField format="DD-MM-YYYY" value={value?.[0]} /> - <DateField format="DD-MM-YYYY" value={value?.[1]} /></>,
            sorter: true
        }, {
            dataIndex: "teacher",
            title: MLTextHelper("00013"),
            render: (value: string) => <TextField value={value} />,
            sorter: true
        }, {
            dataIndex: "plans",
            title: MLTextHelper("00051"),
            render: ((value: ISession["plans"]) => value?.map((plan, i) => (
                <Row key={i}>
                    <Col span="10">
                        <TextField value={`${weekdays(plan.day)}  `} />
                    </Col>
                    <Col>
                        <TextField value={moment(plan?.time?.[0])?.format("HH:mm")} />
                        {" - "}
                        <TextField value={moment(plan?.time?.[1])?.format("HH:mm")} />
                    </Col>
                </Row>
            ))),
            sorter: true
        }, {
            dataIndex: "paymentAmount",
            title: MLTextHelper("00017"),
            render: (value: string) => <NumberField locale="tr" options={{ style: 'currency', currency: 'TRY' }} value={value || 0} />,
            sorter: true
        },
    ];

    if (isAdmin) {

        sessionColumns.push({
            dataIndex: "quota",
            title: MLTextHelper("00016"),
            sorter: true,
            render: (value: number) => <NumberField value={value || 0} />,
        }, {
            dataIndex: "participants",
            title: MLTextHelper("00004"),
            render: (value: IParticipant[], record: ISession) => (
                <Space>
                    <NumberField value={value?.length || 0} />
                    {value?.length ? <ShowButton hideText size="small" onClick={() => showModal({ role: "showParticipants", plan: record })} /> : null}
                    {value?.length < record.quota ? <CreateButton hideText size="small" onClick={() => showModal({ role: "apply", plan: record })} /> : null}
                </Space>
            ),
        }, {
            dataIndex: "status",
            title: MLTextHelper("00009"),
            sorter: true,
            render: renderStatusField,
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
            render: (_: any, record: ISession) => (
                <Space>
                    <EditButton onClick={() => showModal({ role: "editPlan", plan: record })} hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            ),
        });

    } else {
        sessionColumns.push({
            title: "",
            dataIndex: "actions",
            render: (_: any, record: ISession) => (
                <Space>
                    <CreateButton onClick={() => showModal({ role: "apply", plan: record })} size="small">{MLTextHelper("00045")}</CreateButton>
                </Space>
            )
        });
    }
    return sessionColumns;
}

function getStatusColor(status: StatusType): Colors {
    switch (status) {
        case "published":
            return "success";
        case "canceled":
            return "error";
        case "past":
            return "orange";
        case "quotaFull":
            return "volcano";
        case "draft":
        default:
            return "default";
    }
}