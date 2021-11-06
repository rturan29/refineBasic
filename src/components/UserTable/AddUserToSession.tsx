import { Form, Select, useSelect, Switch } from '@pankod/refine';
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { IParticipant, IUser } from 'interfaces';
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
                label={MLTextHelper("00029")}
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
                label={MLTextHelper("00024")}
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
