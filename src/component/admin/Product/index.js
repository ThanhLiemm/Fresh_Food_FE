import React, { Component } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import './product.scss'
import { get, put } from '../../../httpHelper'
import Pagination from 'react-bootstrap/Pagination'
import { FaAngleDown, FaThList } from 'react-icons/fa'
import Banner from '../../Shop/banner'
import { Link } from 'react-router-dom'
import { checkDiscount, formatCurrency } from '../../../algorithm'

class RowToolBar extends Component {
    state = {
        display: "none",
        sortType: "Sort by:  Default sorting"
    }
    handleDropDown = () => {
        if (this.state.display === "none")
            this.setState({
                display: "block"
            })
        else this.setState({ display: "none" })
    };
    handleSortChange = (text, number) => {
        this.setState({ sortType: text },
            (() => { this.props.action(number) }))
    }

    render() {
        return (
            <Row className="row_toolbar">
                <div className="tool_bar">
                    <div>
                        <span>Showing {this.props.startItem}-{this.props.endItem} of {this.props.totalItem} results</span>
                    </div>
                    <div className="sort_type" onClick={() => { this.handleDropDown() }}>
                        <span className="sort_name">{this.state.sortType}</span> <FaAngleDown />
                        <div className="drop_down_sort" style={{ display: this.state.display }}>
                            <ul>
                                <li onClick={() => (this.handleSortChange("Sort by: Default sorting", 1))}>Sort by: Default sorting</li>
                                <li onClick={() => (this.handleSortChange("Sort by: Rating sorting", 2))}>Sort by: Rating sorting</li>
                                <li onClick={() => (this.handleSortChange("Sort by price: Low to high", 3))}>Sort by price: Low to high</li>
                                <li onClick={() => (this.handleSortChange("Sort by price: High to Low", 4))}>Sort by price: High to low</li>
                                <li onClick={() => (this.handleSortChange("Sort by id: High to low", 5))}>Sort by id: High to low</li>
                                <li onClick={() => (this.handleSortChange("Sort by id: Low to high", 6))}>Sort by id: Low to high</li>
                                <li onClick={() => (this.handleSortChange("Sort by: Category", 7))}>Sort by: Category </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </Row>
        )
    }
}

class Categories extends Component {
    render() {
        return (
            <div>
                <div className="title">Categories</div>
                <div className="list_category">
                    <ul>
                        <li onClick={() => this.props.action('')}> <a>Tất Cả</a> </li>
                        {
                            this.props.categories.map((item) => {
                                const category = item || { name: "" }
                                return <li onClick={() => this.props.action(category.id)}><a>{category.name}</a></li>
                            })}
                    </ul>
                </div>
            </div>
        )
    }
}




export default class Shop extends Component {
    state = {
        filter: {
            category: '',
            sort: 'createdDate',
            type: 1,
        },
        page: 1,
        limit: 12,
        totalPage: 0,
        totalItem: 0,
        listProduct: [],
        listCategory: []
    }

