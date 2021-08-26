import React, { useState, useEffect, useRef } from 'react'
import Banner from '../Shop/banner';
import { Container, Table, Modal,Form,Row,Col } from 'react-bootstrap';
import { get, put } from '../../httpHelper';
import { checkDiscount, checkDiscountPast, formatCurrency, formatDate } from '../../algorithm';
import './customerorder.scss'

export default function Index() {
    const [listOrder, setlistOrder] = useState([{ orderDetailDTOS: [{ id: 0 }] }]);
    const [listProduct, setlistProduct] = useState([])
    const [showDetail, setshowDetail] = useState(false)
    const [order, setorder] = useState({ orderDetailDTOS: [{ id: 0 }] })
    const [payments, setpayments] = useState([])
    const getListOrder = () => {
        get('/order')
            .then((response) => {
                console.log(response.data);
                setlistOrder(response.data)
            })
            .catch((error) => alert(error))
    }
    const getPayments = ()=> {
        get('/payment')
        .then(response=>setpayments(response.data))
        .catch(err =>console.log(err))
    }
    useEffect(() => {
        getListOrder();
        getPayments();
    }, [])
    
    const isInitialMount = useRef(true);
    //load products that are in order
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            let listId = [];
            listOrder.map((order) => {
                order.orderDetailDTOS.map((detail) => {
                    if (listId.indexOf(detail.productId) === -1) listId.push(detail.productId);
                })
            })
            console.log(listId)
            let listTemp = [];
            listId.map((id) => {
                get(`/product/${id}`)
                    .then((response => {
                        console.log("abdc")
                        listTemp.push(response.data);
                    }))
                    .catch((error) => console.log(error.response))
            })
            console.log(listTemp);
            setTimeout(() => {
                setlistProduct(listTemp);
            }, 1000);
        }
    }
        , [listOrder])
    //for admin
    const handleSelected = (e) => {
        let index = e.target.id;
        let value = e.target.value;
        if (!window.confirm(`Are you sure to ${value} order?`)) return;
        //put
        let payload = listOrder[index];
        payload.status = value;
        put(`/order/${payload.id}`, payload)
            .then((response) => {
                console.log(response.data);
                getListOrder();
            })
            .catch((error) => {
                console.log(error.response)
                alert(error.response.data.message)
            })
    }
    //ham cover id sang name ok chua
    const idToName = (id) => {
        const List = listProduct.filter((product) => {
            return product.id == id
        })
        if (List.length == 0) return { listImage: [{ url: "" }], price: 0, deadline: new Date() };
        else return List[0];
    }
    //ham xu li hien thi thong tin chi tiet
    const checkShow = (orderIndex) => {
        let order = listOrder[orderIndex];
        setorder(order);
        setshowDetail(true);
        console.log(order)
    }
    let JsxContent = listOrder.map((order, index) => {
        let price = order.total || 0;
        let item;
        item = order.orderDetailDTOS.map((detail) => {
            let product = idToName(detail.productId)
            return <div className="order_content">
                <div className="product_info">
                    <img src={product.listImage[0].url} atl=""></img>
                    <span>{product.name}</span>
                </div>
                <div className="quantity">
                    <span>Quantity: {detail.quantity}</span>
                </div>
                <div className="product_price">
                    <span>{formatCurrency(checkDiscountPast(product.price, product.discount, product.deadline, order.createdDate))}</span>
                </div>
            </div>
        });
        return <div className="order_item" onClick={() => checkShow(index)}>
            <div className="order_header">
                <div><span>{formatDate(order.createdDate)}</span></div>
                <div className="status_price">
                    <span className="status ">Status :
                        <span style={order.status == "CANCEL" ? { color: "red" } : order.status == "DELIVERING" ? { color: "#eaea1d" } : { color: "#40a944" }}>{order.status}</span>
                    </span>
                    <span className="price">{formatCurrency(price)}</span>
                </div>

            </div>
            {item}
        </div>
    })
    let p = payments.find((p)=>p.id == order.paymentId) || {name:""}
    let strProduct_Quantity = "" ;
    order.orderDetailDTOS.map(detail => {
        let product = idToName(detail.productId)
        strProduct_Quantity+=product.name+"(x"+detail.quantity+") ";
    })
    return (
        <div style = {{marginBottom:"50px"}}>
            <Banner name="List Ordered" />
            <Container>
                {JsxContent}
                <Modal show={showDetail} onHide={() => setshowDetail(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title style={{ color: '#40a944', backgroundColor: '#FAFCFC' }}>
                            Detailed Order Information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#FAFCFC' }}>
                        <Form className='modal-detail-asset'>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Date Buy
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={formatDate(order.createdDate)}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    User
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.createdBy}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Fullname
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.fullname}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Email
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.email}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    phone
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.phone}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Status
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.status}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Payment
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={p.name}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Products
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={strProduct_Quantity}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    Total
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={formatCurrency(order.total)}
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId='formPlaintextEmail'>
                                <Form.Label column sm='3' className='pr-0'>
                                    address
                                </Form.Label>
                                <Col sm='9'>
                                    <Form.Control
                                        plaintext
                                        readOnly
                                        defaultValue={order.address}
                                    />
                                </Col>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                </Modal>
            </Container>
        </div>
    )
}
