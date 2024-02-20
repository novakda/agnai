import * as fs from 'fs';
import * as path from 'path';
const png = require('png-metadata');


import { MongoClient } from 'mongodb'
// import { exportCharacter } from '../common/characters'
import { AppSchema } from '../common/types'
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

// Database Name
const dbName = 'agnai'

function ensureFolder(folder: fs.PathLike) {

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }

}

async function main() {

  const dumpFolder = path.resolve(__dirname, 'dump')
  const avatarBaseFolder = path.resolve('C:\\main\\aigithub\\agnai\\dist')
  console.log(avatarBaseFolder)

  ensureFolder(dumpFolder)

  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection('character')

  // the following code examples can be pasted here...
  const findResult = await collection.find({}).toArray()
  console.log('Found documents =>', findResult)

  findResult.map((r) => {
    const char: AppSchema.Character = {
      name: r.name,
      kind: 'character',
      userId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avatar: r.avatar ?? undefined,
      _id: r._id.toString(),
      persona: r.persona,
      greeting: r.greeting,
      scenario: r.scenario,
      sampleChat: r.sampleChat
    }

    const DEFAULT_AVATAR = "C:\\main\\aigithub\\agnai\\web\\asset\\agnai_bg-circle.png"

    // if (char.avatar) {
      const avatarFile = char.avatar ? path.join(avatarBaseFolder, char.avatar) : DEFAULT_AVATAR

      const outFile = path.join(dumpFolder, `${r._id}.png`)
      console.log(avatarFile, outFile)

      let actualPng = DEFAULT_AVATAR

      if (fs.existsSync(avatarFile)) {
          actualPng = avatarFile
      }

      var s = png.readFileSync(actualPng);
      // split
      var list = png.splitChunk(s);
      // append
      var iend = list.pop(); // remove IEND
      var newchunk = png.createChunk("aaAa", "test data");
      list.push(newchunk);
      list.push(iend);
      // join
      var newpng = png.joinChunk(list);
      // save to file
      fs.writeFileSync(outFile, newpng, 'binary');
        
    // }

  })

  // now do things with the character data
  return 'done.'
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
