# QuestionMaster

This project aims to implement a real-time questionnaire game using sockets. 

## Installation

1. Clone the repository
2. `docker-compose up`
3. `cd` into `.\QuestionMaster` and download dependencies by running `composer install` and `yarn`
4. `yarn run watch`
5. `nodemon socket-server.js`
6. Inside the php image, run `php artisan queue:listen`