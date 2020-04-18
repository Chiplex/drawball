ALTER TABLE `draw_user`
	CHANGE COLUMN `draw_id` `draw_id` VARCHAR(36) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci' AFTER `id`,
	CHANGE COLUMN `user_id` `user_id` VARCHAR(36) NULL DEFAULT NULL COLLATE 'utf8mb4_spanish2_ci' AFTER `draw_id`;
