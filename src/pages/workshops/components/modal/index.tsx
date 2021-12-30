/* eslint-disable eqeqeq */
import { useCreate, useForm, useUpdate } from '@pankod/refine';
import { Form, Modal } from 'antd';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { ISession, IWorkshop, TModalRole } from 'interfaces';
import { WorkshopShow, WorkshopCreate, WorkshopEdit } from 'pages/workshops';
import React from 'react';
import ShowPlans from './planModal/ShowPlans';
import ApplyPlan from './planModal/ApplyPlan';
import AddPlan from './planModal/AddPlan';

type WorkshopModalProps = React.PropsWithChildren<{
    modalRole: string;
    currentRecord?: IWorkshop;
    currentPlan?: ISession;
    modalProps: any;
    setModalRole: (role: string) => void;
    setCurrentPlan: (plan: ISession) => void;
    close: () => void;
    showModal: (args: { role: TModalRole, record?: IWorkshop, plan?: ISession; }) => void;
}>;

export default function WorkshopModal({ modalRole, currentRecord, modalProps, currentPlan, close, setModalRole, showModal, setCurrentPlan }: WorkshopModalProps) {

    const { mutate: create } = useCreate<IWorkshop>();
    const { mutate: edit } = useUpdate<IWorkshop>();
    const { form, formProps } = useForm();

    function getModalContent() {

        if (modalRole) {
            if (currentRecord) {
                switch (modalRole as TModalRole) {
                    case "show":
                        return <WorkshopShow recordId={currentRecord.id} />;

                    case "edit":
                        return (
                            <Form {...formProps} initialValues={currentRecord} layout="vertical">
                                <WorkshopEdit />
                            </Form>
                        );

                    case "showPlans":
                        return (
                            <Form {...formProps} layout="vertical">
                                <ShowPlans showModal={showModal} setCurrentPlan={setCurrentPlan} setModalRole={setModalRole} record={currentRecord as IWorkshop} />
                            </Form>);
                    case "addPlan":
                        return (
                            <Form {...formProps} initialValues={{ workshopId: currentRecord.id }} layout="vertical">
                                <AddPlan workshop={currentRecord} />
                            </Form>
                        );

                    case "editPlan":
                        return;
                }

                if (currentPlan) {
                    if (modalRole == "apply")
                        return (
                            <Form {...formProps} layout="vertical">
                                <ApplyPlan plan={currentPlan} />
                            </Form>
                        );

                    if (modalRole == "showParticipants") {
                        return (
                            <Form {...formProps} layout="vertical">
                                {/* <ApplyWorkshop plan={currentPlan} /> */}
                            </Form>
                        );
                    }
                }
            }
            if (modalRole == "create") {
                return (
                    <Form {...formProps} layout="vertical">
                        <WorkshopCreate />
                    </Form>
                );
            }
        }

        return <span></span>;
    }

    function handleCloseModal() {
        close();
        const formContent: any = form.getFieldsValue() as any;

        switch (modalRole as TModalRole) {
            case "create":
                handleCreateWorkshop(formContent);
                break;
            case "edit":
                handleEditWorkshop(formContent);
                break;

            case "addPlan":
                handleAddPlan(formContent);
                break;

            case "apply":
                break;
        }
        form.resetFields();
    }

    function handleAddPlan(formContent: ISession) {
        create({
            resource: "sessions",
            values: formContent
        });
    }

    function handleEditWorkshop(formContent: IWorkshop) {
        if (currentRecord) {
            edit({
                resource: "workshops",
                id: currentRecord.id,
                values: formContent
            });
        }

    }

    function handleCreateWorkshop(formContent: IWorkshop) {
        create({
            resource: "workshops",
            values: formContent
        });
    }

    const customModalprops = {
        ...modalProps,
        onOk: handleCloseModal,
        closable: true,
        width: modalRole == "showPlans" ? 1750 : 1000,
        title: modalRole == "create" ? MLTextHelper("00063") : "",
        footer: modalRole === "show" ? null : undefined
    };

    return (
        <Modal {...customModalprops}>
            {getModalContent()}
        </Modal>
    );
}