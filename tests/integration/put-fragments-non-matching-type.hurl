# tests/integration/put-fragments-non-matching-type.hurl

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

# Then PUT a fragment with non matching type to that url
PUT {{url}}
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`This is a **fragment**!`

# 1. We expect to get back an HTTP 400
HTTP/1.1 400

# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400
jsonpath "$.error.message" == "Fragment types does not match"
