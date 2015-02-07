# Release Notes


## Packet Editor
  The packet editor is a visual framework for constructing packets. A user can 
  create new packets, edit and delete existing packets. The user can save their 
  new packets, or packet modificaitons, so that they will be available upon
  subsequent logins. 
 
### Packet Names
  Packet names currently follow following naming restrictions:
  * name must already not be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

### Packet Editing
  The packet with the current focus will be displayed in the center of the
  screen. An editor control is on the right side of the screen and allows for
  user manipulation of the packet. Currently all packets are initialized with an
  Ethernet header. 
  
  The user may stack new payloads, and delete existing payloads from the packet.
  A payload is selected from the drop down selector on the editor control. The 
  dropdown selector will display a list of available protocols for adding to the
  packet. Adding protocols will change the selector list, following a specific 
  protocol dependency chain.

  Protocol fields may be modified by the user in the editor control. Select a
  protocol in the stack and a panel will open, inside this panel are a series of
  protocol fields that may be changed. Invalid inputs are indicated with a red
  shadow, and hints are provided with tooltips. The packet display in the center
  of the screen will update as you modify the packet.

## Profile Editor
  The packet editor is a visual framework for constructing packets. A user can 
  create new packets, edit and delete existing packets. The user can save their 
  new packets, or packet modificaitons, so that they will be available upon
  subsequent logins. 
 
### Profile Names
  Profile names currently follow following naming restrictions:
  * name must already not be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Switch Editor
  The packet editor is a visual framework for constructing packets. A user can 
  create new packets, edit and delete existing packets. The user can save their 
  new packets, or packet modificaitons, so that they will be available upon
  subsequent logins. 
 
### Switch Names
  Switch names currently follow following naming restrictions:
  * name must already not be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Simulation Editor
  The packet editor is a visual framework for constructing packets. A user can 
  create new packets, edit and delete existing packets. The user can save their 
  new packets, or packet modificaitons, so that they will be available upon
  subsequent logins. 
 
### Simulation Names
  Simulation names currently follow following naming restrictions:
  * name must already not be in use
  * name must match the regex ^[a-zA-Z_][a-zA-Z0-9_]*$

## Simulation Visualization
