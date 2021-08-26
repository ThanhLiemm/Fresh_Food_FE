
import { addCart, subCart } from './actions/cart';
import { get, post } from './httpHelper';

export const checkDiscount = (price,discount,date) =>{
    var myDate = new Date(date);
    var now = new Date;
    if(myDate > now) {
        return price*((100-discount)/100);
    }
    else return price;
}
export const checkDiscountPast = (price,discount,deadline,date)=>{
    var myDate = new Date(date);
    var deadline = new Date(deadline);
    if(myDate < deadline) {
        return price*((100-discount)/100);
    }
    else return price;
}

export const formatCurrency = (price) =>{
    let  newPrice = price || "";
    return newPrice.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
}

export const AddShopCart = (product,quantity,dispatch) => {
    console.log("abdef")
            const formData = {
                quantity:quantity,
                checked:true,
                product:product
            }
            post('/shopcart',formData)
            .then((res)=>{
                console.log(res.data);
                get('/shopcart/count')
                .then(res=>{
                    const action = addCart(parseInt(res.data.Count));
                    dispatch(action);
                    localStorage.setItem("count",parseInt(res.data.Count));
                })
                .catch(error=>console.log(error.response))
            })
            .catch(err=>console.log(err.response));            
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
export const formatDate = (dateTime)=> {
    let newDate = dateTime || "2021-08-18 01:05:19";
    var date =  newDate.slice(0,10);
    let time = newDate.slice(10,19);
    let formatDate = date.split("-").reverse().join("/");
    return formatDate + time;
}