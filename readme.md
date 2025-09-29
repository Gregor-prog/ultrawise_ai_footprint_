# 🌊 Ultrawise: AI-Powered Water Optimization for Data Centers

**Live Site:** [https://ultrawise-sandy.vercel.app](https://ultrawise-sandy.vercel.app)

Ultrawise is an intelligent water management and anomaly detection platform for data centers. It integrates IoT sensors, AI-powered analytics, and dashboards to optimize water usage, detect anomalies, and provide actionable insights.

---

## Overview

Ultrawise connects real-world water consumption data to advanced AI for continuous efficiency improvements.

* **Data Acquisition:** IoT system using a Raspberry Pi Pico W + HC-SR04 ultrasonic sensor.
* **Data Transmission:** Real-time data is sent securely to an MQTT broker (HiveMQ Cloud).
* **Persistence:** A Node.js server subscribes to MQTT and uses an hourly cron job to store data in MongoDB.
* **AI Analysis:** Gemini API (via Genkit) analyzes the stored data to identify patterns and flag irregularities.
* **Visualization:** The Next.js dashboard provides real-time visualization of consumption, flow rate, and actionable AI results.

---

## Tech Stack

* **Frontend:** Next.js, ReactJS
* **AI/LLM:** Gemini API (via Genkit)
* **Backend:** Node.js, Express.js (TypeScript)
* **Database:** MongoDB
* **IoT Communication:** MQTT (HiveMQ Cloud)
* **Hardware:** Raspberry Pi Pico W + HC-SR04 Ultrasonic Sensor

---

## Key Features

The platform is divided into three core AI-driven pages:

### 1. Dashboard (Real-Time Monitoring)

* **Metrics:** Displays water level (%), average flow rate (L/hour), and 24-hour consumption.
* **Visualization:** Chart for daily water consumption patterns.

### 2. Anomaly Detection

* **Analysis:** AI scans daily readings for unusual spikes or drops in consumption.
* **Actionable Insights:** Provides countermeasures and recommendations to prevent future anomalies.

### 3. Optimization Recommendations

* **Data Mining:** AI reads the historical sensor data from MongoDB.
* **Efficiency Suggestions:** Generates specific, detailed recommendations to optimize data center cooling operations, leading to cost and water savings.

---

##  Sensor Setup (MicroPython - Pico W)

The sensor prototype runs MicroPython to measure water distance and publish data every 5 seconds.

**Hardware:** Raspberry Pi Pico W, HC-SR04 sensor.

**Calculation:** Distance is measured using the pulse duration:

```math
Distance (cm) = [Duration (μs)] / [2 × 29.1]
```

**Published Data Format (to `data_center/sensor/001`):**

```json
{
  "sensor_id": "001",
  "distance": 35.72,
  "timestamp": 1695912345
}
```

---

## Local Development Setup

### A. Backend (Node.js API)

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `cd backend`        | Navigate to the backend directory. |
| `npm install`       | Install all dependencies.          |
| `nodemon server.ts` | Run the API server locally.        |

(Ensure your `GEMINI_API_KEY`, MongoDB, and MQTT environment variables are set.)

### B. Frontend (Next.js Dashboard)

| Command       | Description                         |
| ------------- | ----------------------------------- |
| `npm install` | Install all dependencies.           |
| `npm run dev` | Run the Next.js development server. |

Access the dashboard in your browser: **`localhost:9002`**

(Note: Default Next.js runs on port 3000, so 9002 suggests a custom setup.)

---

## MicroPython Documentation for Pico W x SR04

### 1. Code Overview

This project demonstrates how to interface an HC-SR04 ultrasonic distance sensor with a Raspberry Pi Pico (MicroPython) and publish the measured data to a HiveMQ MQTT broker over Wi-Fi. It enables real-time monitoring of distance measurements through MQTT for the Ultrawise prototype.

### 2. Hardware Requirements

* Raspberry Pi Pico W
* HC-SR04 ultrasonic sensor
* Power supply (USB or battery pack)

### 3. Software Requirements

* MicroPython firmware installed on Raspberry Pi Pico
* MQTT broker (HiveMQ Cloud)

### 4. Setup & Installation

* Flash MicroPython on your Raspberry Pi Pico.
* Install Thonny IDE or another MicroPython IDE.
* Change Wi-Fi SSID and Password to your own in the script.
* Upload the script to your Pico W as `main.py`.

### 5. How the Code Works

1. **Connect to Wi-Fi**
   `connect_wifi()` activates the Wi-Fi interface and connects the Pico to your network.

2. **Measure Distance**
   `measure_distance()` sends a trigger pulse, waits for the echo, and calculates distance using the speed of sound (0.0343 cm/μs).
   Formula:

   ```math
   Distance (cm) = [Duration (μs)] / [2 × 29.1]
   ```

3. **Connect to MQTT Broker**
   `connect_mqtt()` establishes a connection with the HiveMQ broker using the provided credentials.

4. **Main Loop**
   `main()` function:

   * Connects to Wi-Fi and MQTT broker.
   * Reads distance values from the sensor.
   * Packages the data as JSON (with sensor_id, distance, and timestamp).
   * Publishes data to the MQTT topic `data_center/sensor/001` every 5 seconds.

### 6. Published Data Format

```json
{
  "sensor_id": "001",
  "distance": 35.72,
  "timestamp": 1695912345
}
```

---

