class SessionBuilder {
    constructor() {}
  
    createSession(onSuccess = console.log, onFailure = console.error) {
      if (typeof(google) != 'undefined')
        this.createGoogleSession(onSuccess, onFailure);  
      else
        this.createDebugSession(onSuccess, onFailure);
    }
  
    createGoogleSession(onSuccess = console.log, onFailure = console.error) {
      const sessionInsert = this.insert;
      const sessionProcessWebgazerData = this.processWebgazerData;
      this.getSessionId(function(id) {
        onSuccess(new Session(id, sessionInsert, sessionProcessWebgazerData))
      }, onFailure);
    }
  
    createDebugSession(onSuccess = console.log, onFailure = console.error) {
      console.log("Running debug session");
      const debugSessionId = -1;
      const debugInsertFunction = (data) => {
        console.log(JSON.parse(JSON.stringify(data)));
      }
      onSuccess(new Session(debugSessionId, debugInsertFunction, this.processWebgazerData));
    }
  
    getSessionId(onSuccess, onFailure) {
      google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).GetSessionID()
    }
  
    insert = (id, data, onSuccess, onFailure) => {
      google.script.run.withFailureHandler(onFailure).withSuccessHandler(onSuccess).Insert(id, data)
    }
  
    processWebgazerData = (data, target) => {
      if (!data.webgazer_data) {
        return;
      }
      if (!data.webgazer_data.length) {
        delete data.webgazer_data;
        delete data.webgazer_targets;
        return;
      }
  
      let accumulator = {
        x: 0,
        y: 0,
        count: 0
      }
  
      for (let sample of data.webgazer_data) {
        accumulator.x += sample.x;
        accumulator.y += sample.y;
        accumulator.count++;
      }
  
      data.webgazerAttributes = {
        averageX: accumulator.x / accumulator.count,
        averageY: accumulator.y / accumulator.count 
      };
      data.fixationAttributes = data.webgazer_targets[target].value;
      delete data.webgazer_data;
      delete data.webgazer_targets;
    }
  }
  
  class Session {
    id
    insert
    processWebgazerData
  
    constructor(id, insert, processWebgazerData) {
      this.id = id;
      this.insert = data => {
        insert(id, data, () => {}, console.error);
      }
      this.processWebgazerData = processWebgazerData;
    }
  }