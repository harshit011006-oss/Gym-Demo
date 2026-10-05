const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("./db");

const app = express();

const PORT = 3000;


// =====================================================
// MIDDLEWARE
// =====================================================

// Serve frontend files from public/
app.use(express.static("public"));

// Allow Express to read JSON sent by frontend
app.use(express.json());


// =====================================================
// TEST GET ROUTE
// =====================================================

app.get("/api/test", (req, res) => {

    res.send("Backend is working!");

});


// =====================================================
// TEST POST ROUTE
// =====================================================

app.post("/api/test", (req, res) => {

    console.log(req.body);

    res.json({
        success: true,
        message: "Data received successfully!",
        data: req.body
    });

});


// =====================================================
// CONTACT FORM
// =====================================================

app.post("/api/contact", async (req, res) => {

    const { name, email, phone, subject, message } = req.body;


    // Validate required fields
    if (!name || !email || !subject || !message) {

        return res.status(400).json({
            success: false,
            message: "Name, email, subject and message are required."
        });

    }


    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });

    }


    // Validate phone only if provided
    if (phone && !/^[0-9+\-\s()]{7,20}$/.test(phone)) {

        return res.status(400).json({
            success: false,
            message: "Please provide a valid phone number."
        });

    }


    try {

        const result = await pool.query(
            `INSERT INTO contacts
            (name, email, phone, subject, message)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                name.trim(),
                email.toLowerCase().trim(),
                phone ? phone.trim() : null,
                subject,
                message.trim()
            ]
        );


        res.status(201).json({
            success: true,
            message: "Your message was saved successfully!",
            contact: result.rows[0]
        });

    } catch (error) {

        console.error("Contact database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to save your message."
        });

    }

});


// =====================================================
// MEMBERSHIPS
// =====================================================

app.get("/api/memberships", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                m.id,
                m.name,
                m.price,
                m.duration,
                m.description,
                m.is_featured,
                m.created_at,

                COALESCE(
                    json_agg(
                        mf.feature
                        ORDER BY mf.id
                    )
                    FILTER (WHERE mf.id IS NOT NULL),
                    '[]'
                ) AS features

            FROM memberships m

            LEFT JOIN membership_features mf
                ON m.id = mf.membership_id

            GROUP BY m.id

            ORDER BY m.id;
        `);


        res.json({
            success: true,
            memberships: result.rows
        });

    } catch (error) {

        console.error("Membership database error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to fetch memberships."
        });

    }

});


// =====================================================
// SIGN UP
// =====================================================

app.post("/api/signup", async (req, res) => {

    const { name, email, phone, password } = req.body;


    // Required fields
    if (!name || !email || !password) {

        return res.status(400).json({
            success: false,
            message: "Name, email and password are required."
        });

    }


    // Password length
    if (password.length < 6) {

        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters."
        });

    }


    // Email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address."
        });

    }


    try {

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);


        // Insert user
        const result = await pool.query(
            `INSERT INTO users
            (name, email, phone, password_hash)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, phone, created_at`,
            [
                name.trim(),
                email.toLowerCase().trim(),
                phone ? phone.trim() : null,
                passwordHash
            ]
        );


        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            user: result.rows[0]
        });

    } catch (error) {

        // Duplicate email
        if (error.code === "23505") {

            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });

        }


        console.error("Signup error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong while creating the account."
        });

    }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {

    const { email, password } = req.body;


    // Required fields
    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Email and password are required."
        });

    }


    try {

        // Find user
        const result = await pool.query(
            `SELECT
                id,
                name,
                email,
                phone,
                password_hash
             FROM users
             WHERE email = $1`,
            [
                email.toLowerCase().trim()
            ]
        );


        // User doesn't exist
        if (result.rows.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        const user = result.rows[0];


        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );


        if (!passwordMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });

        }


        // Never send password hash to frontend
        delete user.password_hash;


        res.json({
            success: true,
            message: "Login successful!",
            user: user
        });

    } catch (error) {

        console.error("Login error:", error.message);

        res.status(500).json({
            success: false,
            message: "Something went wrong while logging in."
        });

    }

});


// =====================================================
// SUBSCRIPTIONS
// =====================================================

app.post("/api/subscriptions", async (req, res) => {

    const { user_id, membership_id } = req.body;


    // Validate IDs
    if (!user_id || !membership_id) {

        return res.status(400).json({
            success: false,
            message: "User ID and membership ID are required."
        });

    }


    try {

        // Check if user already has an active membership
        const existingSubscription = await pool.query(
            `SELECT id
             FROM subscriptions
             WHERE user_id = $1
             AND status = 'active'`,
            [user_id]
        );


        if (existingSubscription.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "You already have an active membership."
            });

        }


        // Create subscription
        const result = await pool.query(
            `INSERT INTO subscriptions
            (user_id, membership_id)
            VALUES ($1, $2)
            RETURNING *`,
            [user_id, membership_id]
        );


        res.status(201).json({
            success: true,
            message: "Membership selected successfully!",
            subscription: result.rows[0]
        });

    } catch (error) {

        console.error("Subscription error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to select membership."
        });

    }

});


// =====================================================
// ACCOUNT
// =====================================================

app.get("/api/account/:userId", async (req, res) => {

    const { userId } = req.params;


    try {

    const result = await pool.query(
    `SELECT
        u.id,
        u.name,
        u.email,
        u.phone,

        m.name AS membership_name,
        s.membership_id AS membership_id,
        m.price,
        m.duration,

        s.id AS subscription_id,
        s.status,
        s.started_at

     FROM users u

     LEFT JOIN subscriptions s
        ON u.id = s.user_id
        AND s.status = 'active'

     LEFT JOIN memberships m
        ON s.membership_id = m.id

     WHERE u.id = $1`,
    [userId]
);


        // User not found
        if (result.rows.length === 0) {

            return res.status(404).json({
                success: false,
                message: "User not found."
            });

        }


        res.json({
            success: true,
            account: result.rows[0]
        });

    } catch (error) {

        console.error("Account error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to load account."
        });

    }

});


// =====================================================
// DATABASE CONNECTION TEST
// =====================================================

pool.query("SELECT NOW()")
    .then(result => {

        console.log("Database connected!");
        console.log(result.rows[0]);

    })
    .catch(error => {

        console.log("Database connection failed!");
        console.log(error.message);

    });


// =====================================================
// START SERVER
// =====================================================

app.listen(PORT, () => {

    console.log(
        `RedRocks Fitness server running on http://localhost:${PORT}`
    );

});

app.patch("/api/subscriptions/:subscriptionId/cancel", async (req, res) => {

    const { subscriptionId } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: "User ID is required."
        });
    }

    try {

        const result = await pool.query(
            `UPDATE subscriptions
             SET status = 'cancelled'
             WHERE id = $1
             AND user_id = $2
             AND status = 'active'
             RETURNING *`,
            [subscriptionId, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Active subscription not found."
            });
        }

        res.json({
            success: true,
            message: "Membership cancelled successfully!"
        });

    } catch (error) {

        console.error("Cancel subscription error:", error.message);

        res.status(500).json({
            success: false,
            message: "Failed to cancel membership."
        });
    }
});