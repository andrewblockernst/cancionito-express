import Song from './Song';
import Image from './Image';
import User from './User';
import Role from './Role';
import UserRole from './UserRole';

// Song <-> Image: one-to-many with cascade delete
Song.hasMany(Image, { foreignKey: 'songId', onDelete: 'CASCADE' });
Image.belongsTo(Song, { foreignKey: 'songId' });

// User <-> Role: many-to-many through UserRole
User.belongsToMany(Role, { through: UserRole, foreignKey: 'userId' });
Role.belongsToMany(User, { through: UserRole, foreignKey: 'roleId' });

export { Song, Image, User, Role, UserRole };
