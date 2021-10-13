import { Menu } from "antd";
import Link from 'next/link';
import { LoginOutlined, AppstoreAddOutlined, UserAddOutlined, CoffeeOutlined, CarryOutOutlined, TeamOutlined } from '@ant-design/icons';
import { useState, useEffect, useContext } from 'react';
import { Context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const { Item, ItemGroup, SubMenu } = Menu;

const Navbar = () => {
    const [current, setCurrent] = useState('');
    const router = useRouter();
    const { state, dispatch } = useContext(Context);
    const { user } = state;

    const logout = async () => {
        dispatch({
            type: 'LOGOUT'
        });
        window.localStorage.removeItem('user');
        const { data } = await axios.get(`/api/logout`);
        toast(data.message);
        router.push('/login');
    };

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
        <>
            <Menu mode="horizontal" selectedKeys={[current]} className="mb-2">
                <Item onClick={e => setCurrent(e.key)} key="/" icon={<AppstoreAddOutlined />}>
                    <Link href="/">
                        <a>Home</a>
                    </Link>
                </Item>
                {user === null && (
                    <>
                        <Item onClick={e => setCurrent(e.key)} key="/login" icon={<LoginOutlined />}>
                            <Link href="/login">
                                <a>Login</a>
                            </Link>
                        </Item>
                        <Item onClick={e => setCurrent(e.key)} key="/register" icon={<UserAddOutlined />}>
                            <Link href="/register">
                                <a>Register</a>
                            </Link>
                        </Item>
                    </>
                )}
                {user && user.role && user.role.includes('Instructor') ? (
                    <>
                        <Item onClick={e => setCurrent(e.key)} key="/instructor/course/create" icon={<CarryOutOutlined />}>
                            <Link href="/instructor/course/create">
                                <a>Create Course</a>
                            </Link>
                        </Item>
                    </>) : (
                    <>
                        <Item onClick={e => setCurrent(e.key)} key="/user/become-instructor" icon={<TeamOutlined />}>
                            <Link href="/user/become-instructor">
                                <a>Become Instructor</a>
                            </Link>
                        </Item>
                    </>
                )}
                {(user && user.role && user.role.includes('Instructor')) && (
                     <Item className="float-right" onClick={e => setCurrent(e.key)} key="/instructor" icon={<TeamOutlined />}>
                     <Link key="/instructor" href="/instructor">
                         <a>Instructor</a>
                     </Link>
                 </Item>
                )}
                {user !== null && (
                    <SubMenu key="/user-menu"
                        icon={<CoffeeOutlined />}
                        title={user && user.name}
                        className="float-right">
                        <ItemGroup>
                            <Item key="/user">
                                <Link href="/user">
                                    <a>Dashboard</a>
                                </Link>
                            </Item>
                            <Item key="/logout" onClick={logout}>
                                Logout
                            </Item>
                        </ItemGroup>
                    </SubMenu>
                )}
            </Menu>
        </>
    );
};

export default Navbar;