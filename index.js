const express = require('express')
const csv = require('csv-parser')
const fs = require('fs')

const app = express()

const config_path = "./data/config.json"
const csv_path = "./data/verkaufsbuch.csv"
const tcp_port = 3000

app.use(express.static('public'))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  let config = JSON.parse(fs.readFileSync(config_path, 'utf-8'))
  console.log(config)

  let csv_data = []

  fs.createReadStream(csv_path)
  .pipe(csv())
  .on('data', (data) => csv_data.push(data))
  .on('end', () => {
    //console.log(csv_data);
    //Array auf ID umbauen
    let verkaufsbuch = []
    for (let row in csv_data) {
      verkaufsbuch[csv_data[row].ID] = csv_data[row].Name
    }
    console.log(verkaufsbuch);

    let bieter = config.bieter
    let gebot = config.gebot
    let maifrau_gebot = config.maifrau
    let maifrau = verkaufsbuch[config.id]
    let nextMF = verkaufsbuch[config.id+1]

    res.render('index', {bieter: bieter, gebot: gebot, maifrau_gebot: maifrau_gebot, maifrau: maifrau, nextMF : nextMF})
  });
})

app.listen(tcp_port, function () {
  console.log('App listening on port ' + tcp_port)
})
