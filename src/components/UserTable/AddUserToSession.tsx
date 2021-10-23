import { Form, Select, useSelect, Switch } from '@pankod/refine';
import React from 'react';

type AddUserToSessionProps = React.PropsWithChildren<{ participants?: IParticipant[]; }>;


export default function AddUserToSession(props: AddUserToSessionProps) {

    const { selectProps } = useSelect<IUser>({
        resource: "users", optionLabel: "nameSurname",
        optionValue: "id",
    });

    selectProps.options = selectProps.options?.filter(option => !props.participants?.find(participant => participant.participantId === option.value)) || [];

    return (
        <>
            <Form.Item
                label="Participant"
                name="participantId"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select {...selectProps} placeholder="Select a user to add" />
            </Form.Item>

            <Form.Item
                label="Payment Completed"
                name="paymentCompleted"
                rules={[
                    {
                        required: true,
                    },
                ]}
                initialValue={false}
            >
                <Switch />
            </Form.Item>
        </>
    );
}
