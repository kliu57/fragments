# tests/integration/delete-fragments.hurl

# First POST a fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# Confirm that the server returns a 201, and capture the Location header value
HTTP/1.1 201
[Captures]
url: header "Location"

# DELETE the fragment we just posted by its URL
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
