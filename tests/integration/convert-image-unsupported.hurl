# tests/integration/convert-image-unsupported.hurl

# First POST a gif fragment
POST http://localhost:8080/v1/fragments
Content-Type: image/gif
[BasicAuth]
user1@email.com:password1
file,image.gif;

# Confirm that the server returns a 201, and capture the Location header value
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL plus unsupported extension
GET {{url}}.tiff
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 415 with error message
HTTP/1.1 415
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 415
jsonpath "$.error.message" == "a image/gif fragment cannot be returned as a image/tiff"
