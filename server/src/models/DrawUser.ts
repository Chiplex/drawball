import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  BelongsToMany,
  ForeignKey,
} from "sequelize-typescript";
import { DataTypes, Sequelize } from "sequelize";
import { Draw } from "./Draw";
import { User } from "./User";


@Table({
  timestamps: false,
  tableName: "draw_user",
})
export class DrawUser extends Model<DrawUser> {
  @ForeignKey(() => Draw)
  @Column({ field: "draw_id", type: DataTypes.STRING })
  drawId!: string;

  @ForeignKey(() => User)
  @Column({ field: "user_id", type: DataTypes.STRING })
  userId!: string;
}
