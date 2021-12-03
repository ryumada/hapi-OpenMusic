# Database Specification

Database name &nbsp;&nbsp;&nbsp;&nbsp; : **openmusic**

Database engine &nbsp;&nbsp; : PostgreSQL


# Table List
  - [songs](#songs)

## songs
| No. | Nama Properti | Tipe Data    | Ketentuan   |
|-----|---------------|--------------|-------------|
| 1.  | id            | VARCHAR(21)  | PRIMARY KEY |
| 2.  | title         | VARCHAR(128) | NOT NULL    |
| 3.  | year          | SMALLINT()   | NOT NULL    |
| 4.  | performer     | VARCHAR(128) | NOT NULL    |
| 5.  | genre         | VARCHAR(32)  | NOT NULL    |
| 6.  | duration      | SMALLINT()   | NOT NULL    |
| 7.  | createdAt     | TIMESTAMPT() | NOT NULL    |
| 8.  | updatedAt     | TIMESTAMPT() | NOT NULL    |