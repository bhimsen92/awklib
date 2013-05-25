# AwkLib
AwkLib is a small nodejs library for processing record oriented files like csv files.

# Install

With [node.js](http://nodejs.org/) and [npm](http://github.com/isaacs/npm):

    npm install awklib

# Usage
Once you install the library, you can start using the library by loading the module using <b>require</b> function.

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
      this.s.totalAge += parseInt(obj.crow.age);
    });
    p.on("end", function(obj){
      console.log("totalAge: " + this.s.totalAge);
    });
    p.process();
