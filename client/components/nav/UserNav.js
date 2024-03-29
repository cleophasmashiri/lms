import Link from 'next/link';
import { useEffect, useState } from 'react';

const UserNav = () => {
    const [current, setCurrent] = useState('');
    useEffect(() => {
        if (process.browser && window.location.pathname) setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    return (
    <div className="nav flex-column nav-pills">
        <Link href="/user">
            <a className={`nav-link ${current==='/user' && 'active'}`}>Dashboard</a>
        </Link>
    </div>);
};


export default UserNav;