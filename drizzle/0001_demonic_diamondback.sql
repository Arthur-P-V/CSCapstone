CREATE TABLE `types` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(20) NOT NULL,
	CONSTRAINT `types_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `events` MODIFY COLUMN `type` int;--> statement-breakpoint
ALTER TABLE `events` ADD CONSTRAINT `events_type_types_id_fk` FOREIGN KEY (`type`) REFERENCES `types`(`id`) ON DELETE no action ON UPDATE no action;