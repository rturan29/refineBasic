import { useEffect, useState } from "react";
import { Form, Input, Select, useOne, usePermissions, } from "@pankod/refine";

import ReactMarkdown from "react-markdown";
import ReactMde from "react-mde";

import "react-mde/lib/styles/css/react-mde-all.css";
import MLTextHelper, { getMLText } from "helpers/MLHelper/MLHelper";
import { IWorkshopCategory } from "interfaces";
import { getCategoryList } from "./helpers";

export const WorkshopCreate: React.FC<{ close?: () => void; }> = ({ close }) => {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const isAdmin = usePermissions().data?.role === "admin";

    const categoryQueryResult = useOne<{ categories: { [key: string]: IWorkshopCategory; }; }>({ resource: "categories", id: "category", });

    const categoryList = getCategoryList(categoryQueryResult);

    useEffect(() => {
        if (!isAdmin) {
            close?.();
        }
    }, [isAdmin, close]);

    return (
        <>
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
                    options={categoryList.map(category => ({ label: getMLText(category.caption), value: category.name }))}
                />
            </Form.Item>

            <Form.Item
                label={MLTextHelper("00008")}
                name="type"
                rules={[{ required: true, }]}
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
                rules={[{ required: true, },]}
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
        </>
    );
};
