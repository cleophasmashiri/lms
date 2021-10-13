import InstructorRoute from "../../../components/routes/InstructorRoute";
import { useState } from "react";
import axios from "axios";
import { Select } from 'antd';
import CreateCourseForm from '../../forms/createCourseForm';
import Resizer from 'react-image-file-resizer';
import { toast } from 'react-toastify';
import router from "next/router";

const CreateCourse = () => {

    const { Option } = Select;

    // state
    const [values, setValues] = useState({
        name: '',
        description: '',
        category: '',
        price: 9.99,
        uploading: false,
        loading: false,
        paid: false
    });
    const [fileButtonText, setFileButtonText] = useState('Upload Image');
    const [preview, setPreview] = useState('');
    const [image, setImage] = useState(null);

    const handleChange = e => {
        setValues({ ...values, [e.target.name]: e.target.value })
    };
    const handleImage = (e) => {
        const file = e.target.files[0];
        setPreview(window.URL.createObjectURL(file));
        setFileButtonText(file.name);
        setValues({ ...values, loading: true });
        Resizer.imageFileResizer(file, 720, 500, 'JPEG', 100, 0, async (uri) => {
            try {
                const { data } = await axios.post('/api/course/upload-image', { image: uri });
                setImage(data);
                setValues({ ...values, loading: false });
            } catch (error) {
                setValues({ ...values, loading: false });
                toast('Error on image upload, try-again');external
                console.log(error);
            }
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setValues({...values, loading: true});  
            const { data } = await axios.post('/api/course', {...values, image});
            setValues({...values, loading: false});
            toast.success('Course created successfully.')
            router.push('/instructor'); 
        } catch (error) {
            setValues({...values, loading: false});
            console.log(error);
        }
    };

    const handleRemoveImage = async (e) => {
        try {
            setValues({...values, loading: true});
          
            setFileButtonText('Upload Image');
            const {Key, Bucket} = image;
            const { data } = await axios.post('/api/course/remove-image', {Key, Bucket});
            setPreview('');
            setImage(null);
            setValues({...values, loading: false});
        } catch (error) {
            setValues({...values, loading: true});
            toast('Error removing, try again');
        }
    }

    return (<InstructorRoute>
        <h1 className="jumbotron text-center square">Create</h1>
        <div className="pt-3 pb-3">
            <CreateCourseForm
                handleSubmit={handleSubmit}
                handleImage={handleImage}
                handleChange={handleChange}
                values={values}
                setValues={setValues}
                preview={preview}
                fileButtonText={fileButtonText}
                handleRemoveImage={handleRemoveImage}
            />
        </div>
    </InstructorRoute>);
};

export default CreateCourse;