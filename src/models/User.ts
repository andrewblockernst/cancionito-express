import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/database';

interface UserAttributes {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
}

type UserCreationAttributes = Optional<UserAttributes, never>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public username!: string;
  public email!: string;
  public passwordHash!: string;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Users',
    timestamps: false,
  }
);

export default User;
