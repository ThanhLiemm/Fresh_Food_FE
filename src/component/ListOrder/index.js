import React, { useState, useEffect, useRef } from 'react'
import Banner from '../Shop/banner';
import { Container, Table } from 'react-bootstrap';
import { get, put } from '../../httpHelper';
import { formatCurrency } from '../../algorithm';
import { statement } from '@babel/template';

export default function Index() {
    const [listOrder, setlistOrder] = useState([{ orderDetailDTOS: [{ id: 0 }] }]);
    const [listProduct, setlistProduct] = useState([{ name: "" }])

    const getListOrder= () => {
        get('/order')
            .then((response) => {
                console.log(response.data);
                setlistOrder(response.data)

            })
            .catch((error) => alert(error.response.data.message))
    }
    useEffect(() => {
        window.scrollTo(0, 0);
        getListOrder();     
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
    const handleSelected = (e)=> {
        let index = e.target.id;
        let value = e.target.value;
        if(!window.confirm(`Are you sure to ${value} order?`)) return ;
        //put
        let payload = listOrder[index];
        payload.status = value;
        put(`/order/${payload.id}`,payload)
        .then((response)=>{
            console.log(response.data);
            getListOrder();
        })
        .catch((error)=>{
            console.log(error.response)
            alert(error.response.data.message)
        })
    }
    // check selected
    const checkSelected = (status,index) => {
        if (status === "DELIVERING") {
            return <select name="status" id = {index} onChange={(e)=>handleSelected(e)} >
                <option value="DELIVERING" selected = "selected">DELIVERING</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCEL">CANCEL</option>
            </select>
        }
        if(status ==="DELIVERED")
        {
            return <select name="status" style={{background:"#40a944",color:"white"}}  id = {index} disabled>
                <option value="DELIVERING">DELIVERING</option>
                <option value="DELIVERED" selected = "selected">DELIVERED</option>
                <option value="CANCEL">CANCEL</option>
            </select>
        }
        if(status === "CANCEL")
        {
            return <select name="status" style={{background:"red",color:"white"}}  id = {index} disabled>
                <option value="DELIVERING" selected = "selected">DELIVERING</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCEL" selected = "selected">CANCEL</option>
            </select>
        }
    }
    //ham cover id sang name ok chua
    const idToName = (id) => {
        const List = listProduct.filter((product) => {
            return product.id == id
        })
        if (List.length === 0) return "";
        else return List[0].name;
    }
    let JsxContent = listOrder.map((order, index) => {
        let price = order.total || 0;
        //let detail = order.orderDetailDTOS || []
        let item = order.orderDetailDTOS.map((detail) => {
            return <p style={{ color: "black" }}>
                <span >{idToName(detail.productId)}</span>
                <span style={{ marginLeft: "5px" }}>X {detail.quantity}</span>
            </p>

        })
        // check user or admin 
        let statuscell;
        if (localStorage.role === "ROLE_ADMIN") {
            statuscell =
                <td>
                    {checkSelected(order.status,index)}
                </td>
        }
        else {
            statuscell = <td>{order.status}</td>;
        }
        return <tr>
            <td>{index + 1}</td>
            <td>{item}</td>
            <td>{formatCurrency(price)}</td>
            <td>{order.createdDate}</td>
            <td>{order.createdBy}</td>
            {statuscell}
        </tr>
    })
    return (
        <div style = {{marginBottom:"50px"}}>
            <Banner name="List Ordered" />
            <Container>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Item Ordered</th>
                            <th>Total Price</th>
                            <th>Date</th>
                            <th>User</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign: "center" }}>
                        {JsxContent}
                    </tbody>
                </Table>
            </Container>
        </div>
    )
}
