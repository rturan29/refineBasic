import { IResourceComponentsProps, useModalForm, Form, Modal, useNavigation, Authenticated } from "@pankod/refine";
import { ISession } from "interfaces";
import { WorkshopCreate } from ".";
import PageContent from "./components/PageContent";

export const WorkshopList: React.FC<IResourceComponentsProps> = () => {
    const { show: showWorkshop } = useNavigation();

    const { modalProps, formProps, show: showCreate, close } = useModalForm<ISession>({ action: "create", redirect: "list" });


    return (
        <Authenticated>
            <PageContent showCreate={showCreate} showWorkshop={showWorkshop} />

            <Modal {...modalProps}>
                <Form {...formProps} layout="vertical">
                    <WorkshopCreate close={close} />
                </Form>
            </Modal>
        </Authenticated>
    );
};
