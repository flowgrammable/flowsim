Flowsim angular module structure
------
The flowsim root module depends on application specific feature modules flowsim.X. Feature modules may depend on 3rd party modules such as ui.router, ui.bootstrap. 

**flowsim (root)** 
- core
- widgets
- subscriber
- packet
- profile
- switch
- simulation

**flowsim.core** 
- datastore
- networking
- ui-router

**flowsim.widgets**
- fgpacketview
- fglist
- resuable dataplane widgets
- share with friend widget

**flowsim.subscriber**
- Session
- credentials manager
- sharing?

**flowsim.packet**
 - PacketManager (CRUD and sharing)
 - PacketBuilder
    - GUI
    - pcap

**flowsim.profile**
 - ProfileManager
 - ProfileBuilder
    - GUI
    - TTP
 - ProfileExporter
    - TTP

**flowsim.switch**
 - SwitchManager
 - SwitchBuilder
    - Import
    - Custom
 - Switch Exporter

**flowsim.dataplane**
- DataplaneManager
- DataplaneBuilder (programmable dp)

**flowsim.simulation**
- TraceManager
- TraceBuilder
- TracePlayer
- TraceExport
