-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3316
-- Generation Time: Jan 16, 2025 at 10:42 AM
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
-- Database: `gears_up`
--
DROP DATABASE IF EXISTS `gears_up`;
CREATE DATABASE IF NOT EXISTS `gears_up` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `gears_up`;

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE IF NOT EXISTS `brand` (
  `brandID` int(10) NOT NULL AUTO_INCREMENT,
  `brandName` text NOT NULL,
  `brandImage` text NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`brandID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`brandID`, `brandName`, `brandImage`, `description`) VALUES
(1, 'Mikasa', 'mikasa.png', 'Mikasa is a well-known Japanese brand that specializes in sports equipment, particularly in volleyball, basketball, soccer, and water polo. Founded in 1917, Mikasa has earned a reputation for producing high-quality, durable sports balls and gear used by athletes around the world. The brand is especially recognized for its official volleyballs, which are used in international competitions, including the Olympics and World Championships. Mikasa is committed to innovation and precision, making it a trusted name in sports equipment for both professional and recreational athletes.');

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE IF NOT EXISTS `cart` (
  `cartID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL, -- Updated to reference `UserID` instead of `username`
  `productID` int(11) NOT NULL,
  `productVariantID` int(11) NOT NULL,
  `quantity` int(5) NOT NULL,
  PRIMARY KEY (`cartID`),
  KEY `productVariantID` (`productVariantID`),
  KEY `userID` (`userID`),
  KEY `productID` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE IF NOT EXISTS `category` (
  `categoryID` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `image` text NOT NULL,
  PRIMARY KEY (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`categoryID`, `name`, `description`, `image`) VALUES
(1, 'Team Sport', 'A team sport is a game where players work together in groups to achieve a common goal, such as scoring points or goals. Success depends on teamwork, strategy, and cooperation. Popular examples include soccer, basketball, and volleyball.', 'teamsport.png');

-- --------------------------------------------------------

--
-- Table structure for table `color`
--

CREATE TABLE IF NOT EXISTS `color` (
  `colorID` int(11) NOT NULL AUTO_INCREMENT,
  `colorName` text NOT NULL,
  PRIMARY KEY (`colorID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `color`
--

INSERT INTO `color` (`colorID`, `colorName`) VALUES
(1, 'Blue'),
(2, 'Red'),
(3, 'Yellow'),
(4, 'Black'),
(5, 'White'),
(6, 'Dark Grey');

-- --------------------------------------------------------

--
-- Table structure for table `company`
--

CREATE TABLE IF NOT EXISTS `company` (
  `companyName` varchar(20) NOT NULL,
  `licenseNumber` int(11) NOT NULL,
  `statement` text NOT NULL,
  `companyLogo` text NOT NULL,
  `statementPicture` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `company`
--

INSERT INTO `company` (`companyName`, `licenseNumber`, `statement`, `companyLogo`, `statementPicture`) VALUES
('Gears Up', 12345678, 'We believe everyone wants the best', 'logo.png', 'track.png');

-- --------------------------------------------------------

--
-- Table structure for table `orderlist`
--

CREATE TABLE IF NOT EXISTS `orderlist` (
  `orderItemId` int(11) NOT NULL AUTO_INCREMENT,
  `productID` int(11) NOT NULL,
  `variantID` int(11)  NOT NULL,
  `userID` int(11) NOT NULL,
  `quantity` int(225) NOT NULL,
  `paymentMethod` varchar(45) DEFAULT NULL,
  `updatedDate` date NOT NULL,
  `orderId` varchar(45) DEFAULT NULL,
  `transactionId` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT "Pending",
  PRIMARY KEY (`orderItemId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE IF NOT EXISTS `product` (
  `productID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) NOT NULL,
  `subCategoryID` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `brand` int(10) NOT NULL,
  `image` text NOT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `addedDate` timestamp DEFAULT current_timestamp,
  PRIMARY KEY (`productID`),
  KEY `categoryID` (`categoryID`),
  KEY `brand` (`brand`),
  KEY `subCategory` (`subCategoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`productID`, `categoryID`, `subCategoryID`, `name`, `brand`, `image`, `description`, `price`, `discount`, `addedDate`) VALUES
(1, 1, 2, 'Volleyball V330W', 1, 'mikasaVolleyball.png', 'The Mikasa V330W is a high-performance volleyball designed for professional play. Known for its durability and precision, it features a soft yet resilient surface for optimal grip and control. The V330W is the official ball for various international competitions, offering excellent flight stability and consistent bounce. Its unique 18-panel construction ensures durability and a true flight path, making it a popular choice for both competitive athletes and enthusiasts. The ball is designed to withstand extensive use, providing reliability for training and games.', 50.90, NULL, '2024-12-09');

-- --------------------------------------------------------

--
-- Table structure for table `product_variant`
--

CREATE TABLE IF NOT EXISTS `product_variant` (
  `productVariantID` int(11) NOT NULL AUTO_INCREMENT,
  `productID` int(11) NOT NULL,
  `sizeID` int(11)  NULL,
  `colorID` int(11)  NULL,
  `quantity` int(100) NULL,
  PRIMARY KEY (`productVariantID`),
  KEY `productID` (`productID`),
  KEY `sizeID` (`sizeID`),
  KEY `colorID` (`colorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT INTO product_variant (`productID`, `quantity`) VALUES(1,56);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE IF NOT EXISTS `reviews` (
  `reviewID` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL, -- Updated to reference `UserID` instead of `username`
  `description` text DEFAULT NULL,
  `rating` int(5) NOT NULL,
  `image` text DEFAULT NULL,
  `reviewDate` date NOT NULL,
  `productID` int(11) NOT NULL,
  `variantID` int(11) NOT NULL,
  PRIMARY KEY (`reviewID`),
  KEY `userID` (`userID`),
  KEY `productID` (`productID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;




-- --------------------------------------------------------

--
-- Table structure for table `size`
--

CREATE TABLE IF NOT EXISTS `size` (
  `sizeID` int(11) NOT NULL AUTO_INCREMENT,
  `size` varchar(200) NOT NULL,
  PRIMARY KEY (`sizeID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `size`
--

INSERT INTO `size` (`sizeID`, `size`) VALUES
(1, 'XS'),
(2, 'S'),
(3, 'M'),
(4, 'L'),
(5, 'XL'),
(6, 'XXL');

-- --------------------------------------------------------

--
-- Table structure for table `subcategory`
--

CREATE TABLE IF NOT EXISTS `subcategory` (
  `subCategoryID` int(11) NOT NULL AUTO_INCREMENT,
  `categoryID` int(11) NOT NULL,
  `name` text NOT NULL,
  `Description` text NOT NULL,
  PRIMARY KEY (`subCategoryID`),
  KEY `categoryID` (`categoryID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`subCategoryID`, `categoryID`, `name`, `Description`) VALUES
(1, 1, 'Basketball', 'Basketball is a team sport played between two teams of five players each. The objective is to score points by shooting a ball through the opponent’s hoop, with the team scoring the most points winning the game. It combines skill, strategy, and teamwork.'),
(2, 1, 'Volleyball', 'Volleyball is a team sport played between two teams of six players, separated by a net. The goal is to score points by sending the ball over the net and into the opponent\'s court, using a series of hits. The team that scores the most points wins the match.');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(5000) NOT NULL,
  `phoneNumber` int(11) NOT NULL,
  `fullName` char(100) NOT NULL,
  `image` text NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE (`username`) -- Ensure `username` remains unique
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `username`, `email`, `password`, `phoneNumber`, `fullName`, `image`, `role`) VALUES
(1, 'admin', 'admin@gmail.com', SHA1('admin'), 23031029, 'admin', 'default.png', 'admin'),
(2, 'user', 'user@gmail.com', SHA1('user'), 12345678, 'user', 'default.png', 'user');

-- --------------------------------------------------------

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`UserID`), -- Updated to reference `UserID`
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `cart_ibfk_3` FOREIGN KEY (`productVariantID`) REFERENCES `product_variant` (`productVariantID`);

--
-- Constraints for table `orderlist`
--
ALTER TABLE `orderlist`
  -- Add foreign key constraints
  ADD CONSTRAINT `orderlist_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`UserID`),
  ADD CONSTRAINT `orderlist_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `orderlist_ibfk_3` FOREIGN KEY (`variantID`) REFERENCES `product_variant` (`productVariantID`);


--
-- Constraints for table `payment`
--
--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `product_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`),
  ADD CONSTRAINT `product_ibfk_4` FOREIGN KEY (`brand`) REFERENCES `brand` (`brandID`),
  ADD CONSTRAINT `product_ibfk_5` FOREIGN KEY (`subCategoryID`) REFERENCES `subcategory` (`subCategoryID`);

--
-- Constraints for table `product_variant`
--
ALTER TABLE `product_variant`
  ADD CONSTRAINT `product_variant_ibfk_1` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `product_variant_ibfk_2` FOREIGN KEY (`sizeID`) REFERENCES `size` (`sizeID`),
  ADD CONSTRAINT `product_variant_ibfk_3` FOREIGN KEY (`colorID`) REFERENCES `color` (`colorID`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`UserID`), -- Updated to reference `UserID`
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`productID`) REFERENCES `product` (`productID`),
  ADD CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`variantID`) REFERENCES `product_variant` (`productVariantID`);

--
-- Constraints for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD CONSTRAINT `subcategory_ibfk_1` FOREIGN KEY (`categoryID`) REFERENCES `category` (`categoryID`);

-- Ensure price is DECIMAL in product (if not already)
ALTER TABLE product MODIFY COLUMN price DECIMAL(10, 2) NOT NULL;

-- Add fsoreign key for brand in product
ALTER TABLE product ADD CONSTRAINT product_ibfk_6 FOREIGN KEY (brand) REFERENCES brand(brandID);

-- Add foreign key for productVariantID in cart
ALTER TABLE cart ADD CONSTRAINT cart_ibfk_4 FOREIGN KEY (productVariantID) REFERENCES product_variant(productVariantID);
COMMIT;


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;