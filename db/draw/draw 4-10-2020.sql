CREATE TABLE `draws` (
	`id` VARCHAR(16) NOT NULL COLLATE 'utf8mb4_spanish2_ci',
	`json` LONGTEXT NULL COLLATE 'utf8mb4_spanish2_ci',
	`image` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`title` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`description` VARCHAR(100) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_spanish2_ci'
ENGINE=InnoDB
;
