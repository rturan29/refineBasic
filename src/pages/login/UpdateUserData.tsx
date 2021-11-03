import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Select, LayoutWrapper, Row, Col, Card, useGetIdentity, Authenticated } from "@pankod/refine";
import { firebaseAuth } from 'helpers/firebase/firebaseConfig';
import { IRegisterArgs, IRegisterProps, IUser } from 'interfaces/ILogin';
import MLTextHelper from 'helpers/MLHelper/MLHelper';

const { createRecaptcha, onUpdateUserData } = firebaseAuth;
const { Option } = Select;

const labelProps: {
    labelAlign: any;
    labelCol: any;
} = {
    labelAlign: "left",
    labelCol: { span: 9 }
};

export default function UpdateUserData(props: IRegisterProps) {
    const reCaptchaContainer = useRef<HTMLDivElement | null>(null);
    const reCaptcha = useRef<any>();
    const [hideUpdatePassword] = useState<boolean>(true);

    const currentUser = useGetIdentity<IUser>()?.data;

    useEffect(() => {
        if (reCaptchaContainer.current && !reCaptcha.current) {
            reCaptcha.current = createRecaptcha(reCaptchaContainer.current);
            reCaptcha.current?.render();
        }
    }, []);

    function onSubmit(args: IRegisterArgs) {
        if (reCaptcha.current) {
            onUpdateUserData(args);
        }
    }

    function renderContent() {
        return (
            <Authenticated>
                <Form.Item
                    {...labelProps}
                    label={MLTextHelper("00019")}
                    name="username"
                    rules={[
                        { type: 'email', message: 'The input is not valid E-mail!' },
                        { required: true, message: 'Please input your email!' }
                    ]}
                    initialValue={currentUser?.email}
                >
                    <Input disabled />
                </Form.Item>
                <Form.Item
                    {...labelProps}
                    label={MLTextHelper("00021")}
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    initialValue={hideUpdatePassword ? "********" : ""}
                >
                    <Input.Password disabled={hideUpdatePassword} />
                </Form.Item>

                <Form.Item
                    {...labelProps}
                    label={MLTextHelper("00027")}
                    name="confirm"
                    dependencies={["password"]}
                    hasFeedback
                    hidden={hideUpdatePassword}
                    rules={!hideUpdatePassword ? [
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
                    ] : []}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    {...labelProps}
                    name="nameSurname"
                    label={MLTextHelper("00018")}
                    rules={[
                        {
                            required: true,
                            message: "Please input your name and surname!",
                            whitespace: true,
                        },
                    ]}
                    initialValue={currentUser?.name}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    {...labelProps}
                    name="phone"
                    label={MLTextHelper("00028")}
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
                    {...labelProps}
                    name="gender"
                    label={MLTextHelper("00022")}
                >
                    <Select placeholder="select your gender">
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    {...labelProps}
                    label={MLTextHelper("00023")}
                    extra="We must make sure that your are a human.">
                    <div ref={reCaptchaContainer} >
                    </div>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                    <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                        Register
                    </Button>

                </Form.Item>
            </Authenticated>);
    }

    return (
        <Authenticated>
            <LayoutWrapper>
                <Row
                    justify="center"
                    align="middle"
                    style={{
                        height: "100vh",
                    }}>
                    <Col xs={22}>
                        <Form onFinish={onSubmit}>
                            <Card
                                style={{
                                    maxWidth: "700px",
                                    margin: "auto",
                                }}
                                title={""}>
                                {renderContent()}
                            </Card>
                        </Form>
                    </Col>
                </Row>
            </LayoutWrapper>
        </Authenticated>
    );
}
