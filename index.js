const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const fs = require('fs');
const sharp = require('sharp');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => res.render('pages/index'));

app.get('/g/', (req, res) => {
          const getStr = "こんにちはGetさん。";
          res.json({method: getStr});
          }
       ); // GET追加

app.use(bodyParser.text({type: 'text/plain'}));

app.post('/p/', (req, res) => {
          //POSTされた文字列を取得
          const postStr = req.body;
          //取得した文字列をデコード
          const decode = Buffer.from(postStr,'base64');
          //最終的に返すエンコード文字列変数
          var encode = 'test';
          
          //デコードされたファイルをHerokuの一時フォルダに保存
          fs.writeFile('/tmp/tmp.png', decode, function(err) {
                    //encode = 'writeFile';
                    console.log(err);
          });
          
          //Sharpによる画像変換
          sharp('/tmp/tmp.png')
                    .tiff({compression: 'lzw'})
                    .toFile('/tmp/tmp.tiff');
          
          //TIFF形式に変換したファイルをエンコード
          fs.readFile('/tmp/tmp.tiff', 'base64', function(err, data) {
                    if (err) encode = err;
                    
                    //encode = 'ENCODE';
          });
          encode = 'Last';
          //エンコード文字列をJSON形式で返す
          res.json({method: encode});
          }
       ); // POST追加

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));
