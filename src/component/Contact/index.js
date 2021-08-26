import React, { Component } from 'react'
import { Container, Row, Col, Form } from 'react-bootstrap'
import Banner from '../Shop/banner'
import './contact.scss'
import { FaHome, FaPhone, FaRegEnvelopeOpen } from 'react-icons/fa'
import emailjs from 'emailjs-com'
import Swal from "sweetalert2";
export default class Contact extends Component {

    render() {
        const handleSubmit = (e) => {

            e.preventDefault();

            emailjs.sendForm('service_de0i2ua', 'template_ll2g7ps', e.target, 'user_f1dWVoITln4WL2RC2QCgY')
            .then((result) => {
                console.log(result.text);
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Thank for you idea',
                    showConfirmButton: false,
                    timer: 2000
                  })
                  e.target.reset();
            }, (error) => {
                console.log(error);
            });
            
        }
        return (
            <div>
                <Banner name="Contact"></Banner>
                <Container className="contact_content">
                    <Row >
                        <Col lg='3' className="col_info" >
                            <div>
                                <h3>Contact Us</h3>
                                <div className="Contact" >
                                    <div className="header">
                                        <div><FaHome className="icon" /></div>
                                        <h5>Address</h5>
                                    </div>
                                    <div className="content">
                                        <p>97 Man Thien, Q9, tp Ho Chi Minh, Viet Nam</p>
                                    </div>
                                </div>
                                <div className="Contact">
                                    <div className="header">
                                        <div><FaPhone className="icon" /></div>
                                        <h5>Phone</h5>
                                    </div>
                                    <div className="content">
                                        <p>Mobile: (08) 123 456 789</p>
                                        <p>Hotline: 1009 678 456</p>
                                    </div>
                                </div>
                                <div className="Contact">
                                    <div className="header">
                                        <div><FaRegEnvelopeOpen className="icon" /></div>
                                        <h5>Email</h5>
                                    </div>
                                    <div className="content_end">
                                        <p>yourmail@domain.com</p>
                                        <p>support@roadthemes.com</p>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg='8' className="col_form">
                            <div>
                                <h3>Tell Us Your Message</h3>
                                <Form onSubmit={(e) => handleSubmit(e)}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Your Name (required)</Form.Label>
                                        <Form.Control type="text" required placeholder="" className="input_field" name="name" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Your Email (required)</Form.Label>
                                        <Form.Control type="email" required placeholder="" className="input_field" name="email" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Subject</Form.Label>
                                        <Form.Control type="text" placeholder="" className="input_field" name="subject" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Your Message</Form.Label>
                                        <Form.Control as="textarea" rows={3} required className="input_field" name="message" />
                                    </Form.Group>
                                    <button type="submit" className="send_button">Send</button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Container>
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.5201415508745!2d106.78447601453792!3d10.847986992272947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752772b245dff1%3A0xb838977f3d419d!2zSOG7jWMgdmnhu4duIEPDtG5nIG5naOG7hyBCxrB1IGNow61uaCBWaeG7hW4gdGjDtG5nIEPGoSBT4bufIFThuqFpIFRQLiBI4buTIENow60gTWluaMK3!5e0!3m2!1svi!2s!4v1629293538344!5m2!1svi!2s" className="maps"></iframe>
            </div>
        )
    }
}
