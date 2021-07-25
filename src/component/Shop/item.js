import React from 'react'
import './item.scss'
import '../../scss/reset.scss'
import { FaHeart, FaShoppingCart} from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { useDispatch} from 'react-redux';
import { AddShopCart, checkDiscount, formatCurrency, formatDate } from '../../algorithm';

export default function Item(props) {

    const dispatch = useDispatch();
    let url = "/product/" + props.product.id;

    const handleAddCart = () => {
        AddShopCart(props.product,1,dispatch)
    }
    let price = checkDiscount(props.product.price,props.product.discount,props.product.deadline)
    price = formatCurrency(price);
    return (
        <div className="item">
            <div className="image">
                <Link to={url}><img src={props.product.listImage[0].url} atl="" /></Link>
            </div>
            <div className="info">
                <div className="name_price">
                    <Link to={url}><a>{props.product.name}</a></Link>
                    <span>{price}</span>
                </div>
                <div className="love_shopcart">
                    <FaHeart /> {props.product.rating}
                    <FaShoppingCart onClick={handleAddCart} />
                </div>

            </div>
        </div>
    )
}
