import { CreateButton, DatePicker, DeleteButton, Form, Input, InputNumber, Select, Space } from '@pankod/refine';
import { TimePicker } from "antd";
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { IWorkshop } from 'interfaces';
import { weekdays } from 'moment';
import React from 'react';

const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;

type AddPlanProps = React.PropsWithChildren<{
    workshop: IWorkshop;
}>;

export default function AddPlan({ workshop }: AddPlanProps) {

    const { type: workshopType } = workshop;


    function getPlanColumn() {
        return (
            <Form.List name={"plans"} >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        {fields.map(({ key, name, fieldKey, ...restField }) => (
                            <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                                <Form.Item
                                    {...restField}
                                    name={[name, 'day']}
                                    fieldKey={[fieldKey, 'day']}
                                    rules={[{ required: true, message: 'Missing day' }]}
                                    style={{ width: "150px" }}
                                >
                                    <Select
                                        placeholder={MLTextHelper("00025")}
                                        options={weekdays().map((label, value) => ({ label, value }))} />
                                </Form.Item>
                                <Form.Item
                                    {...restField}
                                    name={[name, 'time']}
                                    fieldKey={[fieldKey, 'time']}
                                    rules={[{ required: true, message: 'Missing time' }]}
                                >
                                    <TimeRangePicker
                                        placeholder={[MLTextHelper("00046"), MLTextHelper("00047")]}
                                        disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 7]}
                                        hideDisabledOptions
                                        minuteStep={30} format="HH:mm" />
                                </Form.Item>
                                <DeleteButton onClick={() => remove(name)} style={{ marginLeft: "15px" }} size="small" hideText />
                            </Space>
                        ))}
                        <Form.Item>
                            <CreateButton onClick={() => add()} size="small" >{MLTextHelper("00050")}</CreateButton>
                            <Form.ErrorList errors={errors} />
                        </Form.Item>
                    </>
                )
                }
            </Form.List>
        );
    }

    return (
        <>

            <Form.Item
                label={MLTextHelper("00009")}
                name="status"
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { label: "Published", value: "published", },
                        { label: "Draft", value: "draft", },
                        { label: "Canceled", value: "canceled", }
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
                rules={[{ required: workshopType === "group" }]}
            >
                <DateRangePicker placeholder={[MLTextHelper("00048"), MLTextHelper("00049")]} format="DD-MM-YYYY" />
            </Form.Item>

            {getPlanColumn()}

            {workshopType === "group"
                ? <Form.Item
                    label={MLTextHelper("00016")}
                    name="quota"
                    rules={[{ required: true }]}
                >
                    <InputNumber min={0} precision={0} />
                </Form.Item>
                : null}

            <Form.Item
                label={MLTextHelper("00017")}
                name="paymentAmount"
                rules={[{ required: true }]}
            >
                <Input addonBefore={<>&#8378;</>} type="number" min="0" step="0.01" data-type="currency" />
            </Form.Item>
        </>
    );
}
