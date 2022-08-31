const express = require('express')


const app = express()

app.set('view engine', 'ejs')
const books =[
    {
        author : 'Mark Twain',
        title: 'Hukleberry Finn',
        releaseYear : 1884
    },
    {
        author : 'Frank Herbert',
        title: 'Dune',
        releaseYear : 1965
    }
]
const port = process.env.PORT || 8080;

app.get('/', (req, res)=>{
res.render('greeting')
})

app.get('/api/book', (req , res)=>{
    res.json(books)
})
app.listen(port)