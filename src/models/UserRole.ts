import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../db/database';

interface UserRoleAttributes {
  userId: string;
  roleId: string;
}

class UserRole extends Model<UserRoleAttributes> implements UserRoleAttributes {
  public userId!: string;
  public roleId!: string;
}

UserRole.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'UserRoles',
    timestamps: false,
  }
);

export default UserRole;
