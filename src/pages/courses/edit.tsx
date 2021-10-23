import { useState } from "react";
import {
    Edit,
    Form,
    Input,
    Select,
    IResourceComponentsProps,
    useForm,
} from "@pankod/refine";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";

export const CourseEdit: React.FC<IResourceComponentsProps> = () => {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const { formProps, saveButtonProps, queryResult } = useForm<ICourse>();

    console.log(queryResult);

    return (
        <Edit saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
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
                                label: "published",
                                value: "published",
                            },
                            {
                                label: "draft",
                                value: "draft",
                            }
                        ]}
                    />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Select
                        options={[
                            {
                                label: "Art",
                                value: "art",
                            },
                            {
                                label: "Music",
                                value: "music",
                            },
                            {
                                label: "Foreign Language",
                                value: "foreign-language",
                            },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
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
