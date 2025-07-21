CREATE TABLE IF NOT EXISTS configuration (
    id INT AUTO_INCREMENT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    tag VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    mail VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    adress VARCHAR(255),
    birthday DATE,
    picture_profil BLOB,
    pseudo VARCHAR(100) NOT NULL UNIQUE,
    role ENUM('visitor', 'user', 'employee', 'administrator') DEFAULT 'user',
    userType ENUM('passenger', 'driver', 'both'),
    credits INT DEFAULT 20,
    preferences JSON,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cars (
    id CHAR(36) PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    licensePlate VARCHAR(20) NOT NULL UNIQUE,
    capacity INT NOT NULL,
    fuelType ENUM('gasoline', 'diesel', 'electric', 'hybrid', 'hydrogen') DEFAULT 'gasoline',
    status ENUM('available', 'in_use', 'maintenance', 'inactive') DEFAULT 'available',
    latitude DECIMAL(10,7),
    longitude DECIMAL(10,7),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    energy ENUM('Electric', 'Hybrid', 'Gasoline', 'Diesel') DEFAULT 'Gasoline',
    color VARCHAR(50) NOT NULL,
    brandId INT,
    CONSTRAINT fk_cars_brand FOREIGN KEY (brandId) REFERENCES brands(id)
);

CREATE TABLE IF NOT EXISTS codriving (
    id INT AUTO_INCREMENT PRIMARY KEY,
    departureDate DATE NOT NULL,
    departureHour TIME NOT NULL,
    departureLocation VARCHAR(100) NOT NULL,
    departureCity VARCHAR(50) NOT NULL,
    arrivalDate DATE NOT NULL,
    arrivalHour TIME NOT NULL,
    arrivalLocation VARCHAR(100) NOT NULL,
    arrivalCity VARCHAR(50) NOT NULL,
    status ENUM('available', 'full', 'started', 'completed', 'cancelled') DEFAULT 'available',
    seatsAvailable INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    durationMinutes INT,
    driverId INT NOT NULL,
    carId CHAR(36),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_codriving_driver FOREIGN KEY (driverId) REFERENCES users(id),
    CONSTRAINT fk_codriving_car FOREIGN KEY (carId) REFERENCES cars(id)
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    passengerId INT NOT NULL,
    codrivingId INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    creditsUsed INT NOT NULL,
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_passenger FOREIGN KEY (passengerId) REFERENCES users(id),
    CONSTRAINT fk_booking_codriving FOREIGN KEY (codrivingId) REFERENCES codriving(id)
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    commentary VARCHAR(50) NOT NULL,
    rate VARCHAR(50) NOT NULL,
    status ENUM('draft', 'published', 'rejected') NOT NULL
);

CREATE TABLE IF NOT EXISTS parameters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    property VARCHAR(50) NOT NULL,
    value VARCHAR(50) NOT NULL
);