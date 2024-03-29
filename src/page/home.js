import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import CardComponents from "../components/card";
import NavbarComponents from "../components/navbar"
import * as config from "../config";
import Swal from "sweetalert2";

const HomePage = () => {
    const [datas, setData] = useState([])

    const get_models = async () => {
        let user_id = localStorage.getItem("user_id");
        let res = await fetch(`${config['config']['api']}/api/models/${user_id}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
        });
        let data = await res.json();
        if (res.status === 200) {
            // console.log(data)
            setData(data['results'])
        }
    };

    const handleUpload = async (file) => {
        if (file) {
            const waitingPopup = Swal.fire({
                title: "Uploading file...",
                html: "Please Wait<br>",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });
            console.log("Uploading file...");

            const formData = new FormData();
            formData.append("file", file);
            formData.append("file_name", file.name);
            formData.append("user_id", localStorage.getItem("user_id"))

            console.log('formData', formData)

            try {
                const res = await fetch(`${config['config']['api']}/api/upload/`, {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (res.status === 201) {
                    // console.log('handleUpload', data);
                    setData([data['results'], ...datas])
                    waitingPopup.close();
                    Swal.fire({
                        icon: "success",
                        title: "Success !!",
                        text: data["message"],
                    });
                    console.log(datas)
                }
                else {
                    waitingPopup.close();
                    Swal.fire({
                        icon: "error",
                        title: "Fail !!",
                        text: data["message"],
                    });
                }
            } catch (error) {
                console.error(error);
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: "Fail !!",
                text: "File not found !",
            });
        }
    };

    const handleFileChange = () => {
        Swal.fire({
            title: "Select 3D Model",
            input: "file",
        }).then((result) => {
            console.log(result.value)
            if (result.value != null) {
                handleUpload(result.value)
            }
        });
    };

    useEffect(() => {
        get_models();
    }, []);

    const centeredStyle = {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    };

    return (
        <>
            <NavbarComponents />
            <Container key='container'>
                <Row key='row'>
                    <Col xs="auto" className="mt-5" key='uploader'>
                        <Card className="text-center mx-2" style={{ width: "280px", height: "350px" }}>
                            <Card.Body style={centeredStyle}>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Button onClick={handleFileChange}>Upload File</Button>
                                </Form.Group>
                            </Card.Body>
                        </Card>
                    </Col>
                    {datas.map((d) => <Col xs="auto" className="mt-5" key={d.id}><CardComponents id={d.id} name={d.name} url={d.url} updated={d.updated} version={d.version} /></Col>)}
                </Row>
            </Container>
        </>
    );

};
export default HomePage;

