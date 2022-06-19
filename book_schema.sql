SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `book_a_book`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_book`
--

CREATE TABLE `tb_book` (
  `id` int(11) NOT NULL,
  `isbn` varchar(13) DEFAULT NULL,
  `name` varchar(128) NOT NULL,
  `description` text,
  `price` decimal(8,2) NOT NULL,
  `rating_value` decimal(3,2) NOT NULL DEFAULT '0.00',
  `total_rating` int(11) NOT NULL DEFAULT '0',
  `discount_percent` int(11) NOT NULL DEFAULT '0',
  `user_id` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_bookrating`
--

CREATE TABLE `tb_bookrating` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `rating_score` tinyint(4) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_cart`
--

CREATE TABLE `tb_cart` (
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_order`
--

CREATE TABLE `tb_order` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `order_status` enum('pending_payment','wait_payment_confirm','payment_confirmed','packing','ready_to_ship','shiped') NOT NULL DEFAULT 'pending_payment',
  `book_quantity` int(11) NOT NULL,
  `total_book_price` decimal(8,2) NOT NULL,
  `total_shipping_price` decimal(8,2) NOT NULL,
  `total_grand_price` decimal(8,2) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `payment_name` varchar(64) NOT NULL,
  `payment_status` tinyint(1) NOT NULL DEFAULT '0',
  `payment_amount` decimal(8,2) DEFAULT NULL,
  `payment_datetime` datetime DEFAULT NULL,
  `shipping_id` int(11) NOT NULL,
  `shipping_price_per_piece` decimal(8,2) NOT NULL,
  `shipping_status` tinyint(1) NOT NULL DEFAULT '0',
  `shipping_tracking_info` text,
  `shipping_name` varchar(64) NOT NULL,
  `address_id` int(11) NOT NULL,
  `address_1` mediumtext NOT NULL,
  `address_2` mediumtext NOT NULL,
  `address_sub_district` mediumtext NOT NULL,
  `address_district` mediumtext NOT NULL,
  `address_province` mediumtext NOT NULL,
  `address_postel_code` varchar(10) NOT NULL,
  `address_country` varchar(2) NOT NULL,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) NOT NULL,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_order_detail`
--

CREATE TABLE `tb_order_detail` (
  `order_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `book_isbn` varchar(13) DEFAULT NULL,
  `book_name` varchar(256) NOT NULL,
  `book_price` decimal(8,2) NOT NULL,
  `book_discount_percent` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `shipping_price_per_piece` decimal(8,2) NOT NULL,
  `total_book_price` decimal(8,2) NOT NULL,
  `total_shipping_price` decimal(8,2) NOT NULL,
  `total_grand_price` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_payment`
--

CREATE TABLE `tb_payment` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `type` enum('bank_transfer','api') NOT NULL,
  `account_number` varchar(20) DEFAULT NULL,
  `account_name` varchar(128) NOT NULL,
  `account_bank` varchar(20) NOT NULL,
  `image_url` varchar(256) DEFAULT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_payment`
--

