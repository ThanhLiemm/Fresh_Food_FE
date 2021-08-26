import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { Logout_Action } from '../../actions/login_logout';
import { subCart } from '../../actions/cart';

const Nav = styled.div`
  background: #333;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position:fixed;
  top:0;
  width:100%;
  z-index:11;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color:#ffffffbf;
`;

const SidebarNav = styled.nav`
  background: #333;
  width: 240px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 12;
`;

const LeftArea = styled.div`
    margin-right:50px;
    height:100%;
    display:flex;
    justify-content:center;
    align-items:center;
`
const LeftLink = styled(Link)`
    display:inline-block;
    color:#ffffffbf;
    font-size:20px;
    text-decoration:none;
    &:hover {
        color: #ffffffbf;
      }
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false);
    const user = useSelector(state => state.user);
    const numberProduct = useSelector(state => state.cart.number);
    let history = useHistory();
    let dispatch = useDispatch();
    const showSidebar = () => setSidebar(!sidebar);
    const handleLogout = () => {
        localStorage.removeItem("role");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("count");
        const action = Logout_Action();
        dispatch(action);
        const action2 = subCart(numberProduct);
        dispatch(action2);
        history.push('/login');
    }
    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav>
                    <NavIcon to='#'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </NavIcon>
                    <LeftArea>
                        <LeftLink>
                            {user.username}
                        </LeftLink>
                        <LeftLink>
                            <AiIcons.AiOutlineLogout 
                            onClick={handleLogout}
                            style={{color:"#ffffff",fontSize:"25px",marginLeft:"15px"}}/>
                        </LeftLink>
                    </LeftArea>
                </Nav>
                <SidebarNav sidebar={sidebar}>
                    <SidebarWrap>
                        <NavIcon to='#'>
                            <AiIcons.AiOutlineClose onClick={showSidebar}
                            />
                        </NavIcon>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} />;
                        })}
                    </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </>
    );
};

export default Sidebar;
