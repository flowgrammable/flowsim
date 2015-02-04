
# Generic Abstractions

In future versions of flowsim we will be moving towards a more abstraction
definition of the packet processing pipeline. The goals of this new set of
abstrations are:
* clean separation between UI and data plane abstractions
    - support execution of data plane without UI components
* simplify how a user defines new protocols
* support user defined data plane stages
* support user defined pipeline organization

## Data plane abstractions

### Context - a data structure that flows through the pipeline
* construct - construct a new context
  - packet
  - meta data (time of arrival, etc.)
* clone - produce a unique object copy that has an equal value

### Stage   - a context processing element found in the data plane
* construct - construct a new stage
* configure - change the configuration state of a stage
* step      - execute a single step of stage execution
* stapshot  - current stage state visible to the outside world

### Pipeline - collection of stages and their associated data flow
* construct  - construct a pipeline organization
* add        - add stages to the pipeline
* connect    - connect stages within the pipeline
* step       - execute a single step of the next active stage

## Data plane UI compents


