CREATE TABLE event 
(
    event_id INTEGER PRIMARY KEY,
    workstream_id INT(11), 
    start_date DATETIME,
    end_date DATETIME,
    title VARCHAR(128),
    classname VARCHAR(32),
    description TEXT, 
    is_active VARCHAR(1)
);

CREATE TABLE workstream
(
    workstream_id INTEGER PRIMARY KEY,
    name VARCHAR(64),
    password VARCHAR(32)
);
