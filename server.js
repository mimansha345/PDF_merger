import express from 'express';
import path from 'path';
import multer from 'multer';
// const express = require('express')
// const path = require('path')
import { fileURLToPath } from 'url';
// const multer  = require('multer')
import { mergePdfs } from './merge.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// const {mergePdfs} = require('./merge')

const app = express()
const upload = multer({ dest: 'uploads/' })
app.use('/static', express.static('public'))
const port = 3000

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,"templates/index.html"))
})

app.post('/merge', upload.array('pdfs', 2), async (req, res, next) => {
  console.log(req.files);
  console.log(req.files.length);
  console.log(req.files[0]);
  try {if( req.files.length < 2) {
    return res.status(400).send('Please upload two pdf files.');
  }

  let d = await mergePdfs(path.join(__dirname, req.files[0].path), path.join(__dirname, req.files[1].path))

  if(!d) {
    return res.status(500).send('Failed to merge PDFs');
  }
  res.redirect(`http://localhost:3000/static/${d}`);}catch(error){
  console.error('Error merging PDFs:', error);
  res.status(500).send('Internal server error.');
  }
  //res.send({data: req.files})
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
})

// app.post('/', (req, res) => {
//   res.send(path.join(__dirname, "templates/index.html"))
// })

app.listen(port, () => {
  console.log(`Example app listening on port https://localhost:${port}`)
})