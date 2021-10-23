import { useState } from "react";
import {
    Edit,
    Form,
    Input,
    Select,
    IResourceComponentsProps,
    useForm,
    DatePicker,
    InputNumber,
    useSelect,
} from "@pankod/refine";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

export const SessionEdit: React.FC<IResourceComponentsProps> = () => {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const { formProps, saveButtonProps } = useForm<ISession>();

    const { selectProps: courseSelectProps } = useSelect<ICourse>({
        resource: "courses", optionLabel: "title",
        optionValue: "id",
    });

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Course Name"
                    name="courseId"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select {...courseSelectProps} />
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
                    label="Start Date"
                    name="startDate"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DatePicker format="DD-MM-YYYY" />
                </Form.Item>
                <Form.Item
                    label="End Date"
                    name="endDate"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <DatePicker format="DD-MM-YYYY" />
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

                <Form.Item
                    label="Description"
                    name="description"
                >
                    <ReactMde
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={(markdown) =>
                            Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
                        }
                    />
                </Form.Item>
            </Form>
        </Edit>
    );
};
