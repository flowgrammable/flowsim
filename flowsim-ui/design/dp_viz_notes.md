pipelines viz notes
-------------------
Dataplane is composed of individual pipeline stages.
Each stage in the pipeline should be individually testable and requires three functions...

Definition of context
---------------------
* passed between stages


Definition of pipeliene
-------------------------
* specify order of elements


Definition of stage
-------------------------
**stage configuration**
* should be able to configure stage

**play(ctx)**
* get input ctx from dataplane or previous stage
* setup pipeline abstraction
* setup viz if any

**step()**
* step through abstraction
* step resolution up to pipeline author ( entire stage one step vs stage is multiple steps)
* each step modifies ctx
* each step should trigger a viz (state snapshot)

**done()**
* clean up stage
* clean up viz html
* output ctx

Questions
* How should the data that is passed between stages be modeled?
