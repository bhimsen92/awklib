# AwkLib
AwkLib is a small nodejs library for processing record oriented files like csv.

# Install

With [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

    npm install awklib

# Usage
Once you install the library, you can start using it by loading <b>require</b> function.

    /*
        sample.csv
        xyz,abc,10
        abc,abc,10
    */
    var AwkLib = require("awklib");
    var options = {
                    files: [ "sample.csv" ],
                    columns: ["first_name", "last_name", "age" ],
                    header: false,
                    delimiter: ','
                  };
    var p = new AwkLib(options);
    p.on("begin", function(obj){
      this.s.totalAge = 0;
    });
    p.on("line", function(obj){
      this.s.totalAge += parseInt(obj.crow.age); // crow => current row.
    });
    p.on("end", function(obj){
      console.log("totalAge: " + this.s.totalAge); // output will be 20      
    });
    p.process();


<b>options</b> object is made up of four properties:

1. files  

  It is an array of file names which you want to process.

2. columns

  It is an array of column names which is used to identify fields in each line of the file. If you do not specify any
  column names then you can pick fields based on thier position like $0 for first field, $1, $2.. etc.

3. header

  To indicate whether file contains header or not. If set to true, header line will be skipped and no <b>line event</b> will
  be fired. default is set to false.

4. delimiter

  delimiter is the character which separates fields in a line of the given file. default is set to space.

Once options object is built, you can use it to instantiate AwkLib Object. options object is a must for AwkLib object 
to instantiate. AwkLib object is an Event Emitter and emits following three events.

1. begin

   This event is emitted once before the first line event for each file.

2. line

   This event is emitted whenever a line is seen.

3. end

   This event is emitted when processing a file is finished.

Each of this above events callbacks recieves a <b>object</b> which local to the current file being processed and is shared across all these events.
This local object contains a property called <b>crow</b> which represents the row which is being procesed. You can reference columns or fields
via this <b>crow</b>object. You can also use it to set some properties to gather some statistics like totalAge, totalPopulation,
totalRunsScored, average etc.

There is one more object called <b>s(shared)</b> which is visible across all files and is a property of AwkLib object.
You can use to gather statistics across all the files.

# Examples

    /*
        population files.
        
        asia.csv
        india,100
        chine,200
        srilanka,50
        
        europe.csv
        russia 70
        germany 60
        
        var AwkLib = new AwkLib("awklib");
        
        var options = {
                         files: [ "asia.csv", "europe.csv" ],
                         header: false,
                         delimiter: ','
                      };
        var p = new AwkLib(options);
        
        p.on("begin", function(obj){
            // this.s is the shared object across all files, shared across all the events[begin, line, end ].
            if(this.s["totalPopulation"] === undefined)
                this.s.totalPopulation = 0;
            obj.cpopulation = 0; // obj is the local object for the file currently being executed. shared across events [begin, line, end]            
        });
        
        p.on("line", function(obj){            
            obj.cpopulation += parseInt(obj.crow.$1);
            this.s.totalPopulation += obj.cpopulation;
        });
        
        p.on("end", function(obj){
            // obj.currentFile holds, name of the file currently being processed.
            console.log("Total population for file: " + obj.currentFile + ": " + obj.cpopulation);
            if(obj.currentFile == "europe.csv")
                console.log("Total Population: " + this.s.totalPopulation);
        });
        
        p.process();
    */
