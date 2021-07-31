import React, { useState, useEffect,useRef } from 'react'
import { Col, Container, Row, Form } from 'react-bootstrap'
import Banner from '../../Shop/banner'
import { useHistory, withRouter } from 'react-router-dom'
import './product_detail.scss'
import { FaTrash } from 'react-icons/fa'
import { get, post, uploadImage } from '../../../httpHelper'
import { formatCurrency, checkDiscount } from '../../../algorithm'

function AProductDetail() {
    const [index, setindex] = useState(0);
    const [listUrl_File, setlistUrl_File] = useState([]);
    const [listCategories, setlistCategories] = useState([{ id: 0, name: "" }])
    const [price, setprice] = useState(0);
    const [discount, setdiscount] = useState(0)
    const [payload, setpayload] = useState()
    let history = useHistory();
    const handleChangeImage = (e) => {
        console.log(e.target.id);
        setindex(e.target.id);
    }
    const [listImage, setlistImage] = useState([])
    useEffect(() => {
        get('/category')
            .then((response) => setlistCategories(response.data))
            .catch((error) => {
                console.log(error.response)
            })
    }, [])

    const handleRemove = (e) => {
        //if(!e.target.files[0]) return ;
        if (listUrl_File.length === 0) {
            return;
        }
        else {
            let newList = listUrl_File.filter((object, id) => {
                return id != index;
            });
            setlistUrl_File(newList);
            index > 0 && setindex(index - 1);
            if(index==0) document.getElementById('upimage').value  = ''
        }
    }
    const handleInsert = (e) => {
        if(!e.target.files[0]) return ;
        const ext = e.target.files[0].type;
        if (ext !== "image/gif" && ext !== "image/jpeg" && ext !== "image/png") {
            document.getElementById('upimage').value  = ''
            return ;
        };
        let newList;
        if (listUrl_File.length === 5) {
            newList = listUrl_File.filter(() => {
                return true;
            });
            newList[4].url = e.target.files[0];
            newList[4].file = URL.createObjectURL(e.target.files[0]);
            setindex(listUrl_File.length - 1)
        }
        else {
            newList = listUrl_File.filter(() => {
                return true;
            });

            let url = URL.createObjectURL(e.target.files[0]);
            let file = e.target.files[0];
            newList.push({ url, file });
            setindex(listUrl_File.length)
        }
        setlistUrl_File(newList);

    }
    const upLoadFile = () => {
        //swap image 
        let list = listUrl_File.filter(() => { return true; })
        if (index !== 0) [list[0], list[index]] = [list[index], list[0]];
        //upload and recive
        let listAwsUrl = listImage.filter(() => { return true; });

        list.map((object) => {
            uploadImage('/uploadFile', object.file)
                .then((response) => {
                    console.log(response);
                    listAwsUrl.push({ url: response.data });
                    setlistImage(listAwsUrl);
                })
                .catch((error) => {
                    console.log(error.response);
                })
        })
        setTimeout(() => {
            return listAwsUrl;
        }, 500);


    }

    const handleFormSubmit = (e) => {
        e.preventDefault();
        //filter 
        if (listUrl_File.length < 1) {
            alert("Upload should not be less than 2 picture!")
            return
        }
        let name = e.target.name.value;
        let category_id = e.target.category_id.value;
        let price = e.target.price.value;
        let discount = e.target.discount.value;
        let description = e.target.description.value;
        let deadline
        if(e.target.deadline.value) deadline = e.target.deadline.value + " 23:59:59";
        else deadline ="";
        let quantity = e.target.quantity.value;
        let unitType = e.target.unitType.value;
        //chua chuan hoa
        if (name === "" || category_id === "" || price === "" || price < 500 || discount < 0 || discount === ""
            || description === "" || quantity < 1 || quantity === "" || unitType === "") {
            alert("invalid input");
            return;
        }
        console.log(name);
        console.log(category_id);
        console.log(price);
        console.log(discount);
        console.log(description);
        console.log(deadline);
        console.log(quantity);
        console.log(unitType);
        upLoadFile();
        const pl = {
            name: name,
            price: price,
            category_id: category_id,
            discount: discount,
            description: description,
            deadline: deadline,
            quantity: quantity,
            unitType: unitType,
            status: "ACTIVE",
            rating: 100
        }
        setpayload(pl)




    }
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            console.log("Truoc khi alert)" + listImage)
            let pl = payload;
            pl.listImage = listImage;
            setTimeout(() => {
                post('/product', payload)
                    .then((response) => {
                        console.log(response.data);
                        alert("Insert Success!")
                        history.push(`/product/${response.data.id}`)

                    })
                    .catch((error) => {
                        console.log(error.response);
                        alert(error.response.data.message);
                    })
            }, 5000);
        }
    }
        , [listImage])

    let listImageJsx = listUrl_File.map((object, index) => {
        return <img src={object.url} alt="" id={index} onClick={(e) => handleChangeImage(e)}></img>
    })
    let optionJsx = listCategories.map((category) => {
        return <option value={category.id}>{category.name}</option>
    })
    let mainImage = listUrl_File[index] || [{ url: "" }]
    let tommorow = (new Date().setDate((new Date().getDate() + 1)));
    let price_discount = formatCurrency(checkDiscount(price, discount, tommorow));
    return (
        <div className="admin_product">
            <Banner name="Product Detail" />
            <Container>
                <Form onSubmit={(e) => handleFormSubmit(e)}>
                    <Row>
                        <Col className="left">
                            <div className="image_area">
                                <div className="main_image">
                                    <img src={mainImage.url}></img>
                                </div>
                                <div className="add_image">
                                    <div className="list_image">
                                        {listImageJsx}
                                        <div>
                                            <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => handleInsert(e)} id="upimage" ></input>
                                            <FaTrash onClick={() => handleRemove()} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="right">
                            <Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="enter your product name" name="name" required="required" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Category</Form.Label>
                                    <select className="custom_select" name="category_id">
                                        {optionJsx}
                                    </select>
                                </Form.Group>
                            </Row>
                            <Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Price</Form.Label>
                                    <Form.Control type="number" placeholder="price (VND)" name="price" required="required" min="500" onChange={(e) => setprice(e.target.value)} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Discount</Form.Label>
                                    <Form.Control className="discount" type="number" defaultValue="0" name="discount" onChange={(e) => setdiscount(e.target.value)} min="0" />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>End Price</Form.Label>
                                    <Form.Control className="end_price" type="text" placeholder="" disabled value={price_discount} />
                                </Form.Group>
                            </Row>
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    placeholder="Leave description here"
                                    style={{ height: '200px' }}
                                    required="required"
                                    name="description"
                                />
                            </Form.Group>
                            <Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Deadline Discount</Form.Label>
                                    <Form.Control type="date" placeholder="Enter your price" id="deadline"  name="deadline" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control className="discount" type="number" defaultValue="100" min="1" name="quantity" required="required" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Unit Type</Form.Label>
                                    <Form.Control className="end_price" type="text" placeholder="kg, pound, ..." name="unitType" required="required" />
                                </Form.Group>
                                <button type="submit">Insert</button>
                            </Row>

                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}
export default AProductDetail;
