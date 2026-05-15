import os
from contextlib import contextmanager

import pymysql
from pymysql.cursors import DictCursor


DB_CONFIG = {
    "host": os.getenv("DB_HOST", "127.0.0.1"),
    "port": int(os.getenv("DB_PORT", "3306")),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", "test1234"),
    "database": os.getenv("DB_NAME", "sesac_power_station_db"),
    "charset": os.getenv("DB_CHARSET", "utf8mb4"),
    "local_infile": True,
    "cursorclass": DictCursor,
}


@contextmanager
def get_connection():
    connection = pymysql.connect(**DB_CONFIG)
    try:
        yield connection
    finally:
        connection.close()
