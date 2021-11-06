import {
    IResourceComponentsProps,
    useModalForm,
    Modal,
    Form,
    Authenticated,
} from "@pankod/refine";
import WorkshopsTable from "components/WorkshopsTable";
import UserTable from "components/UserTable/UserTable";
import { useState } from "react";
import MLTextHelper from "helpers/MLHelper/MLHelper";
import { IUser } from "interfaces";

export const UsersList: React.FC<IResourceComponentsProps> = () => {
    const [currentRow, setCurrentRow] = useState<IUser>();

    const { modalProps, formProps, show } = useModalForm<IUser>({ action: "create", redirect: "list" });


    return (
        <Authenticated>
            {<UserTable showWorkshops={show} setUserCurrentRow={setCurrentRow} />}
            <Modal {...modalProps} title={MLTextHelper("00033")} footer={null}>
                <Form {...formProps} layout="vertical">
                    <WorkshopsTable user={currentRow} />
                </Form>
            </Modal>
        </Authenticated>
    );
};

