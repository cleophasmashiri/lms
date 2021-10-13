import { useContext, useState } from 'react';
import { Context } from '../../context';
import { Button } from 'antd';
import axios from 'axios';
import { SettingOutlined, UserSwitchOutlined, LoadingOutlined } from '@ant-design/icons';
import { toast } from 'react-toastify';
import { UserRoute } from '../../components/routes/UserRoute';

const BecomeInstructor = () => {

    const { state: { user } } = useContext(Context);
    const [loading, setLoading] = useState(false); 
    const becomeInstructor = (e) => {
        try {
            setLoading(true);
            axios.post('/api/make-instructor', {userId: user._id})
            .then(res => {
                console.log(res);
                const {data} = res;
                window.location.href = data;
            })
            .catch(err => console.log(err))
            .finally(() =>  setLoading(false));
        } catch(err) {
            toast('Stripe onboarding error, try again');
        }
    };
    return (<>
        <h1 className="jumbotron text-center square">Become an Instructor</h1>
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 text-center">
                    <div className="pt-4">
                        <UserSwitchOutlined className="display-1 pb-3" />
                        <br />
                        <h2>Set payout to publish course on Terzona</h2>
                        <p className="lead warning">
                            Terzona partners with stripe to pay your earnings to your bank account
                        </p>
                        <Button
                        className="mb-3 form-control"
                        type="primary"
                        block
                        shape="round"
                        icon={loading? <LoadingOutlined />: <SettingOutlined/>}
                        onClick={becomeInstructor}
                        disabled={(user && user.role && user.role.includes("Instructor")) || loading}
                        >{loading? "Processing...": "Payout Setup"}</Button>
                        <p className="lead">
                            You will be directed to stripe to complete the onboarding.
                        </ p>
                    </div>
                </div>
            </div>
        </div> 
    </>);
};

export default BecomeInstructor;