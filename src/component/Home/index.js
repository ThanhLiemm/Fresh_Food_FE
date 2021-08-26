import React, { useState, useEffect, useRef } from 'react'
import './home.scss'
import Homeslider1 from '../../asset/Homeslider1.jpg'
import Homeslider2 from '../../asset/Homeslider2.jpg'
import Homeslider3 from '../../asset/Homeslider3.jpg'
import Banner3 from '../../asset/img_banner.jpg'
import { Container, Row, Col } from 'react-bootstrap'
import { Slide } from 'react-slideshow-image';
import './home.scss';
import 'react-slideshow-image/dist/styles.css'
import { FaShippingFast, FaLifeRing, FaUndo, FaCreditCard } from 'react-icons/fa'
import { get } from '../../httpHelper'
import Item from '../Shop/smallitem'
import { FaHeart, FaShoppingCart } from 'react-icons/fa'
import { checkDiscount, checkDiscountPast, formatCurrency, AddShopCart } from '../../algorithm'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

export default function Home() {
    const [newProducts, setnewProducts] = useState([]);
    const [likeProducts, setlikeProducts] = useState([]);
    const [discoutProducts, setdiscoutProducts] = useState([]);
    const [countDown, setcountDown] = useState([])
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchNewProducts();
        fetchLikeProducts();
        fetchTop10Discount();
    }, [])
    const count = (product) => {
        const deadline = new Date(product.deadline);
        const now = new Date();
        // khoang cach giua 2 ngay
        const distant = (deadline - now) / 1000; //giay
        //ngay 
        const days = Math.floor(distant / 3600 / 24);
        //hours 
        const hours = Math.floor(distant / 3600) % 24;
        // minutes
        const minutes = Math.floor(distant / 60) % 60;
        //seconds
        const seconds = Math.floor(distant) % 60;
        let object = {
            days: days,
            hours: hours,
            minutes: minutes,
            seconds: seconds
        }
        return object;
    }
    //add to card
    const handleAddCart = (product) => {
        if (localStorage.role === "ROLE_USER")
            AddShopCart(product, 1, dispatch)
        else
            history.push('/login')
    }
    const isInitialMount = useRef(true);
    useEffect(() => {
        let myInterval
        if (isInitialMount.current) {
            isInitialMount.current = false;
        }
        else {
            myInterval = setInterval(() => {
                let list = [];
                discoutProducts.map((product) => {
                    list.push(count(product));
                })
                setcountDown(list);
            }, 1000);
        }
        return () => {
            clearInterval(myInterval);
        }
    }, [discoutProducts])
    const fetchNewProducts = () => {
        get('/productlist/?page=1&limit=12&sort=createdDate&type=1')
            .then(res => setnewProducts(res.data.listProduct))
            .catch(err => console.log(err.response))
    }
    const fetchLikeProducts = () => {
        get('/productlist/?page=1&limit=10&sort=rating&type=1')
            .then(res => setlikeProducts(res.data.listProduct))
            .catch(err => console.log(err.response))
    }
    const fetchTop10Discount = () => {
        get('/top10discount')
            .then(res => {
                setdiscoutProducts(res.data)
            })
            .catch(err => console.log(err.response))
    }
    const slideImages = [
        Homeslider1,
        Homeslider2,
        Homeslider3
    ];
    const properties = {
        duration: 1500,
        autoplay: true,
        slidesToShow: 1,
        indicators: i => (<div className="indicator"></div>)
    }
    const proNewProduct = {
        slidesToShow: 5,
        autoplay: true,
        duration: 2500,
    }
    const proDiscountProduct = {
        slidesToShow: 3,
        autoplay: true,
        duration: 2500,
    }
    const jsxSlide = <Slide easing="ease" {...properties} className="slide">
        <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[0]})` }}>
                <div className="content">
                    <h2>Fresh Vegetable</h2>
                    <h5>Natural Farm Products</h5>
                    <p>Wides range of farm-fresh Vegetables, Fruits and seasonal produce</p>
                    <button onClick = {()=>{history.push('/shop')}}>Shop now</button>
                </div>
            </div>
        </div>
        <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[1]})` }}>
                <div className="content">
                    <h2>Fresh Tomatoes</h2>
                    <h5>Natural Farm Products</h5>
                    <p>Natural organic tomatoes make your health stronger. Put your information here</p>
                    <button>Shop now</button>
                </div>
            </div>
        </div>
        <div className="each-slide">
            <div style={{ 'backgroundImage': `url(${slideImages[2]})` }}>
                <div className="content">
                    <h2>Vegetables Big Sales</h2>
                    <h5>Natural Farm Products</h5>
                    <p>10% certifled-organic mix of fruit and veggies. Perfect for weekly cooking and snacking</p>
                    <button>Shop now</button>
                </div>
            </div>
        </div>
    </Slide>
    const jsxBenefit = <div className="benefit_area">
        <Row className="justify-content-center">
            <Col lg='2' className="benefit">
                <div><FaShippingFast className="front-fa" /></div>
                <h6>FREE SHIPPING</h6>
                <p>Free Shipping On All Us Order Or Order Above $200</p>
            </Col>
            <Col lg='2' className="benefit">
                <div><FaLifeRing className="front-fa" /></div>
                <h6>SUPPORT 24/7</h6>
                <p>Contact Us 24 Hours A Day, 7 Days A Week</p>
            </Col>
            <Col lg='2' className="benefit">
                <div><FaUndo className="front-fa" /></div>
                <h6>30 DAYS RETURN</h6>
                <p>Simply Return It Within 30 Days For An Exchange</p>
            </Col>
            <Col lg='2' className="benefit">
                <div><FaCreditCard className="front-fa" /></div>
                <h6>100% PAYMENT SECURE</h6>
                <p>We Ensure Secure Payment With PEV</p>
            </Col>
        </Row>
    </div>
    const list = [0, 1, 2, 3, 4, 5];
    const jsxNewProduct = <Container className="newproduct_area ">
        <Slide {...proNewProduct} >
            {
                list.map((number) => {
                    const product1 = newProducts[number] || { listImage: [{ url: "abc", rating: 0 }], name: "", price: "" };
                    const product2 = newProducts[number + 6] || { listImage: [{ url: "abc", rating: 0 }], name: "", price: "" };
                    return <div>
                        <Row className="justify-content-center row-new-product">
                            <Col lg={10}> <Item product={product1} /></Col>
                        </Row>
                        <Row className="justify-content-center row-new-product">
                            <Col lg={10}> <Item product={product2} /></Col>
                        </Row>
                    </div>
                })
            }
        </Slide>
    </Container>
    const jsxCountDown = <Container className="countdown_area">
        <Slide {...proDiscountProduct}>
            {
                discoutProducts.slice(0, 5).map((item, index) => {
                    let time = countDown[index] || { days: 0, hours: 0, minutes: 0, seconds: 0 }
                    return <Row className="justify-content-center">
                        <Col className="product_discount_area" lg='11'>
                            <div className="image_area">
                                <Link to={'/product/' + item.id}><img src={item.listImage[0].url} /></Link>
                                <span className="icon">Sale!</span>
                                <div className="date-time">
                                    <div className="block">
                                        <b>{time.days}</b>
                                        <span className="time_text">Days</span>
                                    </div>
                                    <div className="block">
                                        <b>{time.hours}</b>
                                        <span className="time_text">Hours</span>
                                    </div>
                                    <div className="block">
                                        <b>{time.minutes}</b>
                                        <span className="time_text">Minutes</span>
                                    </div>
                                    <div className="block">
                                        <b>{time.seconds}</b>
                                        <span className="time_text">Seconds</span>
                                    </div>
                                </div>
                            </div>
                            <div className="product_info">
                                <div className="name_icons">
                                    <Link to={'/product/' + item.id}><a className="product_name">{item.name}</a></Link>
                                    <div className="love_shopcart">
                                        <FaHeart />
                                        <FaShoppingCart onClick={() => { handleAddCart(item) }} />
                                    </div>
                                </div>
                                <div>
                                    <span className="discount_price">{formatCurrency(item.price)}</span>
                                    <span className="original_price">{formatCurrency(checkDiscount(item.price, item.discount, item.deadline))}</span>
                                </div>

                            </div>
                        </Col>
                    </Row>
                })
            }
        </Slide>
    </Container>
    const jsxTopLike = <Container className="toplike_area">
        <Row>
            <Col className="products" lg='8'>
                <Row>
                    {
                        likeProducts.slice(0, 6).map((product) => {
                            return <Col lg='6'>
                                <div className="col_product">
                                    <div className="image_area">
                                        <Link to = {'/product/'+product.id}>
                                            <img src={product.listImage[0].url} atl="" />
                                        </Link>
                                    </div>
                                    <div className="info">
                                        <div className="name_price">
                                            <Link to = {'/product/'+product.id}><a>{product.name}</a></Link>
                                            <span>{formatCurrency(checkDiscount(product.price, product.discount, product.deadline))}</span>
                                        </div>
                                        <div className="love_shopcart">
                                            <FaHeart />
                                            <FaShoppingCart onclick = {()=>AddShopCart(product)} />
                                        </div>

                                    </div>
                                </div>
                            </Col>
                        })
                    }
                </Row>
            </Col>
            <Col lg='4'>
                <Link to= {'/shop'}>
                    <div className="banner_left">
                        <img src={Banner3} atl="" />
                        <div className="content_area">
                            <h3>Natural Food</h3>
                            <p>Shop now</p>
                        </div>
                    </div>
                </Link>
            </Col>
        </Row>
    </Container>
    return (
        <div className="home_page">
            {jsxSlide}
            {jsxBenefit}
            <div className="title">
                <h2>New Product</h2>
                <p>Recently added our store</p>
            </div>
            {jsxNewProduct}
            <div className="title">
                <h2>Deals Of The Weeks</h2>
                <p>Recently added our store</p>
            </div>
            {jsxCountDown}
            <div className="title">
                <h2>Top Ratting</h2>
                <p>Recently added our store</p>
            </div>
            {jsxTopLike}
        </div>

    )
}
