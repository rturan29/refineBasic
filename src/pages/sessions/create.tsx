import React from "react";
import {
    Form,
    Input,
    Select,
    IResourceComponentsProps,
    useSelect,
    Create,
    useForm,
    DatePicker,
    InputNumber,
    Row,
    Col,
} from "@pankod/refine";


import "react-mde/lib/styles/css/react-mde-all.css";
import { TimePicker } from "antd";
import { weekDays } from "interfaces/lists";

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

export const SessionCreate: React.FC<IResourceComponentsProps> = () => {

    const { formProps, saveButtonProps } = useForm<IPost>({ redirect: "list" });

    const { selectProps: workshopSelectProps } = useSelect<IWorkshop>({
        resource: "workshops", optionLabel: "title",
        optionValue: "id",
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Workshop Name"
                    name="workshopId"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...workshopSelectProps} />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                label: "Published",
                                value: "published",
                            },
                            {
                                label: "Draft",
                                value: "draft",
                            },
                            {
                                label: "Canceled",
                                value: "canceled",
                            }
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Teacher"
                    name="teacher"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Period"
                    name="period"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DateRangePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                    label="Day Time"
                >
                    <Row>
                        <Col span="3">
                            <Form.Item name={["dayTime", "day"]}>
                                <Select options={weekDays.map((label, value) => ({ label, value }))} />
                            </Form.Item>
                        </Col>
                        <Col offset={1} >
                            <Form.Item name={["dayTime", "time"]}>
                                <TimeRangePicker format="HH:mm" />
                            </Form.Item>

                        </Col>
                    </Row>
                </Form.Item>

                <Form.Item
                    label="Quota"
                    name="quota"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <InputNumber min={0} precision={0} />
                </Form.Item>

                <Form.Item
                    label="Payment Amount"
                    name="paymentAmount"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input addonBefore={<>&#8378;</>} type="number" min="0" step="0.01" data-type="currency" />
                </Form.Item>
            </Form>
        </Create>
    );
};
