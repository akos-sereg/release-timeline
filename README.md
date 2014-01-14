release-timeline
================


**Description**   
Release Timeline is an extension of the [SIMILE Timeline][url-simile] Project developed by Massachusetts Institute of Technology. This project allows you to manage timeline content dynamically (persisted in SQLite database), while SIMILE Timeline widget itself can be used to reflect static content only (XML document).   
(See image at the bottom of the page to get the idea)

[url-simile]: http://www.simile-widgets.org/timeline/  "Title"

**Features**
*   Add *event* or *phase* to *Workstream*
*   Create new *Workstream*
*   Load and Modify existing *events* or *phases*
*   Delete existing *events* or *phases*
*   Browse *events* and *phases* by search pattern and classification
*   Supports MySQL database as well

**Install**   
Default SQLite database contains sample release-timeline -related *events* and *phases*, just to show the basic idea of the project.  

Prerequisites:

    $ apt-get install libdancer-perl
    $ apt-get install libdancer-plugin-database-perl
    $ apt-get install libtemplate-perl
    $ apt-get install libtemplate-perl
    $ apt-get install libjson-perl
    $ apt-get install libdb-sqlite3-perl
    $ apt-get install sqlite3

Having all dependencies installed, just simply start app.pl

    $ cd release-timeline/bin
    $ ./app.pl

Now you should be able to load the page in your browser:
    
    http://127.0.0.1:3000/ProjectPlan/web/index.html


**Technical details**

The backend is a **Perl** script using **Dancer** app framework, which communicates with a **jQuery/SIMILE Timeline** frontend using **jquery-ajax** and they speak JSON to understand each other :)


![Screenshot](https://raw.github.com/akos-sereg/release-timeline/master/doc/release-timeline.PNG "Release Time screenshot")

