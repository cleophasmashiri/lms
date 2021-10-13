import InstructorRoute from "../../components/routes/InstructorRoute";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { Avatar } from 'antd';
import Link from 'next/link';
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {

    const [courses, setCourses] = useState([]);

    const myStyle = {marginTop: '-15px', fontSize: '10px'};

    useEffect(() => {
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            const { data } = await axios.get('/api/instructor-courses');
            setCourses(data);
        } catch (error) {
            toast('Error occured, try again');
        }
    };

    return (<InstructorRoute>
        <h1 className="jumbotron text-center square">Instructor Dashboard</h1>
        {courses && courses.map(c => (
            <div key={`container_${c._id}_0`} className="media pt-2">
                <Avatar key={`avatar_${c._id}_0`} size={80} src={c.image ? c.image.Location : '/course.png'}>
                </Avatar>
                <div key={`main_${c._id}_0`} className="media-body pl-2">
                    <div key={`row_${c._id}_0`} className="row">
                        <div key={`col_${c._id}`} className="col">
                            <Link key={c._id} href={`/instructor/course/view/${c.slug}`} className="pointer">
                                <a key={`${c._id}_0`} className="mt-2 text-primary">
                                    <h5 className="pt-2">{c.name}</h5>
                                    </a>
                            </Link>
                            <p style={{marginTop: "-10px"}}>
                                {c.lessons.length} Lessons
                            </p>
                            {c.lessons < 5? (
                                <p style={myStyle} className="text-warning">At least 5 lessons required to publish course.</p>
                            ): c.published? 
                            (<p style={myStyle} className="text-success">Your course is live</p>): (<p className="text-warning">Your course ready to be published</p>)}
                        </div>
                        <div className="col-md-3 mt-3 text-center">
                            {c.published? (<div>
                                <CheckCircleOutlined className="h5 pointer text-success" />
                            </div> ): (<div>
                            <CloseCircleOutlined className="h5 pointer text-warning" />
                            </div>)
                            }
                        </div>
                    </div>
                </div>
            </div>))
        }
    </InstructorRoute>);
};

export default InstructorIndex;