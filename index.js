const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
require("dotenv").config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.swu9d.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = process.env.PORT || 4200;
const dbname = "volunteerNetwork";

app.get("/", (req, res) => {
    res.send("Hello world!");
});
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((err) => {
    console.log("connected db");
    const registrations = client.db(dbname).collection("registrations");
    const events = client.db(dbname).collection("events");
    // post Requests
    app.post("/register", (req, res) => {
        const newRegistration = req.body;
        registrations.insertOne(newRegistration).then((result) => {
            res.send(result.insertedCount > 0);
        });
        console.log(newRegistration);
    });
    app.post("/addevent", (req, res) => {
        const newRegistration = req.body;
        events.insertOne(newRegistration).then((result) => {
            res.send(result.insertedCount > 0);
        });
        console.log(newRegistration);
    });
    // get requests
    app.get("/myEvents", (req, res) => {
        registrations
            .find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents);
            });
    });
    app.get("/events", (req, res) => {
        events.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });
    app.get("/registrations", (req, res) => {
        registrations.find({}).toArray((err, documents) => {
            res.send(documents);
        });
    });

    // delete requests
    app.delete("/delete/:id", (req, res) => {
        console.log(req.params.id);
        registrations
            .deleteOne({ _id: ObjectId(req.params.id) })
            .then((err, result) => {
                console.log(result);
            })
            .then(() => res.send(req.params.id));
    });
});

app.listen(port, () => {
    console.log("Example app listening to localhost:5000");
});
