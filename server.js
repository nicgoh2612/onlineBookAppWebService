const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const port = 3000;

//database config info
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 0,
};

//initialize Express app
const app = express();
//helps app to read JSON
app.use(express.json());

//start the server
app.listen(port,() => {
    console.log('Server running on port', port);
});

 //Get all books
app.get('/allbooks', async (req,res) => {
    try{
        let connection = await mysql.createConnection(dbConfig);
        const[rows] = await connection.execte('SELECT * FROM defaultdb.books');
        res.json(rows);
    } catch(err){
        console.log(err);
        res.status(500).json({message:'Server error for allbooks'});
    }
});

//Create new book
app.post('/addbook', async(req,res)=>{
    const {book_title, book_pic} = req.body;
    try{
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute('INSERT INTO books(book_title, book_pic) VALUES(?,?)', [book_title, book_pic]);
        res.status(201).json({message:'Book'+book_title+'added successfully'});
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Server error - could not add card' + book_title});
    }
});

//Update book
app.post('update/book', async(req,res)=>{
    const {book_title, book_pic, id} = req.body;
    try {
        let connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'UPDATE books SET book_title = ?, book_pic = ? WHERE id = ?',
            [book_title, book_pic, id]
        );
    }catch(err){
        console.log(err);
        res.status(500).json({message:'Server error - could not update books'});
    }
});

//Delete book
app.delete('/deletebook', async (req, res) => {
    const { id } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'DELETE FROM books WHERE id = ?',
            [ id ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });

    } catch (error) {
        res.status(500).json({message: "Error deleting book",});
    }
});
