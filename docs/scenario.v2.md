- [Skenario 1: Terdapat fitur registrasi pengguna (Menambahkan user)](#skenario-1-terdapat-fitur-registrasi-pengguna-menambahkan-user)
- [Skenario 2: Terdapat fitur login pengguna (menambahkan authentication)](#skenario-2-terdapat-fitur-login-pengguna-menambahkan-authentication)
- [Skenario 3: Terdapat fitur refresh access token (memperbarui authentication)](#skenario-3-terdapat-fitur-refresh-access-token-memperbarui-authentication)
- [Skenario 4: Terdapat fitur logout (menghapus authentication)](#skenario-4-terdapat-fitur-logout-menghapus-authentication)
- [Skenario 5: Terdapat fitur menambahkan playlist](#skenario-5-terdapat-fitur-menambahkan-playlist)
- [Skenario 6: Terdapat fitur melihat daftar playlist yang dimiliki](#skenario-6-terdapat-fitur-melihat-daftar-playlist-yang-dimiliki)
- [Skenario 7: Terdapat fitur menghapus playlist](#skenario-7-terdapat-fitur-menghapus-playlist)
- [Skenario 8: Terdapat fitur menambahkan lagu ke playlist](#skenario-8-terdapat-fitur-menambahkan-lagu-ke-playlist)
- [Skenario 9: Terdapat fitur melihat daftar lagu pada playlist](#skenario-9-terdapat-fitur-melihat-daftar-lagu-pada-playlist)
- [Skenario 10: Terdapat fitur menghapus lagu dari playlist](#skenario-10-terdapat-fitur-menghapus-lagu-dari-playlist)
- [Skenario 11: Memiliki fitur menambahkan kolaborator pada playlist](#skenario-11-memiliki-fitur-menambahkan-kolaborator-pada-playlist)
- [Skenario 12: Memiliki fitur menghapus kolaborator dari playlist](#skenario-12-memiliki-fitur-menghapus-kolaborator-dari-playlist)
- [Data validation](#data-validation)
- [Error Handling](#error-handling)
- [Keep openmusic API version 1 features](#keep-openmusic-api-version-1-features)

## Skenario 1: Terdapat fitur registrasi pengguna (Menambahkan user)
- request header:
  - method: **POST**
  - url: **/users**
- request body:
	```json
	{
		"username": string,
		"password": string,
		"fullname": string
	}
	```
- saved data in the server:
	```json
	{
		"id": "user-Qbax5Oy7L8WKf74l",
		"username": "dicoding",
		"password": "encryptedpassword",
		"fullname": "Dicoding Indonesia"
	}
	```
- provision:
  - **username**: UNIQUE
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
      "status": "success",
      "message": "User berhasil ditambahkan",
      "data": {
          "userId": "user-Qbax5Oy7L8WKf74l"
      }
  }
  ```

## Skenario 2: Terdapat fitur login pengguna (menambahkan authentication)
- request header:
  - method: **POST**
  - url: **/authentications**
- request body:
	```json
	{
		"username": string,
		"password": string
	}
	```
- provision:
  - authentication using **JWT token**
  - **JWT token contain userId** from authentic user
  - the value of secret key token of JWT and access token must using .env file **ACCESS_TOKEN_KEY** and **REFRESH_TOKEN_KEY**
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Authentication berhasil ditambahkan",
    "data": {
        "accessToken": "jwt.access.token",
        "refreshToken": "jwt.refresh.token"
    }
  }
  ```
## Skenario 3: Terdapat fitur refresh access token (memperbarui authentication)
- request header:
  - method: **PUT**
  - url: **/authentications**
- request body:
	```json
	{
		"refreshToken": "jwt.refresh.token"
	}
	```
- provision:
  - refresh token has the right signature and is registered in the database
- response header:
  - status code: **200** (Ok)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Authentication berhasil diperbarui",
    "data": {
        "accessToken": "jwt.access.token"
    }
  }
  ```

## Skenario 4: Terdapat fitur logout (menghapus authentication)
- request header:
  - method: **DELETE**
  - url: **/authentications**
- request body:
  ```json
  {
    "refreshToken": "jwt.refresh.token"
  }
  ```
- provision:
  - Refresh token must be registered in the database
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Refresh token berhasil dihapus"
  }
  ```

## Skenario 5: Terdapat fitur menambahkan playlist
- request header:
  - method: **POST**
  - url: **/playlists**
- request body:
  ```json
  {
    "name": string
  }
  ```
- saved data in the server:
  ```json
  {
    "id": "playlist-Qbax5Oy7L8WKf74l",
    "name": "Lagu Indie Hits Indonesia",
    "owner": "user-Qbax5Oy7L8WKf74l",
  }
  ```
- provision:
  - Playlist is a restricted resource that need access token
  - **owner** property is the owner user id. You can get it from artifacts payload JWT
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Playlist berhasil ditambahkan",
    "data": {
        "playlistId": "playlist-Qbax5Oy7L8WKf74l"
    }
  }
  ```

## Skenario 6: Terdapat fitur melihat daftar playlist yang dimiliki
- request header:
  - method: **GET**
  - url: **/playlists**
- provision:
  - Only reveal the owned playlist
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "data": {
        "playlists": [
            {
                "id": "playlist-Qbax5Oy7L8WKf74l",
                "name": "Lagu Indie Hits Indonesia",
                "username": "dicoding"
            },
            {
                "id": "playlist-lmA4PkM3LseKlkmn",
                "name": "Lagu Untuk Membaca",
                "username": "dicoding"
            }
        ]
    }
  }
  ```

## Skenario 7: Terdapat fitur menghapus playlist
- request header:
  - method: **DELETE**
  - url: **/playlists/{playlistId}**
- provision:
  - Only the owner of the playlist can remove it.
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Playlist berhasil dihapus",
  }
  ```

## Skenario 8: Terdapat fitur menambahkan lagu ke playlist
- request header:
  - method: **POST**
  - url: **/playlists/{playlistId}/songs**
- request body:
  ```json
  {
    "songId": string
  }
  ```
- provision:
  - Only the owner (or collaborator) who can add the songs to the playlist
  - **songId** needs to have a valid value
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil ditambahkan ke playlist",
  }
  ```

## Skenario 9: Terdapat fitur melihat daftar lagu pada playlist
- request header:
  - method: **GET**
  - url: **/playlists/{playlistId}/songs**
- provision:
  - Only owner (or collaborator) of the playlist who can see the playlist.
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "data": {
      "songs": [
          {
            "id": "song-Qbax5Oy7L8WKf74l",
            "title": "Kenangan Mantan",
            "performer": "Dicoding"
          },
          {
            "id": "song-poax5Oy7L8WKllqw",
            "title": "Kau Terindah",
            "performer": "Dicoding"
          }
      ]
    }
  }
  ```

## Skenario 10: Terdapat fitur menghapus lagu dari playlist
- request header:
  - method: **DELETE**
  - url: **/playlists/{playlistId}/songs**
- request body:
  ```json
  {
    "songId": string
  }
  ```
- provision:
  - Only the owner (or collaborator) of the playlist who can delete songs from it.
  - **songId** needs to have a valid value
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Lagu berhasil dihapus dari playlist",
  }
  ```

## Skenario 11: Memiliki fitur menambahkan kolaborator pada playlist
- request header:
  - method: **POST**
  - url: **/collaborations**
- request body:
  ```json
  {
    "playlistId": string,
    "userId": string,
  }
  ```
- saved data in the server:
  ```json
  {
    "id": "collab-Qbax5Oy7L8WKf74l",
    "playlistId": "playlist-Qbax5Oy7L8WKf74l",
    "userId": "user-Qbax5Oy7L8WKf74l"
  }
  ```
- provision:
  - Only the owner of the playlist who could add the collaborators
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Kolaborasi berhasil ditambahkan",
    "data": {
        "collaborationId": "collab-Qbax5Oy7L8WKf74l"
    }
  }
  ```

## Skenario 12: Memiliki fitur menghapus kolaborator dari playlist
- request header:
  - method: **DELETE**
  - url: **/collaborations**
- request body:
  ```json
  {
    "playlistId": string,
    "userId": string,
  }
  ```
- saved data in the server:
  ```json
  {
    
  }
  ```
- provision:
  - Only the owner of the playlist who could delete the collaborators
- response header:
  - status code: **200** (OK)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Kolaborasi berhasil dihapus"
  }
  ```
- collaborator playlist permissions
  - view the playlist at GET **/playlists**
  - add songs
  - delete songs
  - view the songs in the playlist

## Data validation
- POST **/users**:
  - username: string, required
  - password: string, required
  - fullname: string, required
- POST **/authentications**:
  - username: string, required
  - password: string, required
- PUT **/authentications**:
  - refreshToken: string, required
- DELETE **/authentications**:
  - refreshToken: string, required
- POST **/playlists**:
  - name: string, required
- POST **/playlists/{playlistId}/songs**
  - songId: string, required

## Error Handling
- When the validation process of the request payload is fail
  - status code: **400** {Bad Request}
  - response body:
    - status: fail
    - message: "can be anything except null"
- When the users access the not found resources
  - status code: **404** {Not Found}
  - response body:
    - status: fail
    - message: "can be anything except null"
- When the users access the restricted resources without an access_token
  - status code: **401** {Unauthorized}
  - response body:
    - status: fail
    - message: "can be anything except null"
- When the users update their access_token using their invalid refresh_token
  - status code: **400** {Bad Request}
  - response body:
    - status: fail
    - message: "can be anything except null"
- When the users access the resources that do not belong to them
  - status code: **403** {Forbidden}
  - response body:
    - status: fail
    - message: "can be anything except null"
- When the error comes from the server
  - status code: **500** {Internal Server Error}
  - response body:
    - status: error
    - message: "can be anything except null"

## Keep openmusic API version 1 features
- API could:
  - save the songs
  - view all songs
  - view the details of a song
  - update the details of a song
  - delete a song
- Implement validation data on:
  - POST **/songs**
  - PUT **/songs**
