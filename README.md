# Flowsim

Flowsim is a tool that helps you learn OpenFlow quickly. It is a completely
self-contained web application, no system configuration is necessary. In minutes
a user can configure an OpenFlow switch and single-step a packet through the
OpenFlow pipeline. At each stage of a simulation, internal data structures
are visible, so a user can see exactly how the OpenFlow pipeline operates.

Most people are interested in learning new technologies, tools, and techniques. 
However, the grind of their daily lives sets a limit on the amount of time they 
have, and levels of frustration they are willing to tolerate. If learning a new
technology is tedious or time consuming, adoption will often stall.

Flowsim is designed with time concerns in mind. We want to teach people
OpenFlow without requiring them to rack and stack equipment, or even configure a
virtual machine. Flowsim allows users to do 'something interesting' in a matter
of minutes with only a few button clicks.

Another key design goal is to visualize the OpenFlow pipeline, and all the
internals of packet processing. We want to let users play with different
OpenFlow abstractions, change configuration, and see how packets flow through
the system. 

Flowsim appeals to a diverse group of people: network engineers, system
administrators, software developers, and hardware engineers. By learning the 
foundational abstractions of OpenFlow, users are better prepared to write 
applications, troubleshoot networks, and even implement the OpenFlow 
specification.

# Flowgrammable

Flowgrammable is a nonprofit organization comprised of students, researchers,
and professional engineers, who are focused on network systems education and
research. Originally founded to compete in the Open Networking Foundation's
(ONF) OpenFlow driver competition, Flowgrammable has evolved into a mentoring,
research, and education organization. The organization mentors undergraduate and
graduate students in SDN research, conducts original research, and actively
develops educational and training material.

## Organization

The Flowsim project is organized into the following subdirectories:
- 3rdparty
- doc
- backend
- flowsim-ui

Our project uses a 3rd party tool called Flyway for SQL database migrations.
This tool depends on Java 1.6, or higher, and certain environment variables
being set. The tool is located in the '3rdparty' directory.

Drawings and documentation about the design of the system can be found in the
'doc' directory. At the moment this is just a collection of notes and not yet
fully organized.

The RESTful API for the service is located in the 'backend' directory. This is
an HTTP/S server using the Restify JavaScript framework to modularly serve
RESTful API services. This is our persistence layer for Flowsim.

The bulk of the application runs in a modern JavaScript capable browser and the
code is located in the 'flowsim-ui' directory. The frontend relies on the
angularjs UI framework and the bootstrap css styling library.

