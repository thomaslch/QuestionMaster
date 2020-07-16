# QuestionMaster

This project aims to implement a real-time questionnaire game using sockets. 

## Stack used
* React and Laravel Blade as front-end
* Laravel as question handler and main backend
* NodeJS and socket.io as websocket service provider

## Installation

1. Clone the repository
2. `docker-compose up`
3. `cd` into `.\QuestionMaster` and download dependencies by running `composer install` and `yarn`
4. `yarn run watch`
5. `nodemon socket-server.js`
6. Inside the php image, run `php artisan queue:listen`