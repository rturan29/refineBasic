import React from 'react';
import { Form, Input, Checkbox, Button, Col, Row } from "@pankod/refine";
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { LoginLocationTypes } from 'interfaces/ILogin';
import routerProvider from '@pankod/refine-react-router';

const { Link } = routerProvider;


export default function Login(props: { setLocation: (location: LoginLocationTypes) => void; }) {

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
            <Row>
                <Col span={7}>
                    <Link to="/login" onClick={() => props.setLocation("forgotPassword")}>{MLTextHelper("00042")}</Link>
                </Col>
                <Col offset={1}>
                    <Link to="/login" onClick={() => props.setLocation("register")}>{MLTextHelper("00044")}</Link>
                </Col>
            </Row>
        </>
    );
}
