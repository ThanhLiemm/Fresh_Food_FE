import React, { Component } from 'react'
import { Button, Form, Modal, Table } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa'
import { del, get, post, put } from '../../../httpHelper'
import './payment.scss'

export default class payments extends Component {

    state = {
        payment: {},
        payments: [],
        show: false,
        isEdit: false,
        name: '',
        url: ''
    }

    componentDidMount() {
        this.fetchPayments();
        this.handleShow();
        this.setState({ show: false });

    }

    fetchPayment(paymentId) {
        get(`/payment/${paymentId}`)
            .then((res) => this.setState({ payment: res.data }))
            .catch((error) => console.log(error));
    }

    fetchPayments() {
        get('/payment')
            .then((res) => this.setState({ payments: res.data }))
            .catch((error) => console.log(error));
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    handleEdit(paymentId) {
        this.setState({ isEdit: true });
        this.fetchPayment(paymentId);
        setTimeout(() => {
            this.setState({ name: this.state.payment.name });
            this.setState({ url: this.state.payment.url });
            this.handleShow();
        }, 300);
    }

    handleSubmit() {
        if (this.state.isEdit) {
            console.log("abc"+this.state.name + this.state.url)
            if(!(this.state.name || this.state.url)) {
                alert("input invalid");
                return ;
            }
            put(`/payment/${this.state.payment.id}`, {
                name: this.state.name,
                url: this.state.url
            })
                .then((res) => {
                    if (res.status === 200) {
                        this.fetchPayments();
                        this.handleClose();
                    }
                })
                .catch((error)=>{
                    console.log(error.response);
                    alert(error.response.data.message)
                });
        } else {
            post(`/payment`, {
                name: this.state.name,
                url: this.state.url
            })
                .then((res) => {
                    if (res.status === 200) {
                        this.fetchPayments();
                        this.handleClose();
                    }
                })
                .catch((error)=>alert(error.response.data.message));;
                
        }
    }

    handleShow() {
        this.setState({ show: true });
    }
    handleAdd() {
        this.setState({name:"",url:""})
        this.setState({ show: true });
    }

    handleClose() {
        this.setState({ isEdit: false });
        this.setState({ show: false });
    }
    handleDelete(paymentId) {
        del(`/payment/${paymentId}`)
        .then((res)=>{this.fetchPayments()})
        .catch((error)=>alert(error.response.data.message))
    }

    render() {
        return (
            <div style={{ padding: "30px" }}>
                <hr></hr>
                <Button variant="success" onClick={() => this.handleAdd()}><FaPlus /> Thêm</Button>
                <Table bordered={false} striped={false} hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên thương hiệu</th>
                            <th>Mô tả</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {this.state.payments.map((payment) => {
                            return (
                                <tr key={payment.id}>
                                    <td>{payment.id}</td>
                                    <td>{payment.name}</td>
                                    <td>{payment.url}</td>
                                    <td>
                                        <Button onClick={() => this.handleEdit(payment.id)}><FaEdit /></Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={()=>this.handleDelete(payment.id)}><FaTrash /></Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={() => this.handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Phương Thức Thanh Toán</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control type="text" placeholder="Nhập tên phương thức thanh toán" value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} name = "name"/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="url">
                                <Form.Control type="text" placeholder="Nhập url" value={this.state.url} onChange={(e) => this.handleChange(e, 'url')} name = "url"/>
                            </Form.Group>
                        </Form>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.handleClose()}>Đóng</Button>
                        <Button variant="primary" onClick={() => this.handleSubmit()}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}