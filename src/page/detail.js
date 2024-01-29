import { useEffect, useState, Suspense } from "react";
import { Container, Button, Form, InputGroup, Toast } from "react-bootstrap";
import NavbarComponents from "../components/navbar"
import { useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, OrbitControls } from "@react-three/drei";
import * as config from "../config";
import Swal from "sweetalert2";

const DetailPage = () => {
    const location = useLocation();
    
    const [datas, setData] = useState([])
    const [version, setVersion] = useState(location.state.version)
    const [latestVersion, setLatestVersion] = useState("")
    const [url, setUrl] = useState(location.state.url)

    console.log(version)

    const id = location.state.id
    const name = location.state.name
    let key = ""
    const updated = location.state.updated

    const [apiKey, setApiKey] = useState("")

    const Model = () => {
        const { scene } = useGLTF(url);
        return <primitive object={scene} />;
    };

    const get_models = async () => {
        let user_id = localStorage.getItem("user_id");
        let res = await fetch(`${config['config']['api']}/api/model/${id}`, {
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

    const handleClick = () => {
        key = url.split("/")
        key = key[key.length - 1]
        setApiKey(key)
        navigator.clipboard.writeText(key)
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
            }
        });
        Toast.fire({
            icon: "success",
            title: "Copied successfully"
        });
    }

    const handleDownload = () => {
        key = url.split("/")
        key = key[key.length - 1]
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
            },
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(
                    new Blob([blob]),
                );
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute(
                    'download',
                    `${key}`,
                );
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            });
    }

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

    const handleChange = (e) => {
        setUrl(e.target.value)
        key = url.split("/")
        key = key[key.length - 1]
        setApiKey(key)
    }

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
            formData.append("id", id);
            formData.append("file", file);
            formData.append("file_name", file.name);
            formData.append("user_id", localStorage.getItem("user_id"))

            // console.log('formData', formData)

            try {
                const res = await fetch(`${config['config']['api']}/api/upload/`, {
                    method: "PUT",
                    body: formData,
                });

                const data = await res.json();
                if (res.status === 200) {
                    // console.log('handleUpload', data);
                    setData([data['results']])
                    setUrl(data['results']['url'])
                    setVersion(data['results']['version'])
                    setApiKey("")
                    waitingPopup.close();
                    Swal.fire({
                        icon: "success",
                        title: "Success !!",
                        text: data["message"],
                    });
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

    useEffect(() => {
        get_models();
    }, []);

    return (
        <>
            <NavbarComponents />
            <Container>
                <div className="d-flex justify-content-end row mt-2">
                    <div className="col-1">
                        <Form.Select aria-label="Default select example" onChange={handleChange}>
                            {version.map((v) => <option key={v.version} value={`${v.model}.${v.extension}`}>{v.version}</option>)}
                        </Form.Select>
                    </div>
                </div>
                <Canvas style={{ height: "80vh" }}>
                    <ambientLight intensity={1.5} />
                    <OrbitControls />
                    <Suspense fallback={null}>
                        <PresentationControls>
                            <Model />
                        </PresentationControls>
                    </Suspense>
                </Canvas>
                <div className="d-flex">
                    <InputGroup aria-label="Basic example">
                        <Button variant="primary" onClick={handleClick}>GET API Key</Button>
                        <Form.Control type="text" placeholder="API key" readOnly value={apiKey} />
                        <Button variant="success" onClick={handleFileChange}>Update</Button>
                        <Button variant="primary" onClick={handleDownload}>Download</Button>
                    </InputGroup>
                </div>
            </Container>
        </>
    )
}

export default DetailPage