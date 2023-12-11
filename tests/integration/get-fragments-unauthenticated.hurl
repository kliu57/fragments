# tests/integration/get-fragments-unauthenticated.hurl

# Unauthenticated GET to /v1/fragments
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:invalid

# 1. We expect to get back an HTTP 401
HTTP/1.1 401
