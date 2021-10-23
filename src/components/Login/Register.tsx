import React from 'react';
import { Form, Input, Checkbox, Button, Select } from "@pankod/refine";
import { IRegisterProps } from 'interfaces/ILogin';

const { Option } = Select;


const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

const labelProps: {
    labelAlign: any;
    labelCol: any;
} = {
    labelAlign: "left",
    labelCol: { span: 9 }
};

export default function Register(props: IRegisterProps) {


    const prefixSelector = (
        <Form.Item name="prefix" noStyle>
            <Select style={{ width: 70 }}>
                <Option selected value="86">+90</Option>
            </Select>
        </Form.Item>
    );

    return (
        <>
            <Form.Item
                {...labelProps}
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
                {...labelProps}
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item
                {...labelProps}
                label="Confirm Password"
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error(
                                    "The two passwords that you entered do not match!"
                                )
                            );
                        },
                    }),
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                {...labelProps}
                name="nameSurname"
                label="Name Surname"
                rules={[
                    {
                        required: true,
                        message: "Please input your name and surname!",
                        whitespace: true,
                    },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                {...labelProps}
                name="phone"
                label="Phone Number"
            // rules={[
            //     {
            //         required: true,
            //         message: "Please input your phone number!",
            //     },
            // ]}
            >
                <Input
                    addonBefore={prefixSelector}
                    style={{
                        width: "100%",
                    }}
                />
            </Form.Item>

            <Form.Item
                {...labelProps}
                name="gender"
                label="Gender"
            >
                <Select placeholder="select your gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                </Select>
            </Form.Item>

            <Form.Item
                {...labelProps}
                label="Captcha"
                extra="We must make sure that your are a human.">
                <div ref={props.setReCaptchaContainer} >
                </div>
            </Form.Item>


            <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                    {
                        validator: (_, value) =>
                            value
                                ? Promise.resolve()
                                : Promise.reject(
                                    new Error("Should accept agreement")
                                ),
                    },
                ]}
                {...tailFormItemLayout}
            >
                <Checkbox>
                    I have read the <a href="/">agreement</a>
                </Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    Register
                </Button>
            </Form.Item>
        </>
    );
}
