pipelines viz notes
-------------------
Dataplane is composed of individual pipeline stages.
Each stage in the pipeline should be individually testable and requires three functions...

**play(data)**
* get input data from dataplane or previous stage
* setup pipeline abstraction
* setup viz if any

**step()**
* step through abstraction
* step resolution up to pipeline author ( entire stage one step vs stage is multiple steps)
* each step modifies data
* each step should trigger a viz

**done()**
* clean up stage
* clean up viz html
* output data

Questions
* How should the data that is passed between stages be modeled?
