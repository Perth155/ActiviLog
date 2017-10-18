+-----------------------------------------+
|        ActiviLog v1.0.0 - README        |
+-----------------------------------------+
---------------------------------
 1.0 About
---------------------------------
ActiviLog is a log taking Web Application to be primarily used by clinical placement students and supervisors to gain
a better understanding of clinical placements by data analysis. 
ActiviLog is a Single Page Web Application [1] developed using a MERN full stack [2], consisting of a Node.js backend server, Express 
web framework for routing, Mongo document database and a React.js frontend framework. 
** Please note that a further simplified setup instruction with images can be found in: https://activilog.herokuapp.com/set_up.html

---------------------------------
 2.0 The Team				
---------------------------------
* Peter Joseph ................(Team Leader + Prototyper + Full-Stack developer)...(21284021@student.uwa.edu.au)
* Abrar Amin ..................(Git Repository Manager + Full-Stack developer).....(21518928@student.uwa.edu.au)
* Srdjan Kusmuk ...............(UX Design + Full-Stack Developer)..................(21705391@student.uwa.edu.au)
* Amelita Putri Karunia .......(Front-end developer)...............................(21771045@student.uwa.edu.au)
* Richard Wen .................(Front-end developer)...............................(21805459@student.uwa.edu.au)
* Samuel Brown ................(Site Reliability Engineer).........................(21195938@student.uwa.edu.au)

---------------------------------
 3.0 Requirements
---------------------------------
Please download and install the following software requirements before proceeding:
* git                       [Download and Install from https://git-scm.com/download/ for macOS, Windows, Linux/ Unix]
* Node.js (v8.2.1 or above) [Download and Install from: https://nodejs.org/en/ for macOS, Windows, Linux/ Unix]
* npm (v5.4.2 or above)     [Included with the above]
---------------------------------
   - 3.1 Downloading Project
---------------------------------
Please have the requirements mentioned in Section 3.0 downloaded before proceeding further. 
Open a Command Prompt (cmd.exe) in Windows, or a Bash Terminal on macOS or Linux. 
> git clone https://www.github.com/Perth155/activilog.git
After the repository has been downloaded and cloned to local storage, go to that directory/ folder
by typing in the command on the Command Prompt/ bash terminal:
> cd activilog/
This will take you to the base directory of the project.
----------------------------------
   - 3.2 Building Project
----------------------------------
Please refer to Section 2.0 of INSTALL.txt
----------------------------------
   - 3.3 Installing Project
----------------------------------
Please refer to Section 2.0 of INSTALL.txt

---------------------------------
 4.0 Directory Setup
---------------------------------
The source code of ActiviLog is mostly contained within the client and server directories located in the base directory that was 
downloaded following instructions in Section 3.1. 

The client directory contains primarily frontend elements:
* A directory called "pages" which contains the JavaScript files that handle the dynamic frontend display rendering using ReactJS.
* A directory called "common" which contains directories for images, stylesheets, client-side JavaScript that has unrestricted access. 
Common React JS components were made for display elements such as Footers and Headers which can also be found in this directory.
* A file called "api.js" this works as an intermidiate point between the client side pages and the backend. 
* A file called "index.html" that is used to render the views in.
* A file called "app.js" that handles routing in the frontend.

The server directory contains primarily backend elements:
* A directory called "models" which holds information about the Mongoose schemas for the database. 
* A file called "server.js" communicates with the database, handles all the session management and authentication of users.
* A file called "router.js" handles communications between the frontend and the backend. 

The bin directory contains:
* A single file called "www" which creates the httpServer and is called on start up.

---------------------------------
 5.0 Definitions/ Reference 
---------------------------------
[1] Single Page Web Application

[2] MERN Full Stack
