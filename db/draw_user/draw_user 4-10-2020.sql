CREATE TABLE `draw_user` (
	`id` INT(11) NOT NULL AUTO_INCREMENT,
	`draw_id` VARCHAR(16) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	`user_id` VARCHAR(16) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci',
	PRIMARY KEY (`id`),
	INDEX `FK_draw_user_draws` (`draw_id`),
	INDEX `FK_draw_user_users` (`user_id`),
	CONSTRAINT `FK_draw_user_draws` FOREIGN KEY (`draw_id`) REFERENCES `draws` (`id`),
	CONSTRAINT `FK_draw_user_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
)
COLLATE='utf8mb4_spanish2_ci'
ENGINE=InnoDB
;
