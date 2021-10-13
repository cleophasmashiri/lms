import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { SyncOutlined } from "@ant-design/icons";
import Link from 'next/link';
import { Context } from "../context";
import { useRouter } from "next/router";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { state } = useContext(Context);
    const { user } = state;
    const router = useRouter();


    useEffect(() => {
        console.log(user);
        if (user !== null) router.push('/');
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const data = await axios.post(`/api/register`, { email, name, password });
            toast.success('Registration successful, please login.');
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className="jumbotron text-center bg-primary square">Register</h1>
            <div className="container col-md-4 offset-md-4 pd-5">
                <form onSubmit={handleSubmit}>
                    <input required type="text"
                        className="form-control mb-4 p-4"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name" />
                    <input required type="email"
                        className="form-control mb-4 p-4"
                        value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email" />
                    <input required type="password"
                        className="form-control mb-4 p-4"
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password" />
                    <button type="submit" className="form-control btn btn-primary"
                        disabled={!name || !email || !password || loading}>
                        {loading ? <SyncOutlined spin /> : "Submit"}
                    </button>
                    <p className="text-center p-3">
                        Already registered?{" "}
                        <Link href="/login">
                            <a>Login</a>
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;