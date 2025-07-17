import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import { Typography, Card } from 'antd';

const { Title, Text } = Typography;

const GET_PERSON_WITH_CARS = gql`
  query PersonWithCars($id: ID!) {
    personWithCars(id: $id) {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const ShowPage = () => {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PERSON_WITH_CARS, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading data.</p>;

  const person = data.personWithCars;

  return (
    <div style={{ padding: '2rem' }}>
      <Title level={2}>
        {person.firstName} {person.lastName}
      </Title>

      {person.cars.length === 0 ? (
        <Text>No cars owned.</Text>
      ) : (
        person.cars.map(car => (
          <Card key={car.id} type="inner" style={{ marginBottom: '1rem' }}>
            <Text>
              {car.year} {car.make} {car.model} —{' '}
              <strong>
                {parseFloat(car.price).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </strong>
            </Text>
          </Card>
        ))
      )}

      <br />
      <Link to="/">← Go Back Home</Link>
    </div>
  );
};

export default ShowPage;
