var AwkLib = require("../lib/awklib");

var options = {
                files: ["../samples/sample_1.csv"],
                delimiter: ',',
                recordDelimiter: '$'   
              };
var p = new AwkLib(options);

p.on("begin", function(f){
   this.s.totalAge = 0; 
});

p.on("line", function(f){
   this.s.totalAge += parseInt(f.crow.$1);
});

p.on("end", function(f){
    if(this.s.totalAge == 24)
        console.log("simple_test => pass");
    else
        console.log("simple_test => fail");
});

p.process();
