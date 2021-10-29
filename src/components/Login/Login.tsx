import React from 'react';
import { Form, Input, Checkbox, Button } from "@pankod/refine";
import MLTextHelper from 'helpers/MLHelper/MLHelper';



export default function Login() {

    return (
        <>
            <Form.Item
                labelAlign="left"
                labelCol={{ span: 7 }}
                label={MLTextHelper("00019")}
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                labelAlign="left"
                labelCol={{ span: 7 }}
                label={MLTextHelper("00021")}
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 7 }}>
                <Checkbox>{MLTextHelper("00030")}</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    {MLTextHelper("00031")}
                </Button>

            </Form.Item>
        </>
    );
}
