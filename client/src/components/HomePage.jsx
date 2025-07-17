import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { UserOutlined } from '@ant-design/icons';
import { Card, Button, Form, Input, Select, message, Modal } from 'antd';
import { ADD_PERSON, ADD_CAR, GET_PEOPLE, GET_CARS, DELETE_PERSON, DELETE_CAR, UPDATE_PERSON } from '../queries';
import EditCarModal from './PersonCard';
import { CarOutlined } from '@ant-design/icons';

import './../home.css';

const { Option } = Select;

const Home = () => {
  const { data: peopleData, loading: peopleLoading } = useQuery(GET_PEOPLE);
  const { data: carsData } = useQuery(GET_CARS);

  const [addPerson] = useMutation(ADD_PERSON);
  const [addCar] = useMutation(ADD_CAR);
  const [deletePerson] = useMutation(DELETE_PERSON);
  const [deleteCar] = useMutation(DELETE_CAR);
  const [updatePerson] = useMutation(UPDATE_PERSON);

  const [isPersonEditModalVisible, setPersonEditModalVisible] = useState(false);
  const [isCarEditModalVisible, setCarEditModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [editPersonForm] = Form.useForm();
  const [addPersonForm] = Form.useForm();
  const [addCarForm] = Form.useForm();

  const handleMutation = async (mutationFn, variables, successMessage, errorMessage, refetchQueries) => {
    try {
      await mutationFn({ variables, refetchQueries });
      message.success(successMessage);
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      message.error(errorMessage);
    }
  };

  // Handle adding a new person
  const handleCreatePerson = (values) => {
    const { firstName, lastName } = values;
    handleMutation(addPerson, { firstName, lastName }, 'Person added successfully!', 'Failed to add person!', [{ query: GET_PEOPLE }]);
    addPersonForm.resetFields();
  };

  // Handle adding a new car
  const handleCreateCar = (values) => {
    const { year, make, model, price, personId } = values;
    handleMutation(addCar, { year: parseInt(year, 10), make, model, price: parseFloat(price), personId }, 'Car added successfully!', 'Failed to add car!', [{ query: GET_CARS }]);
    addCarForm.resetFields();
  };

  // Handle removing a person
  const handleRemovePerson = (personId) => {
    handleMutation(deletePerson, { id: personId }, 'Person removed successfully!', 'Failed to remove person!', [{ query: GET_PEOPLE }]);
  };

  // Handle removing a car
  const handleRemoveCar = (carId) => {
    handleMutation(deleteCar, { id: carId }, 'Car removed successfully!', 'Failed to remove car!', [{ query: GET_CARS }]);
  };

  // Handle editing a person
  const handleEditPerson = (person) => {
    setSelectedPerson(person);
    editPersonForm.setFieldsValue({ firstName: person.firstName, lastName: person.lastName });
    setPersonEditModalVisible(true);
  };

  // Handle editing a car
  const handleEditCar = (car) => {
    setSelectedCar(car);
    setCarEditModalVisible(true);
  };

  // Handle updating a person
  const handleUpdatePerson = (values) => {
    handleMutation(updatePerson, { id: selectedPerson.id, firstName: values.firstName, lastName: values.lastName }, 'Person updated successfully!', 'Failed to update person!', [{ query: GET_PEOPLE }]);
    setPersonEditModalVisible(false);
  };

  return (
    
    <div className="home-container">
      <h1>People and Their Cars</h1>  
      <div className="main-container">
        {/* Add New Person Form */}
        <section className="section">
          <h2>Add New Person</h2>
          <Form form={addPersonForm} onFinish={handleCreatePerson}>
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">Add <UserOutlined /> </Button>
          </Form>
        </section>

        {/* Add New Car Form */}
        <section className="add-sections">
          <div className="section">
            <h2>Add New Car</h2>
            {peopleData?.people?.length > 0 && (
              <Form form={addCarForm} onFinish={handleCreateCar}>
                <Form.Item name="year" label="Year" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="make" label="Make" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="model" label="Model" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                  <Input type="number" />
                </Form.Item>
                <Form.Item name="personId" label="Person" rules={[{ required: true }]}>
                  <Select>
                    {peopleData?.people?.map((person) => (
                      <Option key={person.id} value={person.id}>
                        {person.firstName} {person.lastName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Button type="primary" htmlType="submit">Add <CarOutlined /></Button>
              </Form>
            )}
          </div>
        </section>
      </div>

      {/* People List with Car Cards */}
      <section className="section">
        <h2 style={{ textAlign: 'center', fontWeight: '600', fontSize: '30px', marginBottom: '20px' }}>Records</h2>
        {peopleLoading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {peopleData?.people?.map((person) => (
              <Card key={person.id} title={`${person.firstName} ${person.lastName}`} >
                
                {/* Remove and Edit Person Buttons */}
                <Button type="danger" onClick={() => handleRemovePerson(person.id)}>Remove <UserOutlined /> </Button>
                <Button onClick={() => handleEditPerson(person)}>Edit <UserOutlined /> </Button>
                
                {/* Car Cards for Each Person */}
                <div className="container">
                  {carsData?.cars
                    .filter((car) => car.personId === person.id)
                    .map((car) => (
                      <Card type="inner" key={car.id} title={`${car.year} ${car.make} ${car.model}`} className="card">
                        <p>Price: ${car.price}</p>
                        <Button type="danger" onClick={() => handleRemoveCar(car.id)}>Remove <CarOutlined /></Button>
                        <Button type="default" onClick={() => handleEditCar(car)}>Edit <CarOutlined /></Button>
                      </Card>
                    ))}
                </div>

              </Card>
            ))}
          </div>
        )}
      </section>


      {/* Edit Car Modal */}
      {isCarEditModalVisible && selectedCar && (
        <EditCarModal car={selectedCar} setIsEditModalVisible={setCarEditModalVisible} />
      )}

      {/* Edit Person Modal */}
      <Modal
        title="Edit Person"
        visible={isPersonEditModalVisible}
        onCancel={() => setPersonEditModalVisible(false)}
        footer={null}
      >
        <Form form={editPersonForm} onFinish={handleUpdatePerson}>
          <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Update <UserOutlined /></Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Home;
