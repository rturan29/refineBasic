/* eslint-disable eqeqeq */
import { CrudFilter, Form, GetListResponse, Modal, useForm, useGetIdentity, useUpdate } from '@pankod/refine';
import Admin from 'components/Admin';
import UserTable from 'components/UserTable/UserTable';
import { IParticipant, ISelectedPlan, ISession, IUser, sessionModalRole, sessionStatus } from 'interfaces';
import React from 'react';
import ApplySession from './ApplySession';
import AddUserToSession from './AddUserToSession';
import { firestoreDatabase } from 'helpers/firebase/firebaseConfig';
import MLTextHelper from 'helpers/MLHelper/MLHelper';

type SessionModalProps = React.PropsWithChildren<{
    modalRole: sessionModalRole;
    currentRow: ISession;
    refetch: () => void;
    modalProps: any;
    close: () => void;
}>;

export default function SessionModal({ modalRole, currentRow, modalProps, refetch, close }: SessionModalProps) {
    const { mutate } = useUpdate();
    const { data: identity } = useGetIdentity<IUser>();
    const { form, formProps } = useForm();

    function handleCloseModal() {
        close();
        if (modalRole === "create") {
            if (currentRow?.id) {
                handleAddUserToSession();
            }
        } else if (modalRole === "apply") {
            handleApplySession();
        }
    }

    async function handleAddUserToSession() {
        if (currentRow?.id) {
            const formContent: IParticipant = form.getFieldsValue() as any;

            const status: sessionStatus = currentRow.quota == currentRow.participants?.length ? "quotaFull" : currentRow.status;

            const userData: IUser = await firestoreDatabase.getOne({ resource: "users", id: formContent.participantId });

            mutate({ resource: `sessions`, id: currentRow?.id, values: { participants: [...currentRow.participants, formContent], status } });
            mutate({ resource: "users", id: formContent.participantId, values: { workshops: [...userData.workshops, currentRow.id] } });

            form.resetFields();
            setTimeout(() => {
                refetch();
            }, 1000);
        }
    }

    async function handleApplySession() {
        const formContent: ISelectedPlan = form.getFieldsValue() as any;

        const filters: CrudFilter[] = [{ field: "email", operator: "eq", value: identity?.email }];
        const userData: GetListResponse<IUser> = await firestoreDatabase.getList({ resource: "users", filters });

        const participantData: IParticipant = {
            participantId: userData.data?.[0]?.id,
            isPaymentCompleted: false,
            selectedPlan: { ...formContent }
        };

        const availablePlans = currentRow.availablePlans?.map(({ day, time }) => ({
            day,
            time: day == formContent.day ? time.filter(t => t != formContent.time) : time
        }));

        mutate({ resource: "sessions", id: currentRow?.id, values: { participants: [...currentRow.participants, participantData], availablePlans } });

        mutate({ resource: "users", id: userData.data?.[0]?.id, values: { workshops: [...userData.data[0].workshops, currentRow.id] } });

    }

    function getModalContent() {
        switch (modalRole) {
            case "show":
                return (
                    <Admin>
                        <UserTable participants={currentRow?.participants} isSessionUsers sessionId={currentRow?.id} resetSessionData={refetch} />
                    </Admin>);
            case "create":
                return (
                    <Admin>
                        <Form {...formProps}>
                            <AddUserToSession participants={currentRow?.participants} />
                        </Form>
                    </Admin>);
            case "apply":
                return (
                    <Form {...formProps}>
                        <ApplySession currentSession={currentRow} />
                    </Form>
                );
            default:
                return null;
        }
    }

    const customModalprops = {
        ...modalProps,
        onOk: handleCloseModal,
        closable: true,
        width: modalRole === "show" ? 1250 : 500,
        title: getModalTitle(modalRole),
        footer: modalRole === "show" ? null : undefined
    };

    return (
        <Modal {...customModalprops} >
            {getModalContent()}
        </Modal>);

}


function getModalTitle(modalRole: sessionModalRole) {
    switch (modalRole) {
        case "show":
            return MLTextHelper("00054");
        case "create":
            return MLTextHelper("00055");
        case "apply":
            return MLTextHelper("00056");
        default:
            return "";
    }
}
