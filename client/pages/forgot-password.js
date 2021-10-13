import { useContext, useState, useEffect } from 'react';
import { Context } from '../context';
import axios from 'axios';
import { toast } from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';

const ForgotPassword = () => {

    const { state: { user } } = useContext(Context);
    const [email, setEmail] = useState('');
    const [emailRequestOk, setEmailRequestOk] = useState(false);
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (user != null) {
            router.push('/');
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailRequestOk) {
            await handleResetPassword();
        } else {
            await handleRequestCode(); 
        }
    };

    const handleRequestCode = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/forgot-password', { email });
            setEmailRequestOk(true);
            setLoading(false);
            toast.success('Change password submitted, check your email for code')
        } catch (error) {
            setLoading(false);
            toast.error('Error occurred');
        }
    };

    const handleResetPassword = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post('/api/reset-password', {email, code, newPassword});
            toast.success('Password changed successful');
            router.push('/');
        } catch (err) {
            toast.error('Error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Forgot Password</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input className="form-control mb-4 p-4"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email" />
                    {emailRequestOk &&
                        <>
                            <input className="form-control mb-4 p-4"
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Enter Code" />
                            <input className="form-control mb-4 p-4"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password" />
                        </>
                    }
                    <button type="submit" disabled={loading || !email} className="btn btn-primary form-control p-2">{loading ? <SyncOutlined spin /> : "Submit"}</button>
                </form>
            </div>  

        </>
    );
};

export default ForgotPassword;

