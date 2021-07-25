import React, { Component } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './footer.scss'

export default class index extends Component {
    render() {
        return (
            <footer>
                <Container>
                    <div className="footer_top">
                        <Row>
                            <Col lg={4}>
                                <div>
                                    <h2>Fresh Food</h2>
                                    <p>We are a team of designers and developers that create high quality Magento, Prestashop, Opencart.</p>
                                    <ul>
                                        <li>
                                            <strong>Adress: </strong>
                                            4710-4890 Breckinridge USA
                                        </li>
                                        <li>
                                            <strong>Email: </strong>
                                            support@plazathemes.com
                                        </li>
                                        <li>
                                            <strong>Call Us: </strong>
                                            1-1001-234-5678
                                        </li>
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <div>
                                    <h3>Infomation</h3>
                                    <ul>
                                        <li><a>Blog</a></li>
                                        <li><a>Contact</a></li>
                                        <li><a>Wishlist</a></li>
                                        <li><a>About us</a></li>
                                        <li><a>Privacy Policy</a></li>
                                        <li><a>Frequently Questions</a></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={2}>
                                <div>
                                    <h3>Categories</h3>
                                    <ul>
                                        <li><a>Hoa Qủa</a></li>
                                        <li><a>Rau Xanh</a></li>
                                        <li><a>Thịt Tươi</a></li>
                                        <li><a>Cá Hồi</a></li>
                                        <li><a>Cá Chép</a></li>
                                        <li><a>Bánh Mì</a></li>
                                    </ul>
                                </div>
                            </Col>
                            <Col lg={4}>
                                <div>
                                    <h3>Sign Up To Newsletter</h3>
                                    <p>Subscribe to get the latest news and updates from Safira</p>
                                    <form>
                                        <div>
                                            <input type="email" placeholder=" Your email address.."></input>
                                            <button type="submit">SUBSCRIBE</button>
                                        </div>
                                    </form>

                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="footer_bottom">
                        <Row>
                            <Col>
                                <p>Copyright © PlazaThemes. All Right Reserved.
                                    <br/> Design by Plazathemes.com</p>
                            </Col>
                            <Col>
                                <div>
                                    <img src="http://demo.roadthemes.com/safira/wp-content/uploads/2020/05/icon_payment.png" atl=""/>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Container>
            </footer>
        )
    }
}
