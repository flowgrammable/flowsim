# Release Notes


## Packet Editor
  The packet editor is a visual framework for constructing packets. A user can 
  create new packets, and edit or delete existing packets. They can also save their 
  new packets or packet modifications so that they will be available upon
  subsequent logins. 
 
### Packet Names
  Packet names currently follow these restrictions:
  * name must not already be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

### Packet Editing
  The packet with the current focus will be displayed in the center of the
  screen. An editor control is on the right side of the screen and allows for
  user manipulation of the packet. Currently all packets are initialized with an
  Ethernet header. 
  
  The user may stack new payloads and delete existing payloads from the packet.
  A payload is selected from the dropdown selector on the editor control. The 
  dropdown selector will display a list of all available protocols for the
  packet. Adding protocols will change the selector list and follow a specific 
  protocol dependency chain.

![Image of PacketEditor](http://flowgrammable.org/static/media/uploads/packet_editor.png )

  Protocol fields may also be modified by the user in the editor control. Select a
  protocol in the stack and a panel will open, inside this panel are a series of
  protocol fields that may be changed. Invalid inputs are indicated with a red
  shadow, and hints are provided with tooltips. The packet display in the center
  of the screen will update as you modify the packet.

## Profile Editor
  The profile editor is a visual framework for managing OpenFlow switch 
  profiles. A switch profile enumerates the capabilities of a type of switch,
  this is similar to an ONF defined Table Type Pattern (TTP). Users can create
  new profiles, and edit or delete existing profiles. Users can also save their 
  new profiles or profile modifications so that they will be available upon
  subsequent logins. 

![Image of ProfileEditor](http://flowgrammable.org/static/media/uploads/profile_editor.png )

  A profile determines the capabilities of a type or category of a switch. The
  underying data model is almost identical to the switch configuration data
  with the exception of managing capabilities and not configuration state. 
  Some of the capabilities a user can decide are:
  - the fragmentation capabilities of the data path
  - the number of ports of the switch
  - the speed and medium of the switch ports
  - the number of tables supported on the switch
  - per table protocol match capability: exact, exact-default, prefix, mask
  - per table instructions supported
  - per table apply actions supported
  - per table write actions supported
  - per table goto restriction sets
 
### Profile Names
  Profile names currently follow these restrictions:
  * name must not already be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Switch Editor
  The switch editor is a visual framework for managing the configuration state
  of a switch. A user can create new switches, and edit or delete existing 
  switches. The user can save their new switch or switch modifications so that
  they will be available upon subsequent logins. 

  The switch editor manipulates the configuration state of a switch. When the
  user creates a new switch they must select a switch profile to instantiate. 
  The newly constructed switch will have immutable capabilities determined by
  the selected profile. The configuration data model expands slightly on the the
  data model exposed in switch profile.

  Users can manage data path behaviors including, for example, the fragmentation
  behavior of the datapath (drop fragments, reassemble fragments, or do nothing
  special for fragments). Ports can be administratively placed into down or up
  states, a visual indication is provided as to the current administrative state
  of the port. Ports can also be placed in semi-blocking states (no receive, no
  forward), as well as masking future packet-in exceptions.

  Tables are arranged by name and, when selected, show a flow table summary. A 
  flow summary is a compact representation of a flow's priority, match set, and 
  instruction set. Selecting an installed flow will open a dialog to configure
  that flow. Deleting an installed flow is possible by clicking on the minus icon 
  by the flow in the flow summary table. Finally, adding a new flow to the table
  is accomplished by setting a flow priority and clicking Add Flow. This action
  will open the flow editor dialog.

![Image of FlowEditor](http://flowgrammable.org/static/media/uploads/switch_editor.png )

  The flow editor lets a user manage the flow's match and instruction sets. The
  match set is a canonical set of matches. Every packet has internal meta data 
  (ingress port information) as well as an Ethernet header fields that can be 
  matched against. However, matching against higher-layer protocol fields 
  requires proving that the higher-layer protocol exists. This is accomplished by
  matching a payload discriminator for the value of the desired protocol. For
  instance, matching Ethernet.type = 0x0800 (IPv4), will make it possible to
  match on IPv4 protocol fields. Matches are deleted from the back of the match
  set.

  Instructions can be added and removed from the instruction set by enabling
  or disabling the relevant instruction button. A meter can be enabled and a
  meter id can be set, which will send a matching packet to the targeted meter. 
  Actions can be added or removed from the Apply and Write instructions. Constant 
  values can be passed to a subsequent table through the metadata register. And
  finally, flow control can jump to subsequent tables by setting the goto target.

  Actions are simple functions that let a user affect the delivery of a packet 
  or modify a packet in some way. Actions set in the Apply action list will 
  immediately be evaluated, while actions in the Write action set will 
  eventually be evaluated. When a packet matches a flow the Apply action list is
  immediately executed, which can modify the packet and deliver the packet to a
  port or group. The action set of the Write is deferred by placing the actions
  into a data structure that follows the packet through the packet processing 
  pipeline. This data structure is the packet's action set.

  The Apply action list has few restrictions; actions can be repeated and there
  are no ordering requirements. However, the Write action set will enforce a
  uniqueness and ordering requirement. Actions are not allowed to repeat 
  themselves in the action set, and they must be evaluated in a specific order.
  The flow dialog will enforce all of these restrictions so the user does not
  have to concern themselves with the details. Finally, the flow dialog enforces
  Apply action safety. This means it prevents a user from using actions on 
  protocol fields that may not exist in the matched packet. This mechanism is
  similar to the protocol discriminator method described above in match sets. 
 
### Switch Names
  Switch names currently follow these restrictions:
  * name must not already be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Simulation Editor

![Image of SimulatorEditor](http://flowgrammable.org/static/media/uploads/simulation_editor.png )

  The simulation editor is a visual framework for constructing traces and 
  managing a simulation. A user can create new traces, and edit or delete existing
  traces. The user can save their new traces or trace modificaitons so that 
  they will be available upon subsequent logins. A trace is a named switch and a
  sequence of packets along with the ports those packets should be injected in 
  the target switch. A user can select any switch or packet which has been 
  constructed through the packet and switch editors. When building a trace the
  user can specify the ingress logical port id, physical port id, and tunnel id
  to be seen by the data plane.

  Once a switch has been selected and at least a single packet has been inserted
  into the trace, the simulation can begin. The simulation can be started by
  pressing the play button on the top left portion of screen.

### Simulation Names
  Simulation names currently follow these restrictions:
  * name must not already be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Simulation Visualization
  Once a simulation begins the user has two controls to run the simulation.
  There is a step button on the top left of the screen which will advance the
  simulation by a single step, and there is a stop button which will cause the 
  simulation to stop and return the user to the simulation editor. At the top
  of the simulation is a pipeline summary with a green shadow representing the
  current progress of the packet through the system. With each subsequent step
  the packet will journey through the pipeline, moving between stages, sometimes
  taking multiple steps per stage. In each stage a visualization is presented to
  the user of the underlying abstract machine processing the packet.

  The pipeline is broken into 7 stages: arrival, extraction, choice, selection,
  execution, groups, and egress. Actual system pipelines may have different 
  organizations than what is presented in Flowsim; however, they must be 
  equivalent in terms of external events. Put another way, the same set of 
  configuration and packet inputs should yield the same set of exception and 
  packet outputs. This means Flowsim provides an excellent vantage point to 
  learn about the pipeline abstractions and how they affect packets flowing
  through the system.

  The arrival stage shows a packet entering the system along with construction 
  and initialization of the data structures that will flow with the packet
  through the pipeline. The primary data structure that flows through the 
  pipeline is the packet context. The context contains the packet key, which is
  a set of values used to determine which flow matches a packet. The packet key
  is initialized with some internal data about how the packet arrived. The
  context is initialized with table and buffer processing information.

  The extraction stage is where a packet is decoded and the packet key is built
  up to contain a larger set of protocol fields. Each protocol header in the 
  packet is decoded in a single step and a subset of the protocol header is 
  copied over to the packet key. In actual systems this stage can be broken up
  and deferred to later in the pipeline. The only absolute ordering is imposed
  by attempting to match or set a protocol field. Flowsim performs a complete 
  packet decode at the front of the pipeline for clarity.

  The choice stage is quite simple and uses the table identifier from the packet
  context to select a single table from the collection of tables. Because the
  pipeline allows for control flow between tables, this stage is the meet point 
  for going to another table.

  The selection stage takes a packet key and a table index and selects the 
  highest priority flow that matches. This flow is added to the context for
  subsequent processing. A packet key does not have to match any flow in the 
  table.

  The execution stage is one of the most interesting stages in the pipeline. In 
  this stage a user can single-step the simulation and see exactly:
  - how instructions are executed
  - how apply actions immediately impact delivery or modify the packet
  - how clear will empty the context's action set
  - how write actions merge into the context's action set
  - how the table identifier is updated
  - how the context will complete table processing or proceed to another table

  The groups stage displays group processing of a packet (all, indirect, select,
  and fast failover). Group processing is currently not supported in Flowsim.

  The egress stage is the final stage of packet processing. In this stage the 
  packet context's action set is executed. A user can step each action in the 
  set and see how it modifies the packet before finally delivering the packet.
