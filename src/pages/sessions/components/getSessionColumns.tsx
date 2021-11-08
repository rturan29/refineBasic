/* eslint-disable eqeqeq */
import { Col, CreateButton, DateField, DeleteButton, EditButton, FilterDropdown, NumberField, Radio, Row, ShowButton, Space, TagField, TextField } from "@pankod/refine";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IParticipant, ISession, IWorkshop, sessionModalRole, workshopType } from "interfaces";
import moment, { weekdays } from "moment";

interface ColumnProps {
    isLoading: boolean;
    workshops?: IWorkshop[];
    isAdmin: boolean;
    activeWorkshopType: workshopType;
    handleShowModal: (record: ISession, newModalRole: sessionModalRole) => void;
}

export default function getSessionColumns({ isLoading, workshops, isAdmin, activeWorkshopType, handleShowModal }: ColumnProps) {

    let sessionColumns: any[] = [{
        dataIndex: "workshopId",
        title: MLTextHelper("00012"),
        render: (value: string) => isLoading
            ? <TextField value="Loading..." />
            : <TextField value={workshops?.find((item) => item.id === value)?.title} />,
        sorter: true
    }, {
        dataIndex: "teacher",
        title: MLTextHelper("00013"),
        render: (value: string) => <TextField value={value} />,
        sorter: true
    }, {
        dataIndex: "period",
        title: MLTextHelper("00014"),
        render: (value: ISession["period"]) => <> <DateField format="DD-MM-YYYY" value={value?.[0]} /> - <DateField format="DD-MM-YYYY" value={value?.[1]} /></>,
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
        render: (value: string) => <NumberField locale="tr" options={{ style: 'currency', currency: 'TRY' }} value={value} />,
        sorter: true
    },
    ];

    if (isAdmin) {
        if (activeWorkshopType == "group") {
            sessionColumns.push({
                dataIndex: "quota",
                title: MLTextHelper("00016"),
                sorter: true,
                render: (value: number) => <NumberField value={value || 0} />,
            });
        }

        sessionColumns.push({
            dataIndex: "participants",
            title: MLTextHelper("00004"),
            render: (value: IParticipant[], record: ISession) => (
                <Space>
                    <NumberField value={value?.length || 0} />
                    {value?.length ? <ShowButton hideText size="small" onClick={() => handleShowModal(record, "show")} /> : null}
                    {value?.length < record.quota || activeWorkshopType == "private" ? <CreateButton hideText size="small" onClick={() => handleShowModal(record, "create")} /> : null}
                </Space>
            ),
        }, {
            dataIndex: "status",
            title: MLTextHelper("00009"),
            sorter: true,
            render: (value: string) => <TagField value={value}></TagField>,
            filterDropdown: (props: any) => (
                <FilterDropdown {...props}>
                    <Radio.Group>
                        <Radio value="published">Published</Radio>
                        <Radio value="draft">Draft</Radio>
                        <Radio value="rejected">Rejected</Radio>
                        <Radio value="past">Past</Radio>
                        <Radio value="quotaFull">Quota-Full</Radio>
                    </Radio.Group>
                </FilterDropdown>
            )
        }, {
            dataIndex: "actions",
            title: MLTextHelper("00011"),
            render: (_: any, record: ISession) => (
                <Space>
                    <EditButton hideText size="small" recordItemId={record.id} />
                    <DeleteButton hideText size="small" recordItemId={record.id} />
                </Space>
            ),
        });

    } else {
        sessionColumns.push({
            title: MLTextHelper("00011"),
            dataIndex: "actions",
            render: (_: any, record: ISession) => (
                <Space>
                    <CreateButton onClick={() => handleShowModal(record, "apply")} size="small">{MLTextHelper("00045")}</CreateButton>
                </Space>
            )
        });
    }

    return sessionColumns;

}