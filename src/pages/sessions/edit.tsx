import React, { useEffect, useState } from "react";
import {
    Edit, Form, Input, Select, IResourceComponentsProps, useForm, DatePicker, Authenticated,
    InputNumber, useSelect, useNavigation, usePermissions, CreateButton, DeleteButton, Space,
} from "@pankod/refine";
import { TimePicker } from "antd";
import "react-mde/lib/styles/css/react-mde-all.css";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { ISession, IWorkshop } from "interfaces";
import { weekdays } from "moment";
const { RangePicker: DateRangePicker } = DatePicker;
const { RangePicker: TimeRangePicker } = TimePicker;


export const SessionEdit: React.FC<IResourceComponentsProps> = () => {
    const { formProps, saveButtonProps, queryResult } = useForm<ISession>();
    const [selectedWorkshop, setSelectedWorkshop] = useState<string>();

    const isAdmin = usePermissions().data?.role === "admin";

    const { push } = useNavigation();

    const { selectProps: workshopSelectProps, queryResult: workshopQueryResult } = useSelect<IWorkshop>({ resource: "workshops", optionLabel: "title", optionValue: "id", });
    const workshopType = workshopQueryResult.data?.data?.find(workshop => workshop.id === selectedWorkshop)?.type;

    useEffect(() => {
        if (!isAdmin) {
            push("/sessions");
        }
    }, [isAdmin, push]);

    useEffect(() => {
        setSelectedWorkshop(queryResult?.data?.data.workshopId);
    }, [queryResult?.data?.data.workshopId]);


    return (
        <Authenticated>
            <Edit saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label={MLTextHelper("00012")}
                        name="workshopId"
                        rules={[{ required: true }]}
                    >
                        <Select onChange={(value: unknown) => setSelectedWorkshop((value as string))}{...workshopSelectProps} />
                    </Form.Item>

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
                                            <Select placeholder={MLTextHelper("00025")} options={weekdays().map((label, value) => ({ label, value }))} />
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
                </Form>
            </Edit>
        </Authenticated>
    );
};
