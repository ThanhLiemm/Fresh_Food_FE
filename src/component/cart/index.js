import React, { useState } from 'react'
import './cart.scss'
import Banner from '../Shop/banner'
import { Table, Container} from 'react-bootstrap'
import { ChangeQuantity, checkDiscount, CheckItemCart, formatCurrency, SubShopCart } from '../../algorithm';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

export default function Index(props) {
    const [listProduct, setListProduct] = useState(JSON.parse(localStorage.getItem('shopcart')) || []);
    let rows;
    let total=0;
    const dispatch = useDispatch();
    const history = useHistory();
     //handle even here
    const handleDelete = (e)=> {
        //bo product co id = e.target.id ra khoi localstorage, giam number 1 dv, cap nhat lai listProduct
        SubShopCart(e.target.id,dispatch);
        setListProduct(JSON.parse(localStorage.getItem('shopcart')) || []);
    }

    const handleCheckBox = (e) => {
        CheckItemCart(e.target.id,e.target.checked);
        setListProduct(JSON.parse(localStorage.getItem('shopcart')) || []);
    }

    const handleNumberChange = (e) =>{
        let number = e.target.value ;
        let index = e.target.id;
        if(number<=0 && number>listProduct[index].quantity) {
            alert("number is out of range !");
            return ;
        }
        else {
            ChangeQuantity(index,number);
            setListProduct(JSON.parse(localStorage.getItem('shopcart')) || []);
        }
    }
    const handleCheckout = () => {
        history.push('/checkout')
    }

    if (listProduct.length === 0) {
        rows= <h2>Shop Cart Emty</h2>;  
    }
    else {
        
        rows = listProduct.map((item,index) => {
            let discount = checkDiscount(item.product.price, item.product.discount, item.product.deadline);
            let discountPrice = formatCurrency((discount || ''));
            let originalPrice = formatCurrency((item.product.price || ''));
        
            let priceJsx; //discount of not discount
            if (discount === item.product.price)
                priceJsx = <p className="price">{originalPrice}</p>;
            else priceJsx = <p className="price"><span>{originalPrice}</span> {discountPrice}</p>

            let checkbox; //check box display
            if( item.checked ===true) 
                checkbox = <td className="checkbox"><input type="checkbox" id={index} onChange={(e)=>handleCheckBox(e)} defaultChecked></input></td>
            else 
                checkbox = <td className="checkbox"><input type="checkbox" id={index} onChange={(e)=>handleCheckBox(e)}></input></td>
             return <tr>
                <td className="delete"><span id = {item.product.id} onClick={(e)=>handleDelete(e)}>X</span></td>
                <td className="product"><img src= {item.product.listImage[0].url}></img></td>
                <td className="price">
                    <p>
                        {priceJsx}
                    </p>
                </td>
                <td className="quantity"><input id ={index} min = "1" max ={item.product.quantity} type="number" defaultValue={item.quantity} onChange={(e)=>handleNumberChange(e)}></input></td>
                <td className="total">{formatCurrency((discount * item.quantity))}</td>
                {checkbox}
            </tr>
            
        })
        //count toal price
        listProduct.map((item)=>{
            if(item.checked===true) total+= (item.quantity*checkDiscount(item.product.price,item.product.discount,item.product.deadline))
        })
        
    }
    const totalPrice = formatCurrency(total);
    let button ;
    if(total !==0) button = <button className="checkout" onClick={handleCheckout}>Check Out</button>
    else button = <button className="checkout" disabled style = {{background:"#333"}}>Check Out</button>

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
