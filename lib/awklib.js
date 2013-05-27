var fs = require("fs"),
    EE = require("events").EventEmitter,
    inherits = require("util").inherits;

function AwkLib(options){
    if(arguments.length == 0){
        throw Error("you must send an options object.");
    }
    this.files = options.files || [];
    this.columns = options.columns || [];
    this.delimiter = options.delimiter || ' ';
    this.recordDelimiter = options.recordDelimiter || null;
    this.header = options.header || false; // shared across all files.
    this.s = {}; // shared object across events[line, begin and end] and files.
}
inherits(AwkLib, EE);

AwkLib.prototype.process = function(){
                            self = this;
                            for(var i = 0; i < this.files.length; i++){            
                                fs.readFile(this.files[i], (function(){
                                    var pos = i;
                                    var localObject = {"currentFile" : self.files[pos]};
                                    self.emit("begin", localObject);
                                    return function(err, data){
                                        if(err) throw err;
                                        else{
                                            /**
                                            * XXX: Need to convert this into evented flow.
                                            */
                                            var readFile = new LineReader(data.toString('utf-8'), self.recordDelimiter),
                                                line, cols, crow;
                                            // read data line by line.
                                            if(self.header)
                                                readFile.getNextLine();
                                            do{
                                                line = readFile.getNextLine();
                                                if(line !== ""){
                                                    // split on delimiter.
                                                    cols = line.split(self.delimiter);
                                                    // set the columnSize.[its global to all files.]
                                                    self.columnsSize = cols.length;
                                                    // get current row in a JSON object.
                                                    crow = self.getCrow(cols);
                                                    localObject.crow = crow;
                                                    self.emit("line", localObject);
                                                }
                                            }while(!readFile.done);
                                            self.emit("end", localObject);
                                        }
                                    }
                                })()
                                ); // end of readFile function call.
                            }
                           };
AwkLib.prototype.getCrow = function(cols){
                            var crow = {},
                                getColumnName;
                            // check whether columns field is set are not.
                            if(this.columns.length == 0){
                                getColumnName = this.getDefaultColumnName;
                            }
                            else{
                                getColumnName = this.getColumnName;
                            }
                            for(var i = 0, len = cols.length; i < len; i++){
                                crow[getColumnName.call(this, i)] = cols[i];
                            }
                            return crow;
                           };
AwkLib.prototype.getDefaultColumnName = function(index){
                                         return "$" + index;
                                        };
AwkLib.prototype.getColumnName = function(index){                                  
                                  return this.columns[index];
                                 };
                           

function LineReader(data, recordDelimiter){
    this.data = data;
    this.begin = 0;
    this.size = data.length;
    this.recordDelimiter = recordDelimiter || '\n';
    this.done = false;
}

LineReader.prototype.getNextLine = function(){
                                    var tbuffer = "";
                                    for(var i = this.begin; i < this.size; i++){
                                        if(this.isLineBoundary(this.data[i])){
                                            tbuffer = this.data.substring(this.begin, i);
                                            break;
                                        }
                                    }
                                    this.begin = i + this.recordDelimiter.length;
                                    this.done = (this.begin >= this.size);
                                    return tbuffer;
                                   };
                                   
LineReader.prototype.isLineBoundary = function(c){
                                        return c == this.recordDelimiter;
                                      }
module.exports = AwkLib;
