
# A Book -- RESTful API
> RESTful API of Nowhere book store

Tech Stack
- NodeJS
	- Express.js
	- Passport JWT
	- Mysql2
	- Express Validator
- MySQL
- Docker
- Nginx (reverse proxy)
  
## API URL
> https://b.14devlab.co

## API Document
> https://app.swaggerhub.com/apis-docs/thdevss/a-Book/1.0.0

## How to use

1. Clone this repo
2. Create .env file (for database connection config)

    DB_HOST=localhost
    DB_USER=user
    DB_PASS=pass
    DB_NAME=book_a_book
    DB_PORT=3306

3. Run command
``` # docker build . -t a-book-api ```
``` # docker run -p 8888:3000 --env-file ./.env a-book-api ```
