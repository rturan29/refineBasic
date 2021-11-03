import { useEffect, useState } from "react";
import {
    Edit,
    Form,
    Input,
    Select,
    IResourceComponentsProps,
    useForm,
    usePermissions,
    useNavigation,
    Authenticated,
} from "@pankod/refine";
import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import MLTextHelper from "helpers/MLHelper/MLHelper";

export const WorkshopEdit: React.FC<IResourceComponentsProps> = () => {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    const { formProps, saveButtonProps } = useForm<IWorkshop>();
    const { data: permissionsData } = usePermissions();
    const isAdmin = permissionsData?.role === "admin";

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
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label={MLTextHelper("00007")}
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
                        label={MLTextHelper("00008")}
                        name="type"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Select
                            options={[
                                {
                                    label: "Private",
                                    value: "private",
                                },
                                {
                                    label: "Group",
                                    value: "group",
                                }
                            ]}
                        />
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
                        label={MLTextHelper("00010")}
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
        </Authenticated>
    );
};
