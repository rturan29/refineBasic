import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Button, Select, LayoutWrapper, Row, Col, Card, useGetIdentity, Authenticated } from "@pankod/refine";
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from 'helpers/firebaseAuth';
import { IRegisterArgs, IRegisterProps, IUser } from 'interfaces/ILogin';

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
    const reCaptcha = useRef<RecaptchaVerifier | null>(null);
    const [hideUpdatePassword] = useState<boolean>(true);

    const currentUser = useGetIdentity<IUser>()?.data;

    // const prefixSelector = (
    //     <Form.Item name="prefix" noStyle>
    //         <Select style={{ width: 70 }}>
    //             <Option selected value="86">+90</Option>
    //         </Select>
    //     </Form.Item>
    // );


    useEffect(() => {
        if (reCaptchaContainer.current && !reCaptcha.current) {
            reCaptcha.current = createRecaptcha(reCaptchaContainer.current, {});
            reCaptcha.current?.render();
        }
    }, []);

    function onSubmit(args: IRegisterArgs) {
        if (reCaptcha.current) {
            onUpdateUserData(args, reCaptcha.current);
        }
    }

    function renderContent() {
        return (<>
            <Form.Item
                {...labelProps}
                label="Email"
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
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
                initialValue={hideUpdatePassword ? "********" : ""}
            >
                <Input.Password disabled={hideUpdatePassword} />
            </Form.Item>

            <Form.Item
                {...labelProps}
                label="Confirm Password"
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
                label="Name Surname"
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
                label="Phone Number"
            // rules={[
            //     {
            //         required: true,
            //         message: "Please input your phone number!",
            //     },
            // ]}
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
                <div ref={reCaptchaContainer} >
                </div>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 7, span: 16 }}>
                <Button style={{ marginRight: "100px" }} type="primary" htmlType="submit">
                    Register
                </Button>

            </Form.Item>
        </>);
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
