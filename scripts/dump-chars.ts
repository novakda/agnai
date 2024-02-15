import { MongoClient } from 'mongodb'
import { exportCharacter } from '../common/characters'
import { AppSchema } from '../common/types'
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url)

// Database Name
const dbName = 'agnai'

async function main() {
  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection('character')

  // the following code examples can be pasted here...
  const findResult = await collection.find({}).toArray()
  console.log('Found documents =>', findResult)

  findResult.map((r) => {
    const char:AppSchema.Character = {
        name: r.name,
        kind: 'character',
        userId: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatar: '',
        _id: r._id.toString(),
        persona: r.persona,
        greeting: '',
        scenario: '',
        sampleChat: ''
    }

    // got to cast R to character
    const conv = exportCharacter(char, 'tavern')
    console.log(conv)
  })

  // now do things with the character data
  return 'done.'
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
