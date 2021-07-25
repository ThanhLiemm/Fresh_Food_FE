import React, { Component } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import './product.scss'
import { get } from '../../../httpHelper'
import Pagination from 'react-bootstrap/Pagination'
import { FaAngleDown, FaThList } from 'react-icons/fa'
import Banner from '../../Shop/banner'
import { Link } from 'react-router-dom'
import { checkDiscount } from '../../../algorithm'

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
                                <li onClick={() => (this.handleSortChange("Sort by price: high to Low", 4))}>Sort by price: high to Low</li>
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
            sort: 'id',
            type: 0,
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
        window.scrollTo(0, 0);

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
        rows = this.state.listProduct.map((item) => {
            let id = item.id;
            let url = item.listImage[0].url;
            let name = item.name;
            let price = checkDiscount(item.price,item.discount,item.deadline)
            let category_id = item.category_id;
            //cover category_id to category name
            let category = this.state.listCategory.filter((category) => {
                return category.id == category_id;
            })
            return <tr className="product_row"> 
                <td>{id}</td>         
                <td><img src={url}></img></td>
                <td>{name}</td>
                <td>{price}</td>
                <td>{category.name}</td>
                <td>{category.name}</td>
            </tr>

        })
        return (
            <div className="home" >
                <Banner name="Shop" />
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
                                            <th><Link>Add New</Link></th>
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
