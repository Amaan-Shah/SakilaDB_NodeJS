const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json())
app.use(cors({ origin: '*' }))

const dbconn = mysql.createConnection({
  host: process.env['host'],
  user: process.env['user'],
  password: process.env['password'],
  database: 'api_sshah344',
  multipleStatements: true
})

dbconn.connect((err) => {
  if (err) throw err;
  console.log('MySQL DB Connected Successfully!');
});

app.get('/', (req, res) => {
  res.send(
    `Welcome to sshah344_api for CS 480! <br/>
           
      <br/>Functionalities:<br/>

        <br/> Get: <br/>

         <br/>/api/items => gets all items from table <br/>

         <br/> /api/items/:id => gets single item according to ':id' <br/>
         `);
})

/**
 * Get All Items
 *
 * @return response()
 */
app.get('/api/items', (req, res) => {
  let sqlQuery = "SELECT * FROM api_sshah344.items";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Get Single Item
 *
 * @return response()
 */
app.get('/api/items/:id', (req, res) => {
  let sqlQuery = "SELECT * FROM api_sshah344.items WHERE id=" + req.params.id;

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Create New Item
 *
 * @return response()
 */
app.post('/api/items', (req, res) => {
  let data = { title: req.body.title, body: req.body.body };

  let sqlQuery = "INSERT INTO api_sshah344.items SET ?";

  let query = dbconn.query(sqlQuery, data, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Update Item
 *
 * @return response()
 */
app.put('/api/items/:id', (req, res) => {
  let sqlQuery = "UPDATE api_sshah344.items SET title='" + req.body.title + "', body='" + req.body.body + "' WHERE id=" + req.params.id;

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * Delete Item
 *
 * @return response()
 */
app.delete('/api/items/:id', (req, res) => {
  let sqlQuery = "DELETE FROM api_sshah344.items WHERE id=" + req.params.id + "";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/**
 * API Response
 *
 * @return response()
 */
function apiResponse(results) {
  return JSON.stringify({ "status": 200, "error": null, "response": results });
}

/////////////////////////////////////   PART 1   ///////////////////////////////////////

// Gets all items from film table.
app.get('/api/films', (req, res) => {
  let sqlQuery = "SELECT * FROM sakila.film";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

// Gets Data For Specific Film ID
app.get('/api/films/:film_id', (req, res) => {
  let sqlQuery = 
    "SELECT * FROM sakila.film where film_id = " + req.params.film_id + ";";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

// Gets the actors associated with a film_id
app.get('/api/films/:film_id/actors', (req, res) => {
  let sqlQuery = "select A.actor_id, A.first_name, A.last_name, A.last_update from sakila.actor A inner join sakila.film_actor FA on (FA.actor_id = A.actor_id) inner join sakila.film F on (F.film_id = FA.film_id) where F.film_id =" + req.params.film_id + ";";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

// Get all info from actors
app.get('/api/actors', (req, res) => {
  let sqlQuery = 
    "SELECT * FROM sakila.actor;";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/actors/:actor_id', (req, res) => {
  let sqlQuery = 
    "SELECT * FROM sakila.actor where actor_id = " + req.params.actor_id + ";";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

app.get('/api/actors/:actor_id/films', (req, res) => {
  let sqlQuery = 
    "select F.film_id, F.title, F.description from sakila.actor A inner join sakila.film_actor FA on (A.actor_id = FA.actor_id) inner join sakila.film F on (FA.film_id = F.film_id) where A.actor_id =" + req.params.actor_id + ";";

  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/////////////////////////////////////   PART 2   ///////////////////////////////////////

// Check stock of film at specific store
app.get('/api/check_stock', (req, res) => {
  let film_id = req.query.film_id;
  let store_id = req.query.store_id;
  
  
  let sqlQuery = "CALL sakila.film_in_stock(" + film_id +", " + store_id + ", @sol); SELECT @sol as num_in_stock;"
  
  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

/////////////////////////////////////   PART 3   ///////////////////////////////////////

// Process_rental
app.get('/api/process_rental', (req, res) => {
  let customer_id = req.query.customer_id;
  let inventory_id = req.query.inventory_id;
  let staff_id = req.query.staff_id;
  let payment_amount = req.query.payment_amount;
  
  
  let sqlQuery = "CALL sakila.process_rental(" + customer_id +", " + inventory_id + ", " + staff_id + ", " + payment_amount + ", @new_rental_id, @new_payment_id); SELECT @new_rental_id as new_rental_id, @new_payment_id as new_payment_id;"
  
  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results[1]));
  });
});

/////////////////////////////////////   PART 4   ///////////////////////////////////////

// Return all rows from the customer_list view.
// Has functionality to have optional filter by country
app.get('/api/customer_data', (req, res) => {
  let sqlQuery = ""
  
  if ("country" in req.query) {
    let country = req.query.country;
    sqlQuery = "select * from sakila.customer_list where country like lower('" + country + "');"
  }
  else {
    sqlQuery = "select * from sakila.customer_list;"
  }
  
  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});

// Return a specific customer.  
app.get('/api/customer_data/:customer_id', (req, res) => {
  
  let sqlQuery = "select * from sakila.customer_list where id = " + req.params.customer_id + ";"
  
  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});


/////////////////////////////////////   PART 5   ///////////////////////////////////////

// Distance from UIC to given coordinates
app.get('/api/distance_to_uic', (req, res) => {
  let latitude = req.query.latitude;
  let longitude = req.query.longitude;
  let units = "meters"
  
  let url = req.originalUrl;
  if (url.indexOf("units") != -1) {
    units = req.query.units;
  }
  
  let sqlQuery = "select * from sakila.customer_list;"
  
  let query = dbconn.query(sqlQuery, (err, results) => {
    if (err) throw err;
    res.send(apiResponse(results));
  });
});


/*------------------------------------------
--------------------------------------------
Server listening
--------------------------------------------
--------------------------------------------*/
app.listen(3000, () => {
  console.log('Server started on port 3000...');
});