    setStateProduct(response) {
        this.setState({
            listProduct: response.data.listProduct,
            page: response.data.page,
            totalPage: response.data.totalPage,
            totalItem: response.data.totalProduct
        })
    }
    setStateCategory(response) {
        this.setState({
            listCategory: response.data
        })
    }
    //update list product for sort for page for category
    updateListProduct = () => {

        get(`/admin/productlist/?page=${this.state.page}` + //url 
            `&limit=${this.state.limit}` +
            `&sort=${this.state.filter.sort}` +
            `&type=${this.state.filter.type}` +
            `&category=${this.state.filter.category}`)
            .then(response => {
                console.log(response);
                this.setStateProduct(response);
            })
            .catch(erorr => console.log(erorr));


    }
    //update category
    updateListCategory = () => {
        get("/category")
            .then(response => {
                console.log(response);
                this.setStateCategory(response);
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.updateListProduct();
        this.updateListCategory();
    }
    handlePageChange = (event) => {
        this.setState({
            page: event.target.text
        }, this.updateListProduct);
        window.scrollTo(0, 0);
    }
    handleCategoryChange = (name) => {
        if (typeof name !== 'undefined') {
            this.setState({
                filter: {
                    ...this.state.filter,
                    category: name
                },
                page: 1
            }, this.updateListProduct);
        }
    }
    handleSortChange = (type) => {
        if (type === 1) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'createdDate',
                type: 1,
            }
        }, this.updateListProduct);
        if (type === 2) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'rating',
                type: 1,
            }
        }, this.updateListProduct);
        if (type === 3) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'price',
                type: 0,
            }
        }, this.updateListProduct);
        if (type === 4) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'price',
                type: 1,
            }
        }, this.updateListProduct);
        if (type === 5) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'id',
                type: 1,
            }
        }, this.updateListProduct);
        if (type === 6) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'id',
                type: 0,
            }
        }, this.updateListProduct);
        if (type === 7) this.setState({
            filter: {
                ...this.state.filter,
                sort: 'category_id',
                type: 1,
            }
        }, this.updateListProduct);
    }
    handleChangeStatus = (e) => {
        let index = e.target.id;
        let payload = this.state.listProduct[index];
        if (payload.status === "INACTIVE")
            payload.status = "ACTIVE";
        else
            payload.status = "INACTIVE";
        put(`/product/${payload.id}`,payload)
            .then((response) => {
                let list = this.state.listProduct;
                list[index] = response.data;
                this.setState({ listProduct: list });
            })
            .catch((error) => {
                console.log(error);
                alert("Can not enable product")
            })

    }
    render() {
        //setting pagination
        let active = this.state.page;
        let items = [];
        for (let number = 1; number <= this.state.totalPage; number++) {
            items.push(
                <Pagination.Item onClick={(event) => { this.handlePageChange(event) }} key={number} active={number === active}>
                    {number}
                </Pagination.Item>,
            );
        }
        let startItem = (this.state.page - 1) * this.state.limit + 1;
        let endItem = startItem + this.state.listProduct.length - 1;

        let rows;
        rows = this.state.listProduct.map((item, index) => {
            const link = `/product/${item.id}`
            let id = item.id;
            let url = item.listImage[0].url || "";
            let name = item.name;
            let price = checkDiscount(item.price, item.discount, item.deadline)
            let category_id = item.category_id;
            //cover category_id to category name
            let category = this.state.listCategory.filter((category) => {
                return category.id == category_id;
            })
            if (category.length === 0) category = [{ name: "" }]
            if (item.status === "INACTIVE") {
                return <tr className="product_row_disable">
                    <td className="opacity"><span>{id}</span></td>
                    <td className="opacity"><img src={url}></img></td>
                    <td className="opacity"><span>{name}</span></td>
                    <td className="opacity"><span>{formatCurrency(price)}</span></td>
                    <td className="opacity"><span>{category[0].name}</span></td>
                    <td>
                        <Link to = {link} style={{ textDecoration: "none" }} >Update</Link>
                        <span className="enable" id={index} onClick={(e) => this.handleChangeStatus(e)}>Enable</span>
                    </td>
                </tr>
            }
            else
                return <tr className="product_row">
                    <td><span>{id}</span></td>
                    <td><img src={url}></img></td>
                    <td><span>{name}</span></td>
                    <td><span>{formatCurrency(price)}</span></td>
                    <td><span>{category[0].name}</span></td>
                    <td>
                        <Link to = {link} style={{ textDecoration: "none" }} >Update</Link>
                        <span className="disable" id = {index} onClick={(e)=>this.handleChangeStatus(e)} >Disable</span>
                    </td>
                </tr>

        })
        return (
            <div className="home" >
                <Banner name="Product" />
                <div className="shop_content">
                    <Container>
                        <Row>
                            <Col>
                                <RowToolBar totalItem={this.state.totalItem} startItem={startItem} endItem={endItem} action={this.handleSortChange} />
                                {/* list product */}
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Product</th>
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th><Link to = '/addproduct'style={{ textDecoration: "none" }}>Add New</Link></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {rows} */}
                                        {rows}
                                    </tbody>
                                </Table>
                                <Pagination>{items}</Pagination>

                            </Col>
                        </Row>
                    </Container>

                </div>
            </div>
        )
    }
}
