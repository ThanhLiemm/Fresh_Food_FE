import React, { useState,useEffect } from 'react'
import './cart.scss'
import Banner from '../Shop/banner'
import { Table, Container } from 'react-bootstrap'
import { ChangeQuantity, checkDiscount, CheckItemCart, formatCurrency, SubShopCart } from '../../algorithm';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { del, get, put } from '../../httpHelper';
import { subCart } from '../../actions/cart';

export default function Index(props) {
    const [listProduct, setListProduct] = useState([]);
    let rows;
    let total = 0;
    const dispatch = useDispatch();
    const history = useHistory();
    useEffect(() => {
        window.scrollTo(0, 0);
       fetchShopCart();
    }, [])
    const fetchShopCart = ()=> {
        get('/shopcart')
        .then((res)=> {
            console.log(res.data);
            setListProduct(res.data);
        })
        .catch((err)=> {
            console.log(err.response);
        })
    }
    const putShopCart = (index,number) => {
        let item = listProduct[index];
        item.quantity = number;
        put('/shopcart',item)
        .then((res)=>{
            setListProduct(res.data);
        })
        .catch((err)=> console.log(err.response));
    }
    const putChecked = (index,checked) => {
        let item = listProduct[index];
        item.checked = checked;
        put('/shopcart',item)
        .then((res)=>{
            setListProduct(res.data);
        })
        .catch((err)=>console.log(err.response));
    }
    const deleteItem = (id) => {
        del(`/shopcart/?productId=${id}`)
        .then((res)=>{
            setListProduct(res.data);
            const action = subCart(1);
            dispatch(action);
            localStorage.setItem("count", res.data.length)
        })
        .catch((err)=>console.log(err.response));
    }
    //handle even here
    const handleDelete = (e) => {
        //bo product co id = e.target.id ra khoi localstorage, giam number 1 dv, cap nhat lai listProduct
        // SubShopCart(e.target.id, dispatch);
        // setListProduct(JSON.parse(localStorage.getItem('shopcart')) || []);
        deleteItem(e.target.id)
        
    }

    const handleCheckBox = (e) => {
        putChecked(e.target.id, e.target.checked);      
    }

    const handleNumberChange = (e) => {
        let number = e.target.value;
        let index = e.target.id;
        if(number =="") return ;
        get(`/product/${listProduct[index].product.id}`)
            .then((response) => {
                console.log(response.data.quantity)
                if (number <= 0 ) {
                    console.log(number);
                    alert("Your quantity should not be less than 1 !");
                    e.target.value = 1;
                    return;
                }
                else if(number > response.data.quantity) {
                    alert(`Your quantity should not be less than ${response.data.quantity}` )
                    e.target.value = response.data.quantity;
                    return;
                }
                else {
                    putShopCart(index,number);
                }
            })
            .catch((error) => console.log(error))

    }
    const handleCheckout = () => {
        console.log("abdef");
        history.push('/checkout')
    }

    if (listProduct.length === 0) {
        rows = <h2>Shop Cart Emty</h2>;
    }
    else {

        rows = listProduct.map((item, index) => {
            let discount = checkDiscount(item.product.price, item.product.discount, item.product.deadline);
            let discountPrice = formatCurrency((discount || ''));
            let originalPrice = formatCurrency((item.product.price || ''));

            let priceJsx; //discount of not discount
            if (discount === item.product.price)
                priceJsx = <p className="price">{originalPrice}</p>;
            else priceJsx = <p className="price"><span>{originalPrice}</span> {discountPrice}</p>

            let checkbox; //check box display
            if (item.checked)
                checkbox = <td className="checkbox"><input type="checkbox" id={index} onChange={(e) => handleCheckBox(e)} defaultChecked></input></td>
            else
                checkbox = <td className="checkbox"><input type="checkbox" id={index} onChange={(e) => handleCheckBox(e)}></input></td>
            return <tr>
                <td className="delete"><span id={item.product.id} onClick={(e) => handleDelete(e)}>X</span></td>
                <td className="product"><img src={item.product.listImage[0].url}></img></td>
                <td className="price">
                    <p>
                        {priceJsx}
                    </p>
                </td>
                <td className="quantity"><input id={index} min="1" max={item.product.quantity} type="number" defaultValue={item.quantity} onChange={(e) => handleNumberChange(e)}></input></td>
                <td className="total">{formatCurrency((discount * item.quantity))}</td>
                {checkbox}
            </tr>

        })
        //count toal price
        listProduct.map((item) => {
            if (item.checked === true) total += (item.quantity * checkDiscount(item.product.price, item.product.discount, item.product.deadline))
        })

    }
    const totalPrice = formatCurrency(total);
    let button;
    if (total !== 0) button = <button className="checkout" onClick={handleCheckout}>Check Out</button>
    else button = <button className="checkout" disabled style={{ background: "#333" }}>Check Out</button>

    return (
        <div>
            <Banner name="Shop Cart" />
            <div className="table">
                <Container>
                    <Table>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </Table>
                    <div className="end">
                        <p className="total_price">Total: <span>{totalPrice}</span></p>
                        {button}
                    </div>
                </Container>
            </div>
        </div>
    )
}
