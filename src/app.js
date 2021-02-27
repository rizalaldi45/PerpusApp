let express = require('express')
let hbs = require('hbs')
let path = require('path')
let axios = require('axios')
let bodyParser = require('body-parser')
let app = express()
let auth = require('../middleware/auth')

let port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup Handlebars Engine And View Location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)
hbs.registerHelper('incremented', function (index) {
    index++;
    return index;
});

//Setup Static Directory To Serve
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())

// routing
app.get('/', (req, res)=>{
    res.render('index', {
        tittle : "Index Page"
    })
})
app.get('/login', (req, res)=>{
    res.render('login', {
        tittle : "Login Page"
    })
})
app.get('/content', (req, res)=>{
    res.render('content', {
        tittle : "Content Page"
    })
})
// end routing

// paginate manipulation
let a = 1
adds = ()=>{
    a++;
}
mins = ()=>{
    if(a === 1){
        mins() = null;
        alert("Anda Berada Di Halaman Awal")	
     }
    a--;
}
// end

app.get('/adminPanel', async (req, res)=>{
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/get`)
        const bookData = response.data
        res.render('adminPanel', {
            data : bookData
        })
    }catch(e){
        res.render('adminPanel', {err : "Internal Server Error !"})
    }
})
app.get('/adminPanelNext', async (req, res)=>{
    adds()
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/get?page=${a}`)
        const bookData = response.data
        res.render('adminPanel', {
            data : bookData
        })
    }catch(e){
        res.render('adminPanel', {err : "Internal Server Error !"})
    }
})
app.get('/adminPanelPrev', async (req, res)=>{
    mins()
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/get?page=${a}`)
        const bookData = response.data
        res.render('adminPanel', {
            data : bookData
        })
    }catch(e){
        res.render('adminPanel', {err : "Internal Server Error !"})
    }
})
app.get('/delete/:id', async (req, res)=>{
    try{
        await axios.delete(`https://myperpusapi.herokuapp.com/delete/${req.params.id}`)
        res.redirect('/adminPanel')
    }catch(e){
        console.log(e)
    }
})
app.post('/add', async (req, res)=>{
    try{
        await axios.post(`https://myperpusapi.herokuapp.com/add?namaBuku=${req.body.namaBuku}&kodeBuku=${req.body.kodeBuku}&penerbit=${req.body.penerbit}`)
        res.redirect('/adminPanel')
    }catch(e){
        console.log(e)
    }
})
app.get('/getContent', async (req, res)=>{
    try{
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${req.query.buku}&maxResults=40`)
        res.send(response.data)
    }catch{
        console.log("Upsss, Something Wrong !!!")
    }
})
app.get('/find/:id', async (req, res)=>{
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/get/${req.params.id}`)
        const editData = response.data
        res.render('updateData', {
            list : editData
        })
    }catch(e){
        console.log(e)
    }
})
app.get('/update/:id', async (req, res)=>{
    try{
        await axios.patch(`https://myperpusapi.herokuapp.com/edit/${req.params.id}?namaBuku=${req.query.namaBuku}&kodeBuku=${req.query.kodeBuku}&penerbit=${req.query.penerbit}`)
        res.redirect('/adminPanel')
    }catch(e){
        console.log(e)
    }
})
app.get('/searchBook', async (req, res)=>{
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/cariBuku?namaBuku=${req.query.query}`)
        const bookData = response.data
        res.render('adminPanel', {
            data : bookData
        })
    }catch{
        res.render('adminPanel', {err : "Internal Server Error !"})
    }
})


// peminjaman Buku

app.get('/adminPanelBorrow', async (req, res)=>{
    try{
        const response = await axios.get('https://myperpusapi.herokuapp.com/dataPinjam')
        const dataPinjam = response.data
        res.render('adminPanel2', {
            data2 : dataPinjam
        })
    }catch{
        res.render('/adminPanel2', {err : "Internal Server Error !"})
    }
})
app.get('/findPinjam/:id', async (req, res)=>{
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/getPinjam/${req.params.id}`)
        const dataPinjam = response.data
        res.render('updateData2', {
            list2 : dataPinjam
        })
    }catch(e){
        console.log(e)
    }
})
app.get('/deleteBorrowBook/:id', async (req, res)=>{
    try{
        await axios.delete(`https://myperpusapi.herokuapp.com/deleteBorrow/${req.params.id}`)
        res.redirect('/adminPanelBorrow')
    }catch(e){
        console.log(e)
    }
})
app.post('/addPeminjaman', async (req, res)=>{
    try{
        await axios.post(`https://myperpusapi.herokuapp.com/pinjam?namaPeminjam=${req.body.namaPeminjam}&alamat=${req.body.alamat}&namaBuku=${req.body.namaBuku}&noTelp=${req.body.noTelp}`)
        res.redirect('/adminPanelBorrow')
    }catch(e){
        console.log(e)
    }
})
app.get('/updatePinjamBuku/:id', async (req, res)=>{
    try{
        await axios.patch(`https://myperpusapi.herokuapp.com/updatePinjam/${req.params.id}?namaPeminjam=${req.query.namaPeminjam}&noTelp=${req.query.noTelp}&namaBuku=${req.query.namaBuku}&status=${req.query.status}`)
        res.redirect('/adminPanelBorrow')
    }catch(e){
        console.log(e)
    }
})
app.get('/searchBorrow', async (req, res)=>{
    try{
        const response = await axios.get(`https://myperpusapi.herokuapp.com/cariDataPinjam?namaPeminjam=${req.query.query}`)
        const dataPinjam = response.data
        res.render('adminPanel2', {
            data2 : dataPinjam
        })
    }catch{
        res.render('adminPanel', {err : "Internal Server Error !"})
    }
})


app.listen(port, ()=>{
    console.log(`Running on port ${port} !`)
})