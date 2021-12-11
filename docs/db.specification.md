# Database Specification

Database name &nbsp;&nbsp;&nbsp;&nbsp; : **openmusic**

Database engine &nbsp;&nbsp; : PostgreSQL


# Table List
- [songs](#songs)
- [users](#users)
- [playlists](#playlists)
- [playlistsongs (Junctional Table)](#playlistsongs-junctional-table)
- [collaborations (Junctional Table)](#collaborations-junctional-table)

## songs
| No. | Nama Properti | Tipe Data    | Ketentuan   |
|-----|---------------|--------------|-------------|
| 1.  | id            | VARCHAR(21)  | PRIMARY KEY |
| 2.  | title         | VARCHAR(128) | NOT NULL    |
| 3.  | year          | SMALLINT()   | NOT NULL    |
| 4.  | performer     | VARCHAR(128) | NOT NULL    |
| 5.  | genre         | VARCHAR(32)  | NOT NULL    |
| 6.  | duration      | SMALLINT()   | NOT NULL    |
| 7.  | inserted_at   | TIMESTAMPT() | NOT NULL    |
| 8.  | updated_at    | TIMESTAMPT() | NOT NULL    |

## users
| No. | Nama Properti | Tipe Data    | Ketentuan        |
|-----|---------------|--------------|------------------|
| 1.  | id            | VARCHAR(21)  | PRIMARY KEY      |
| 2.  | username      | VARCHAR(64)  | UNIQUE, NOT NULL |
| 3.  | password      | TEXT         | NOT NULL         |
| 4.  | fullname      | VARCHAR(128) | NOT NULL         |

// INFO
- id: "user-Qbax5Oy7L8WKf74l"

## playlists
| No. | Nama Properti | Tipe Data    | Ketentuan                       |
|-----|---------------|--------------|---------------------------------|
| 1.  | id            | VARCHAR(25)  | PRIMARY KEY                     |
| 2.  | name          | VARCHAR(128) | NOT NULL                        |
| 3.  | owner         | VARCHAR(21)  | NOT NULL, FOREIGN KEY(users.id) |

// INFO
- id: "playlist-Qbax5Oy7L8WKf74l"

## playlistsongs (Junctional Table)
| No. | Nama Properti | Tipe Data   | Ketentuan                           |
|-----|---------------|-------------|-------------------------------------|
| 1.  | id            | VARCHAR(46) | PRIMARY KEY                         |
| 2.  | playlist_id   | VARCHAR(25) | NOT NULL, FOREIGN KEY(playlists.id) |
| 3.  | song_id       | VARCHAR(21) | NOT NULL, FOREIGN KEY(songs.id)     |

// INFO
- id: "playlistsongs-Qbax5Oy7L8WKf74lQbax5Oy7L8WKf74l"
- CONSTRAINT UNIQUE column combination between playlist_id and song_id

## collaborations (Junctional Table)
| No. | Nama Properti | Tipe Data   | Ketentuan                           |
|-----|---------------|-------------|-------------------------------------|
| 1.  | id            | VARCHAR(23) | PRIMARY KEY                         |
| 2.  | playlist_id   | VARCHAR(25) | NOT NULL, FOREIGN KEY(playlists.id) |
| 3.  | user_id       | VARCHAR(21) | NOT NULL, FOREIGN KEY(user.id)      |

// INFO
- id: "collab-Qbax5Oy7L8WKf74l"
- CONSTRAINT UNIQUE column combination between playlist_id and user_id