import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import React, { useState, useEffect } from 'react'
import icon from '../../asset/icon.png'
import './navbar.scss'
import { FaShoppingCart } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useSelector,useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import {Logout_Action } from '../../actions/login_logout';

export default function Header() {
    const numberProduct = useSelector(state => state.cart.number);
    const user = useSelector(state=>state.user);
    let left, right;
    let history = useHistory();
    let dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        const action = Logout_Action();
        dispatch(action);
        history.push('/login');
    }
    if (user.username === "") {
        left =
            <Nav className="me-auto">
                <Nav.Link as={Link} to='/' >Home</Nav.Link>
                <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                <Nav.Link as={Link} to="/about">About us</Nav.Link>
                <Nav.Link as={Link} to="/contact">Contact us</Nav.Link>
            </Nav>
        right =
            <Nav>
                <Nav.Link as={Link} to="/cart" id="count">
                    <FaShoppingCart /> <span>{numberProduct}</span>
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                    <a>Login</a>
                </Nav.Link>
                <span> / </span>
                <Nav.Link as={Link} to="/signup">
                    <a>Signup</a>
                </Nav.Link>
            </Nav>
    }
    else {
        if (user.role === "ROLE_USER") {
            left =
                <Nav className="me-auto">
                    <Nav.Link as={Link} to='/' >Home</Nav.Link>
                    <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
                    <Nav.Link as={Link} to="/about">About us</Nav.Link>
                    <Nav.Link as={Link} to="/contact">Contact us</Nav.Link>
                </Nav>
            right =
                <Nav>
                    <Nav.Link as={Link} to="/cart" id="count">
                        <FaShoppingCart /> <span>{numberProduct}</span>
                    </Nav.Link>
                    <Nav.Link as={Link} to="/customer">
                        <a>{user.username}</a>
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>
                        <a>Logout</a>
                    </Nav.Link>
                </Nav>
        }
        if (user.role === "ROLE_ADMIN") {
            left =
                <Nav className="me-auto">
                    <Nav.Link as={Link} to='/' >Product</Nav.Link>
                    <Nav.Link as={Link} to="/shop">Category</Nav.Link>
                    <Nav.Link as={Link} to="/about">Payment</Nav.Link>
                </Nav>
            right =
                <Nav>
                    <Nav.Link>
                        <a>{`Admin`}</a>
                    </Nav.Link>
                    <Nav.Link onClick={handleLogout}>
                        <a>Logout</a>
                    </Nav.Link>
                </Nav>
        }
    }
    return (
        <Navbar collapseOnSelect expand="lg" bg="green" variant="dark" fixed="top">
            <Container>
                <Link to='/'>
                    <Navbar.Brand >
                        <img src={icon}></img>
                    </Navbar.Brand>
                </Link>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    {left}
                    {right}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

