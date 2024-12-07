-- MySQL dump 10.13  Distrib 8.4.1, for Win64 (x86_64)
--
-- Host: localhost    Database: DeviceMateDB
-- ------------------------------------------------------
-- Server version	8.4.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `client_id` int NOT NULL AUTO_INCREMENT,
  `client_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`client_id`),
  KEY `client_user_id` (`user_id`),
  CONSTRAINT `client_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (22,'Yaser Mansoor','2024-08-26 08:50:07',11),(23,'Sara Asad','2024-08-26 08:50:07',13),(24,'Kareem Ali','2024-08-26 08:50:07',14),(75,'Ahmad Kurman','2024-09-08 10:50:07',14),(92,'yazeed khuja','2024-10-11 16:29:49',24);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conversations`
--

DROP TABLE IF EXISTS `conversations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conversations` (
  `conversation_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `user_id` int NOT NULL,
  `started_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`conversation_id`),
  KEY `conversations_ibfk_2` (`user_id`),
  KEY `conversations_ibfk_1` (`client_id`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conversations`
--

LOCK TABLES `conversations` WRITE;
/*!40000 ALTER TABLE `conversations` DISABLE KEYS */;
INSERT INTO `conversations` VALUES (7,22,11,'2023-08-25 06:00:00'),(9,24,14,'2023-08-25 08:45:00'),(10,75,14,'2024-09-14 11:19:51'),(13,92,24,'2024-10-11 16:32:02');
/*!40000 ALTER TABLE `conversations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `device_info`
--

DROP TABLE IF EXISTS `device_info`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `device_info` (
  `device_id` int NOT NULL AUTO_INCREMENT,
  `device_type` varchar(50) NOT NULL,
  `platform` varchar(50) NOT NULL,
  `operating_system` varchar(100) NOT NULL,
  `network_type` varchar(20) NOT NULL,
  `client_id` int DEFAULT NULL,
  PRIMARY KEY (`device_id`),
  KEY `client_id` (`client_id`),
  CONSTRAINT `device_info_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `device_info`
--

LOCK TABLES `device_info` WRITE;
/*!40000 ALTER TABLE `device_info` DISABLE KEYS */;
INSERT INTO `device_info` VALUES (1,'Laptop','Windows','Windows NT 10.0','3g',22),(2,'Laptop','Windows','Windows NT 10.0','3g',23),(3,'Mobile','Andriod','Andriod A 13.0','3g',24),(4,'Desktop','Windows','Windows NT 10.0','4g',75),(18,'Desktop','Windows','Windows NT 10.0','2g',92);
/*!40000 ALTER TABLE `device_info` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_transfers`
--

DROP TABLE IF EXISTS `file_transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_transfers` (
  `transfer_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int NOT NULL,
  `file_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `transferred_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`transfer_id`),
  KEY `file_transfers_ibfk_1` (`session_id`),
  KEY `file_transfers_ibfk_2` (`file_id`),
  CONSTRAINT `file_transfers_ibfk_1` FOREIGN KEY (`session_id`) REFERENCES `sessions` (`session_id`) ON DELETE CASCADE,
  CONSTRAINT `file_transfers_ibfk_2` FOREIGN KEY (`file_id`) REFERENCES `files` (`file_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_transfers`
--

LOCK TABLES `file_transfers` WRITE;
/*!40000 ALTER TABLE `file_transfers` DISABLE KEYS */;
INSERT INTO `file_transfers` VALUES (5,41,5,75,'2024-09-09 17:50:31'),(8,41,8,14,'2024-09-10 06:00:51'),(10,41,10,14,'2024-09-10 06:24:38'),(11,41,11,14,'2024-09-10 06:37:56'),(13,41,13,14,'2024-09-10 06:42:14'),(14,41,14,75,'2024-09-10 06:45:10'),(19,41,19,75,'2024-09-14 10:20:26'),(22,2,22,24,'2024-09-16 06:51:54'),(23,2,23,24,'2024-09-16 08:38:28'),(24,2,24,14,'2024-09-16 08:38:38'),(25,2,25,24,'2024-09-16 08:40:04'),(27,41,27,75,'2024-09-17 06:27:18'),(30,59,30,92,'2024-10-12 10:44:40'),(31,59,31,24,'2024-10-12 10:44:49'),(32,59,32,24,'2024-10-12 12:00:31'),(33,59,33,24,'2024-10-12 12:22:34'),(35,41,35,14,'2024-11-01 17:36:50'),(36,41,36,75,'2024-11-01 17:37:20'),(37,41,37,14,'2024-11-02 07:36:40'),(38,41,38,14,'2024-11-02 07:40:35'),(39,41,39,75,'2024-11-02 07:42:15'),(40,41,40,14,'2024-11-02 08:06:09'),(41,41,41,75,'2024-11-02 08:07:33'),(42,41,42,14,'2024-11-02 08:50:47'),(43,41,43,75,'2024-11-02 08:52:24');
/*!40000 ALTER TABLE `file_transfers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_type` varchar(255) NOT NULL,
  `file_size` bigint NOT NULL,
  PRIMARY KEY (`file_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (5,'My info.txt','text/plain',3241),(8,'My Content 10-3-2023.vcf','text/x-vcard',17214),(10,'cover-letter-muhannad-alrashed.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',17352),(11,'Recovery Codes for Facebook Account.txt','text/plain',89),(13,'My info.txt','text/plain',3241),(14,'resume-muhannad-alrashd.pdf','application/pdf',778461),(19,'My Content 10-3-2023.vcf','text/x-vcard',17214),(22,'hdd4fjz-hd-natural-wallpaper.jpg','image/jpeg',748065),(23,'BingWallpaper.jpg','image/jpeg',499267),(24,'b4sYtnU-hd-natural-wallpaper.jpg','image/jpeg',687973),(25,'bruce-timana-hWOwYb4Lz3U-unsplash.jpg','image/jpeg',7142020),(27,'Create-tables.sql','',2901),(28,'المراجع.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',15345),(29,'Create-tables.sql','',2901),(30,'المراجع.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',15345),(31,'Create-tables.sql','',2901),(32,'المراجع.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',15345),(33,'Create-tables.sql','',2901),(35,'My info.txt','text/plain',3274),(36,'Presentation.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation',2319420),(37,'cover-letter-muhannad-alrashed.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',17352),(38,'resume-muhannad-alrashd.pdf','application/pdf',778461),(39,'Presentation.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation',2319420),(40,'My info.txt','text/plain',3274),(41,'Presentation.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation',2319420),(42,'My info.txt','text/plain',3274),(43,'Presentation.pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation',2319420);
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `content` text NOT NULL,
  `sent_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `replied_to` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`message_id`),
  KEY `messages_ibfk_1` (`conversation_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`conversation_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (6,7,22,'Hello, I need help!','2023-08-25 07:05:00',NULL),(7,7,14,'Sure, how can I assist you?','2023-08-25 07:06:00',NULL),(9,9,24,'I have an issue with my account.','2023-08-25 09:15:00',NULL),(10,9,14,'I will check that for you.','2023-08-25 09:16:00',NULL),(11,10,14,'Hey Ahmad, how are you?','2024-09-14 11:19:51',NULL),(12,10,75,'I\'m good, thanks','2024-09-14 16:58:35',NULL),(13,10,14,'So, tell me what happened.','2024-09-14 17:06:14',NULL),(14,10,75,'The app is not working.','2024-09-14 17:15:21',NULL),(15,10,75,'Something happened ','2024-09-14 17:26:20',NULL),(16,10,14,'Send me an image','2024-09-14 17:27:14',NULL),(18,10,75,'I sent the image','2024-09-14 17:43:38',NULL),(20,10,14,'I saw it, thanks','2024-09-14 17:53:49',NULL),(21,10,14,'Follow up with me','2024-09-14 17:56:05',NULL),(22,10,75,'I\'m ready','2024-09-14 18:01:34',NULL),(23,10,75,'What is first?','2024-09-14 18:03:49',NULL),(24,10,14,'1','2024-09-14 18:05:50',NULL),(25,10,75,'What\'s next?','2024-09-14 18:26:55',NULL),(26,10,75,'I\'m ready','2024-09-14 18:28:34',NULL),(28,10,75,'done','2024-09-14 18:32:38',NULL),(30,10,75,'I\'m good','2024-09-15 17:54:05',NULL),(31,9,14,'What is it?','2024-09-15 18:01:46',NULL),(32,9,24,'Just a second.','2024-09-15 18:02:40',NULL),(33,9,24,'I\'ll try first ','2024-09-15 18:06:39',NULL),(34,9,14,'ok','2024-09-15 18:10:30',NULL),(35,9,24,'It\'s the same','2024-09-15 18:10:58',NULL),(36,9,14,'explain further ','2024-09-15 18:20:50',NULL),(37,9,24,'sure','2024-09-15 18:20:57',NULL),(38,9,24,'It asks for confirm code','2024-09-15 19:01:20',NULL),(39,9,14,'Take a screenshot ','2024-09-15 19:01:50',NULL),(40,9,14,'And the error','2024-09-15 19:02:13',NULL),(41,9,24,'ok','2024-09-15 19:14:50',NULL),(42,9,14,'...','2024-09-15 19:15:17',NULL),(43,9,24,'then','2024-09-15 19:15:30',NULL),(44,9,14,'check this','2024-09-16 05:14:45',NULL),(45,9,24,'Haven\'t received','2024-09-16 05:15:43',NULL),(46,9,14,'.','2024-09-16 06:56:07',NULL),(47,9,14,'.','2024-09-16 06:58:12',NULL),(48,9,24,'What happened?','2024-09-16 06:58:49',NULL),(49,9,24,'Any problems?','2024-09-16 07:19:44',NULL),(50,9,24,'.','2024-09-16 07:22:36',NULL),(51,9,14,'Wait','2024-09-16 07:27:04',NULL),(52,9,14,'here we are ','2024-09-16 07:27:20',NULL),(54,9,14,'...','2024-09-16 07:31:37',NULL),(55,9,24,'11','2024-09-16 08:05:56',NULL),(56,9,14,'.','2024-09-16 08:06:25',NULL),(57,9,14,'312','2024-09-16 08:08:16',NULL),(58,9,24,'546','2024-09-16 08:08:33',NULL),(59,9,14,'lkdfu','2024-09-16 08:29:42',NULL),(60,9,24,'euaf[p','2024-09-16 08:29:58',NULL),(61,9,24,',','2024-09-16 08:32:24',NULL),(62,9,14,'What\'s up now','2024-09-16 08:50:07',NULL),(63,9,14,'check this','2024-09-16 08:55:29',NULL),(64,9,14,'...','2024-09-16 18:23:37',NULL),(65,9,14,'check this','2024-09-16 18:24:22',NULL),(66,9,14,'Send me an image','2024-09-16 18:25:56',NULL),(67,9,14,'2','2024-09-16 18:27:51',NULL),(68,9,14,'6524','2024-09-16 18:29:44',NULL),(69,9,24,'I\'m ready','2024-09-16 18:31:26',NULL),(70,9,14,'Send me an image','2024-09-16 18:33:29',NULL),(72,9,14,'check this','2024-09-16 18:34:14',NULL),(74,9,14,'Hey Ahmad, how are you?','2024-09-16 18:41:17',NULL),(75,9,14,'Hey Ahmad, how are you?','2024-09-16 18:41:44',NULL),(76,9,14,'check this','2024-09-16 18:44:08',NULL),(77,9,24,'done','2024-09-16 18:44:18',NULL),(80,10,75,'Tell me.','2024-09-17 10:11:54',NULL),(87,10,14,'check this','2024-09-20 10:06:09',NULL),(92,10,75,'I\'m good','2024-09-20 10:37:47',NULL),(93,10,75,'what is this','2024-09-20 12:16:52',NULL),(95,10,14,'An Image.','2024-09-20 17:05:02','what is this'),(96,9,14,'heyu','2024-09-27 14:16:11',NULL),(97,9,24,'how are you','2024-09-27 14:16:22',NULL),(98,10,75,'hey','2024-10-04 06:17:04',NULL),(99,10,14,'hello','2024-10-04 08:37:14',NULL),(100,10,14,'..','2024-10-04 08:37:36',NULL),(101,10,75,'I have another problem','2024-10-04 08:40:17',NULL),(102,10,14,'ok','2024-10-04 08:40:34',NULL),(103,10,75,'first thing is the app','2024-10-04 08:41:12',NULL),(104,10,75,'Error message','2024-10-04 08:43:12',NULL),(105,10,14,'got it','2024-10-04 08:43:26',NULL),(106,10,14,'try this','2024-10-04 08:43:51',NULL),(107,10,75,'sure','2024-10-04 08:44:48',NULL),(108,10,14,'open settings','2024-10-04 08:45:10',NULL),(109,10,75,'I opened it','2024-10-04 08:52:07',NULL),(110,10,75,'What\'s now?','2024-10-04 08:59:13',NULL),(111,10,75,'.','2024-10-04 09:04:27',NULL),(112,10,14,'go to updates','2024-10-04 09:06:02',NULL),(113,10,75,'one second','2024-10-04 09:10:07',NULL),(114,10,14,'Are you done?','2024-10-04 09:12:29',NULL),(115,10,75,'yes','2024-10-04 09:12:49',NULL),(116,10,75,'.','2024-10-04 09:13:20',NULL),(117,10,14,'click options','2024-10-04 09:14:40',NULL),(127,13,24,'hello','2024-10-11 16:32:02',NULL),(128,13,24,'What\'s up ','2024-10-11 16:32:32',NULL),(129,13,92,'Hi','2024-10-11 16:33:08','hello'),(130,13,92,'I\'m good','2024-10-11 16:33:23',NULL),(131,13,24,'hello','2024-10-12 10:43:24',NULL),(132,13,92,'.','2024-10-12 10:43:34',NULL),(135,10,14,'زز','2024-11-02 07:39:01',NULL),(136,10,75,'صباح الخير','2024-11-02 08:08:33',NULL),(137,10,75,'hey','2024-11-02 08:08:50',NULL),(138,10,14,'hello','2024-11-02 08:54:06',NULL),(139,10,14,'What\'s up ','2024-11-02 08:54:19',NULL),(140,10,75,'تشرفنا','2024-11-02 08:54:59','انا مهند الراشد'),(141,10,14,'مرحبا','2024-11-03 11:35:21',NULL);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts_articles`
--

DROP TABLE IF EXISTS `posts_articles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts_articles` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `type` enum('post','article') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `content` longtext NOT NULL,
  `published_at` datetime NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts_articles`
--

LOCK TABLES `posts_articles` WRITE;
/*!40000 ALTER TABLE `posts_articles` DISABLE KEYS */;
INSERT INTO `posts_articles` VALUES (7,'article','The Future of Device Management with DeviceMate','Explore how DeviceMate is shaping the future of device management by providing real-time analytics, automated workflows, and seamless integration across platforms.','Device management has always been a complex task, but with DeviceMate’s innovative platform, this is changing. DeviceMate allows IT managers to have complete visibility over their network of devices in real time. The platform’s robust automation capabilities reduce manual tasks and streamline workflows, improving operational efficiency. In this article, we discuss how DeviceMate integrates with modern infrastructures and its future potential for expanding into AI-driven solutions.','2024-09-01 00:00:00','/img/Management-future.jpg'),(8,'article','5 Best Practices for Secure Device Management','Discover essential security practices for managing your organization\'s devices and how DeviceMate can enhance protection against emerging threats.','In today’s digital age, security is paramount. Devices are the gateways to your organization’s sensitive data, and securing them is critical. This article outlines five key practices that can help safeguard your device fleet, including remote device locking, encryption, regular updates, and compliance checks. With DeviceMate’s built-in security features, your devices remain secure and monitored in real-time, minimizing risks and ensuring compliance with industry standards.','2024-08-15 00:00:00','/img/Secure-management.jpg'),(9,'article','Streamlining Device Maintenance with Automated Alerts','Learn how automated alerts in DeviceMate are transforming device maintenance, reducing downtime, and keeping your organization running smoothly.','Downtime due to device issues can be costly. DeviceMate’s automated alert system helps prevent this by notifying users when a device requires maintenance or shows signs of potential failure. These alerts can be customized and integrated into existing workflows, making it easier to handle device issues before they escalate.','2024-09-10 00:00:00','/img/Automated-alerts.jpg'),(10,'post','How DeviceMate Saves Time for IT Teams','Discover how DeviceMate’s automation features free up IT teams from repetitive tasks, allowing them to focus on more critical issues.','IT teams often spend hours performing manual tasks such as updating software, configuring devices, or troubleshooting. With DeviceMate’s automation features, much of this work can be handled automatically, leaving IT professionals more time to address higher-level problems.','2024-08-05 00:00:00','/img/Save-time.png'),(11,'post','DeviceMate\'s Role in Remote Work Environments','How DeviceMate is enabling organizations to better manage devices in an increasingly remote workforce.','With the rise of remote work, managing devices scattered across different locations has become a challenge. DeviceMate’s cloud-based device management solution offers remote device monitoring and management, ensuring devices remain secure and functional, no matter where they are located.','2024-08-20 00:00:00','/img/Remote-work.jpg'),(12,'post','Top 3 Reasons Your Business Needs DeviceMate','Why businesses of all sizes should be using DeviceMate to improve device visibility, security, and performance.','Every business, regardless of size, relies on devices for daily operations. Managing those devices effectively is essential for long-term success. This blog post outlines the top three reasons why DeviceMate is the best solution for businesses: enhanced visibility into device performance, improved security features, and the ability to automate time-consuming maintenance tasks.','2024-09-05 00:00:00','/img/Business-needs.jpg');
/*!40000 ALTER TABLE `posts_articles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `user_id` int NOT NULL,
  `session_connection_code` varchar(50) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `session_connection_code` (`session_connection_code`),
  KEY `client_id` (`client_id`),
  KEY `sessions_ibfk_2` (`user_id`),
  CONSTRAINT `sessions_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`client_id`),
  CONSTRAINT `sessions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,22,11,'99SX-xzv0-TPgr-n31v','2023-08-25 10:00:00','2024-09-24 18:20:19',0),(2,24,14,'99SX-xzv0-TPgr-fg3d','2024-10-08 14:52:04','2024-10-08 14:59:45',0),(3,23,13,'99SX-xzv0-TPgr-A2g2','2023-08-25 12:00:00','2024-09-24 18:20:19',0),(41,75,14,'lBP-F2a-dvb-uu6E','2024-11-03 14:34:44','2024-11-03 14:44:08',0),(59,92,24,'GRB-W2S-rSN-TO0D','2024-11-01 19:55:14','2024-11-01 20:04:38',0);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `phone` varchar(255) DEFAULT NULL,
  `about` text,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (11,'user one','john.doe@example.com','$2a$10$TKIw6Ou/m6IcBiD28iA51Ox9/vd5aDlg6wCRoyrHPn62g6c6EIhK2','2024-08-26 08:50:07','2024-10-07 08:25:11',NULL,NULL),(13,'Lana Mike','Lana.mike@example.com','$2a$10$HhECtIK.6WQh7Vwgpiqkiu1rJZ3KO.yK9sri6EGiKTDZ6Gob.UdMy','2024-08-26 08:50:07','2024-12-02 12:14:52',NULL,NULL),(14,'Muhannad Al-Rashed','muhannad.1design@gmail.com','$2a$10$3Obczc3/X6P/anx9COuUVuOvPeIOVAdAzy5mJ38eGFQ0ZRIupd58q','2024-08-26 08:50:07','2024-12-02 12:13:24','+963931811650','Hi, how are you.\nMy name is Muhannad, and I\'m a software developer.'),(24,'Muhannad Al','muhannad.1de54sign@gmail.com','$2a$10$jzDxdYkdPw3kpPt.SOps4uTakhpbOYHCwWi19OWGfP1b7oFkSWyne','2024-10-10 12:07:37','2024-11-01 16:51:54','','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-12-03 14:09:32
