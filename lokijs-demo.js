const loki = require('lokijs')
const db = new loki('demo.json', {autosave: true, autosaveInterval: 5000, autoload: true })

let mytable = db.getCollection('mytable')
if(mytable == null)  {
	mytable = db.addCollection('mytable', { disableChangesApi: false })
}

mytable.on("pre-update", function(e) {
  console.log("pre-update", e)
})
mytable.on("error", function(e) {
  console.log("error", e)
})
mytable.on("update", function(e) {
  console.log("update", e)
})

let data = mytable.insert({ a: 1 })

data.b = 2
mytable.update(data)

data.a = 5
mytable.update(data)

data.x = [12, 3, 4, 5]
mytable.update(data)

data.x.push(666)
mytable.update(data)

db.saveDatabase()

console.log(mytable)

console.log(JSON.parse(db.serializeChanges(['mytable'])))
