ALTER TABLE `meetings` RENAME COLUMN `class` TO `class_id`;--> statement-breakpoint
ALTER TABLE `meetings` DROP FOREIGN KEY `meetings_class_classes_id_fk`;
--> statement-breakpoint
ALTER TABLE `meetings` ADD CONSTRAINT `meetings_class_id_classes_id_fk` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE no action ON UPDATE no action;