import Link from 'next/link';
import { useState, useEffect } from 'react';

const InstructorNav = () => {

    useEffect(() => {
        process.browser && setCurrent(window.location.pathname);
    }, [process.browser && window.location.pathname]);

    const [current, setCurrent] = useState('');
    return (
        <div className="nav flex-column nav-pills">
            <Link key="/instructor" href="/instructor">
                <a className={`nav-link ${current === '/instructor' && 'active'}`}>Dashboard</a>
            </Link>
            <Link key="/instructor/course/create" href="/instructor/course/create">
                <a className={`nav-link ${current === '/instructor/course/create' && 'active'}`}>Create Course</a>
            </Link>
        </div>);
};


export default InstructorNav;