import {
    IResourceComponentsProps,
    useModalForm,
    Modal,
    Form,
} from "@pankod/refine";
import CoursesTable from "components/CoursesTable";
import UserTable from "components/UserTable/UserTable";
import { useState } from "react";

export const UsersList: React.FC<IResourceComponentsProps> = () => {
    const [currentRow, setCurrentRow] = useState<IUser>();

    const { modalProps, formProps, show } = useModalForm<IUser>({ action: "create", redirect: "list" });


    return (
        <>
            {<UserTable showCourses={show} setUserCurrentRow={setCurrentRow} />}
            <Modal {...modalProps} title="Show Courses" footer={null}>
                <Form {...formProps} layout="vertical">
                    <CoursesTable user={currentRow} />
                </Form>
            </Modal>
        </>
    );
};

