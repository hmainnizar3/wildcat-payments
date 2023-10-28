#!/bin/bash

while true; do
  limit=100
  for ((i = 1; i <= limit; i++)); do

    curl --request POST \
      --url http://localhost:3000/api/v1/payments/create \
      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFkYjBkYmM1LTNjMjAtNGQyOC1hOWRhLWE5ZGI1N2ViNGZkYyIsImlhdCI6MTY5ODQ3ODU2OSwiZXhwIjoxNjk5MDgzMzY5fQ._7N0dzkGMabNpD4BkF7E4-Eb9Qik9mrZ36XI_Ad_9_M' \
      --header 'Content-Type: application/json' \
      --header 'User-Agent: insomnia/8.3.0' \
      --data '{
	
	"amount": 299,
	"thirdParty": "8917FYU",
	"currency": "DKK",
	"onBehalfOf": "812801f6-69e6-4059-be19-47e3d2fd271f"
}' &
  done

  # Wait for all background processes to finish
  wait

  # Sleep for 1 second (adjust as needed to maintain the desired rate)
  sleep 1
done
