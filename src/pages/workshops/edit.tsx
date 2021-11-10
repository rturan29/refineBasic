import { useEffect, useState } from "react";
import { Edit, Form, Input, Select, IResourceComponentsProps, useForm, usePermissions, useNavigation, Authenticated, } from "@pankod/refine";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IWorkshop } from "interfaces";

export const WorkshopEdit: React.FC<IResourceComponentsProps> = () => {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const { formProps, saveButtonProps } = useForm<IWorkshop>();
    const isAdmin = usePermissions().data?.role === "admin";

    const { push } = useNavigation();

    useEffect(() => {
        if (!isAdmin) {
            push("/workshops");
        }
    }, [isAdmin, push]);


    return (
        <Authenticated>
            <Edit saveButtonProps={saveButtonProps}>
                <Form {...formProps} layout="vertical">
                    <Form.Item
                        label={MLTextHelper("00006")}
                        name="title"
                        rules={[{ required: true, },]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={MLTextHelper("00007")}
                        name="category"
                        rules={[{ required: true, },]}
                    >
                        <Select
                            options={[
                                { label: "Art", value: "art", },
                                { label: "Music", value: "music", },
                                { label: "Foreign Language", value: "foreign-language", },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={MLTextHelper("00008")}
                        name="type"
                        rules={[{ required: true, },]}
                    >
                        <Select
                            options={[
                                { label: "Private", value: "private", },
                                { label: "Group", value: "group", }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label={MLTextHelper("00009")}
                        name="status"
                        rules={[{ required: true, }]}
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
                        label={MLTextHelper("00010")}
                        name="description"
                        rules={[{ required: true, }]}
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
        </Authenticated>
    );
};
