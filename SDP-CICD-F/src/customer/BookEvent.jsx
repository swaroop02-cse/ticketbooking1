import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config';

export default function BookEvent() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const eventId = queryParams.get('eventid');

  const [customer, setCustomer] = useState(null);
  const [formData, setFormData] = useState({
    startdate: "",
    enddate: "",
    bookedcapacity: 1
  });

  useEffect(() => {
    const storedCustomer = sessionStorage.getItem("customer");
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    } else {
      alert("Customer not logged in!");
      navigate("/customerlogin");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      event: { id: eventId },
      customer: { id: customer.id },
      ...formData,
      status: 1
    };

    try {
      const response = await fetch(`${config.url}/customer/bookevent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        alert("Event booked successfully!");
        navigate("/bookedevents");
      } else {
        alert("Failed to book event.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Book Event</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Start Date</label>
            <input
              type="date"
              name="startdate"
              value={formData.startdate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>End Date</label>
            <input
              type="date"
              name="enddate"
              value={formData.enddate}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Capacity</label>
            <input
              type="number"
              name="bookedcapacity"
              min="1"
              value={formData.bookedcapacity}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button type="submit" style={styles.button}>Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
    background: "#f8f6ff",
    minHeight: "100vh"
  },

  card: {
    width: "100%",
    maxWidth: "480px",
    padding: "25px",
    borderRadius: "15px",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    borderTop: "5px solid #7b00ff"
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#7b00ff",
    fontSize: "26px",
    fontWeight: "700"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    marginBottom: "6px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#333"
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "15px",
    outline: "none",
    transition: "0.3s"
  },

  button: {
    marginTop: "15px",
    padding: "12px",
    background: "#7b00ff",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s"
  }
};
