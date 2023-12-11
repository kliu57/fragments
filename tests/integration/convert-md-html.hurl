# tests/integration/convert-md-html.hurl

# First POST a markdown fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`This is a **fragment**!`

# Confirm that the server returns a 201, and capture the Location header value
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL plus html extension
GET {{url}}.html
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200 and the type and body of the fragment is correct
HTTP/1.1 200
Content-Type: text/html
[Asserts]
body == "<p>This is a <strong>fragment</strong>!</p>\n"
