import React from 'react';
import { Form, Input, Button } from "@pankod/refine";



export default function ForgotPassword() {

    return (
        <>
            <Form.Item
                labelAlign="left"
                labelCol={{ span: 7 }}
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    Send Password Reset Email
                </Button>

            </Form.Item>
        </>
    );
}
