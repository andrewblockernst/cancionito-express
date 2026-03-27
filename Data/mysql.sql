/*CREATE TABLE Songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Uso de AUTOINCREMENT en SQLite
    title VARCHAR(255) NOT NULL
);

CREATE TABLE Images (
    id_internal INTEGER,  -- No se puede usar AUTOINCREMENT en una clave primaria compuesta
    id_song INTEGER,
    url VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_song) REFERENCES Song(id),
    PRIMARY KEY (id_internal, id_song)  -- Definir la clave primaria compuesta
);*/


-- Limpiar la tabla Songs y reiniciar el ID autoincremental
--DELETE FROM Songs; 
--DELETE FROM sqlite_sequence WHERE name='Songs';

SELECT * FROM Songs;
SELECT * FROM Images;

-- LISTAR TABLAS
--SELECT name FROM sqlite_master WHERE type='table';

SELECT * FROM AspNetRoles;
SELECT * FROM AspNetUsers;
SELECT * FROM AspNetUserRoles;
SELECT * FROM AspNetUserClaims;
SELECT * FROM AspNetUserLogins;
SELECT * FROM AspNetRoleClaims;
SELECT * FROM AspNetUserTokens;




--DELETE FROM Songs;
--DELETE FROM Images;
