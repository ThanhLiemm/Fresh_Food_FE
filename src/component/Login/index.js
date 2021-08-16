import React, { Component } from 'react';
import './login.scss'
import { Form, Button,Container } from 'react-bootstrap'
import { Link,useHistory} from 'react-router-dom';
import Banner from '../Shop/banner'
import { get, post, token } from '../../httpHelper';
import {useDispatch} from 'react-redux'
import { Login_Action, Logout_Action } from '../../actions/login_logout';
import { addCart } from '../../actions/cart';
export default function Login(props){
        let dispatch = useDispatch();
        let history = useHistory();
        const handleSubmit = (e) => {
            e.preventDefault();
            let username = e.target.username.value;
            let password = e.target.password.value;
            if(username ==="" || password ==="") {
                alert("Fill this form!")
            }
            let payload = {
                username: username,
                password: password
            }
            post('/auth/signin',payload)
            .then((response)=>{
                console.log(response)
                localStorage.setItem('accessToken',response.data.accessToken);
                localStorage.setItem('username',response.data.username);
                localStorage.setItem('id',response.data.id);
                localStorage.setItem('role',response.data.roles[0]);
                alert("Login Success");
                //re render ui
                const action = Login_Action();
                dispatch(action);
                if(localStorage.role ==="ROLE_USER") {
                    get('/shopcart/count')
                    .then(res=>{
                        localStorage.setItem("count",res.data.Count);
                        const action = addCart(res.data.Count);
                        dispatch(action);
                    })
                    history.push('/cart');
                }
                else history.push('/product');

            })
            .catch((error)=> {
                console.log(error);
                alert("Username or Password is not correct")
            });
        }
        return (
            <div>
                <Banner name = "Login"/>
                <div className="form_login">
                <Form onSubmit={(e)=>handleSubmit(e)}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>User Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter username" required="required" name ="username"/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" required="required" name = "password"/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="remember me" defaultChecked="true"/>
                    </Form.Group>
                    <div className="submit_area">
                        <Button variant="primary" type="submit" >
                            Submit
                        </Button>
                        <span>You don't have account? <Link to ="/signup">Sign up</Link></span>
                    </div>
                </Form>
            </div>
            </div>
        )
}
