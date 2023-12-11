# tests/integration/get-fragments-by-id-invalid-id.hurl

# Try to GET fragment with invalid id
PUT http://localhost:8080/v1/fragments/invalidID
[BasicAuth]
user1@email.com:password1

# 1. We expect to get back an HTTP 404
HTTP/1.1 404

# We have various assertions about the response that we want to check
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "fragment not found"
