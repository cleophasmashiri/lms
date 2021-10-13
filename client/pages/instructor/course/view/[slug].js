import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-toastify";
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { Avatar, Tooltip, Button, Modal } from 'antd';
import { EditOutlined, CheckOutlined, UploadOutlined } from "@ant-design/icons";
import ReactMarkdown from 'react-markdown'
import AddLessonForm from '../../../forms/addLessonForm';

const ViewCourse = () => {

    const router = useRouter();
    const { slug } = router.query;
    const [course, setCourse] = useState([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        loadCourse();
    }, [slug]);

    const [lessons, setLessons] = useState({
        title: '',
        content: '',
        video: ''
    });

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/', lessons);
        } catch (error) {
            toast('Error on save lesson, try again');
        }
        console.log(lessons);
    };

    const loadCourse = async () => {
        try {
            if (slug) {
                const { data } = await axios.get(`/api/course/${slug}`);
                setCourse(data);
            }
        } catch (error) {
            toast('Error fetching course, try again');
        }
    };

    return (<InstructorRoute>
        <div className="container-fluid pt-3">
            {course && <div className="container-fluid pt-1">
                <div className="media pt-2">
                    <Avatar
                        size={80}
                        src={course.image ? course.image.location : '/course.jpg'}
                    />
                    <div className="media-body pl-2">
                        <div className="row">
                            <div className="col">
                                <h5 className="mt-2 text-primary">{course.name}</h5>
                                <p style={{ marginTop: '-10px' }}>
                                    {course.lessons && course.lessons.length} Lessons
                                </p>
                                <p style={{ marginTop: '-15px', fontSize: '10px' }}>
                                    {course.category}
                                </p>
                            </div>
                            <div className="col-2">
                                <Tooltip title="Edit">
                                    <EditOutlined className="h5 pointer text-warning" />
                                </Tooltip>
                                <Tooltip title="Publish">
                                    <CheckOutlined className="h5 pointer text-danger" />
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
                <hr/>
                <div className="row">
                    <div className="col">
                        <ReactMarkdown source={course.description} />
                    </div>
                </div>
                <div className="row">
                    <Button
                        onClick={() => setVisible(true)}
                        className="col-md-6 offset-md-3 text-center"
                        type="primary"
                        shape="round"
                        icon={<UploadOutlined />}
                        size="large"
                    >Add Lesson</Button>
                    <Modal
                        title="+ Add Lesson"
                        centered
                        visible={visible}
                        onCancel={() => setVisible(false)}
                        footer={null}
                    >
                        <AddLessonForm lessons={lessons} handleAddLesson={handleAddLesson} setLessons={setLessons} />
                    </Modal>
                </div>
            </div>}
        </div>
    </InstructorRoute>);
};

export default ViewCourse;