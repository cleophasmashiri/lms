import { Select, Button, Avatar, Badge } from 'antd';
import { SaveOutlined } from "@ant-design/icons";

const CreateCourseForm = ({ handleChange, handleImage, handleSubmit, values, setValues, preview, fileButtonText, handleRemoveImage }) => {

    const { Option } = Select;
    const children = [];
    for (let i = 9.99; i < 99.9; i++) {
        children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>)
    }

    return (<form onSubmit={handleSubmit}>
        <div className="form-group">
            <input className="form-control"
                type="text"
                name="name"
                placeholder="Name"
                value={values.name}
                onChange={handleChange}
            />
        </div>
        <div className="form-group">
            <textarea className="form-control"
                cols="7"
                rows="7"
                name="description"
                placeholder="Description"
                value={values.description}
                onChange={handleChange}
            />
        </div>
        <div className="form-group">
            <input className="form-control"
                type="text"
                name="category"
                placeholder="Category"
                value={values.category}
                onChange={handleChange}
            />
        </div>
        <div className="row">
            <div className="col">
                <div className="form-group">
                    <Select style={{ width: "100%" }} size="large" placeholder="Paid" name="paid"
                        value={values.paid}
                        onChange={v => setValues({ ...values, paid: v })}>
                        <Option value={true}>Paid</Option>
                        <Option value={false}>Free</Option>
                    </Select>
                </div>
            </div>
            {values.paid && (
                <div className="form-group">
                    <Select size="large" placeholder="Price" name="price"
                        defaultValue="$9.99"
                        tokenSeparators={[,]}
                        onChange={v => setValues({ ...values, price: v })}>
                        {children}
                    </Select>
                </div>)}
        </div>
        <div className="form-row">
            <div className="col">
                <div className="form-group">
                    <label className="btn btn-outline-seconday btn-block text-left">
                        {fileButtonText}
                        <input className="form-control"
                            type="file"
                            accept="image/*"
                            name="image"
                            value={values.imagePreview}
                            onChange={handleImage}
                        />
                    </label>
                </div>
            </div>
            {preview && (
                <div className="col-md-6" style={{ paddingTop: '30px' }}>
                    <Badge count="X" onClick={handleRemoveImage} className="pointer">
                        <Avatar src={preview} width={200} />
                    </Badge>
                </div>
            )}
        </div>
        <div className="row">
            <div className="col">
                <Button className="btn btn-primaryq"
                    type="primary"
                    size="large"
                    shape="round"
                    loading={values.loading}
                    onClick={handleSubmit}
                    disabled={values.loading || values.uploading}
                    icon={<SaveOutlined />}
                >{values.loading ? 'Saving...' : 'Save & Continue'}</Button>
            </div>
        </div>
    </form>);
};

export default CreateCourseForm;