# Activilog
![Activilog Logo](https://i.imgur.com/9iWt0IF.png)
A supervised activity log single-page web application, created using a MERN full stack.


## Prerequisites
* [Node.JS](https://nodejs.org/en/download/)
* [Yarn](https://yarnpkg.com/en/docs/install)
* git 
* heroku-cli (for deploying test builds on heroku only).

## Running the node webserver from localhost
Clone this repository
```
$ git clone https://github.com/activilog/activilog.git && cd activilog
```
Get the ```.env``` file from the shared [Google Drive directory](https://drive.google.com/drive/u/0/folders/0B281UB9AbcZhc0JRczd1Vnd1SFk) if you are already a contributor, or by contacting a contributor if not. Place it on the root directory of the project.

Install all dependencies and run webpack to create a bundled (transcompiled) JavaScript file, and starting the NodeJS server localy. 
```
$ yarn install
$ yarn webpack && yarn dev
```
The web application should be running on ```http://localhost:3000```

## Deploy on Heroku
Start Heroku
```
$ heroku login
$ heroku create [appname]
```
**Alternatively**, only if you have access to ActiviLog's heroku credentials, 
```
$ heroku git:remote -a activilog  
```
By default heroku installs production dependencies only. To install the dev dependencies [disable production mode](https://devcenter.heroku.com/articles/nodejs-support)
```
$ heroku config:set NPM_CONFIG_PRODUCTION=false
```
Set your environment variables (see ```.env```)
```
$ heroku config:set <VARIABLE> = <VALUE>
```
Send your files to the new instance 
```
$ git push heroku master
```
Run the server
```
$ heroku ps:scale web=1
```
Check on the server status
```
$ heroku ps
```
Launch the deployed web app on a web browser
```
$ heroku open
```
[Currently deployed on Heroku](https://activilog.herokuapp.com/)


## TODO
* Add seperate PROD database (via config.json file to be gitignored)
* Add email client to verify accounts to prevent spam accounts/ bots.
* Make the "Add Account" Feature a "Send Invitation" feature instead (admin shouldn't be able to reset user PW anymore).
* Get plots working... Use existing npm packages for this potentially.

## Contributors 
* Peter Joseph 
* Abrar Amin
* Srdjan Kusmuk 
* Richard Wen
* Amelita Putri Karunia
* Samuel Browne

