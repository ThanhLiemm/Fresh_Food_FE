import React, {} from 'react';
import './signup.scss'
import { Form, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom';
import Banner from '../Shop/banner'
import { post } from '../../httpHelper';
import {useHistory } from 'react-router-dom'

export default function Signup(props){
        window.scrollTo(0,150);
        let history = useHistory();
        const handleFormSubmit = (e) => {
            e.preventDefault();
            let username = e.target.username.value;
            let email = e.target.email.value;
            let password = e.target.password.value;
            let re_password = e.target.re_password.value;

            if(password === '' || username === '' || email === '' || re_password ==='') {
                alert("Please fill this form! ")
                return ;
            }
            if(password !== re_password) {
                alert("Your password and re-password is not match! ")
                return;
            }
            let payload = {
                username: username,
                email: email,
                password: password,
                role: ["user"]
            }
            post('/auth/signup',payload)
            .then((response)=>{
                console.log(response);
                alert("Signup Success! ");
                history.push("/login");
            })
            .catch((error) => {
                console.log(error.response.data);
                alert(error.response.data.message || "Password: "+error.response.data.password)
            })
        }
        return (
            <div>
                <Banner name = "Sign up"/>
                <div className="form_signup">
                    <Form onSubmit = {(e)=>handleFormSubmit(e)}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>User Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" name = "username" required="required"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter email" name = "email" required="required"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name = "password" required="required"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Re-Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" name = "re_password" required="required"/>
                        </Form.Group>

                        <div className="submit_area">
                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                            <span>You have account? <Link to="/login">Login</Link></span>
                        </div>
                    </Form>
                </div>
            </div>
        )
}
