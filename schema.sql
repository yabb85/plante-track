DROP TABLE IF EXISTS sensors;

CREATE TABLE sensors(
	id INTEGER PRIMARY KEY ASC,
	name CHAR(50),
	mac CHAR(17),
	description TEXT,
	type CHAR(100)
);

DROP TABLE IF EXISTS stats;

CREATE TABLE stats(
	id INTEGER PRIMARY KEY ASC,
	id_sensor INTEGER,
	temperature INTEGER,
	humidity INTEGER,
	label DATE,
	FOREIGN KEY(id_sensor) REFERENCES sensors(id)
);
