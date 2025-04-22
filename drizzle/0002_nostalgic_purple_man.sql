CREATE TABLE `meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`class` int NOT NULL,
	`location` varchar(30) NOT NULL,
	`date` datetime,
	`qrcode` text,
	`cancelled` boolean DEFAULT false,
	CONSTRAINT `meetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`eNumber` varchar(10) NOT NULL,
	`password_hash` mediumtext NOT NULL,
	`admin` boolean NOT NULL,
	`first_name` varchar(20) NOT NULL,
	`last_name` varchar(20) NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
DROP TABLE `types`;--> statement-breakpoint
RENAME TABLE `events` TO `classes`;--> statement-breakpoint
ALTER TABLE `classes` RENAME COLUMN `event_name` TO `name`;--> statement-breakpoint
ALTER TABLE `classes` DROP FOREIGN KEY `events_type_types_id_fk`;
--> statement-breakpoint
ALTER TABLE `classes` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `classes` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `classes` ADD `teacher` int;--> statement-breakpoint
ALTER TABLE `classes` ADD `recurring` boolean NOT NULL;--> statement-breakpoint
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_class_classes_id_fk` FOREIGN KEY (`class`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` ADD CONSTRAINT `classes_teacher_users_id_fk` FOREIGN KEY (`teacher`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `location`;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `meeting_time`;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `current_qr`;--> statement-breakpoint
ALTER TABLE `classes` DROP COLUMN `type`;