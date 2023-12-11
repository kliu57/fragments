# tests/integration/put-fragments.hurl

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

# Then PUT a fragment to that url
PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`This is an updated fragment!`

# 1. We expect to get back an HTTP 200
HTTP/1.1 200

# We have various assertions about the response that we want to check
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 28

# 2. Try to GET the fragment which was updated
GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
Content-Length: 28
[Asserts]
body == "This is an updated fragment!"
