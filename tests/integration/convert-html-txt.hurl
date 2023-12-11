# tests/integration/convert-html-txt.hurl

# First POST a html fragment
POST http://localhost:8080/v1/fragments
Content-Type: text/html
[BasicAuth]
user1@email.com:password1
`<p>This is a <strong>fragment</strong>!</p>\n`

# Confirm that the server returns a 201, and capture the Location header value
HTTP/1.1 201
[Captures]
url: header "Location"

# Try to GET the fragment we just posted by its URL plus txt extension
GET {{url}}.txt
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200 and the type and body of the fragment is correct
HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "<p>This is a <strong>fragment</strong>!</p>\n"
