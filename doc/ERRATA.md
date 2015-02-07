# Unsupported Features

| Name               | Description                                                 |
|====================|=============================================================|
| Groups             | OpenFlow Group tables: all, indirect, select, fast-failover |
| Meters             | OpenFlow Meters: remark, discard                            |
| Profile preselects | Initializes a profile based on an OpenFlow version          |

# Known Issues

1. Write Action Safety

  Currently, flowsim will not stop you from creating potential unsafe action 
  sets in a write instruction. The unsafe action will generate an exceptuion
  during simulation. This will be addressed in a subsequent release.


