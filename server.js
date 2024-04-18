const express = require('express');
const app = express();
const fileUpload = require('express-fileupload');
const path = require('path');
const uploadDir = path.join(__dirname, 'static/upload/images');
const fs = require("fs");

app.use(express.json());  
app.use(express.urlencoded( {extended : false } ));

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// 파일 업로드를 위한 미들웨어 설정
app.use(fileUpload());

app.post('/upload/image', (req, res) => {
  if (!req.files) {
    console.log(!req.files);
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const uploadFile = req.files.image;
  const uploadId = uploadFile.name;
  uploadFile.mv(path.join(uploadDir, uploadId), (err) => {
    if (err) {
      console.error('Error saving the file:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    const response = {
      url: `/static/upload/images/${uploadId}`,
      ...req.body,
    };

    return res.json(response);
  });
});

//파일 이미지 내보내기
app.post("/getImage", async (req, res) => { 
    console.log('이미지가져오기')
    console.log(req.body)
    const file = fs.readFileSync(uploadDir + '/' + req.body.fileName);
    const fBase64=  "data:image/png;base64,"+Buffer.from(file).toString('base64');
    res.send(fBase64);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server is listening on port`);
});
app.get('/', (req, res) =>{
    console.log('접속')
    res.send('hihi')
});