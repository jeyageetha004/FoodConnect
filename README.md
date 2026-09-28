# FoodConnect

FoodConnect is a web-based food donation and request platform designed to reduce food waste and help people in need by connecting donors, verified NGOs/trusts, and receivers in one simple digital experience.

The application allows people with extra food to donate it, helps receivers request food through verified organizations, and offers an admin dashboard to review and approve trust/NGO applications and food requests.

---

## Overview

FoodConnect focuses on a practical and social mission:

- Reduce food wastage by redirecting surplus food to those who need it
- Support local communities through direct food sharing
- Provide verification through trusted NGOs and charitable organizations
- Create a transparent tracking system for donation and delivery status
- Keep the system simple, lightweight, and easy to run locally

This project is built as a frontend-only demo application using HTML, CSS, and JavaScript, with data stored in the browser using localStorage.

---

## Existing Features

### 1. Landing Page / Homepage
- Attractive landing page with a hero section and call-to-action buttons
- Sections for About Us, Donate, Request, and My Donations/My Requests
- Responsive navigation and modern UI styling

### 2. Food Donation System
- Donors can submit their name, food item, quantity, location, and contact number
- Food donations are saved locally in the browser
- Donated items appear in the available food list
- Donation form includes validation for quantity and phone number

### 3. Food Search and Availability
- Users can search available food by item name
- Available quantity is displayed dynamically
- Food cards show donor details and location

### 4. Food Request System
- Receivers can request food from available donation entries
- Validation ensures the requested quantity is valid and within available stock
- Request submission includes receiver details and a selected verified trust/NGO
- Each request is linked to the selected trust/NGO for accountability

### 5. Delivery Status Tracking
- Donor can update the progress of a request through different stages:
  - Request Received
  - Request Accepted
  - Food Packing
  - Out for Delivery
  - Delivered
- Both donor and receiver dashboards reflect the current status

### 6. Donor Dashboard
- Donors can view all of their donated food items
- Each donation card shows the number of requests received
- Delivery status buttons allow donation status updates

### 7. Receiver Dashboard
- Receivers can search their requests by name
- They can track the request status and see donor and trust details
- They can see remaining food quantity and trust information

### 8. Trust / NGO Registration
- Trusts and NGOs can register with their name, registration number, type, address, contact person, phone number, email, and service area
- They must upload required supporting documents:
  - Registration Certificate
  - Trust / NGO ID Proof
  - Address Proof
- All uploaded documents are stored as Base64 data in localStorage

### 9. Admin Dashboard
- Admin login is available through a demo login page
- Admin can review NGO/trust applications
- Admin can approve or reject trust/NGO registrations
- Admin can review incoming food requests and accept or reject them
- Summary cards show donations, requests, and NGO applications

### 10. Demo Authentication
- Built-in demo credentials:
  - Admin: admin / admin123
  - User: user / user123

---

## Tech Stack

This project uses a lightweight frontend stack:

- HTML5 for structure and UI layout
- CSS3 for styling and responsive design
- JavaScript for logic, form handling, DOM updates, and local data processing
- localStorage for data persistence
- Python HTTP server for local project execution during development

---

## Project Structure

```text
food donate/
├── admin.css
├── admin.html
├── admin.js
├── index.html
├── login.css
├── login.html
├── login.js
├── script.js
├── style.css
├── README.md
└── assets/ (if added later)
```

### File Breakdown

- `index.html`  
  Main landing page and user-facing donation/request workflow

- `script.js`  
  Contains the main app logic: donation flow, request management, dashboard logic, trust registration, and status tracking

- `login.html`  
  Login page for admin/user access

- `login.js`  
  Handles login validation and route redirect logic

- `admin.html`  
  Admin dashboard interface

- `admin.js`  
  Manages admin verification, approvals, rejections, and food request review

- `style.css`  
  Main styling for the public website

- `login.css`  
  Styling for the login page

- `admin.css`  
  Styling for the admin dashboard

---

## Project Architecture

The architecture is intentionally simple because the project is a frontend demo and not yet backed by a database or server API.

### Frontend Layer
- Public website pages render the donation and request experience
- Login and admin screens handle the role-based sections of the platform

