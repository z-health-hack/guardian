# Hawking's Mate - Backend
The Hawking's Mate backend is responsible for user and data mgmt.

## Development Setup
For a local development setup with PyCharm please follow this instructions:
1. Clone the repository from the console ```git clone https://github.com/z-health-hack/guardian.git```
2. Install Python >3.7 by using pyenv [Help](https://realpython.com/intro-to-pyenv/)
3. Open a new Project in PyCharm: ```File --> Open...``` and select the ```backend``` folder in your cloned repository (make sure you really select the ```backend``` folder)
4. PyCharm should open a new Project for you. Now, go to ```File --> Settings... --> Project: backend --> Python Interpreter``` click on the wheel on the top right and select ```Show all...```
5. If not already present, add a new System Interpreter (it should be located ~/.pyenv/versions/3.7.9/bin/python)
6. Add a new Pipenv Environment (please select for the Base Interpreter the System Interpreter you just added)
7. Go back into the Project explorer and right click on the ```guardian``` folder and select ```Mark Directory As --> Source Root```
8. You're all set and ready to develop

For local development the ```guardian.settings``` can be used. It uses an SQLite instance.

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

# Deploy


eu.gcr.io/health-hack-guardian/guardian-backend:0.0.1
