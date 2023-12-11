# tests/integration/convert-webp-gif.hurl

# First POST a webp fragment
POST http://localhost:8080/v1/fragments
Content-Type: image/webp
[BasicAuth]
user1@email.com:password1
file,image.webp;

# Confirm that the server returns a 201, and capture the Location header value
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL plus gif extension
GET {{url}}.gif
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200 and the type of the fragment is correct
HTTP/1.1 200
Content-Type: image/gif
