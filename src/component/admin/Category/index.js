import React, { Component } from 'react'
import { Button, Form, Modal, Table } from 'react-bootstrap';
import {FaPlus,FaTrash,FaEdit} from 'react-icons/fa'
import {del, get,post,put} from '../../../httpHelper'

export default class Categories extends Component {

    state = {
        category: {},
        categories: [],
        show: false,
        isEdit: false,
        name: '',
        description: ''
    }

    componentDidMount() {
        this.fetchCategories();
        this.handleShow();
        this.setState({ show: false });

    }

    fetchCategory(categoryId) {
        get(`/category/${categoryId}`)
            .then((res) => this.setState({ category: res.data }))
            .catch((error) => console.log(error));
    }

    fetchCategories() {
        get('/category')
            .then((res) => this.setState({ categories: res.data }))
            .catch((error) => console.log(error));
    }

    handleChange(e, key) {
        this.setState({ [key]: e.target.value });
    }

    handleEdit(categoryId) {
        console.log(categoryId)
        this.setState({ isEdit: true });
        this.fetchCategory(categoryId);
        setTimeout(() => {
            this.setState({ name: this.state.category.name });
            this.handleShow(); 
        }, 500);
    }

    handleSubmit() {
        if (this.state.isEdit) {
            put(`/category/${this.state.category.id}`, {
                name: this.state.name,
            })
                .then((res) => {
                    if (res.status === 200) {
                        this.fetchCategories();
                        this.handleClose();
                    }
                })
                .catch((error)=>alert(error.response.data.message));
        } else {
            post(`/category`, {
                name: this.state.name,
            })
                .then((res) => {
                    if (res.status === 200) {
                        this.fetchCategories();
                        this.handleClose();
                    }
                })
                .catch((error)=>alert(error.response.data.message));
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
    
    handleDelete(categoryid) {
        del(`/category/${categoryid}`)
        .then((res)=>{this.fetchCategories()})
        .catch((error)=>alert(error.response.data.message))
    }

    render() {
        return (
            <div style={{ padding: "30px" }}>
                <hr></hr>
                <Button variant="success" onClick={() => this.handleAdd()}><FaPlus/> Thêm</Button>
                <Table bordered={false} striped={false} hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên thương hiệu</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody style={{textAlign:"center"}}>
                        {this.state.categories.map((category) => {
                            return (
                                <tr key={category.id}>
                                    <td>{category.id}</td>
                                    <td>{category.name}</td>
                                    <td>{category.description}</td>
                                    <td>
                                        <Button onClick={() => this.handleEdit(category.id)}><FaEdit/></Button>
                                    </td>
                                    <td>
                                        <Button variant="danger" onClick={()=> this.handleDelete(category.id)}><FaTrash/></Button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                <Modal show={this.state.show} onHide={() => this.handleClose()}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thương hiệu</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Control type="text" placeholder="Nhập tên thương hiệu" value={this.state.name} onChange={(e) => this.handleChange(e, 'name')} />
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