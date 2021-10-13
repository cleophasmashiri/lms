import { useReducer, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const initialState = {
    user: null
};

const Context = createContext();

// reducer 
const rootRuducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
};

//  provider
const Provider = ({ children }) => {
    const [state, dispatch] = useReducer(rootRuducer, initialState);
    useEffect(() => {
        dispatch({
            type: 'LOGIN',
            payload: JSON.parse(window.localStorage.getItem('user'))
        });
    }, []);

    const router = useRouter();

    axios.interceptors.response.use((res) => {
        return res;
    }, (err) => {
        const response = err.response;
        if (response.status === 401 && response.config && !response.config.__isRetryRequest) {
            return new Promise((resolve, reject) => {
                axios.get('api/logout')
                    .then(data => {
                        dispatch({ type: 'LOGOUT' });
                        window.localStorage.setItem('user', null);
                        router.push('/login');
                    })
                    .catch(err => {
                        reject(err);
                    });
            });
        }
        return Promise.reject(err);
    });

    useEffect(() => {
        const getCsrfToken = async () => {
            const { data } = await axios.get('/api/csrf-token');
            axios.defaults.headers['X-CSRF-Token'] = data.csrfToken;
            // console.log('X-CSRF-Token', data.csrfToken);
        };
        getCsrfToken();
    }, []);

    return (
        <Context.Provider value={{ state, dispatch }}>
            {children}
        </Context.Provider>
    );
};

export { Context, Provider };