# tests/integration/get-fragments-expanded.hurl

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

# Try to GET all expanded fragments
GET http://localhost:8080/v1/fragments?expand=1
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200 and the type and body of the fragment is correct
HTTP/1.1 200
Content-Type: application/json; charset=utf-8
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments" count > 0
