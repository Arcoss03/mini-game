-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP DATABASE IF EXISTS `mini_game_db`;
CREATE DATABASE `mini_game_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `mini_game_db`;

DROP TABLE IF EXISTS `posts`;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `prompt1` varchar(255) NOT NULL,
  `img_url1` varchar(255) NOT NULL,
  `nb_clic1` int NOT NULL,
  `prompt2` varchar(255) NOT NULL,
  `img_url2` varchar(255) NOT NULL,
  `nb_clic2` int NOT NULL,
  `author_id` int NOT NULL,
  `creation_date` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `posts` (`id`, `prompt1`, `img_url1`, `nb_clic1`, `prompt2`, `img_url2`, `nb_clic2`, `author_id`, `creation_date`) VALUES
(1,	'test',	'https://cdn2.thecatapi.com/images/rs.jpg',	21,	'test',	'https://cdn2.thecatapi.com/images/mu.gif',	13,	1,	'2024-03-06 13:20:06'),
(2,	'lala',	'https://cdn2.thecatapi.com/images/55j.jpg',	3,	'lala',	'https://cdn2.thecatapi.com/images/aa9.jpg',	4,	2,	'2024-03-06 13:20:10'),
(5,	'Quel chat est le plus mignon ?',	'https://cdn2.thecatapi.com/images/1l8.jpg',	154,	'Lequel de ces chats préférez-vous ?',	'https://cdn2.thecatapi.com/images/3cv.jpg',	104,	1,	'2024-03-06 13:20:11'),
(6,	'dsqs',	'https://cdn2.thecatapi.com/images/4d.jpg',	6,	'<q<qsxq<',	'https://cdn2.thecatapi.com/images/2nk.jpg',	0,	1,	'2024-03-06 13:20:13'),
(7,	'manger',	'https://cdn2.thecatapi.com/images/3dr.jpg',	0,	'boire',	'https://cdn2.thecatapi.com/images/8mh.jpg',	1,	1,	'2024-03-06 13:20:17');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pseudo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` (`id`, `pseudo`, `email`) VALUES
(1,	'Arcoss',	'frin.arthur@gmail.com'),
(2,	'michel',	'miche.truc@gmail.com');

-- 2024-03-06 13:21:45
