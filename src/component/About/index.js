import React, { Component } from 'react'
import { Container, Row, Col,ProgressBar } from 'react-bootstrap'
import Banner from '../Shop/banner'
import './about.scss'
export default class About extends Component {
    render() {
        return (
            <div>
                <Banner name="About us"></Banner>
                <Container className="about_content">
                    <Row className=" justify-content-center">
                        <Col className="info" lg='5'>
                            <h2>About Our Fresh Food Store</h2>
                            <h5>We Believe That Every Project Existing In Fresh Vegetables World Is A Result Of An Idea And Every Idea Has A Cause.</h5>
                            <p>For this reason, our every design serves an idea. Our strength in design is reflected by our name, our care for details. Our specialist won't be afraid to go extra miles just to approach near perfection. We don't require everything to be perfect, but we need them to be perfectly cared for. That's a reason why we are willing to give contributions at best. Not a single detail is missed out under Billey's professional eyes. The amount of dedication and effort equals to the level of passion and determination. Get better, together as one.</p>
                        </Col>
                        <Col className="image" lg='5'>
                            <img src="http://demo.roadthemes.com/safira/wp-content/uploads/2020/06/img-about2.jpg"></img>
                        </Col>
                    </Row>
                </Container>
                <div className="center_content">
                    <Container>
                        <Row className="justify-content-center">
                            <Col lg='5' className="left" >
                                <h3>Functionality Meets Perfection</h3>
                                <p>In today’s day and age, one cannot underestimate the importance of design, the art of creating striking visuals to move and captivate your audience. And as the world becomes more and more digitized with each passing second, the importance of graphic design has been rocketed to the top.</p>
                            </Col>
                            <Col lg='5' className ="right">
                                <div className="design">
                                    <p>UI/UX</p>
                                    <ProgressBar striped variant="danger" now={75} />
                                    <p>Ideas</p>
                                    <ProgressBar striped variant="danger" now={65} />
                                    <p>Design</p>
                                    <ProgressBar striped variant="danger" now={85} />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
                    <Container className ="girl">
                    <div className="row_icon">
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/icon_about1.jpg"></img></div>
                            <h5>Creative Always</h5>
                            <p>We believe any idea is a good idea, but the best idea wins</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/icon_about2.jpg"></img></div>
                            <h5>Express Customization</h5>
                            <p>Safira has many Express Customization centers throughout Europe</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/icon_about3.jpg"></img></div>
                            <h5>Premium Integrations</h5>
                            <p>We can build pretty much any integration you want</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/icon_about4.jpg"></img></div>
                            <h5>Premium Integrations</h5>
                            <p>Write, edit and interact with others on the same content, in real time</p>
                        </div>
                    </div>
                    </Container>
                    <Container className ="girl">
                        <h2>Meet Our Leaders</h2>
                        <p><span style ={{borderBottom:"black 2px solid"}}>Fresh Food's Team</span></p>
                    <div className="row_icon">
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/leader1.png"></img></div>
                            <h5>Ms. Veronica</h5>
                            <p style = {{marginTop:"0"}}>Web Designer</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/leader2.png"></img></div>
                            <h5>Missa Santos</h5>
                            <p style = {{marginTop:"0"}}>CEO Founder</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/leader3.png"></img></div>
                            <h5>Missa Santos</h5>
                            <p style = {{marginTop:"0"}}>Chief Operating Officer</p>
                        </div>
                        <div lg='3' className = "icon_col">
                            <div><img src = "http://demo.roadthemes.com/safira/wp-content/uploads/2020/04/leader4.png"></img></div>
                            <h5>Lisa Antonia</h5>
                            <p style = {{marginTop:"0"}}>Chief Operating Officer</p>
                        </div>
                    </div>
                    </Container>
            </div>
        )
    }
}
