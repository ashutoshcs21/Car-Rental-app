import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DefaultLayout from '../components/DefaultLayout';
import { getAllCars } from '../redux/actions/carsActions';
import { Col, Row, DatePicker } from 'antd';
import { Link } from 'react-router-dom';
import Spinner from '../components/Spinner';
import moment from 'moment';

const { RangePicker } = DatePicker;

function Home() {
    const { cars = [] } = useSelector(state => state.carsReducer);
    const { loading } = useSelector(state => state.alertsReducer);
    const [totalCars, setTotalcars] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCars());
    }, [dispatch]);

    useEffect(() => {
        setTotalcars(cars);
    }, [cars]);

    function setFilter(values) {
        const selectedFrom = moment(values[0], 'MMM DD yyyy HH:mm');
        const selectedTo = moment(values[1], 'MMM DD yyyy HH:mm');

        const temp = cars.filter(car => {
            if (car.bookedTimeSlots.length === 0) return true;

            return car.bookedTimeSlots.every(booking =>
                !(
                    selectedFrom.isBetween(booking.from, booking.to) ||
                    selectedTo.isBetween(booking.from, booking.to) ||
                    moment(booking.from).isBetween(selectedFrom, selectedTo) ||
                    moment(booking.to).isBetween(selectedFrom, selectedTo)
                )
            );
        });

        setTotalcars(temp);
    }

    return (
        <DefaultLayout>
            <Row className="mt-3" justify="center">
                <Col lg={20} sm={24} className="d-flex justify-content-left">
                    <RangePicker
                        showTime={{ format: 'HH:mm' }}
                        format="MMM DD yyyy HH:mm"
                        onChange={setFilter}
                        placeholder={['Start Time', 'End Time']}
                    />
                </Col>
            </Row>

            {loading && <Spinner />}

            <Row justify="center" gutter={16}>
                {totalCars.map(car => (
                    <Col key={car._id} lg={5} sm={24} xs={24}>
                        <div className="car p-2 bs1">
                            <img src={car.image} className="carimg" alt={car.name} />
                            <div className="car-content d-flex align-items-center justify-content-between">
                                <div className="text-left pl-2">
                                    <p>{car.name}</p>
                                    <p>Rent Per Hour {car.rentPerHour} /-</p>
                                </div>
                                <div>
                                    <button className="btn1 mr-2">
                                        <Link to={`/booking/${car._id}`}>Book Now</Link>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </DefaultLayout>
    );
}

export default Home;
