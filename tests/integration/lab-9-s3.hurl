# POST a new text fragment to http://localhost:8080 as an authorized user.
# The fragment's body should be the string, Hello S3!.

POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello S3!`

# Confirm that the server returns a 201, and capture the Location header value to a variable named url
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL
GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200, that the type of the fragment is text/plain, and that the body is equal to Hello S3!

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello S3!"

# DELETE the fragment using the url as an authorized user.

DELETE {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200.

HTTP/1.1 200

# Try to GET the fragment again using the url as an authorized user.

GET {{url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 404, since the fragment should be deleted.

HTTP/1.1 404
