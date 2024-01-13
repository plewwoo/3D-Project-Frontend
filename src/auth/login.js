import { Button, Form, FloatingLabel, Container, Card } from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import { useEffect } from "react";
import * as config from "../config";

const LoginPage = () => {
    const { Formik } = formik;

    const check_login = async () => {
        let user_id = localStorage.getItem("user_id");
        let access_token = localStorage.getItem("access_token");
        let expires = localStorage.getItem("expires");

        let values = {
            user_id: user_id,
            token: access_token,
            expires: expires,
        };

        if (new Date() > new Date(expires)) {
            localStorage.clear();
        } else {
            let res = await fetch(`${config['config']['api']}/api/check-login/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                mode: "cors",
                body: JSON.stringify(values),
            });
            let data = await res.json();
            // console.log(data);
            if (res.status === 200) {
                window.location.href = "/";
            }

            // console.log(user_id, access_token, expires);
        }
    };

    useEffect(() => {
        check_login();
    }, []);

    const schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string().required(),
    });
    return (
        <Formik
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                try {
                    let res = await fetch(`${config['config']['api']}/api/login/`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        mode: "cors",
                        body: JSON.stringify(values),
                    });
                    let data = await res.json();
                    // console.log(res);
                    if (res.status === 200) {
                        // console.log("login success :", data);
                        localStorage.setItem(
                            "user_id",
                            data["data"]["user_id"]
                        );
                        localStorage.setItem(
                            "access_token",
                            data["data"]["access_token"]
                        );
                        localStorage.setItem(
                            "expires",
                            data["data"]["expires"]
                        );
                        window.location.href = "/";
                    } else {
                        // console.log("login fail :", data);
                        Swal.fire({
                            icon: "error",
                            title: "Login Failed",
                            text: data["data"],
                        });
                    }
                } catch (error) {
                    console.log(error);
                }
            }}
            initialValues={{
                username: "",
                password: "",
            }}>
            {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100vh" }}>
                    <Card className="mt-5" style={{ width: 400 }}>
                        <Card.Header>
                            <h2>Login</h2>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formUsername">
                                    <FloatingLabel
                                        controlId="floatingUsername"
                                        label="Username"
                                        className="mb-3">
                                        <Form.Control
                                            placeholder="Username"
                                            type="text"
                                            name="username"
                                            value={values.username}
                                            onChange={handleChange}
                                            isValid={!!errors.username}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formPassword">
                                    <FloatingLabel
                                        controlId="floatingPassword"
                                        label="Password"
                                        className="mb-3">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            name="password"
                                            value={values.password}
                                            onChange={handleChange}
                                            isValid={!!errors.password}
                                        />
                                    </FloatingLabel>
                                    <Form.Text id="passwordHelpBlock" muted>
                                        <Card.Link href="#">
                                            Forget Password ?
                                        </Card.Link>
                                    </Form.Text>
                                </Form.Group>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    type="submit">
                                    Login
                                </Button>
                                <Form.Group>
                                    <Form.Text id="passwordHelpBlock" muted>
                                        <Card.Link href="register">
                                            Register ?
                                        </Card.Link>
                                    </Form.Text>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </Formik>
    );
};

export default LoginPage;
