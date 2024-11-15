var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// Kết nối MongoDB
const mongodb = 'mongodb+srv://admin:MGLGcqehn9qD3ITs@cluster0.z4mdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(mongodb, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch(err => {
      console.log("Failed to connect to MongoDB", err);
    });

// Tạo schema và model cho Ô tô
const carSchema = new mongoose.Schema({
  MaXe: { type: String, required: true },
  Name: { type: String, required: true },
  Price: { type: Number, required: true },
  Year: { type: Number, required: true },
  Brand: { type: String, required: true },
});

const Car = mongoose.model('Car', carSchema);

// Route để hiển thị form nhập liệu
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tạo Ô Tô', errors: null });
});

// Route xử lý khi người dùng gửi form
router.post('/submit', async (req, res) => {
  const { MaXe, Name, Price, Year, Brand } = req.body;
  let errors = {};

  // Validate dữ liệu phía server
  if (!/^[a-zA-Z\s]+$/.test(Name)) {
    errors.Name = 'Tên xe chỉ được chứa chữ.';
  }
  if (isNaN(Price) || Price <= 0) {
    errors.Price = 'Giá xe phải là một số hợp lệ.';
  }
  if (Year < 1980 || Year > 2024) {
    errors.Year = 'Năm sản xuất phải từ 1980 đến 2024.';
  }

  // Kiểm tra nếu có lỗi
  if (Object.keys(errors).length > 0) {
    return res.render('index', { title: 'Tạo Ô Tô', errors, MaXe, Name, Price, Year, Brand });
  }

  // Lưu dữ liệu vào MongoDB nếu không có lỗi
  const car = new Car({ MaXe, Name, Price, Year, Brand });
  try {
    await car.save();
    res.send('Ô tô đã được tạo thành công!');
  } catch (err) {
    res.status(500).send('Có lỗi xảy ra khi lưu dữ liệu.');
  }
});

// Route GET để lấy danh sách Ô tô đã nhập
router.get('/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);  // Trả về danh sách Ô tô dưới dạng JSON
  } catch (err) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy dữ liệu Ô tô.', error: err });
  }
});

module.exports = router;
