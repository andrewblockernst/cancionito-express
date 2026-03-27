import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/database';

interface SongAttributes {
  id: number;
  title: string;
}

type SongCreationAttributes = Optional<SongAttributes, 'id'>;

class Song extends Model<SongAttributes, SongCreationAttributes> implements SongAttributes {
  public id!: number;
  public title!: string;
}

Song.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Songs',
    timestamps: false,
  }
);

export default Song;
