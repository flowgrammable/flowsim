# Unsupported Features

|  Name                | Description                                                   |
|:---------------------|:--------------------------------------------------------------|
|  Groups              | OpenFlow Group tables: all, indirect, select, fast-failover   |
|  Meters              | OpenFlow Meters: remark, discard                              |
|  Profile preselects  | Initializes a profile based on an OpenFlow version            |
|  Port stats          | View of active port statistics                                |
|  Flow properties     | cookie, hard_timer, idle_timer, flow_removed, etc.            |
|  Write safety        | Prevent unsafe write actions across tables                    |
|  PacketIn            | Visualize PacketIn exceptions                                 |
|  PacketOut           | PacketOut injection                                           |

# Known Issues

1. Write Action Safety

  Currently, flowsim will not stop you from creating potential unsafe action 
  sets in a write instruction. The unsafe action will generate an exceptuion
  during simulation. This will be addressed in a subsequent release.

2. Metadata register

  The metadata register in the packet context is not being visualized. A user
  can not see this value in the execution view.
  
3. Push Tag Action

  Currently it is not possible to add the Push Tag Action to flows that do not 
  match on the tag attempting to be pushed. This will be addressed in the next
  release.
  
4. Match Sequence MPLS/L3/L4

  There is an issue with match set construction that prevents the creation of 
  the match sequence MPLS/L3/L4. This will be addressed in the next release
  

