# Guardian Angel - Backend

Description of the Guardian Angel backend.

## API Usages:
1. Getting a token (using curl):
    ```
    curl -X POST -H "Content-Type: application/json" -d '{"username":"<username>", "password":"<password>"}' <host>:<port>/api-token-auth/
   ```
   Returns the a dictionary with one single key value pair ("token")
2. List all time series
    ```
   curl -X GET -H "Authorization: Token <token>" <host>:<port>/api/v1/timeseries/
   ```