INSERT INTO `tb_payment` (`id`, `name`, `type`, `account_number`, `account_name`, `account_bank`, `image_url`, `is_default`) VALUES
(1, 'KBank', 'bank_transfer', '0009999999', 'DEMOT TEST', 'KBank', NULL, 1),
(2, 'Credit Card', 'api', '0', '0', 'omise', NULL, 0),
(5, 'SCB', 'bank_transfer', '1119999999', 'DEMOT TEST', 'SCB', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_shipping`
--

CREATE TABLE `tb_shipping` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `price_per_piece` decimal(8,2) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_shipping`
--

INSERT INTO `tb_shipping` (`id`, `name`, `price_per_piece`, `is_default`) VALUES
(1, 'Thailandpost', '40.00', 1),
(2, 'Kerry', '20.00', 0);

-- --------------------------------------------------------

--
-- Table structure for table `tb_user`
--

CREATE TABLE `tb_user` (
  `id` int(11) NOT NULL,
  `email` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  `session_key` varchar(32) DEFAULT NULL,
  `first_name` varchar(256) NOT NULL,
  `last_name` varchar(256) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_user_address`
--

CREATE TABLE `tb_user_address` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `address_1` text NOT NULL,
  `address_2` text,
  `address_sub_district` mediumtext NOT NULL,
  `address_district` mediumtext NOT NULL,
  `address_province` mediumtext NOT NULL,
  `address_postel_code` varchar(10) NOT NULL,
  `address_country` varchar(2) NOT NULL DEFAULT 'TH',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_book`
--
ALTER TABLE `tb_book`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `isbn` (`isbn`),
  ADD KEY `user_has_book` (`user_id`);

--
-- Indexes for table `tb_bookrating`
--
ALTER TABLE `tb_bookrating`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `rating_has_book` (`book_id`);

--
-- Indexes for table `tb_cart`
--
ALTER TABLE `tb_cart`
  ADD PRIMARY KEY (`book_id`,`user_id`),
  ADD KEY `cart_has_user` (`user_id`);

--
-- Indexes for table `tb_order`
--
ALTER TABLE `tb_order`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_has_user` (`user_id`),
  ADD KEY `order_has_address` (`address_id`),
  ADD KEY `order_has_shipping` (`shipping_id`),
  ADD KEY `order_has_payment` (`payment_id`);

--
-- Indexes for table `tb_order_detail`
--
ALTER TABLE `tb_order_detail`
  ADD PRIMARY KEY (`order_id`,`book_id`),
  ADD KEY `detail_has_book` (`book_id`);

--
-- Indexes for table `tb_payment`
--
ALTER TABLE `tb_payment`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_shipping`
--
ALTER TABLE `tb_shipping`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tb_user`
--
ALTER TABLE `tb_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `tb_user_address`
--
ALTER TABLE `tb_user_address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_book`
--
ALTER TABLE `tb_book`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_order`
--
ALTER TABLE `tb_order`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_payment`
--
ALTER TABLE `tb_payment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tb_shipping`
--
ALTER TABLE `tb_shipping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tb_user`
--
ALTER TABLE `tb_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tb_user_address`
--
ALTER TABLE `tb_user_address`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_book`
--
ALTER TABLE `tb_book`
  ADD CONSTRAINT `user_has_book` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`);

--
-- Constraints for table `tb_bookrating`
--
ALTER TABLE `tb_bookrating`
  ADD CONSTRAINT `rating_has_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`),
  ADD CONSTRAINT `rating_has_book` FOREIGN KEY (`book_id`) REFERENCES `tb_book` (`id`);

--
-- Constraints for table `tb_cart`
--
ALTER TABLE `tb_cart`
  ADD CONSTRAINT `cart_has_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`),
  ADD CONSTRAINT `cart_has_book` FOREIGN KEY (`book_id`) REFERENCES `tb_book` (`id`);

--
-- Constraints for table `tb_order`
--
ALTER TABLE `tb_order`
  ADD CONSTRAINT `order_has_address` FOREIGN KEY (`address_id`) REFERENCES `tb_user_address` (`id`),
  ADD CONSTRAINT `order_has_payment` FOREIGN KEY (`payment_id`) REFERENCES `tb_payment` (`id`),
  ADD CONSTRAINT `order_has_shipping` FOREIGN KEY (`shipping_id`) REFERENCES `tb_shipping` (`id`),
  ADD CONSTRAINT `order_has_user` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`);

--
-- Constraints for table `tb_order_detail`
--
ALTER TABLE `tb_order_detail`
  ADD CONSTRAINT `detail_has_book` FOREIGN KEY (`book_id`) REFERENCES `tb_book` (`id`),
  ADD CONSTRAINT `detail_has_order` FOREIGN KEY (`order_id`) REFERENCES `tb_order` (`id`);

--
-- Constraints for table `tb_user_address`
--
ALTER TABLE `tb_user_address`
  ADD CONSTRAINT `user_has_address` FOREIGN KEY (`user_id`) REFERENCES `tb_user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
