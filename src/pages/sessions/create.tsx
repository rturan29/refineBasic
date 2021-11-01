import React, { useState } from "react";
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
import MLTextHelper from "helpers/MLHelper/MLHelper";

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

export const SessionCreate: React.FC<IResourceComponentsProps> = () => {
    const [selectedWorkshop, setSelectedWorkshop] = useState<string>();
    const { formProps, saveButtonProps } = useForm<IPost>({ redirect: "list" });


    const { selectProps: workshopSelectProps, queryResult } = useSelect<IWorkshop>({
        resource: "workshops", optionLabel: "title",
        optionValue: "id",
    });

    const workshopType = queryResult.data?.data?.find(workshop => workshop.id === selectedWorkshop)?.type;

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label={MLTextHelper("00012")}
                    name="workshopId"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select onChange={(value: unknown) => setSelectedWorkshop((value as string))}{...workshopSelectProps} />
                </Form.Item>

                <Form.Item
                    label={MLTextHelper("00009")}
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
                    label={MLTextHelper("00013")}
                    name="teacher"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label={MLTextHelper("00014")}
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
                    noStyle
                >
                    {workshopType === "private"
                        ? weekDays.map(day =>
                            <Row key={day}>
                                <Col>
                                    <Form.Item label={day} name={["dayTime", "time"]}>
                                        <TimeRangePicker disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7]} hideDisabledOptions minuteStep={30} format="HH:mm" />
                                    </Form.Item>
                                </Col>
                            </Row>)
                        : <Row >
                            <Col span={3}>
                                <Form.Item label={MLTextHelper("00025")} name={["dayTime", "day"]}>
                                    <Select options={weekDays.map((label, value) => ({ label, value }))} />
                                </Form.Item>
                            </Col>
                            <Col offset={1} >
                                <Form.Item label={MLTextHelper("00026")} name={["dayTime", "time"]}>
                                    <TimeRangePicker disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7]} hideDisabledOptions minuteStep={30} format="HH:mm" />
                                </Form.Item>
                            </Col>
                        </Row>
                    }
                </Form.Item>

                {workshopType === "group"
                    ? <Form.Item
                        label={MLTextHelper("00016")}
                        name="quota"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <InputNumber min={0} precision={0} />
                    </Form.Item>
                    : null}

                <Form.Item
                    label={MLTextHelper("00017")}
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
