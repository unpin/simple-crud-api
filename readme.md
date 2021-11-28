# In-memory CRUD API

## Getting Started

This is an explanation of how you can start this project on your machine. To get a local copy up and running follow these simple example steps.

### Prerequisites

You should have NodeJS v16.13.0 and npm installed.

### Installation

1. Download the repo from [GitHub](https://github.com/unpin/simple-crud-api/pull/1)

2. Create .env file in the root directory of the project and set PORT of your choosing. (For your convenience the file was created for you.)

    ```
    PORT=3000
    ```

3. Install NPM packages
    ```sh
    npm install
    ```
4. Run the server with one of the following commands
    ```sh
    npm run start:dev       # Starts the server in development mode
    nmp run start:prod      # Starts the server in production mode
    ```

## USAGE EXAMPLES

<br>

-   ## Application provides the following API endpoints:

     <br>

    -   **GET** `/person` or `/person/${personId}` should return all persons or person with corresponding `personId`
    -   **POST** `/person` is used to create record about new person and store it in database
    -   **PUT** `/person/${personId}` is used to update record about existing person
    -   **DELETE** `/person/${personId}` is used to delete record about existing person from database

-   ## Persons are stored as `objects` that have following properties:
    -   `_id` — unique identifier (`string`, `uuid`) generated on server side
    -   `name` — person's name (`string`, **required**)
    -   `age` — person's age (`number`, **required**)
    -   `hobbies` — person's hobbies (`array` of `strings` or empty `array`, **required**)
    ```js
    {
        "_id": UUID,            - Unique identifier
        "name": String,         - required field
        "age": Number,          - required field
        "hobbies": [String]     - required field
    }
    ```
