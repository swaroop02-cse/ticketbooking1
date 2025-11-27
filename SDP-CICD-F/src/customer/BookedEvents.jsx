import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

export default function BookedEvents() {
  const [bookedEvents, setBookedEvents] = useState([]);
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    const fetchBookedEvents = async () => {
      const storedCustomer = sessionStorage.getItem('customer');
      if (storedCustomer) {
        const customerData = JSON.parse(storedCustomer);
        setCustomer(customerData);

        try {
          const response = await axios.get(
            `${config.url}/customer/bookedevents/${customerData.id}`
          );
          setBookedEvents(response.data);
        } catch (error) {
          console.error('Error fetching booked events:', error);
        }
      } else {
        alert('Please log in to view your booked events.');
      }
    };

    fetchBookedEvents();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.title}>Your Booked Events</h2>

      {customer ? (
        <div style={styles.cardContainer}>
          {bookedEvents.length > 0 ? (
            bookedEvents.map((event, index) => (
              <div key={index} style={styles.eventCard}>
                <h3 style={styles.eventTitle}>{event.event.title}</h3>

                <div style={styles.eventDetail}>
                  <strong>Category:</strong> {event.event.category}
                </div>
                <div style={styles.eventDetail}>
                  <strong>Start Date:</strong> {event.startdate}
                </div>
                <div style={styles.eventDetail}>
                  <strong>End Date:</strong> {event.enddate}
                </div>
                <div style={styles.eventDetail}>
                  <strong>Capacity Booked:</strong> {event.bookedcapacity}
                </div>
                <div style={styles.eventDetail}>
                  <strong>Status:</strong> {event.status}
                </div>
                <div style={styles.eventDetail}>
                  <strong>Booking Time:</strong>{' '}
                  {new Date(event.bookingtime).toLocaleString()}
                </div>

                <div style={styles.bookingIdBadge}>
                  Booking ID: {event.id}
                </div>
              </div>
            ))
          ) : (
            <p style={styles.noEvents}>No booked events found.</p>
          )}
        </div>
      ) : (
        <p>Loading your customer details...</p>
      )}
    </div>
  );
}

const styles = {
  pageContainer: {
    padding: '20px',
    maxWidth: '900px',
    margin: 'auto'
  },

  title: {
    textAlign: 'center',
    textDecoration: 'underline',
    marginBottom: '30px',
    color: '#4a0072',
    fontSize: '28px'
  },

  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  },

  eventCard: {
    background: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: '0.3s',
    borderLeft: '5px solid #7b00ff'
  },

  eventTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#7b00ff',
    marginBottom: '12px'
  },

  eventDetail: {
    fontSize: '15px',
    marginBottom: '8px'
  },

  bookingIdBadge: {
    marginTop: '15px',
    padding: '8px',
    background: '#f3e8ff',
    color: '#5200a8',
    fontWeight: '600',
    borderRadius: '8px',
    textAlign: 'center'
  },

  noEvents: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#555'
  }
};
