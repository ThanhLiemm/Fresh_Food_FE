import React, { useState, useEffect } from 'react'
import './checkout.scss'
import Banner from '../Shop/banner'
import { Container, Row, Col, Form} from 'react-bootstrap'
import { checkDiscount, DisableAll, formatCurrency } from '../../algorithm'
import { get, post, put } from '../../httpHelper'
import {useHistory} from 'react-router-dom'

export default function Index(props) {
    const [listProduct, setListProduct] = useState([]);
    const [listPayment, setlistPayment] = useState([{ id: 0, name: '', url: '' }])
    const [customer, setcustomer] = useState({})
    let total = 0;
    let history = useHistory();
    
    //get list payment
    const getPayment = () => {
        get('/payment')
            .then((response) => setlistPayment(response.data))
            .catch((erorr) => console.log(erorr))
    }
    //get shopcart
    const getShopCart = () => {
        get('/shopcart')
        .then((response)=>{setListProduct(response.data)})
        .catch((err)=>{console.log(err.response)});
    }
    //get customer
    const getCustomer = ()=>{
        get('/customer')
        .then((res)=>setcustomer(res.data))
        .catch(err=>console.log(err.response))
    }
    useEffect(() => {
        getPayment();
        getShopCart();
        getCustomer();
    }, [])
    //diable all product 
    const unchecked = () => {
        listProduct.map((item)=>{
            item.checked = false;
            put(`/shopcart`,item)
            .catch(err => console.log(err))
        })
    }
    //show list buy prodcut
    let buyProducts = listProduct.map((item) => {
        let price = checkDiscount(item.product.price, item.product.discount, item.product.deadline);
        if (item.checked) {
            total += price * item.quantity;
            return <p className="product">{item.product.name} x {item.quantity}<span>{formatCurrency(price * item.quantity)}</span></p>
        }
    })
    //sho list payment
    let paymentJsx = listPayment.map((item) => {
        return <Form.Check type="radio" label={item.name} name="group" value={item.id} required = "required" />
    })
    const handleCheckout = (e) => {
        e.preventDefault();
        let fistname = e.target.firstname.value;
        let lastname = e.target.lastname.value ;
        let phone = e.target.phone.value;
        let email = e.target.email.value;
        let address = e.target.address.value;
        let paymentId = e.target.group.value;
        // let customerId = localStorage.getItem('id');
        // let jwt = `Bearer ${localStorage.getItem('accessToken')}`
        
        let orderDetailDTOS = [];
        listProduct.map((item) => {
            if(item.checked) {
                orderDetailDTOS.push({
                    quantity: item.quantity,
                    productId: item.product.id
                })
            }
        })
        //create payload
        let payload = {
            address: address,
            email:email,
            fullname: `${lastname} ${fistname}`,
            phone: phone,
            status: 0,
            paymentId: paymentId,
            orderDetailDTOS: orderDetailDTOS
        }
        post('/order',payload)
        .then((response)=>{
            console.log(response)
            unchecked();
            alert("Order Success, Your Product is delivering!")
            history.push('/shop');
        })
        .catch((error)=>{
            console.log(error)
            alert(error.response)
        });
    }
    return (

        <div className="checkout">
            <Banner name="Checkout" />
            <Container>
                <form onSubmit = {(e)=> handleCheckout(e)}>
                    <Row>
                        <Col className="left" lg-6>
                            <div className="customer_info">
                                <h3>BILLING DETAILS</h3>
                                <div className="info_form">
                                    <Row>
                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter first name" required="required" name = "firstname"
                                            value = {customer.firstname}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridPassword">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter last name" required="required" name = "lastname"
                                            value = {customer.lastname}/>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control placeholder="1234 Main St" required="required" name = "address"
                                        value = {customer.address}/>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress2">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type= "email" placeholder="@Example.com" required="required"  name = "email"
                                        value = {localStorage.email}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress2">
                                        <Form.Label>Phone</Form.Label>
                                        <Form.Control type="tel" placeholder="012345678" required="required"  name = "phone"
                                        value = {customer.phone}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </Col >
                        <Col className="right" lg-6>
                            <div className="bill_info">
                                <h3>YOUR ORDER</h3>
                                <div className="title">
                                    <h4>Product</h4>
                                    <h4>Price</h4>
                                </div>
                                {buyProducts}
                                <h4 className="total">Total: <span>{formatCurrency(total)}</span></h4>
                                <div className="payment">
                                    {paymentJsx}
                                </div>
                                <div className="checkout">
                                    <button type="submit" >Checkout</button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Container>
        </div>
    )
}
