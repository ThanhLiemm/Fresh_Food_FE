import React, { useState, useEffect } from 'react'
import { Link, Redirect, withRouter,useHistory } from 'react-router-dom'
import './productdetail.scss'
import Banner from '../Shop/banner.js'
import { get } from '../../httpHelper'
import { Col, Row, Container } from 'react-bootstrap'
import { FaHeart, FaFacebookF, FaTwitter, FaGooglePlusG, FaPinterest } from 'react-icons/fa'
import { useDispatch } from 'react-redux';
import { AddShopCart, checkDiscount, formatCurrency } from '../../algorithm'

function Productdetail(props) {

    const [product, setProduct] = useState({});
    const [category, setCategory] = useState({});
    const [mainUrl, setMainUrl] = useState('');
    const dispatch = useDispatch();
    let history = useHistory();
    const getProduct = () => {
        get(`/product/${props.match.params.productid}`)
            .then((response) =>
                {   
                    setProduct(response.data)
                }
            )
            .catch((e) => {
                console.log("abcd"+e);
                history.push('/404')
            });
    }
    const getCategory = () => {
        let list = product.listImage || [{ url: '' }]
        setMainUrl(list[0].url);
        let id = product.category_id || '';
        get(`/category/${id}`)
            .then((response) => { setCategory(response.data) })
            .catch((error) => console.log(error));
    }


    useEffect(() => {
        getCategory();
    }, [product])

    useEffect(() => {
        getProduct();
    }, []);
    const handleImageChange = (e) => {
        setMainUrl(e.target.src);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        AddShopCart(product, e.target.quantity.value, dispatch);
    }

    let name = product.name || ""
    let listImage = product.listImage || [{ url: "" }];
    let price = product.price || "";
    let rating = product.rating || "";
    let description = product.description || "";
    let category_name = category.name || "";

    let discount = checkDiscount(product.price, product.discount, product.deadline);
    let discountPrice = formatCurrency((discount || ''));
    let originalPrice = formatCurrency((product.price || ''));

    let priceJsx;
    if (discount === product.price)
        priceJsx = <p className="price">{originalPrice}</p>;
    else priceJsx = <p className="price"><span>{originalPrice}</span> {discountPrice}</p>
    return (
        <div>
            <Banner name="Product Detail" />
            <Container>
                <div className="main_detail">
                    <Row>
                        <Col lg-6 className="image">
                            <div className="main_image">
                                <img className="main" src={mainUrl} />
                            </div>
                            <div className="list_image">
                                {listImage.map((image) => {
                                    return <img src={image.url} onClick={(e) => handleImageChange(e)} />
                                })}
                            </div>
                        </Col>
                        <Col lg-6 className="info_detail">
                            <div className="detail">
                                <h1>{name}</h1>
                                <div>
                                    <FaHeart />
                                    <span> {rating} (lượt)</span>
                                </div>
                                {priceJsx}
                                <p className="description">{description}</p>
                                <div className="form_area">
                                    <form onSubmit={(e) => handleFormSubmit(e)}>
                                        <input type="number" defaultValue="1" name="quantity"></input>
                                        <button type="submit">ADD TO CART</button>
                                    </form>
                                </div>
                                <div>
                                    <span>Category : </span><span className="category_name">{category_name}</span>
                                </div>
                                <div className="end_detail">
                                    <span>Share: </span> <FaFacebookF /> <FaTwitter /> <FaGooglePlusG /> <FaPinterest />
                                </div>
                            </div>

                        </Col>
                    </Row>

                </div>

            </Container>
        </div>
    )
}

export default withRouter(Productdetail);
