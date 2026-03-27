import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/database';

interface RoleAttributes {
  id: string;
  name: string;
}

type RoleCreationAttributes = Optional<RoleAttributes, never>;

class Role extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
  public id!: string;
  public name!: string;
}

Role.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(256),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'Roles',
    timestamps: false,
  }
);

export default Role;
