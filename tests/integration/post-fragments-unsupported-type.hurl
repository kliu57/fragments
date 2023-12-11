# tests/integration/post-fragments-unsupported-type.hurl

# Authenticated POST to /v1/fragments
POST http://localhost:8080/v1/fragments
# We're sending an exe
Content-Type: text/javascript
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
# Body of the request goes in ```...``` when it's a string
`console.log('Hello');`

# We expect to get back an HTTP 415
HTTP/1.1 415
