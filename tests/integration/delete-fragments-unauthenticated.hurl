# tests/integration/delete-fragments-unauthenticated.hurl

# First POST a fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

# We expect to get back an HTTP 201
HTTP/1.1 201
# Capture the Location URL into a variable named `url`
[Captures]
url: header "Location"

# Unauthenticated PUT to that url
PUT {{url}}
[BasicAuth]
user1@email.com:invalid

# 1. We expect to get back an HTTP 401
HTTP/1.1 401

# 2. Try to GET the fragment which was not deleted
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 19
[Asserts]
body == "This is a fragment!"

