const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("Kandpal Transport Backend is running...");
});

app.get("/api/trucks", (req, res) => {
  const trucks = [
    {
      id: 1,
      name: "Mini Truck",
      capacity: "1 Ton",
      pricePerKm: 35,
      bestFor: "Local goods delivery",
      image: "mini-truck.png",
      available: true,
    },
    {
      id: 2,
      name: "Medium Truck",
      capacity: "5 Ton",
      pricePerKm: 50,
      bestFor: "City to city transport",
      image: "medium-truck.png",
      available: true,
    },
    {
      id: 3,
      name: "Heavy Container Truck",
      capacity: "10-20 Ton",
      pricePerKm: 100,
      bestFor: "Long route logistics",
      image: "heavy-truck.png",
      available: true,
    },
  ];

  res.status(200).json({
    success: true,
    count: trucks.length,
    data: trucks,
  });
});

app.post("/api/inquiries", (req, res) => {
  const { name, phone, email, pickup, drop, goods, weight, message } = req.body;

  if (!name || !phone || !email || !pickup || !drop || !goods) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  const inquiry = {
    id: Date.now(),
    name,
    phone,
    email,
    pickup,
    drop,
    goods,
    weight,
    message,
    createdAt: new Date().toISOString(),
  };

  console.log("New Inquiry:", inquiry);

  res.status(201).json({
    success: true,
    message: "Inquiry submitted successfully.",
    data: inquiry,
  });
});

app.post("/api/bookings", (req, res) => {
  const { name, phone, pickup, drop, truckType, goods, weight } = req.body;

  if (!name || !phone || !pickup || !drop || !truckType || !goods) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  const trackingId = "KT" + Date.now();

  const booking = {
    trackingId,
    name,
    phone,
    pickup,
    drop,
    truckType,
    goods,
    weight,
    status: "Booked",
    currentLocation: pickup,
    estimatedDelivery: "To be updated",
    driverName: "To be assigned",
    truckNumber: "To be assigned",
    createdAt: new Date().toISOString(),
  };

  console.log("New Booking:", booking);

  res.status(201).json({
    success: true,
    message: "Booking created successfully.",
    data: booking,
  });
});

app.get("/api/track/:trackingId", (req, res) => {
  const { trackingId } = req.params;

  const trackingSteps = [
    "Booked",
    "Pickup Done",
    "In Transit",
    "Near Destination",
    "Delivered",
  ];

  const trackingRecords = {
    KT1001: {
      trackingId: "KT1001",
      status: "Booked",
      currentLocation: "Haldwani Transport Office",
      estimatedDelivery: "Pickup scheduled today",
      driverName: "Mohan Singh",
      truckNumber: "UK04KT1001",
      steps: trackingSteps,
    },

    KT1002: {
      trackingId: "KT1002",
      status: "Pickup Done",
      currentLocation: "Rudrapur Warehouse",
      estimatedDelivery: "8 hours",
      driverName: "Deepak Rawat",
      truckNumber: "UK06KT2045",
      steps: trackingSteps,
    },

    KT1003: {
      trackingId: "KT1003",
      status: "In Transit",
      currentLocation: "Delhi Bypass",
      estimatedDelivery: "4 hours",
      driverName: "Harish Bisht",
      truckNumber: "UK07KT3021",
      steps: trackingSteps,
    },

    KT1004: {
      trackingId: "KT1004",
      status: "Near Destination",
      currentLocation: "Rudrapur delivery hub",
      estimatedDelivery: "45 minutes",
      driverName: "Manoj Kandpal",
      truckNumber: "UK04KT7788",
      steps: trackingSteps,
    },

    KT1005: {
      trackingId: "KT1005",
      status: "Delivered",
      currentLocation: "Gurugram Delivery Hub",
      estimatedDelivery: "Delivered successfully",
      driverName: "Vikram Negi",
      truckNumber: "UK08KT9090",
      steps: trackingSteps,
    },
  };

  const trackingData = trackingRecords[trackingId.toUpperCase()];

  if (!trackingData) {
    return res.status(404).json({
      success: false,
      message:
        "Tracking details not found. Try demo IDs: KT1001, KT1002, KT1003, KT1004, KT1005",
    });
  }

  res.status(200).json({
    success: true,
    data: trackingData,
  });
});

// Serve React frontend build from Docker public folder
app.use(express.static(path.join(__dirname, "public")));

// React fallback route - Express v5 safe
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});