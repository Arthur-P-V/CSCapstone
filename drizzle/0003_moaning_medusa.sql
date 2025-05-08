CREATE TABLE `attendance_record` (
	`eNumber` int NOT NULL,
	`meeting_id` int NOT NULL,
	`check_in_time` date,
	CONSTRAINT `attendance` PRIMARY KEY(`eNumber`,`meeting_id`)
);
--> statement-breakpoint
ALTER TABLE `meetings` RENAME COLUMN `class` TO `class_id`;--> statement-breakpoint
ALTER TABLE `meetings` DROP FOREIGN KEY `meetings_class_classes_id_fk`;
--> statement-breakpoint
ALTER TABLE `attendance_record` ADD CONSTRAINT `attendance_record_eNumber_users_eNumber_fk` FOREIGN KEY (`eNumber`) REFERENCES `users`(`eNumber`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `attendance_record` ADD CONSTRAINT `attendance_record_meeting_id_meetings_id_fk` FOREIGN KEY (`meeting_id`) REFERENCES `meetings`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;