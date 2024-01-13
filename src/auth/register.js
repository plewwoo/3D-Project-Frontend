import {
    Button,
    Form,
    FloatingLabel,
    Container,
    Card,
    Col,
    Row,
} from "react-bootstrap";
import * as formik from "formik";
import * as yup from "yup";
import { React } from "react";
import Swal from "sweetalert2";
import * as config from "../config";

const RegisterPage = () => {
    const { Formik } = formik;

    const schema = yup.object().shape({
        first_name: yup.string().required(),
        last_name: yup.string().required(),
        username: yup.string().required(),
        password: yup.string().required(),
        tel: yup.string().required(),
        email: yup.string().required(),
    });
    return (
        <Formik
            validationSchema={schema}
            onSubmit={async (values, actions) => {
                // console.log(values);
                try {
                    let res = await fetch(
                        `${config['config']['api']}/api/register/`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            mode: "cors",
                            body: JSON.stringify(values),
                        }
                    );
                    let data = await res.json();
                    if (res.status === 201) {
                        if (data.success === true) {
                            // console.log("register success :", data);
                            Swal.fire({
                                icon: "success",
                                timer: 2000,
                                timerProgressBar: true,
                                title: data["message"],
                                text: "We will navigate you to login",
                                willClose: () => {
                                    // window.location.href = "/login";
                                },
                            });
                        }
                    } else {
                        // console.log("register fail :", data);
                        Swal.fire({
                            icon: "error",
                            title: data["message"],
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
                first_name: "",
                last_name: "",
                tel: "",
                email: "",
            }}>
            {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Container
                    className="d-flex justify-content-center align-items-center"
                    style={{ height: "100vh" }}>
                    <Card className="mt-5" style={{ width: 600 }}>
                        <Card.Header>
                            <h2>Register</h2>
                        </Card.Header>
                        <Card.Body>
                            <Form noValidate onSubmit={handleSubmit}>
                                <Form.Group
                                    className="mb-3"
                                    controlId="formRegister">
                                    <Container>
                                        <Row>
                                            <Col className="px-0">
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
                                                        isValid={
                                                            touched.username &&
                                                            !errors.username
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="px-0">
                                                <FloatingLabel
                                                    controlId="floatingPassword"
                                                    label="Password">
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Password"
                                                        name="password"
                                                        value={values.password}
                                                        onChange={handleChange}
                                                        isValid={
                                                            touched.password &&
                                                            !errors.password
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Form.Group>
                                <hr className="px-5" />
                                <Form.Group className="mb-3">
                                    <Container>
                                        <Row>
                                            <Col style={{ paddingLeft: "0" }}>
                                                <FloatingLabel
                                                    controlId="floatingFirstname"
                                                    label="First Name"
                                                    className="mb-3">
                                                    <Form.Control
                                                        placeholder="First Name"
                                                        type="text"
                                                        name="first_name"
                                                        value={
                                                            values.first_name
                                                        }
                                                        onChange={handleChange}
                                                        isValid={
                                                            touched.first_name &&
                                                            !errors.first_name
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                            <Col
                                                style={{
                                                    paddingRight: "0",
                                                }}>
                                                <FloatingLabel
                                                    controlId="floatingLastname"
                                                    label="Last Name"
                                                    className="mb-3">
                                                    <Form.Control
                                                        placeholder="Last Name"
                                                        type="text"
                                                        name="last_name"
                                                        value={values.last_name}
                                                        onChange={handleChange}
                                                        isValid={
                                                            touched.last_name &&
                                                            !errors.last_name
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ paddingLeft: "0" }}>
                                                <FloatingLabel
                                                    controlId="floatingTel"
                                                    label="Tel"
                                                    className="mb-3">
                                                    <Form.Control
                                                        placeholder="Tel"
                                                        type="text"
                                                        name="tel"
                                                        value={values.tel}
                                                        onChange={handleChange}
                                                        isValid={
                                                            touched.tel &&
                                                            !errors.tel
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={{ paddingLeft: "0" }}>
                                                <FloatingLabel
                                                    controlId="floatingEmail"
                                                    label="Email"
                                                    className="mb-3">
                                                    <Form.Control
                                                        placeholder="Email"
                                                        type="text"
                                                        name="email"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        isValid={
                                                            touched.email &&
                                                            !errors.email
                                                        }
                                                    />
                                                </FloatingLabel>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Form.Group>
                                <div className="d-flex justify-content-between">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        type="submit">
                                        Register
                                    </Button>
                                    <Button
                                        href="login"
                                        variant="primary"
                                        size="lg"
                                        type="submit">
                                        Back
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            )}
        </Formik>
    );
};

export default RegisterPage;
