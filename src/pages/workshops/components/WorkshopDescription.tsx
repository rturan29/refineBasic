import { SaveButton, Button, Space, Row } from '@pankod/refine';
import React, { useState } from 'react';
import ReactMde, { getDefaultToolbarCommands } from 'react-mde';
import ReactMarkdown from 'react-markdown';
import { CloseOutlined } from '@ant-design/icons';
import Styles from "../assets/style.module.scss";


type WorkshopDescriptionProps = React.PropsWithChildren<{
    description: string;
    isEdit: boolean;
    setIsEdit: (value: boolean) => void;
    setDescription: (value: string) => void;
    handleSaveDescription: () => void
}>;

export default function WorkshopDescription({ description, setDescription, handleSaveDescription, isEdit, setIsEdit }: WorkshopDescriptionProps) {
    const [selectedTab, setSelectedTab] = useState<"write" | "preview">("write");

    function renderEdit() {
        return (
            <>
                <Row className={Styles.editorRow}>
                    <ReactMde
                        value={description}
                        onChange={setDescription}
                        selectedTab={selectedTab}
                        onTabChange={setSelectedTab}
                        toolbarCommands={getDefaultToolbarCommands()}
                        generateMarkdownPreview={markdown => Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)}
                    />
                </Row>
                <Row >
                    <Space size="large">
                        <Button onClick={() => setIsEdit(false)} color="" icon={<CloseOutlined />} >Cancel</Button>
                        <SaveButton onClick={handleSaveDescription} />
                    </Space>
                </Row>
            </>
        );
    }

    function renderDescription() {
        return (
            <>
                <ReactMarkdown children={description} />
            </>);
    }


    return (
        <div className={Styles.workshopDescription}>

            {isEdit ? renderEdit() : renderDescription()}
        </div >
    );
}
