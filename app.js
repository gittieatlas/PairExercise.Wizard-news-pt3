const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/posts');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/posts', postRoutes);
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.redirect('/posts');
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
