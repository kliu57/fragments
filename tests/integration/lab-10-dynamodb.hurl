# POST a new JSON fragment to http://localhost:8080 as an authorized user.
# The fragment's body should be the JSON value, { "service": "DynamoDB" }.

POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{ "service": "DynamoDB" }

# Confirm that the server returns a 201, and capture the Location header value and the fragment's id
# in variables named fragment1_url and fragment1_id.

HTTP/1.1 201

# Capture the Location URL into a variable named `fragment1_url`
# Capture the id into a variable named `fragment1_id`
[Captures]
fragment1_url: header "Location"
fragment1_id: jsonpath "$.fragment.id"

# GET the fragment info (i.e., metadata) for the fragment you just created using the Location URL/info as an authorized
# user and confirm that the server returns a 200 and that all of the metadata properties match what you expect.

# Try to GET the fragment info we just posted by its URL
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
# 25 is the length of our fragment data
jsonpath "$.fragment.size" == 25

# POST a second Markdown fragment to http://localhost:8080 as the same authorized user.
# The fragment's body should be the Markdown value, DynamoDB is **great**.

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
`DynamoDB is **great**.`

# Confirm that the server returns a 201, and once again capture the Location header value and the second id
# in variables named fragment2_url and fragment2_id.

HTTP/1.1 201
[Captures]
fragment2_url: header "Location"
fragment2_id: jsonpath "$.fragment.id"

# GET the fragment info (i.e., metadata) you just created using the url/info as an authorized user and
# confirm that the server returns a 200 and that all of the metadata properties match what you expect.

GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
# Our fragment ids use UUIDs, see https://ihateregex.io/expr/uuid/
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
# Our ownerId hash is a hex encoded string
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
# Basic check for the presence of created and updated date strings.
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
# 22 is the length of our fragment data
jsonpath "$.fragment.size" == 22

# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs)
# and confirm that the list of fragments includes the two id values you captured above

GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}

# DELETE the first fragment you created above

DELETE http://localhost:8080/v1/fragments/{{fragment1_id}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 200

HTTP/1.1 200

# Try to GET the first fragment again using the url you captured above as the authorized user.

GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

# Confirm that the server returns a 404, since the fragment should be deleted.

HTTP/1.1 404

# GET all of the fragments for the same authorized user without expanding them (i.e., just get back the IDs) a second time,
# and confirm that the first id is NOT included but that the second id is (i.e., that the second was not deleted).

GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" not includes {{fragment1_id}}
jsonpath "$.fragments" includes {{fragment2_id}}
