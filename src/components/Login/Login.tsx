import React from 'react';
import { Form, Input, Checkbox, Button } from "@pankod/refine";



export default function Login() {

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

            <Form.Item
                labelAlign="left"
                labelCol={{ span: 7 }}
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 7 }}>
                <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    Submit
                </Button>

            </Form.Item>
        </>
    );
}
