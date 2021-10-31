import React from 'react';
import { Form, Input, Button, Row, Col, Link } from "@pankod/refine";
import MLTextHelper from 'helpers/MLHelper/MLHelper';
import { LoginLocationTypes } from 'interfaces/ILogin';



export default function ForgotPassword(props: { setLocation: (location: LoginLocationTypes) => void; }) {

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
            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    Send Password Reset Email
                </Button>
            </Form.Item>
            <Row>
                <Col span={7}>
                    <Link to="/login" onClick={() => props.setLocation("login")}>Go back to Login</Link>
                </Col>
                <Col offset={1}>
                    <Link to="/login" onClick={() => props.setLocation("register")}>Register now</Link>
                </Col>
            </Row>
        </>
    );
}
