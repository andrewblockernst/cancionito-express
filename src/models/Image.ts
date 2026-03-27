import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db/database';

interface ImageAttributes {
  internalId: number;
  songId: number;
  url: string;
}

type ImageCreationAttributes = Optional<ImageAttributes, never>;

class Image extends Model<ImageAttributes, ImageCreationAttributes> implements ImageAttributes {
  public internalId!: number;
  public songId!: number;
  public url!: string;
}

Image.init(
  {
    internalId: {
      type: DataTypes.INTEGER,
      field: 'id_internal',
      primaryKey: true,
    },
    songId: {
      type: DataTypes.INTEGER,
      field: 'id_song',
      primaryKey: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Images',
    timestamps: false,
  }
);

export default Image;
