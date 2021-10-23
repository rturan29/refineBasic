import React from "react";
import {
    Form,
    Input,
    Select,
    IResourceComponentsProps,
    Create,
    useForm
} from "@pankod/refine";

const { Option } = Select;

export const UserCreate: React.FC<IResourceComponentsProps> = () => {

    const { formProps, saveButtonProps } = useForm<IPost>({ redirect: "list" });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                <Form.Item
                    label="Name Surname"
                    name="nameSurname"
                    rules={[
                        {
                            required: true,
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your email!' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item

                    name="phone"
                    label="Phone Number"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone number!",
                        },
                    ]}
                >
                    <Input
                        style={{
                            width: "100%",
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name="gender"
                    label="Gender"
                >
                    <Select placeholder="select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

            </Form>
        </Create>
    );
};
