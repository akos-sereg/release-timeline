# Migrate MySQL database to SQLite
# from github: esperlu/mysql2sqlite.sh
./mysql2sqlite.sh -h 127.0.0.1 -u root -p<mysql password> <mysql database> | sqlite3 projectplan.sqlite