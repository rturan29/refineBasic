import React, { useEffect, useRef, useState } from 'react';
import { AntdLayout, Row, Col, Form, Card, useLogin, useNavigation, useCreate } from '@pankod/refine';
import { RecaptchaVerifier } from '@firebase/auth';
import _ from "lodash";
import Login from 'components/Login/Login';
import Register from 'components/Login/Register';
import ForgotPassword from 'components/Login/ForgotPassword';
import firebaseAuth from 'helpers/firebase/firebaseAuth';
import { ILoginArgs, LoginLocationTypes, IRegisterArgs } from 'interfaces/ILogin';

const { createRecaptcha, handleResetPassword, handleRegister } = firebaseAuth;


export default function Authentication() {
    const { mutate: login } = useLogin<ILoginArgs>();
    const { mutate: createData } = useCreate<IUser>();
    const [location, setLocation] = useState<LoginLocationTypes>("login");
    const reCaptchaContainer = useRef<HTMLDivElement | null>(null);
    const reCaptcha = useRef<RecaptchaVerifier | null>(null);
    const { push } = useNavigation();

    useEffect(() => {
        firebaseAuth.auth.onAuthStateChanged(user => {
            if (user?.uid) {
                push("/workshops");
            }
        });

    }, [push]);

    useEffect(() => {
        if (reCaptchaContainer.current && !reCaptcha.current) {
            reCaptcha.current = createRecaptcha(reCaptchaContainer.current, {});
            reCaptcha.current?.render();
        }
    }, [location]);

    function setReCaptchaContainer(ref: HTMLDivElement) {
        reCaptchaContainer.current = ref;
    }

    const CardTitle = (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "60px",
            }}
        >
            <img src="./refine.svg" alt="Logo" />
        </div>
    );

    function renderAuthContent() {
        switch (location) {
            case "register":
                return <Register setLocation={setLocation} setReCaptchaContainer={setReCaptchaContainer} />;
            case "forgotPassword":
                return <ForgotPassword setLocation={setLocation} />;
            case "login":
            default:
                return <Login setLocation={setLocation} />;
        }
    }

    function onRegister(values: ILoginArgs | IRegisterArgs) {
        if (reCaptcha.current) {
            handleRegister(values, reCaptcha.current, setLocation);
            createData({ resource: "users", values: _.omit(values, ["password", "rememberme"]) });
        }
    }

    function onSubmit(values: ILoginArgs) {
        switch (location) {
            case "register":
                onRegister(values);
                break;
            case "forgotPassword":
                handleResetPassword(values.email);
                break;
            case "login":
            default:
                login(values);
                break;
        }
    }

    return (
        <AntdLayout>
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
                                maxWidth: location === "register" ? "700px" : "500px",
                                margin: "auto",
                            }}
                            title={CardTitle}>
                            {renderAuthContent()}
                        </Card>
                    </Form>
                </Col>
            </Row>
        </AntdLayout>
    );
}

