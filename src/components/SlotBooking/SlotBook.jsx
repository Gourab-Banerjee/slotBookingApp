import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SlotBook.css";
import swal from "sweetalert2";

const SlotBook = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({
    date: "",
    slot: "09:00", // Default slot
  });

  const [bookingList, setBookingList] = useState([]);
  
  const [currUser, setCurrUser] = useState(JSON.parse(localStorage.getItem("name")));

  useEffect(() => {
    // Load existing bookings from local storage when the component mounts
    displayBookings();
  }, []);

  const displayBookings = () => {
    // Retrieve and display existing bookings from local storage
    const currentUser = localStorage.getItem("name");
    const bookedSlots = [];

    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        if (
          key !== "userList" &&
          key !== "loggedinUserList" &&
          key !== "name"
        ) {
          const booking = JSON.parse(localStorage[key]);
          // Create a booked slot object
          const bookedSlot = {
            key,
            date: booking.date,
            slot: booking.slot,
            username: booking.username,
            isCurrentUserBooking: booking.username === currentUser,
          };

          bookedSlots.push(bookedSlot);
        }
      }
    }

    setBookingList(bookedSlots);
  };

  const handleBooking = (e) => {
    e.preventDefault();
    const { date, slot } = bookingData;

    // Check if the slot is already booked
    const bookingKey = `${date}-${slot}`;
    if (localStorage.getItem(bookingKey)) {
      
      swal.fire("Slot is already booked. Please choose another slot.");
      return;
    }

    // Check if the selected date is in the past
    const selectedDate = new Date(date + "T" + slot);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      swal.fire(
        "You cannot book slots in the past. Please select a valid date and time."
      );
      return;
    }

    // Store booking data in local storage
    const username = localStorage.getItem("name");
    console.log(username);
    const newBookingData = {
      date,
      slot,
      username,
    };
    // setBookingData(bookingData)
    localStorage.setItem(bookingKey, JSON.stringify(newBookingData));
    swal.fire("Slot booked successfully");

    // After booking, clear the form
    setBookingData({
      date: "",
      slot: "09:00",
    });
  

    // Update the displayed bookings
    displayBookings();
  };
  const handleLogout = () => {
    localStorage.removeItem("name");
    setCurrUser(null);
    swal.fire("Logout successfull");
    navigate("/");
  };

  const cancelBooking = (bookingKey) => {
    const currentUser = localStorage.getItem("name");
    const bookingData = JSON.parse(localStorage.getItem(bookingKey));

    if (currentUser === bookingData.username) {
      if (window.confirm("Are you sure you want to cancel this booking?")) {
        localStorage.removeItem(bookingKey);
        swal.fire("Booking canceled successfully!");

        // Update the displayed bookings
        displayBookings();
      }
    } else {
      swal.fire("You can only cancel your own bookings.");
    }
  };

  return (
    <div className="container-box">
      {currUser ? (
        <div className="container">
          <div className="navbar">
            <h4>Welcome, {currUser}!</h4>
            <button id="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <h2 id="heading">Slot Booking App</h2>
          <form onSubmit={handleBooking}>
            <div className="input">
              <label htmlFor="date"> Select Date:</label>
              <br />
              <input
                type="date"
                id="date"
                required
                value={bookingData.date}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) =>
                  setBookingData({ ...bookingData, date: e.target.value })
                }
              />
            </div>
            {bookingData.date && (
              <div className="input">
                <label htmlFor="slot">Slot:</label>
                <br />
                <select
                  id="slot"
                  required
                  value={bookingData.slot}
                  onChange={(e) =>
                    setBookingData({ ...bookingData, slot: e.target.value })
                  }
                >
                  <option value="09:00">09:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="13:00">01:00 PM</option>
                  <option value="15:00">03:00 PM</option>
                  <option value="17:00">05:00 PM</option>
                  {/* Add more slots as needed */}
                </select>
              </div>
            )}

            <div id="button">
              <button  id="submit" type="submit">Book Slot</button>
            </div>
          </form>
        
          {/* Display existing bookings */}
          <div id="bookings">
            <h3>Booked Slots:</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Slot</th>
                  <th>Booked By</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookingList.map((booking) => (
                  <tr key={booking.key}>
                    <td>{booking.date}</td>
                    <td>{booking.slot}</td>
                    <td>{booking.username}</td>
                    <td>
                      {booking.isCurrentUserBooking ? (
                        <button id="cancel-button" onClick={() => cancelBooking(booking.key)}>
                          Cancel
                        </button>
                      ) : (
                        ""
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <h2 id="noData">
          please login to use the slot booking app <Link to="/">Login</Link>
        </h2>
      )}
    </div>
  );
};

export default SlotBook;
