import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import UserNav from '../nav/UserNav';

const UserRoute = ({ children }) => {

    const router = useRouter();
    const [ok, setOk] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const { data } = await axios.get('api/current-user');
            if (data.ok) setOk(true);
        } catch (e) {
            setOk(false);
            router.push('login');
        }
    };

    return (
        <> {!ok? <SyncOutlined spin className="d-flex justify-content-center display-1 text-primary p-5" />: (
           <div className="container-fluid">
               <div className="row">
                <div className="col-md-2">
                    <UserNav />
                </div>
                <div className="col-md-10">
                    {children}
                </div>
               </div>
           </div>
        )}
        </>
    );
};

export default UserRoute;