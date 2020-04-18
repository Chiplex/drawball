CREATE TABLE `users` (
	`id` VARCHAR(16) NOT NULL COLLATE 'utf8mb4_spanish2_ci',
	`email` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`password` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`created_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NULL DEFAULT NULL,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	PRIMARY KEY (`id`)
)
COLLATE='utf8mb4_spanish2_ci'
ENGINE=InnoDB
;
