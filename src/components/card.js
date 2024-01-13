import { Suspense } from "react";
import { Card, Button, ButtonGroup } from "react-bootstrap";
import { Canvas } from "@react-three/fiber";
import { useGLTF} from "@react-three/drei";
import Moment from 'react-moment';
import { Link } from "react-router-dom";
import * as config from "../config";

const Image = ({ url }) => {
    console.log(`${config['config']['api']}` + url)
    const urls = `${config['config']['api']}` + url
    console.log(urls)
    return <img src={urls} />;
};

const Model = ({ url }) => {
    const urls = url
    const { scene } = useGLTF(urls);
    return <primitive object={scene} />;
};


const CardComponents = ({ id, name, url, updated }) => {
    let key = ""
    console.log(url)
    const dateToFormat = new Date(updated)

    const handleDownload = () => {
        key = url.split("/")
        key = key[key.length - 1]
        fetch(`${config['config']['api']}` + url, {
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
                    {/* <Card.Text>
                        Some quick example text to build on the card title and
                        make up the bulk of the card's content.
                    </Card.Text> */}
                    <ButtonGroup>
                        <Button><Link to={`detail/${id}`} style={{ color: '#FFF', textDecoration: 'none' }} state={{ id: id, name: name, url: url, updated: dateToFormat }}>Detail</Link></Button>
                        <Button variant="success" onClick={handleDownload}>Download</Button>
                    </ButtonGroup>
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
