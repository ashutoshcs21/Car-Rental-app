import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DefaultLayout from "../components/DefaultLayout";
import { getAllCars } from "../redux/actions/carsActions";
import { Col, Row, DatePicker } from "antd";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import moment from "moment";
import "./Home.css";


const { RangePicker } = DatePicker;

function Home() {
    const { cars = [] } = useSelector((state) => state.carsReducer);
    const { loading } = useSelector((state) => state.alertsReducer);
    const [totalCars, setTotalcars] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllCars());
    }, [dispatch]);

    useEffect(() => {
        setTotalcars(cars);
    }, [cars]);

    function setFilter(values) {
        const selectedFrom = moment(values[0], "MMM DD yyyy HH:mm");
        const selectedTo = moment(values[1], "MMM DD yyyy HH:mm");

        const temp = cars.filter((car) => {
            if (car.bookedTimeSlots.length === 0) return true;

            return car.bookedTimeSlots.every(
                (booking) =>
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

    return ( <
        DefaultLayout > { /* Hero Section */ } <
        section className = "hero-section" >
        <
        div className = "hero-content" >
        <
        h1 > Rent Your Car, Anytime, Anywhere < /h1> <
        p > Affordable, reliable, and fast car rentals at your fingertips🚗 < /p> <
        a href = "#cars"
        className = "hero-btn" >
        Book Now <
        /a> < /
        div > <
        /section>

        { /* Date Filter */ } <
        Row className = "mt-3"
        justify = "center" >
        <
        Col lg = { 20 }
        sm = { 24 }
        className = "d-flex justify-content-left" >
        <
        RangePicker showTime = {
            { format: "HH:mm" }
        }
        format = "MMM DD yyyy HH:mm"
        onChange = { setFilter }
        placeholder = {
            ["Start Time", "End Time"]
        }
        /> < /
        Col > <
        /Row>

        { loading && < Spinner / > }

        { /* Cars Section */ } <
        section id = "cars"
        className = "cars-section" >
        <
        Row justify = "center"
        gutter = { 16 } > {
            totalCars.map((car) => ( <
                Col key = { car._id }
                lg = { 6 }
                sm = { 24 }
                xs = { 24 } >
                <
                div className = "car-card" >
                <
                img src = { car.image }
                className = "car-img"
                alt = { car.name }
                /> <
                div className = "car-info" >
                <
                h3 > { car.name } < /h3> <
                p > Rent Per Hour: < span > ₹{ car.rentPerHour } < /span></p >
                <
                button className = "book-btn" >
                <
                Link to = { `/booking/${car._id}` } > Book Now < /Link> < /
                button > <
                /div> < /
                div > <
                /Col>
            ))
        } <
        /Row> < /
        section >

        { /* About Us Section */ } <
        section className = "about-section" >
        <
        div className = "about-content" >
        <
        h2 > About Us < /h2> <
        p >
        Welcome to < span className = "brand" > CarX < /span>, your trusted car rental
        platform.We provide a wide range of cars at affordable rates with a smooth booking experience.Whether it’ s
        for a business trip, family vacation, or just exploring the city, we’ ve got you covered.🚀 <
        /p> < /
        div > <
        /section> < /
        DefaultLayout >
    );
}

export default Home;