import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { Context } from "../context";
import { useRouter } from 'next/router';

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // state
    const { state, dispatch } = useContext(Context);
    const { user } = state;
    const router = useRouter();

    useEffect(() => {
        if (user === null) {
            router.push('/login');
        } else {
            router.push('/user');
        }
    }, [user]);

    const handleSubmit = async (e) => {

        e.preventDefault();
        try {
            setLoading(true);
            const { data } = await axios.post(`/api/login`, { email, password });
            toast.success('Login successful, please login.');
            dispatch({
                type: 'LOGIN',
                payload: data
            });
            window.localStorage.setItem('user', JSON.stringify(data));
            setLoading(false);
            // router.push('/user');
        } catch (err) {
            toast.error(err.response?.data);
            setLoading(false);
        }
    };

    return (
        <div>   
            <h1 className="jumbotron text-center bg-primary square">Login</h1>
            <div className="container col-md-4 offset-md-4 pd-5">
                <form onSubmit={handleSubmit}>
                    <input required type="email"
                        className="form-control mb-4 p-4"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email" />
                    <input required type="password"
                        className="form-control mb-4 p-4"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password" />
                    <button type="submit" className="form-control btn btn-primary"
                        disabled={!email || !password || loading}>
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                    <p className="text-center pt-3">
                        Not yet registered?{" "}
                        <Link href="/register">
                            <a>Register</a>
                        </Link>
                    </p>
                    <p className="text-center text-danger">
                        <Link href="/forgot-password">
                            <a className="text-danger">Forgot password</a>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;