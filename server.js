let express = require('express');
let app = express();
let port = process.env.PORT || 8000;
let fs = require('fs');
let bodyParser = require('body-parser');
let rawData = fs.readFileSync('./storage.json', 'utf8');
let parseData = JSON.parse(rawData); // parse to json

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  res.json(parseData);
});

app.get('/users/:name', (req, res) => {
  let findUser = parseData.find( (user) => {
    return user.name === req.params.name // find the user in json file
  });

  if(findUser){
      res.json(findUser)
    }else {
      res.sendStatus(400);
    }
})

app.post('/users', (req, res) => {
  let users = {
    name: req.body.name,
    email: req.body.email,
    state: req.body.state
  }

  let findUser = parseData.find( (user) => {
    return user.name === req.body.name && user.email === req.body.email && user.state === req.body.state;
  })

  if(!findUser){
    parseData.push(users);
    fs.writeFileSync('./storage.json', JSON.stringify(parseData));
    res.json(parseData);
  } else {
    res.sendStatus(400)
  }
});

app.put('/users/:name', (req, res) => {
  let user = req.body;

  let findUser = parseData.find( (user) => {
    return user.name === req.params.name
  });

  if(findUser){
    let index = parseData.indexOf(findUser);
    parseData[index] = user;
    fs.writeFileSync('./storage.json', JSON.stringify(parseData));
    res.json(user);
  } else {
    return res.sendStatus(400);
  }

});

app.delete('/users/:name', (req, res) => {
  let user = req.body;

  let findUser = parseData.find( (user) => {
    return user.name === req.params.name
  });

  if(findUser){
    let index = parseData.indexOf(findUser);
    parseData.splice(index, 1);
    fs.writeFileSync('./storage.json', JSON.stringify(parseData));
    res.json(user);
  } else {
    return res.sendStatus(400);
  }
})

app.use( (req, res) => {
  res.sendStatus(404);
});

app.listen(port, () => {
  console.log('Listening to port', port);
});
