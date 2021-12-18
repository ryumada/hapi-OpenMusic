- [Skenario 1: Terdapat fitur ekspor lagu pada playlist](#skenario-1-terdapat-fitur-ekspor-lagu-pada-playlist)
- [Skenario 2: Terdapat fitur mengunggah gambar](#skenario-2-terdapat-fitur-mengunggah-gambar)
- [Skenario 3: Applying Server-Side Cache](#skenario-3-applying-server-side-cache)
- [Skenario 4: Keep the feature from OpenMusic API v2 and v1 up.](#skenario-4-keep-the-feature-from-openmusic-api-v2-and-v1-up)

## Skenario 1: Terdapat fitur ekspor lagu pada playlist
- request header:
  - method: **POST**
  - url: **/exports/playlists/{playlistId}**
- request body:
  ```json
  {
    "targetEmail": string,
  }
  ```
- provision:
  - **targetEmail** must be a valid valid email, not just any string value
  - the users who can export the playlist must be the owner or the collaborator of the playlist.
  - must use the message broker using `RabbitMQ`
    - the name of the `RabbitMQ` host must use the environment variable value named `RABBITMQ_SERVER`
  - must create queue consumer app
  - the exported result is a json data
  - The exported result must be sent using `nodemailer`
    - The email credentials must be using `MAIL_ADDRESS` and `MAIL_PASSWORD` environment variables
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Permintaan Anda sedang kami proses",
  }
  ```

## Skenario 2: Terdapat fitur mengunggah gambar
- request header:
  - method: **POST**
  - url: **/upload/pictures**
- request body:
  ```json
  {
    "data": file
  }
  ```
- provision:
  - the type of content must be [MIME Types of images](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types)
  - the maximum file allowed is 500KB
  - you must use either local system storage or AWS S3 bucket to accomodate the object
  - if using Amazon S3 must using AWS_BUCKET_NAME environment variable.
- response header:
  - status code: **201** (Created)
  - **Content-Type**: **application/json; charset=utf-8**
- response body:
  ```json
  {
    "status": "success",
    "message": "Gambar berhasil diunggah",
    "data": {
        "pictureUrl": "http://…"
    }

  }
  ```

## Skenario 3: Applying Server-Side Cache
- request header:
  - method: **GET**
  - url: **/playlists/{playlistId}/songs**
- provision:
  - cache must be deleted if there is a song deleted or a new song  added to the playlist
  - the memory engine must use `Redis` or `Memurai` (Windows)
  - the `Redis` hostname must be used `REDIS_SERVER` environment variable

## Skenario 4: Keep the feature from OpenMusic API v2 and v1 up.
- provision:
  - make sure the feature and the criteria from OpenMusic API v2 and v1 is still working.
