-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 15, 2026 at 06:54 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `config_form`
--

-- --------------------------------------------------------

--
-- Table structure for table `form`
--

CREATE TABLE `form` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `form_created` int(11) NOT NULL COMMENT 'notfiledcreated - 0,\r\nfiledcreated - 1,\r\n\r\n '
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form`
--

INSERT INTO `form` (`id`, `name`, `form_created`) VALUES
(6, 'Student-form', 1);

-- --------------------------------------------------------

--
-- Table structure for table `form_data`
--

CREATE TABLE `form_data` (
  `id` bigint(20) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `form_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_data`
--

INSERT INTO `form_data` (`id`, `data`, `form_id`) VALUES
(4, '{\"first name\":\"Archana\",\"last name\":\"K\",\"phone number\":\"8438880419\",\"email address\":\"archana2104aa@gmail.com\"}', 6),
(6, '{\"first name\":\"Ganesh\",\"last name\":\"M\",\"phone number\":\"7845784512\",\"email address\":\"archana2104aa1@gmail.com\",\"date of birth\":\"2026-03-14\",\"address\":\"cuddalore -1\"}', 6);

-- --------------------------------------------------------

--
-- Table structure for table `form_field`
--

CREATE TABLE `form_field` (
  `id` bigint(20) NOT NULL,
  `field_type` varchar(255) DEFAULT NULL,
  `form_id` bigint(20) DEFAULT NULL,
  `label` varchar(255) DEFAULT NULL,
  `required` tinyint(1) NOT NULL,
  `field_key` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `form_field`
--

INSERT INTO `form_field` (`id`, `field_type`, `form_id`, `label`, `required`, `field_key`) VALUES
(12, 'text', 6, 'First Name', 1, 'first name'),
(13, 'text', 6, 'Last Name', 1, 'last name'),
(14, 'number', 6, 'Phone Number', 1, 'phone number'),
(15, 'email', 6, 'Email Address', 1, 'email address'),
(16, 'date', 6, 'Date of Birth', 1, 'date of birth'),
(17, 'text', 6, 'Address', 1, 'address');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `form`
--
ALTER TABLE `form`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_data`
--
ALTER TABLE `form_data`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `form_field`
--
ALTER TABLE `form_field`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `form`
--
ALTER TABLE `form`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `form_data`
--
ALTER TABLE `form_data`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `form_field`
--
ALTER TABLE `form_field`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
