
import { addCart, subCart } from './actions/cart';

export const checkDiscount = (price,discount,date) =>{
    var myDate = new Date(date);
    var now = new Date;
    if(myDate > now) {
        return price*((100-discount)/100);
    }
    else return price;
}

export const formatCurrency = (price) =>{
    return price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}

export const AddShopCart = (product,quantity,dispatch) => {
    let listProduct = JSON.parse(localStorage.getItem('shopcart')) || [];
        let flat = true;
        listProduct.map((item) => {
            if (item.product.id === product.id) {
                flat = false;
                item.quantity += parseInt(quantity);
            }
        })
        if (flat) {
            listProduct.push({
                quantity: parseInt(quantity),
                product: product,
                checked : true
            });
            const action = addCart();
            dispatch(action);
        }
        localStorage.setItem('shopcart', JSON.stringify(listProduct));
}

export const SubShopCart = (id,dispatch) => {
    let listProduct = JSON.parse(localStorage.getItem('shopcart')) || [];
    let newList = listProduct.filter((item)=>{
        return item.product.id != id;
    })
    localStorage.setItem('shopcart', JSON.stringify(newList));
    const action = subCart();
    dispatch(action);
    
}

export const CheckItemCart = (number,checked) => {
    let listProduct = JSON.parse(localStorage.getItem('shopcart')) || [];
    listProduct.map((item,index)=>{
        if(index==number) item.checked = checked;
    })
    localStorage.setItem('shopcart', JSON.stringify(listProduct));
}

export const ChangeQuantity = (id,quantity) => {
    let listProduct = JSON.parse(localStorage.getItem('shopcart')) || [];
    listProduct.map((item,index)=>{
        if(index==id) item.quantity = quantity;
    })
    localStorage.setItem('shopcart', JSON.stringify(listProduct));
}

export const DisableAll = () => {
    let listProduct = JSON.parse(localStorage.getItem('shopcart')) || [];
    listProduct.map((item,index)=>{
        item.checked = false;
    })
    localStorage.setItem('shopcart', JSON.stringify(listProduct));
}