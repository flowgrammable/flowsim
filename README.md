# Flowsim

Flowsim is a tool that helps you learn OpenFlow quickly. Flowsim is a completely
self-contained web application, no system configuration necessary. In minutes a
user can configure an OpenFlow switch, and single step a packet through the
OpenFlow pipeline. At each stage in a simulation, internal data structures
are visible, so a user can see exactly how the OpenFlow pipeline operates.

Most people are interested in learning new technologies, tools, and techniques. 
However, the grind of their daily lives sets a limit on the amount of time they 
have, and levels of frustration they are willing to tolerate. If learning 
something new is tedious or time consuming, then the indoctrination rate of the
cool new thing is going to be low.

Flowsim was designed with time concerns in mind. We wanted to teach people
OpenFlow without requiring them to rack and stack equipment, or even configure a
virtual machine. A person using flowsim should be able to do 'something 
interesting' in a matter of minutes with just a few button clicks.

Another key design goal was to visualize the OpenFlow pipeline, and all the
internals of packet processing. We wanted to let users play with differnet
OpenFlow abstrations, change configuration, and see how packets flowed through
the system. 

Flowsim should appeal to a diverse group of people: network engineers, system
adminstrators, software developers, and hardware engineers. By learning the 
foundational abstractions of OpenFlow a user can be better prepared to write 
applications, trouble shoot networks, or even implement the OpenFlow 
specification.

# Flowgramable

Flowgrammable is a nonprofit organization comprised of students, researchers,
and professional engineers, who are focused on network systems education and
research. Originally founded to compete in the Open Networking Foundation's
(ONF) OpenFlow driver competition, Flowgrammable has evolved into a mentoring,
research, and education organization. The organization mentors undergraduate and
graduate students in SDN research, conducts original research, and actively
develops educational and training material.

## Organization

Flowsim is organized as follows ...

The project is organized into the following subdirectories:
- 3rdparty
- doc
- backend
- flowsim-ui

Our project currently uses a 3rd party tool called Flyway for SQL database
migrations. This tool depends on java 1.6 or higher and certain environment
variables being set. The tool is located in the '3rdparty' directory.

Drawings and documentation about the design of the system can be found int
'doc' directory. At the moment this is just a collection of notes and not that
organized.

The RESTful API for the service is located in the 'backend' directory. This is
an HTTP/S server using the Restify javascript framework to modularly serve
RESTful API services. This is our persistence layer for flowsim.

The bulk of the application runs in a modern javascript capable broswer and the
code is located in the 'flowsim-ui' directory. The frontend relies on the
angularjs UI framework and the bootstrap css styling library.

