import { usePermissions, EditButton, SaveButton, Button, Space, useUpdate, Row } from '@pankod/refine';
import React, { useEffect, useState } from 'react';
import ReactMde, { getDefaultToolbarCommands } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { CloseOutlined } from '@ant-design/icons';
import { IWorkshopCategory } from 'interfaces';
import * as Styles from "../../../assets/Styles.module.scss";

type WorkshopDescriptionProps = React.PropsWithChildren<{
    workshop: IWorkshopCategory;
}>;

export default function WorkshopDescription({ workshop }: WorkshopDescriptionProps) {
    const [isEdit, setIsEdit] = useState(false);
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");
    const [editorValue, setEditorValue] = useState("");

    const isAdmin = usePermissions().data?.role === "admin";

    const { mutate } = useUpdate();

    useEffect(() => {
        setEditorValue(workshop.description);
    }, [workshop]);

    function handleSaveDescription() {
        mutate({ resource: "categories", id: "category", values: editorValue });
        setIsEdit(false);
    }

    function renderMarkdownEdit() {
        return (
            <>
                <Row>
                    <ReactMde
                        value={editorValue}
                        onChange={setEditorValue}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        toolbarCommands={getDefaultToolbarCommands()}
                        generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
                    />
                </Row>
                <Row>
                    <Space size="large">
                        <Button onClick={() => setIsEdit(false)} color="" icon={<CloseOutlined />} />
                        <SaveButton onClick={handleSaveDescription} />
                    </Space>
                </Row>
            </>
        );
    }

    function renderDescription() {
        return (
            <>
                <ReactMarkdown children={editorValue} />
                {isAdmin ? <EditButton onClick={() => setIsEdit(true)} /> : null}
            </>);
    }


    return (
        <div className={Styles.workshopDescription}>
            {isEdit ? renderMarkdownEdit() : renderDescription()}
        </div>
    );
}
