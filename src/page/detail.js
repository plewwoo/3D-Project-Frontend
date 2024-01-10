import { useEffect, useState, Suspense } from "react";
import { Container, Row, Col, Card, Button, Form, ButtonGroup, InputGroup } from "react-bootstrap";
import NavbarComponents from "../components/navbar"
import { useParams, useLocation } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, Stage, OrbitControls, Environment } from "@react-three/drei";

const Model = ({ url }) => {
    console.log('http://localhost:8000' + url)
    const urls = 'http://localhost:8000' + url
    console.log(urls)
    const { scene } = useGLTF(urls);
    return <primitive object={scene} />;
};

const DetailPage = () => {
    const location = useLocation();
    console.log(location.state)
    const id = location.state.id
    const name = location.state.name
    let url = location.state.url
    let key = ""
    const updated = location.state.updated

    const [apiKey, setApiKey] = useState("")

    const handleClick = () => {
        key = url.split("/")
        key = key[key.length - 1]
        console.log(key)
        setApiKey(key)
    }

    const handleDownload = () => {
        key = url.split("/")
        key = key[key.length - 1]
        fetch('http://localhost:8000' + url, {
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

    return (
        <>
            <NavbarComponents />
            <Container>
                <Canvas style={{ height: "80vh" }}>
                    <ambientLight intensity={1.5} />
                    <OrbitControls />
                    <Suspense fallback={null}>
                        <PresentationControls>
                            <Model url={url} />
                        </PresentationControls>
                    </Suspense>
                </Canvas>
                <div className="d-flex">
                    <InputGroup aria-label="Basic example">
                        <Button variant="primary" onClick={handleClick}>GET API Key</Button>
                        <Form.Control type="text" placeholder="API key" readOnly value={apiKey} />
                        <Button variant="primary" onClick={handleDownload}>Download</Button>
                    </InputGroup>
                </div>
            </Container>
        </>
    )
}

export default DetailPage