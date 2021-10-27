import {
    IResourceComponentsProps,
    useModalForm,
    Modal,
    Form,
} from "@pankod/refine";
import WorkshopsTable from "components/WorkshopsTable";
import UserTable from "components/UserTable/UserTable";
import { useState } from "react";

export const UsersList: React.FC<IResourceComponentsProps> = () => {
    const [currentRow, setCurrentRow] = useState<IUser>();

    const { modalProps, formProps, show } = useModalForm<IUser>({ action: "create", redirect: "list" });


    return (
        <>
            {<UserTable showWorkshops={show} setUserCurrentRow={setCurrentRow} />}
            <Modal {...modalProps} title="Show Workshops" footer={null}>
                <Form {...formProps} layout="vertical">
                    <WorkshopsTable user={currentRow} />
                </Form>
            </Modal>
        </>
    );
};

