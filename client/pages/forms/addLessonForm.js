const AddLessonForm = ({ lessons, handleAddLesson, setLessons }) => {
    return (<div className="container pt-3">
        <form onAbort={handleAddLesson}>
            <div className="form-group">
                <input className="form-control"
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={values.title}
                    onChange={val => setLessons({
                        ...lessons, title: val
                    })}
                />
            </div>
            <div className="form-group">
            <textarea className="form-control"
                cols="7"
                rows="7"
                name="content"
                placeholder="Content"
                value={values.content}
                onChange={handleChange}
            />
        </div>
        </form>
    </div>);
};

export default AddLessonForm;