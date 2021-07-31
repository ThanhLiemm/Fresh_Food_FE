import logo from './logo.svg';
import './App.scss';
import Header from './component/Navbar'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './component/Home';
import Shop from './component/Shop';
import Contact from './component/Contact';
import About from './component/About';
import Login from './component/Login';
import Signup from './component/Signup';
import Footer from './component/Footer';
import ProductDetail from './component/ProductDetail'
import PageNotFound from './component/PageNotFound'
import Cart from './component/cart'
import Checkout from './component/Checkout'
import Product from './component/admin/Product'
import NewProduct from './component/admin/NewProduct'
import UpdateProduct from './component/admin/UpdateProduct'
import Category from './component/admin/Category'
import Payment from './component/admin/Payment'
import ListOrder from './component/ListOrder'
import Profile from './component/Profile'

function App() {
  const shopCart = JSON.parse(localStorage.getItem('shopcart')) || [];
  return (
    <Router>
      <Header></Header>
      <Switch>
        <Route exact path="/" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <PageNotFound />;
          else return <Home />;
        }} />

        <Route exact path="/shop" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <PageNotFound />;
          else return <Shop />;
        }} />

        <Route exact path="/about" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <PageNotFound />;
          else return <About />;
        }} />

        <Route exact path="/contact" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <PageNotFound />;
          else return <Contact />;
        }} />

        <Route exact path="/login" render={() => {
          if (!localStorage.getItem('username')) return <Login />;
          else return <PageNotFound />;
        }} />

        <Route exact path="/signup" render={() => {
          if (!localStorage.getItem('username')) return <Signup />;
          else return <PageNotFound />;
        }} />

        <Route exact path="/product/:productid" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <UpdateProduct />;
          else return <ProductDetail />;
        }} />
        <Route exact path="/addproduct" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <NewProduct />;
          else return <PageNotFound />;
        }} />

        <Route exact path="/cart" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <PageNotFound />;
          else return <Cart />;
        }} />


        <Route exact path="/checkout" render={() => {
          if (localStorage.getItem('role') === "ROLE_USER" && localStorage.getItem('username')) {
            if (shopCart.length !== 0)
              return <Checkout />;
            else return <Cart />
          }
          else return <Login />;
        }} />

        <Route exact path="/product/" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <Product />;
          else return <PageNotFound />;
        }} />
        <Route exact path="/category/" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <Category />;
          else return <PageNotFound />;
        }} />
        <Route exact path="/payment/" render={() => {
          if (localStorage.role === "ROLE_ADMIN") return <Payment />;
          else return <PageNotFound />;
        }} />

        <Route exact path="/listorder/" render={() => {
          if (localStorage.role === "ROLE_ADMIN" || localStorage.role === "ROLE_USER") return <ListOrder />;
          else return <PageNotFound />;
        }} />

        <Route exact path="/profile/" render={() => {
          if (localStorage.role === "ROLE_USER") return <Profile/>;
          else return <PageNotFound />;
        }} />


        <Route path="**" component={PageNotFound} />
        {/* miss product, category, payment */}

      </Switch>
      <Footer></Footer>
    </Router>
  );
}

export default App;
