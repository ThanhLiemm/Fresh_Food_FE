import React, { useState, useEffect,useRef } from 'react'
import { Col, Container, Row, Form } from 'react-bootstrap'
import Banner from '../../Shop/banner'
import { useHistory, withRouter } from 'react-router-dom'
import '../NewProduct/product_detail.scss'
import { FaTrash } from 'react-icons/fa'
import { del, get, post, put, uploadImage, UploadImageCP } from '../../../httpHelper'
import { formatCurrency, checkDiscount } from '../../../algorithm'

function AProductDetail(props) {
    const [index, setindex] = useState(0);
    const [listUrl_File, setlistUrl_File] = useState([]);
    const [product, setproduct] = useState({ name: "", description: "", deadline: "", unitType: "" })
    const [listCategories, setlistCategories] = useState([{ id: 0, name: "" }])
    const [price, setprice] = useState(0);
    const [discount, setdiscount] = useState(0)
    const [payload, setpayload] = useState({ listImage: "" })
    const [quantity, setquantity] = useState(0)
    const getProduct = () => {
        get(`/admin/product/${props.match.params.productid}`)
            .then((response) => {
                console.log(response.data)
                setproduct(response.data)
                let list = [];
                response.data.listImage.map((item) => {
                    list.push({ url: item.url, file: "" })
                })
                setlistUrl_File(list);
                setprice(response.data.price);
                setdiscount(response.data.discount);
                setquantity(response.data.quantity)
            }
            )
            .catch((e) => {
                console.log(e.response);
                history.push('/404')
            });
    }
    useEffect(() => {
        console.log(listUrl_File);
    }, [listUrl_File])
    const handleChangeImage = (e) => {
        console.log(e.target.id);
        setindex(e.target.id);
    }
    let history = useHistory();
    const [listImage, setlistImage] = useState([{ abd: "fadaf" }])
    useEffect(() => {
        get('/category')
            .then((response) => setlistCategories(response.data))
            .catch((error) => {
                console.log(error.response)
            })
        getProduct();

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
            if (index < product.listImage.length) { //delete image

                console.log(product);
                del(`/image/${product.listImage[index].id}`)
                    .then((response) => {
                        console.log(response);
                        let newProduct = product;
                        newProduct.listImage = product.listImage.filter((image, id) => {
                            return index != id;
                        })
                        setproduct(newProduct);
                    })
                    .catch((error) => console.log("alfaf;afj;" + error.response))
            }
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
        let listTemp = [];

        listUrl_File.map((object, index) => {
            let id = product.listImage[index] || "";
            if (object.file != "") // image Internal url
            {
                uploadImage('/uploadFile', object.file)
                    .then((response) => {
                        console.log(response);

                        listTemp.push({ id: id, url: response.data, productId: product.id });
                    })
                    .catch((error) => {
                        console.log(error.response);
                    })
            }
            else { // this image was updated
                listTemp.push(product.listImage[index]);
                console.log(listTemp);

            }
            setTimeout(setlistImage(listTemp), 3000)

        })
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
        console.log(e.target.category_id.name);
        console.log(name);
        console.log(category_id);
        console.log(price);
        console.log(discount);
        console.log(description);
        console.log(deadline);
        console.log(quantity);
        console.log(unitType);
        upLoadFile();
        const payload = {
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
        setpayload(payload);
        // setTimeout(() => {
        //     // payload.listImage = listImage;
        //     // post('/product',payload)
        //     // .then((response)=>console.log(response.data))
        //     // .catch((error)=>console.log(error.response))
        //     console.log(listImage);
        // }, 5000);



    }
    const isInitialMount = useRef(true);
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
         } else {
            console.log("Truoc khi alert)"+listImage)
            let pl = payload;
            pl.listImage = listImage;
            setTimeout(() => {
                console.log("Truoc khi alert)"+listImage)
                put(`/product/${product.id}`, pl)
                    .then((response) => {
                        console.log(response)
                        alert("Update success!")
                    })
                    .catch((error) => {
                        console.log(error)
                        alert(error.response.data.message)
                    })
            }, 4000);
         }
            


        // console.log(listImage+"tre 3000s");
        // setTimeout(() => {
        //     console.log(listImage);
        // }, 5000);
    }, [listImage])

    let listImageJsx = listUrl_File.map((object, index) => {
        return <img src={object.url} alt="" id={index} onClick={(e) => handleChangeImage(e)}></img>
    })


    let optionJsx = listCategories.map((category) => {
        if(category.id===product.category_id)
            return <option value={category.id} selected>{category.name}</option>
            return <option value={category.id}>{category.name}</option>
    })
    let mainImage = listUrl_File[index] || [{ url: "" }]
    let tommorow = (new Date().setDate((new Date().getDate() + 1)));
    let price_discount = formatCurrency(checkDiscount(price, discount, tommorow));
    let deadline = product.deadline || ""
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
                                            <input type="file" accept="image/gif, image/jpeg, image/png" onChange={(e) => handleInsert(e)} id = "upimage" ></input>
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
                                    <Form.Control type="text" placeholder="enter your product name" name="name" required="required" defaultValue={product.name} />
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
                                    <Form.Control type="number" placeholder="price (VND)" name="price" required="required" min="500" onChange={(e) => setprice(e.target.value)} value={price} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Discount</Form.Label>
                                    <Form.Control className="discount" type="number" value={discount} name="discount" onChange={(e) => setdiscount(e.target.value)} min="0" />
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
                                    defaultValue={product.description}
                                />
                            </Form.Group>
                            <Row>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Deadline Discount</Form.Label>
                                    <Form.Control type="date" placeholder="Enter your price" id="deadline" name="deadline" defaultValue={deadline.slice(0, 10)} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control className="discount" type="number" value={quantity} name="quantity" onChange={(e) => setquantity(e.target.value)} min="1" />
                                </Form.Group>   

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Unit Type</Form.Label>
                                    <Form.Control className="end_price" type="text" placeholder="kg, pound, ..." name="unitType" required="required" defaultValue={product.unitType} />
                                </Form.Group>
                                <button type="submit">Update</button>
                            </Row>

                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    )
}
export default withRouter(AProductDetail);
