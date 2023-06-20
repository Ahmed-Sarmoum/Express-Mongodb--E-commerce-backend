const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()


const app = express()
app.use(cors())
app.use(express.json({limit: "10mb"}))
const PORT = process.env.PORT || 8080
mongoose.set("strictQuery", false)
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("connect to database"))
    .catch((err) => console.log(err))


const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  confirmPassword: String,
  imageProfile: String,
});

const userModel = mongoose.model("user", userSchema)


app.get('/', (req, res) => {
    res.send('Server is running ...')
})

app.post("/signup", (req, res) => {
    const { email } = req.body

    userModel.findOne({ email: email }).then((result) => {
        console.log(result);
        if (result) {
          res.send({message: "Email is already register!!", alert: false})
        } else {
            const data = userModel(req.body)
            const save = data.save()
            res.send({ message: "Successfully sign up", alert: true }); 
        }
    })
});

app.post('/login', (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    userModel.findOne({ email: email }).then((result) => {
        if(result) {
            let dataSend = {
                _id: result._id,
                firstName: result.firstName,
                lastName: result.lastName,
                email: result.email,
                imageProfile: result.imageProfile
            } 

            res.send({ message: "Login is Successfully :-)", alert: true, data: dataSend });
        } else {
            res.send({ message: "Email is not available, please sign up", alert: false });
        }
    })
})


// Product Section

const productSchema = mongoose.Schema({
    name: String,
    category: String, 
    image: String,
    price: Number,
    description: String
})

const productModel = mongoose.model("product", productSchema)

app.post('/saveProduct', (req, res) => {
    console.log('====================================');
    console.log(req.body);
    console.log('====================================');
    const data = productModel(req.body);
    const save = data.save();
    res.send({ message: "Successfully upload", alert: true }); 
})

app.get("/products", async (req, res) => {
    const data = await productModel.find({})

    res.send(JSON.stringify(data));
})

app.listen(PORT, () => console.log("server is running at port:", PORT))