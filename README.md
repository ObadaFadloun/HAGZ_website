# HAGZ Website – Football Field Booking Platform

HAGZ is a full-stack booking platform built with **Node.js (backend)** and **React + Tailwind (frontend)** that allows players to easily book football fields, owners to manage their facilities, and admins to oversee the entire system.

---

## 🚀 Features

### **Player**

* Search for football fields
* Book fields with live availability
* View and cancel reservations
* Rate & comment on fields
* Use promo codes
* Receive notifications
* Rent equipment
* View field benefits (bathrooms, night lights...)
* Find teams
* View weather info
* Book birthday packages

### **Owner**

* Manage football field details
* Set pricing, slots, promotions
* Full reservation management
* Loyalty programs

### **Admin**

* Add, edit, and manage football fields
* View & delete reservations
* Owner approval flows

---

## 🏗️ Tech Stack

### **Backend (Node.js + Express)**

* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Multer (file upload)
* Cron Jobs
* Nodemailer (emails)
* Custom error handling middleware

### **Frontend (React)**

* React + Vite
* Tailwind CSS
* Framer Motion
* Axios

### **Other Tools**

* Git & GitHub

---

## 📂 Project Structure

### **Backend** (`/backend`)

```
backend/
  controllers/
    adminController.js
    authController.js
    errorController.js
    favoriteController.js
    footballFieldController.js
    ownerController.js
    ownerRequestController.js
    reservationController.js
    reviewController.js
    userController.js

  cronJobs/
    deleteOldUsers.js

  img/
  middleware/
    upload.js

  models/
    footballFieldModel.js
    ownerRequestModel.js
    reservationModel.js
    reviewModel.js
    userModel.js

  public/img/

  routes/
    adminRoutes.js
    authRoutes.js
    footballFieldRoutes.js
    ownerRequestRoutes.js
    ownerRoutes.js
    reservationRoutes.js
    reviewRoutes.js
    userRoutes.js
    weatherRoute.js

  utils/
    appError.js
    autoCompleteReservation.js
    catchAsync.js
    email.js
```

### **Frontend** (`/frontend`)

```
frontend/
  public/
    vite.svg

  src/
    assets/
      backgroundImages/
        background1.jpg
        background2.jpg
        background3.jpg
      Animation.json
      empty.json
      EmptyState.json
      loading.json
      player.json
      profile-img.png
      react.svg
      soccer.json

    components/
      AlertModal.jsx
      AnimatedText.jsx
      Button.jsx
      Card.jsx
      EmptyScreen.jsx
      Footer.jsx
      Modal.jsx
      Navbar.jsx
      Pagination.jsx
      ScrollToTop.jsx
      Sidebar.jsx
      Typewriter.jsx

    hooks/
      useWeather.js

    pages/
      Booking/
        components/
          AboutSection.jsx
          CoverSection.jsx
          DateSelector.jsx
          EditReservationModal.jsx
          FacilitiesCard.jsx
          MapSection.jsx
          ReservationCard.jsx
          ReservationsTable.jsx
          ReviewsSection.jsx
          SlotsList.jsx
          VideoReviewSection.jsx
          WeatherCard.jsx

      FootballFields/
      settings/
        BecomeOwnerSection.jsx
        ChangePasswordSection.jsx
        DeleteAccountSection.jsx
        EditProfileSection.jsx
        UploadProfileSection.jsx

      About.jsx
      AdminDashboard.jsx
      AdminUsers.jsx
      AuthForm.jsx
      BookingPage.jsx
      Contact.jsx
      FavoritesPage.jsx
      Homepage.jsx
      Offers.jsx
      OwnerDashboard.jsx
      OwnerRequests.jsx
      ....

    utils/
      slotUtils.js
```

/hagz-backend
├── apps
├── core
├── reservations
├── football_fields
├── reviews
└── users

/hagz-frontend
├── src
├── components
├── pages
├── hooks
└── utils


## 📌 Final Project Plan

### 🎯 Core User Roles

* **Admin**
* **Owner** (approved by admin)
* **Player** (default)

### 👤 User Model – Fields

* First name, last name
* Email, hashed password
* Role (admin, owner, player)
* Profile picture
* Status (active, blocked, warned)
* Loyalty points
* Created at, updated at

### 🏟️ Football Field Model – Fields

**Basic Info:** name, type, description, location, address, city, coordinates

**Pricing:** price per hour, currency, discounts

**Owner/Admin:** ownerId, approval status

**Facilities:** bathrooms, changing rooms, night lights, parking, cafeteria partnerships, equipment rentals

**Media:** images, video

**Availability:** open/close time, closed days

**Reviews:** average rating, total reviews, comments, top comments

**Extras:** weather integration, tags, capacity

**System:** createdAt, updatedAt

### 📅 Reservation Model – Fields

* Reservation ID
* User ID
* Field ID
* Date, start time, end time
* Status (active, copmleted, cancelled)
* Price
* Created at, updated at

### ⚡ Features by Role

**Admin:** approve owners, block users, manage fields, reservations, reviews, dashboard

**Owner:** manage fields, reservations, offers, dashboard, reviews

**Player:** search, filter, book, cancel, reviews, likes, teams, promo codes, notifications, dark mode, birthday packages, loyalty points

### 🛠️ System Features

* JWT authentication
* Pagination
* Notifications (email + in-app)
* Online payments
* Weather API
* Offers, red alert system
* B2B partnerships

### 🗂️ Development Phases

**Phase 1:** user system, field CRUD, reservations

**Phase 2:** search, filters, pagination, reviews, owner dashboard
