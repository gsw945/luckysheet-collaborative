const loki = require('lokijs');
const path = require('path');
const LokiFSStructuredAdapter = require('lokijs/src/loki-fs-structured-adapter');

let dbFile = path.resolve(__dirname, './demo2.json');

let Db = new loki(dbFile, 
  { 
    verbose: true,
    autosave: true, 
    autoload: true,
    autosaveInterval: 1000,
    adapter: new LokiFSStructuredAdapter(),
    autoloadCallback: databaseInitialize,
    autosaveCallback: () => { 
      console.log('autosaved db'); 
    }
  }
);

function databaseInitialize(cb) {
  let entries = Db.getCollection('test');

  if (entries === null) {
    console.log('test collection is empty, ADDING new collection test');
    entries = Db.addCollection('test', { unique: ['id'] });
    entries.insert({id: 1, test: 'test'});
    entries.insert({id: 2, test: 'test2'});
    entries.insert({id: 3, test: 'test3'});
  }
  cb();
}

const loadDb = (cb) => {
  databaseInitialize(callback => {
    Db.loadDatabase({}, function (err) {
      if (err) console.error('db load errors', err);
      cb({
        Db: Db,
        test: Db.getCollection('test')      
      });
    }); 
  });
};

// module.export = loadDb; 
// then use loadDb in other file like index.js

loadDb(({Db, test})=> {
  console.log('db loaded', Db);
  console.log('entries in db collection test', test.find());
});
