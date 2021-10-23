import React, { useEffect, useRef, useState } from 'react';
import Login from 'components/Login/Login';
import { AntdLayout, Row, Col, Form, Card, Link, useLogin, useNavigation } from '@pankod/refine';
import ForgotPassword from 'components/Login/ForgotPassword';
import { firebaseAuth } from 'helpers/firebaseAuth';
import Register from 'components/Login/Register';
import { RecaptchaVerifier } from '@firebase/auth';
import { ILoginArgs, LoginLocationTypes, IRegisterArgs } from 'interfaces/ILogin';

const { createRecaptcha, handleResetPassword, handleRegister } = firebaseAuth;


export default function Authentication() {
    const { mutate: login } = useLogin<ILoginArgs>();
    const [location, setLocation] = useState<LoginLocationTypes>("login");
    const reCaptchaContainer = useRef<HTMLDivElement | null>(null);
    const reCaptcha = useRef<RecaptchaVerifier | null>(null);
    const { push } = useNavigation();

    useEffect(() => {
        firebaseAuth.auth.onAuthStateChanged(user => {
            if (user?.uid) {
                push("/courses");
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
                return <Register setReCaptchaContainer={setReCaptchaContainer} />;
            case "forgotPassword":
                return <ForgotPassword />;
            case "login":
            default:
                return <Login />;
        }
    }

    function onRegister(values: ILoginArgs | IRegisterArgs) {
        if (reCaptcha.current) {
            handleRegister(values, reCaptcha.current, setLocation);
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
                            {getLoginHelperLinks(location, setLocation)}
                        </Card>
                    </Form>
                </Col>
            </Row>
        </AntdLayout>
    );
}

function getLoginHelperLinks(loginLocation: LoginLocationTypes, setLocation: (location: LoginLocationTypes) => void) {
    const onForgotPassword = () => setLocation("forgotPassword");

    function onRegister() {
        setLocation("register");
    }

    function onReturnLogin() {
        setLocation("login");
    }

    function getForgotPasswordLink() {
        return (<Link to="/login" onClick={onForgotPassword}>Forgot password</Link>);
    }

    function getGoBackToLoginLink() {
        return (<Link to="/login" onClick={onReturnLogin}>Go back to Login</Link>);
    }

    function getRegisterLink() {
        return (<Link to="/login" onClick={onRegister}>Register now</Link>);
    }

    function getLeftLink() {
        switch (loginLocation) {
            case "forgotPassword":
                return getGoBackToLoginLink();
            case "register":
            case "login":
                return getForgotPasswordLink();
        }
    }

    function getRightLink() {
        switch (loginLocation) {
            case "register":
                return getGoBackToLoginLink();
            case "forgotPassword":
            case "login":
                return getRegisterLink();
        }
    }

    function getLoginLinks() {
        return <>
            <Row>
                <Col span={7}>
                    {getLeftLink()}
                </Col>
                <Col>
                    {getRightLink()}
                </Col>
            </Row>
        </>;
    }


    return getLoginLinks();
}
