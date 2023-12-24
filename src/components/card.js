import { useState, Suspense } from "react";
import { Card, Button } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { useGLTF, PresentationControls, Stage, OrbitControls } from "@react-three/drei";
import Moment from 'react-moment';
import { Link, useNavigate } from "react-router-dom";

const Image = ({ url }) => {
    console.log('http://localhost:8000' + url)
    const urls = 'http://localhost:8000' + url
    console.log(urls)
    return <img src={urls} />;
};

const Model = ({ url }) => {
    console.log('http://localhost:8000' + url)
    const urls = 'http://localhost:8000' + url
    console.log(urls)
    const { scene } = useGLTF(urls);
    return <primitive object={scene} />;
};

const CardComponents = ({ id, name, url, updated }) => {
    const navigate = useNavigate();
    console.log(url)
    const dateToFormat = new Date(updated)

    if (name && name !== "") {
        return (
            <Card className="mx-2" style={{ width: "280px", height: "350px" }}>
                <Canvas>
                    <ambientLight />
                    <Suspense fallback={null}>
                        <Model url={url} />
                    </Suspense>
                </Canvas>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                    </Card.Text>

                    <Link to={`detail/${id}`} state={{ id: id, name: name, url: url, updated: dateToFormat }}>Detail</Link>
                </Card.Body>
                <Card.Footer>
                    <small>
                        Created :  <Moment date={dateToFormat} format="DD/MM/YYYY HH:mm:ss" />
                    </small>
                </Card.Footer>
            </Card>
        );
    }
};

export default CardComponents;
