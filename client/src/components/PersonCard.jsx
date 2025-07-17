import { Modal, Input, Button, Form, message, Row, Col } from 'antd';
import { useMutation } from '@apollo/client';
import { UPDATE_CAR, GET_CARS } from './../queries';
import { CarOutlined } from '@ant-design/icons';

const EditCarModal = ({ car, setIsEditModalVisible }) => {
  const [updateCar] = useMutation(UPDATE_CAR, { refetchQueries: [{ query: GET_CARS }] });
  const [form] = Form.useForm();

  const handleUpdate = async (values) => {
    try {
      // Ensure the price is parsed to a float value
      await updateCar({ variables: { id: car.id, ...values, price: parseFloat(values.price) } });
      message.success('Car updated successfully!');
      setIsEditModalVisible(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error('Failed to update car!');
    }
  };

  return (
    <Modal 
      title="Edit Car Details"
      open={true}
      onCancel={() => setIsEditModalVisible(false)}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        initialValues={{ ...car, price: car.price.toString() }}
        onFinish={handleUpdate}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="year"
              label="Year"
              rules={[{ required: true, message: 'Please enter the car year!' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="make"
              label="Make"
              rules={[{ required: true, message: 'Please enter the car make!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="model"
              label="Model"
              rules={[{ required: true, message: 'Please enter the car model!' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true, message: 'Please enter the car price!' }]}
            >
              <Input type="number" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Update  <CarOutlined />
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCarModal;
