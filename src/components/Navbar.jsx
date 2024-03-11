import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, Button, Dropdown } from 'react-bootstrap';
import styles from './NavBar.module.css';
import UserService from "../services/UserService";



function NavBar() {
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        if (accessToken) {
          UserService.getUserByAccessToken(accessToken)
            .then(response => {
              setUserRole(response.data.role); 
            })
            .catch(error => {
              navigate("/Login");
            });
        }
      }, [accessToken, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        navigate("/Login");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleProfileClick = () => {
        if (accessToken) {
            navigate("/profile");
        } else {
            navigate("/Login");
        }
    };

    return (
        <Navbar className={styles.navBar} expand="lg">
          <Container className="mt-0">
            <Navbar.Brand onClick={handleLogoClick}>
              <img className="logoNav" src="/src/Images/logoS3.png" alt="logo" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
              <Nav className="ml-auto">
                {localStorage.getItem('access_token') ? (
                  <Dropdown>
                    <Dropdown.Toggle as={Button} variant="link" id="profile-dropdown">
                      <img src="/src/Images/profilePicture.png" alt="Profile" className={styles.profileImage} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {userRole === 'CAR_OWNER' && (
                        <Dropdown.Item as={NavLink} to="/userAdverts">
                          Manage Adverts
                        </Dropdown.Item>
                      )}
                      <Dropdown.Item as={NavLink} to="/chats">Chats</Dropdown.Item>
                      <Dropdown.Item onClick={handleProfileClick}>Profile</Dropdown.Item>
                      <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                ) : (
                  <NavLink to="/Login">
                    Login
                  </NavLink>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      );
}

export default NavBar;
