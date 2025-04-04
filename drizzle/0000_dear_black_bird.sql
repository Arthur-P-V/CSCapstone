CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`date_created` timestamp DEFAULT (now()),
	`event_name` varchar(50) NOT NULL,
	`location` varchar(256) NOT NULL,
	`meeting_time` datetime,
	`current_qr` varchar(500),
	`description` varchar(500) NOT NULL,
	`type` varchar(50),
	`roster_file` varchar(1000),
	CONSTRAINT `events_id` PRIMARY KEY(`id`)
);
