const auth = (req, res, next)=>{
    res.redirect('login')
    console.log(req.query)
}
module.exports = auth