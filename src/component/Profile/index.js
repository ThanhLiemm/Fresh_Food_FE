import './profile.scss'

import React, {useState, useEffect}from 'react'
import Banner from '../Shop/banner'
import { Container, Form, Row, Col } from 'react-bootstrap'
import { get, put } from '../../httpHelper'

export default function Index() {
    const [profile, setprofile] = useState({})
    
    const getProfile = () =>{
        get('/customer')
        .then((response)=>{
            console.log(response);
            setprofile(response.data)
        })
        .catch((error) => {
            console.log(error)
        })
    }
    useEffect(()=>{
        getProfile()
    }     
        , [])
    const handleFormSubmit = (e)=>{
        e.preventDefault();
        //validate
        //create payload
        let payload = {...profile};
        payload.address = e.target.address.value;
        payload.firstname = e.target.firstname.value;
        payload.lastname = e.target.lastname.value;
        payload.phone = e.target.phone.value;
        put('/customer',payload) 
        .then((response)=> {
            console.log(response.data);
            alert("update success")
            setprofile(response.data)
        })
        .catch((error)=>{
            console.log(error.response);
            alert(error.response.data.message);
        })
    }
    return (
        <div className="your_profile">
            <Banner name="Your Profile" />
            <Container>
                <Form className = "form_data" onSubmit = {(e)=>handleFormSubmit(e)}>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your firsname" required = "required" name = "firstname" defaultValue={profile.firstname}/>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter your lastname" required = "required" name = "lastname" defaultValue={profile.lastname}/>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type = "text" placeholder="1234 Main St" required = "required" name = "address" defaultValue={profile.address}/>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control type ="tel" placeholder="Enter your phone number" value={profile.phone} name = "phone"/>
                    </Form.Group>

                    <div className="submit">
                        <button type = "submit">Update</button>
                    </div>
                </Form>
            </Container>
        </div>
    )
}
