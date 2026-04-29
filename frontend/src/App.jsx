import { useEffect, useState } from "react";
import "./App.css";

import miniTruck from "./assets/mini-truck.png";
import mediumTruck from "./assets/medium-truck.png";
import heavyTruck from "./assets/heavy-truck.png";

function App() {
  const [view, setView] = useState("site");
  const [trucks, setTrucks] = useState([]);
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState(null);
  const [trackingError, setTrackingError] = useState("");
  const [priceData, setPriceData] = useState({
    truckId: "",
    distance: "",
    weight: "",
  });
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [adminForm, setAdminForm] = useState({
    email: "",
    password: "",
  });

  const truckImages = {
    "mini-truck.png": miniTruck,
    "medium-truck.png": mediumTruck,
    "heavy-truck.png": heavyTruck,
  };

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    pickup: "",
    drop: "",
    goods: "",
    weight: "",
    message: "",
  });

  useEffect(() => {
    fetch("http://localhost:5000/api/trucks")
      .then((res) => res.json())
      .then((data) => {
        setTrucks(data.data || []);
      })
      .catch((error) => {
        console.log("Error fetching trucks:", error);
      });
  }, []);

  const goToSiteSection = (sectionId) => {
    setView("site");

    setTimeout(() => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || "Something went wrong.");
        return;
      }

      alert(
        `Thank you ${formData.name}! Your inquiry has been submitted successfully. Kandpal Transport team will contact you soon.`
      );

      setFormData({
        name: "",
        phone: "",
        email: "",
        pickup: "",
        drop: "",
        goods: "",
        weight: "",
        message: "",
      });
    } catch (error) {
      alert("Backend connection failed. Please check if backend is running.");
      console.log("Inquiry Error:", error);
    }
  };

  const handleTrack = async (e) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      setTrackingError("Please enter a tracking ID.");
      setTrackingData(null);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/track/${trackingId}`
      );

      const result = await response.json();

      if (!response.ok) {
        setTrackingError(result.message || "Tracking details not found.");
        setTrackingData(null);
        return;
      }

      setTrackingData(result.data);
      setTrackingError("");
    } catch (error) {
      setTrackingError("Backend connection failed. Please check backend.");
      setTrackingData(null);
      console.log("Tracking Error:", error);
    }
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;

    setPriceData({
      ...priceData,
      [name]: value,
    });

    setEstimatedPrice(null);
  };

  const calculatePrice = (e) => {
    e.preventDefault();

    const selectedTruck = trucks.find(
      (truck) => String(truck.id) === String(priceData.truckId)
    );

    if (!selectedTruck || !priceData.distance) {
      alert("Please select truck type and enter distance.");
      return;
    }

    const distance = Number(priceData.distance);

    if (distance <= 0) {
      alert("Please enter a valid distance.");
      return;
    }

    const basePrice = distance * selectedTruck.pricePerKm;

    setEstimatedPrice({
      truckName: selectedTruck.name,
      pricePerKm: selectedTruck.pricePerKm,
      distance,
      weight: priceData.weight || "Not specified",
      total: basePrice,
    });
  };

  const handleAdminChange = (e) => {
    const { name, value } = e.target;

    setAdminForm({
      ...adminForm,
      [name]: value,
    });
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (
      adminForm.email === "admin@kandpal.com" &&
      adminForm.password === "admin123"
    ) {
      setAdminLoggedIn(true);
      setAdminError("");
      setAdminForm({ email: "", password: "" });
      return;
    }

    setAdminError("Invalid admin email or password. Use admin@kandpal.com / admin123 for demo.");
  };

  const renderNavbar = () => (
    <nav className="navbar">
      <button className="logo logo-button" onClick={() => goToSiteSection("home")}>
        <span className="logo-icon">K</span>
        <span>Kandpal</span>
        <small>Transport</small>
      </button>

      <ul className="nav-links">
        <li><button onClick={() => goToSiteSection("home")}>Home</button></li>
        <li><button onClick={() => goToSiteSection("services")}>Services</button></li>
        <li><button onClick={() => goToSiteSection("trucks")}>Trucks</button></li>
        <li><button onClick={() => goToSiteSection("calculator")}>Calculator</button></li>
        <li><button onClick={() => goToSiteSection("tracking")}>Tracking</button></li>
        <li><button onClick={() => goToSiteSection("pricing")}>Pricing</button></li>
        <li><button onClick={() => goToSiteSection("about")}>About</button></li>
        <li><button onClick={() => goToSiteSection("contact")}>Contact</button></li>
        <li><button onClick={() => setView("admin")}>Admin</button></li>
      </ul>

      <button className="nav-btn" onClick={() => goToSiteSection("contact")}>Book Now →</button>
    </nav>
  );

  const renderAdminPortal = () => {
    if (!adminLoggedIn) {
      return (
        <section className="admin-section">
          <div className="admin-login-card">
            <p className="section-tag">ADMIN PORTAL</p>
            <h2>Login to Dashboard</h2>
            <p className="admin-subtitle">
              Demo login: <strong>admin@kandpal.com</strong> / <strong>admin123</strong>
            </p>

            <form onSubmit={handleAdminLogin} className="admin-form">
              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                value={adminForm.email}
                onChange={handleAdminChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={adminForm.password}
                onChange={handleAdminChange}
                required
              />

              {adminError && <p className="admin-error">{adminError}</p>}

              <button type="submit" className="primary-btn admin-login-btn">
                Login →
              </button>
            </form>
          </div>
        </section>
      );
    }

    return (
      <section className="admin-section">
        <div className="admin-dashboard">
          <div className="admin-header">
            <div>
              <p className="section-tag">ADMIN DASHBOARD</p>
              <h2>Kandpal Transport Control Panel</h2>
              <p>Demo dashboard. Database connection will make these records live.</p>
            </div>

            <button className="secondary-btn" onClick={() => setAdminLoggedIn(false)}>
              Logout
            </button>
          </div>

          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span>Total Trucks</span>
              <strong>{trucks.length || 3}</strong>
            </div>

            <div className="admin-stat-card">
              <span>New Inquiries</span>
              <strong>12</strong>
            </div>

            <div className="admin-stat-card">
              <span>Active Bookings</span>
              <strong>7</strong>
            </div>

            <div className="admin-stat-card">
              <span>In Transit</span>
              <strong>4</strong>
            </div>
          </div>

          <div className="admin-table-card">
            <h3>Recent Demo Inquiries</h3>

            <div className="admin-table">
              <div className="admin-table-row admin-table-head">
                <span>Name</span>
                <span>Phone</span>
                <span>Pickup</span>
                <span>Drop</span>
                <span>Status</span>
              </div>

              <div className="admin-table-row">
                <span>Rahul Sharma</span>
                <span>9876543210</span>
                <span>Haldwani</span>
                <span>Delhi</span>
                <span className="status-pill">New</span>
              </div>

              <div className="admin-table-row">
                <span>Amit Rawat</span>
                <span>9811122233</span>
                <span>Dehradun</span>
                <span>Noida</span>
                <span className="status-pill active">In Transit</span>
              </div>

              <div className="admin-table-row">
                <span>Neha Bisht</span>
                <span>9999988888</span>
                <span>Nainital</span>
                <span>Gurugram</span>
                <span className="status-pill done">Delivered</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const renderSite = () => (
    <>
      {/* Hero */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Reliable Logistics.
            <span>Premium Transport.</span>
          </h1>

          <p>
            Safe, fast and affordable transport solutions across India.
            Your goods, our responsibility.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn" onClick={() => goToSiteSection("contact")}>Book Now →</button>
            <button className="secondary-btn" onClick={() => goToSiteSection("services")}>View Services →</button>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section" id="services">
        <p className="section-tag">OUR SERVICES</p>
        <h2>End-to-End Transport Solutions</h2>
        <p className="section-desc">
          From local goods movement to long-route truck booking, Kandpal Transport
          provides safe, reliable and affordable logistics solutions across India.
        </p>

        <div className="services-grid">
          <div className="service-card">
            <div className="icon">🚚</div>
            <h3>Goods Transport</h3>
            <p>
              Reliable and secure transport of all types of goods across cities
              and states.
            </p>
          </div>

          <div className="service-card">
            <div className="icon">🚛</div>
            <h3>Truck Booking</h3>
            <p>
              Book the right truck for your needs with easy, quick and
              hassle-free booking.
            </p>
          </div>

          <div className="service-card">
            <div className="icon">📍</div>
            <h3>Route Coverage</h3>
            <p>
              Extensive network covering major cities and remote locations
              across India.
            </p>
          </div>
        </div>
      </section>

      {/* Truck Options */}
      <section className="section" id="trucks">
        <p className="section-tag">TRUCK OPTIONS</p>
        <h2>Choose the Right Truck</h2>
        <p className="section-desc">
          Select from our available truck options based on your goods, route and
          capacity requirement.
        </p>

        <div className="truck-options-grid">
          {trucks.length === 0 ? (
            <p className="loading-text">Loading truck options...</p>
          ) : (
            trucks.map((truck) => (
              <div className="truck-option-card" key={truck.id}>
                <div className="truck-option-image">
                  <img
                    src={truckImages[truck.image]}
                    alt={truck.name}
                    className="truck-option-img"
                  />
                </div>

                <h3>{truck.name}</h3>
                <p>{truck.bestFor}</p>

                <div className="truck-meta">
                  <span>Capacity: {truck.capacity}</span>
                  <span>₹{truck.pricePerKm}/km</span>
                </div>

                <button className="primary-btn truck-book-btn" onClick={() => goToSiteSection("contact")}>
                  Book This Truck →
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Price Calculator */}
      <section className="section" id="calculator">
        <p className="section-tag">PRICE CALCULATOR</p>
        <h2>Estimate Your Transport Cost</h2>
        <p className="section-desc">
          Select your truck type and enter distance to get an instant estimated
          transport cost.
        </p>

        <div className="calculator-box">
          <form className="calculator-form" onSubmit={calculatePrice}>
            <select
              name="truckId"
              value={priceData.truckId}
              onChange={handlePriceChange}
              required
            >
              <option value="">Select Truck Type</option>
              {trucks.map((truck) => (
                <option key={truck.id} value={truck.id}>
                  {truck.name} - ₹{truck.pricePerKm}/km
                </option>
              ))}
            </select>

            <input
              type="number"
              name="distance"
              placeholder="Distance in KM"
              value={priceData.distance}
              onChange={handlePriceChange}
              min="1"
              required
            />

            <input
              type="text"
              name="weight"
              placeholder="Approx Weight e.g. 2 Ton"
              value={priceData.weight}
              onChange={handlePriceChange}
            />

            <button type="submit" className="primary-btn">
              Calculate Price →
            </button>
          </form>

          {estimatedPrice && (
            <div className="price-result">
              <h3>Estimated Cost</h3>

              <div className="price-result-grid">
                <p><strong>Truck:</strong> {estimatedPrice.truckName}</p>
                <p><strong>Rate:</strong> ₹{estimatedPrice.pricePerKm}/km</p>
                <p><strong>Distance:</strong> {estimatedPrice.distance} km</p>
                <p><strong>Weight:</strong> {estimatedPrice.weight}</p>
              </div>

              <div className="total-price">
                ₹{estimatedPrice.total.toLocaleString("en-IN")}
              </div>

              <p className="price-note">
                This is an estimated price. Final price may vary based on route,
                load type and availability.
              </p>

              <button className="primary-btn" onClick={() => goToSiteSection("contact")}>
                Book This Estimate →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tracking */}
      <section className="section" id="tracking">
        <p className="section-tag">LIVE TRACKING</p>
        <h2>Track Your Shipment</h2>
        <p className="section-desc">
          Enter your tracking ID to check current shipment status, location and
          delivery update.
        </p>

        <div className="tracking-box">
          <form className="tracking-form" onSubmit={handleTrack}>
            <input
              type="text"
              placeholder="Enter Tracking ID e.g. KT2026001"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
            />

            <button type="submit" className="primary-btn">
              Track Now →
            </button>
          </form>

          {trackingError && <p className="tracking-error">{trackingError}</p>}

          {trackingData && (
            <div className="tracking-result">
              <h3>Tracking Details</h3>

              <div className="tracking-grid">
                <p><strong>Tracking ID:</strong> {trackingData.trackingId}</p>
                <p><strong>Status:</strong> {trackingData.status}</p>
                <p><strong>Current Location:</strong> {trackingData.currentLocation}</p>
                <p><strong>Estimated Delivery:</strong> {trackingData.estimatedDelivery}</p>
                <p><strong>Driver:</strong> {trackingData.driverName}</p>
                <p><strong>Truck Number:</strong> {trackingData.truckNumber}</p>
              </div>

              <div className="tracking-steps">
                {trackingData.steps.map((step, index) => (
                  <span
                    key={index}
                    className={
                      step === trackingData.status
                        ? "tracking-step active"
                        : "tracking-step"
                    }
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Pricing */}
      <section className="section" id="pricing">
        <p className="section-tag">PRICING</p>
        <h2>Transparent & Competitive Rates</h2>

        <div className="pricing-grid">
          <div className="pricing-card">
            <div>
              <h3>Standard Service</h3>
              <p>Starting from</p>
              <h4>₹50/km</h4>

              <ul>
                <li>✓ Ideal for regular shipments</li>
                <li>✓ Safe & timely delivery</li>
                <li>✓ Pan India coverage</li>
              </ul>
            </div>

            <div className="truck-small"></div>
          </div>

          <div className="pricing-card premium">
            <span className="badge">MOST POPULAR</span>

            <div>
              <h3>Premium Service</h3>
              <p>Starting from</p>
              <h4>₹100/km</h4>

              <ul>
                <li>✓ Priority handling</li>
                <li>✓ Dedicated support</li>
                <li>✓ Faster delivery assurance</li>
              </ul>
            </div>

            <div className="truck-small"></div>
          </div>
        </div>

        <p className="note">
          ⓘ Prices may vary based on distance, load type & location. Contact us
          for a custom quote.
        </p>
      </section>

      {/* About */}
      <section className="section" id="about">
        <p className="section-tag">WHY CHOOSE US</p>
        <h2>We Deliver More Than Just Goods</h2>

        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">⏱</div>
            <h3>On-Time Delivery</h3>
            <p>We value your time and ensure timely deliveries every time.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🛡</div>
            <h3>Safe Handling</h3>
            <p>Your goods are handled with utmost care and complete safety.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">₹</div>
            <h3>Affordable Pricing</h3>
            <p>Best-in-class service at transparent and competitive rates.</p>
          </div>

          <div className="feature">
            <div className="feature-icon">🎧</div>
            <h3>24/7 Support</h3>
            <p>Our support team is always ready to assist you, anytime.</p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact-section" id="contact">
        <div className="contact-info">
          <h3>Get in Touch</h3>
          <p>Have a question or need a quote? We are here to help!</p>

          <div className="contact-list">
            <p>📞 +91 7252083527</p>
            <p>✉️ kandpalj57@gmail.com</p>
            <p>📍 Haldwani, Uttarakhand, India</p>
            <p>🕘 Mon - Sat: 8:00 AM - 8:00 PM</p>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>Send Us an Inquiry</h3>

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <div className="form-row">
            <input
              type="text"
              name="pickup"
              placeholder="Pickup Location"
              value={formData.pickup}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="drop"
              placeholder="Drop Location"
              value={formData.drop}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <input
              type="text"
              name="goods"
              placeholder="Type of Goods"
              value={formData.goods}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="weight"
              placeholder="Weight Approx."
              value={formData.weight}
              onChange={handleChange}
            />
          </div>

          <textarea
            name="message"
            placeholder="Additional Message"
            value={formData.message}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="primary-btn">
            Send Inquiry →
          </button>
        </form>
      </section>
    </>
  );

  return (
    <div className="app">
      {renderNavbar()}
      {view === "admin" ? renderAdminPortal() : renderSite()}

      <footer className="footer">
        <div>
          <div className="logo footer-logo">
            <span className="logo-icon">K</span>
            <span>Kandpal</span>
            <small>Transport</small>
          </div>

          <p>
            Delivering trust, on time, every time. Your reliable logistics
            partner across India.
          </p>
        </div>

        <div>
          <h4>Quick Links</h4>
          <p>Home</p>
          <p>Services</p>
          <p>Pricing</p>
          <p>About</p>
        </div>

        <div>
          <h4>Our Services</h4>
          <p>Goods Transport</p>
          <p>Truck Booking</p>
          <p>Route Coverage</p>
          <p>Express Delivery</p>
        </div>

        <div>
          <h4>Contact Info</h4>
          <p>📞 +91 7252083527</p>
          <p>✉️ kandpalj57@gmail.com</p>
          <p>📍 Haldwani, Uttarakhand</p>
        </div>
      </footer>

      <div className="copyright">
        © 2026 Kandpal Transport. All Rights Reserved by Jagdish Kandpal & Jiya Bisht.
      </div>
    </div>
  );
}

export default App;
