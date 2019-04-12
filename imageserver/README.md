
# Agilis projekt - Imageserver

Simple nodeJS webserver, with post form in index.html, and list in /movements.
Application running on PORT 3000.

## TODO:
- Forward "motion detected" to ??
- Python server communication
## Used:

- express
- express-fileupload
- time-stamp
- sqlite3
- axios (!!!! NEW !!!! FOR async http)
- body-parser (!!!! NEW !!!!)

## npm

Use npm install.
package.json and package-lock.json included.

## SQL
CREATE TABLE movements ( date_time TEXT NOT NULL,
path TEXT NOT NULL,
image TEXT NOT NULL,
is_new INTEGER);