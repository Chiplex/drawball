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
import { DrawUser } from "./DrawUser";
import { Draw } from "./Draw";
import { v4 as uuid } from "uuid";

@Table({
  timestamps: true,
  paranoid: true,
  tableName: "users",
})
export class User extends Model<User> {
  @Column({
    primaryKey: true,
    autoIncrement: false,
    field: "id",
    type: DataTypes.STRING,
    defaultValue: uuid()
  }) id!: string;

  @Column({
    type: DataTypes.STRING,
  }) email!: string;

  @Column({
    type: DataTypes.STRING,
  }) password!: string;

  @CreatedAt @Column({
    type: DataTypes.DATE,
    field: "created_at",
  }) createdAt!: Date;
  @UpdatedAt @Column({
    type: DataTypes.DATE,
    field: "updated_at",
  })  updatedAt!: Date;
  @DeletedAt @Column({
    field: "deleted_at",
    type: DataTypes.DATE,
  })  deletedAt!: Date;

  @BelongsToMany(() => Draw, () => DrawUser) draws?: Draw[];
}
