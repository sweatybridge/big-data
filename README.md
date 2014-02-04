Setup Guide
===
1. install [home brew](http://brew.sh)
        ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"
2. install [nodejs](http://nodejs.org)
        brew install node
3. install [yeoman](http://yeoman.io/)
        npm install -g yo
4. clone this repo
        git clone https://gitlab.doc.ic.ac.uk/lab1314_spring/topics_13.git
5. change to your `topics_13` directory and run
        grunt serve

Deployment
===
1. Compile the website source code
        grunt
2. Upload the entire `dist` folder to our `project directory`

Project Directory
===
Your entire group project directory is accessible via the web as the URL:

        http://www.doc.ic.ac.uk/project/2013/163/g13163xx/

Note: we usually recommend that you put web pages in a subdirectory
of your project directory, for example

/vol/project/2013/163/g13163xx/web/

in which case the above URL would become:

        http://www.doc.ic.ac.uk/project/2013/163/g12163xx/web/

You may also want to add a very restrictive .htaccess file to the top
level directory to disallow web browsing of your entire group project
directory.

For more information about the DoC web server, CGI scripts etc,
please see the CSG web guides found at:

       http://www.doc.ic.ac.uk/csg/guides/web/