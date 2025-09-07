require('dotenv').config()
const express = require("express")
const fs = require('fs')
const user = require('./MOCK_DATA.json')
const app = express()

// middleware- plugin
app.use(express.urlencoded({ extended: false }))

app.post('/api/users', (req, res) => {
        const body = req.body;
        console.log(body);
        user.push({...body, id: user.length + 1});
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(user), (err, data) => {
            return res.json({status:"success"});
        })
    })

app.get("/", (req, res) => {
    res.send('Home Page')
})

app.get("/about", (req, res) => {
    res.send('<h1>About Page </h1>')
})

app
    .route('/api/users')
    .get((req, res) => {
        return res.json(user);
    })

app.get('/users', (req, res) => {
    const html = `
        <ul>
            ${user.map((user) => `<li>${user.first_name}</li>`).join('')}
        </ul>
    `
    return res.send(html);
})
 
//:id -> dynamic routes
app
  .route('/api/users/:id')
  // Get single user
  .get((req, res) => {
    const id = Number(req.params.id);
    const userData = user.find((u) => u.id === id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(userData);
  })

  // Update user (PATCH)
  .patch((req, res) => {
    const id = Number(req.params.id);
    const userData = user.find((u) => u.id === id);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    const body = req.body;
    // Update only provided fields
    Object.assign(userData, body);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(user, null, 2), (err) => {
      if (err) return res.status(500).json({ status: "error", error: err });
      return res.json({ status: "success", updatedUser: userData });
    });
  })

  // Delete user
  .delete((req, res) => {
    const id = Number(req.params.id);
    const index = user.findIndex((u) => u.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    user.splice(index, 1);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(user, null, 2), (err) => {
      if (err) return res.status(500).json({ status: "error", error: err });
      return res.json({ status: "success", message: `User ${id} deleted` });
    });
  });




app.listen(process.env.port || 3000, () => {
    console.log(`Server Started ! at http://localhost:${process.env.port || 3000}`);
})