# The Chatrooms - Stream 3 Final Project (http://)

## Description
The Chatrooms. A place where you can meet and chat to people that share a common interest with yourself with real-time messaging. 

### Why I chose this project! 
With a year expierence in a junior development role, I decided to choose the instant-messaging website to try test my abilites with something challenging. While I am not 100% happy with the outcome of the project due to time constraints, I feel alot more confident that I would be able to get involved with more complicated projects in the future.

### Who/What is this app for?
The Chatrooms is for anyone and everyone. Sign up, join a room that interests you, if there are none available and you have a subscription, create one. Start chatting. IT is as simple as that.


### Current Features. 
Users:
    -   User Account: User can register for an account. User can edit their profile, choose a profile picture. This image will show beside evey User message posted.
    -   Subscription: A subscription provides the user the ability to create new rooms. 

Chatrooms:
    -   Displays a list of messages between all users from a chatroom. In batches of 50.
    -   When user scrolls to top of screen, will append another batch of messages to the list. 
    -   Searching. There ais the ability to search for rooms, rooms a user is already part are not included.


### Features I would have liked to implement.
The main reason thee features have been left out is due to time. Private messaging also lacks a clean implementation. 

    -   Private Messaging: I really would have liked to implement this feature. I couldn't find a nice way of implementing the private room. 
    -   As part of the subscription I wanted to limit the number of rooms a user could join. A free account was to be 10 and a subscription was to be 20. 


## Tech Used

### Some the tech used includes:
- [Django](https://www.djangoproject.com/)
    - Used Django to create the REST api 
- [Bootstrap](http://getbootstrap.com/)
    - Used **Bootstrap** to give our project a simple, responsive layout
- [Bootswatch](https://bootswatch.com/united/)
    - Used **Bootswatch** theme "Superhero" with the google font Kanit for the style of the site
- [AngularJs](https://angularjs.org/)
    - Used AngularJs to build the front-end of the website.
- [NPM](https://www.sqlalchemy.org/)
    - **SQLAlchemy** is used interact with our database tables. 
- [Bower](https://flask-migrate.readthedocs.io/en/latest/)
    - Used for applying databaase migrations. Any changes to the Models could easily be applied to the database with this package
- [Angular-Payments](https://github.com/laurihy/angular-payments)
    - Provides validation and formatting of paymnets form.  
- [ng-file-upload](https://github.com/danialfarid/ng-file-upload/blob/master/README.md#full-reference)
    - Simple directive to make the uploadinf of profile images easy. 
- [socket.io](https://socket.io/)
    - Socket.io has been choosen to handle the real-time messaging in the chatrooms. 
- [Github](https://github.com)
    - Used for version control
- [Heroku](https://heroku.com)
    - Used to deploy the website.

### Getting the code up and running
1. Firstly you will need to clone both repositories by running the ```git clone https://github.com/horan5034/chatroom-server.git  https://github.com/horan5034/chatroom-client.git``` command in a folder that will house the projects.
2. To get the front-end up and running you will need to make sure that you have **npm** and **bower** installed
  1. You can get **npm** by installing Node from [here](https://nodejs.org/en/)
  2. Once you've done this you'll need to run the following command:
     `npm install -g bower # this may require sudo on Mac/Linux`
3. When all dependencies have been installed, start the app by running node server.js or nodemon server.js (if you have nodemon installed)
4. To get the back-end running, first you will need to create a virtualenv. In command terminal, navigate to chatroom-server root foler and run virtualenv <name> 
5. Once created, activate the virtualenv with env\Scripts\activate. 
6. Then navigate into the server folder, and install the requirements with command ```pip install -r requirements.txt```
7 Finally, run python manage.py runserver to start the back-end project.

Credits: 
    Credit for loading spinner http://tobiasahlin.com/spinkit/
    I have used Bootswatch Theme (credit is also acknowledged at the top of the bootstrap.css file in the static folder)
