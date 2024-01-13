import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { useEffect, useState } from "react";
import * as config from "../config";

const NavbarComponents = () => {
    let [username, set_username] = useState("");

    let get_user_data = async () => {
        let id = localStorage.getItem("user_id");
        let res = await fetch(`${config['config']['api']}/api/profile/${id}/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
        });
        console.log(res);
        let data = await res.json();
        console.log(data)
        set_username(data["data"]["username"]);
    };

    useEffect(() => {
        get_user_data();
    }, []);

    return (
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="/">3D App</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <div className="me-auto"></div>
                    <Nav>
                        <NavDropdown title={username} id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                Profile
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                                href="login"
                                onClick={() => {
                                    localStorage.clear();
                                }}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavbarComponents;
