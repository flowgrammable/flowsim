# Unsupported Features

| Name               | Description                                                 |
|====================|=============================================================|
| Groups             | OpenFlow Group tables: all, indirect, select, fast-failover |
| Meters             | OpenFlow Meters: remark, discard                            |
| Profile preselects | Initializes a profile based on an OpenFlow version          |
| Port stats         | View of active port statistics                              |
| Flow properties    | cookie, hard_timer, idle_timer, flow_removed, etc.          |
| Write safety       | Prevent unsafe write actions across tables                  |
| PacketIn           | Visualize PacketIn exceptions                               |
| PacketOut          | PacketOut injection                                         |

# Known Issues

1. Write Action Safety

  Currently, flowsim will not stop you from creating potential unsafe action 
  sets in a write instruction. The unsafe action will generate an exceptuion
  during simulation. This will be addressed in a subsequent release.

2. Metadata register

  The metadata register in the packet context is not being visualized. A user
  can not see this value in the execution view.