### Client-Side Logic Layer
- JavaScript manages all major workflows such as:
  - donation submission
  - request handling
  - status updates
  - trust approvals
  - admin actions

### Data Layer
- Data is stored in browser localStorage under keys such as:
  - `foodConnectFoods`
  - `foodConnectTrusts`
  - `foodConnectRole`
- This makes the app easy to demo and test without a backend

### User Role Flow

```text
User / Donor
   ↓
Donate Food
   ↓
Food appears in Available Food
   ↓
Receiver Requests Food
   ↓
Trust / NGO selected
   ↓
Request tracked with status updates

Admin
   ↓
Login
   ↓
Review NGOs / Trusts
   ↓
Approve or reject registrations
   ↓
Review and accept/reject food requests
```

---

## How to Run the Project

### Option 1: Using Python HTTP Server

1. Open a terminal in the project folder
2. Run:

```bash
python -m http.server 8000
```

3. Open this URL in the browser:

```text
http://localhost:8000/
```

### Demo Login

- Admin: `admin` / `admin123`
- User: `user` / `user123`

---

## Use Cases

This project is suitable for:

- Startup demos for social impact products
- College or university project work
- Hackathons focused on food waste reduction
- Prototype development for community food distribution systems

---

## Project Highlights

- Easy-to-understand social impact concept
- Simple and clean interface
- Role-based access for admin and user flows
- Donation and request lifecycle tracking
- NGO trust verification workflow
- Lightweight implementation without external dependencies

---

## Limitations of the Current Version

Since this is a frontend demo, some limitations exist:

- No real backend database
- No secure authentication or session management
- No API integration
- No production-grade data validation
- No email/SMS notification system
- No maps or GPS-based matching
- No cloud storage for uploaded documents

---

## Features That Can Be Added in Upcoming Days

Here are strong features to add to make the project more complete and production-ready:

### 1. Real Backend and Database
- Use Firebase, MongoDB, PostgreSQL, or Supabase
- Store users, donations, requests, and trust applications in a proper database

### 2. Authentication and Authorization
- Add signup/login with secure password hashing
- Use JWT or session-based authentication
- Separate roles for donor, receiver, admin, and NGO

### 3. Real-Time Notifications
- Email and SMS alerts for donation updates
- Push notifications for request approval or delivery status

### 4. Map Integration
- Use Google Maps or Leaflet to show donation locations and nearby food points
- Add nearest donor/receiver matching

### 5. Dashboard Analytics
- Total meals donated
- Active requests count
- Most demanded food categories
- Monthly impact statistics

### 6. Image Upload Improvements
- Store uploaded documents in cloud object storage
- Add file validation and size limits

### 7. Payment / Delivery Support Integration
- Add logistics options for pickup/delivery coordination
- Include partner delivery tracking

### 8. Mobile-Friendly Enhanced Experience
- Convert into a PWA and mobile-first experience
- Improve responsiveness across devices

### 9. Search and Filter Enhancements
- Filter by location, category, food type, and quantity
- Advanced donor/receiver matching algorithms

### 10. Community and Admin Features
- Complaint management system
- Reporting and moderation tools
- Audit logs for all donations and requests

---

## Future Roadmap

### Phase 1: MVP Improvements
- Add backend and database
- Secure login system
- Improve validation and error handling
- Upgrade admin dashboard

### Phase 2: Community Intelligence
- Add maps, notifications, and analytics
- Improve search/filtering and matching
- Add trust verification history

### Phase 3: Production Scale
- Add cloud hosting and deployment
- Include security hardening
- Launch mobile and web versions
- Build partnership workflows with NGOs and local agencies

---

## Conclusion

FoodConnect is a practical and meaningful web application designed to address food waste and hunger through digital community support. It demonstrates an end-to-end donation/request workflow with trust-based verification and admin oversight.

Although the current version is a frontend prototype, it lays a strong foundation for a scalable real-world platform in the future.

---

## License

This project is currently distributed for educational and demo purposes. If you plan to use it commercially or in production, it is recommended to add a proper project license and update the codebase for security and deployment readiness.

---

## Author / Project Context

This project is a front-end demo for a food donation and food request management system with the goal of helping communities reduce waste while supporting families and individuals in need.
