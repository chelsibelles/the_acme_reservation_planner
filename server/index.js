const express = require("express");
const {
    client,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation, // Corrected typo here
} = require("./db.js");

const server = express();
client.connect();

// Middleware
server.use(express.json());

// Routes
// GET /api/customers
server.get("/api/customers", async (req, res, next) => {
    try {
        res.send(await fetchCustomers());
    } catch (ex) {
        next(ex);
    }
});

// GET /api/restaurants
server.get("/api/restaurants", async (req, res, next) => {
    try {
        res.send(await fetchRestaurants());
    } catch (ex) {
        next(ex);
    }
});

// GET /api/reservations
server.get("/api/reservations", async (req, res, next) => {
    try {
        res.send(await fetchReservations());
    } catch (ex) {
        next(ex);
    }
});

// POST /api/customers/:id/reservations
server.post("/api/customers/:id/reservations", async (req, res, next) => {
    try {
        res.status(201).send(
            await createReservation({
                date: req.body.date, // Use req.body for the reservation details
                party_count: req.body.party_count, 
                restaurant_id: req.body.restaurant_id, 
                customer_id: req.params.id, // Customer ID comes from req.params
            })
        );
    } catch (ex) {
        next(ex);
    }
});

// DELETE /api/customers/:customer_id/reservations/:id
server.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
    try {
        await destroyReservation({ customer_id: req.params.customer_id, id: req.params.id });
        res.sendStatus(204);
    } catch (ex) {
        next(ex);
    }
});

// Error handling
server.use((err, req, res, next) => {
    res.status(err.status || 500).send({ error: err.message || err });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Listening on port ${port}`);
    console.log("Some curl commands to test:");
    console.log(`curl localhost:${port}/api/customers`);
    console.log(`curl localhost:${port}/api/restaurants`);
    console.log(`curl localhost:${port}/api/reservations`);
});
