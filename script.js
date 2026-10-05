/* =========================================================
   REDROCKS FITNESS - MAIN JAVASCRIPT
========================================================= */


document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       1. MOBILE NAVIGATION
    ===================================================== */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            // Change hamburger icon
            if (navMenu.classList.contains("active")) {
                menuToggle.textContent = "✕";
            } else {
                menuToggle.textContent = "☰";
            }
        });

        // Close menu when navigation link is clicked
        const navLinks = navMenu.querySelectorAll("a");

        navLinks.forEach(link => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");
                menuToggle.textContent = "☰";

            });

        });

    }


    /* =====================================================
       2. NAVBAR ON SCROLL
    ===================================================== */

    const navbar = document.querySelector(".navbar");

    if (navbar) {

        window.addEventListener("scroll", () => {

            if (window.scrollY > 50) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }

        });

    }


    /* =====================================================
       3. SCROLL REVEAL ANIMATION
    ===================================================== */

    const revealElements = document.querySelectorAll(
        ".section-heading, .about-image, .about-content, .feature-card, .gym-card, .pricing-card, .cta-content"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });


    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");
                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("show");
        });

    }


    /* =====================================================
       4. STAGGER FEATURE CARDS
    ===================================================== */

    const featureCards = document.querySelectorAll(".feature-card");

    featureCards.forEach((card, index) => {

        card.style.transitionDelay = `${index * 0.12}s`;

    });


    /* =====================================================
       5. STAGGER PRICING CARDS
    ===================================================== */

    const pricingCards = document.querySelectorAll(".pricing-card");

    pricingCards.forEach((card, index) => {

        card.style.transitionDelay = `${index * 0.15}s`;

    });


    /* =====================================================
       6. NUMBER COUNTER ANIMATION
    ===================================================== */

    const stats = document.querySelectorAll(".stat h2");

    const animateCounter = (element) => {

        const originalText = element.textContent.trim();

        // Handle 24/7 separately
        if (originalText === "24/7") {
            return;
        }

        // Separate number and suffix
        const numberMatch = originalText.match(/[\d.]+/);

        if (!numberMatch) {
            return;
        }

        const target = parseFloat(numberMatch[0]);
        const suffix = originalText.replace(numberMatch[0], "");

        let current = 0;

        const duration = 1500;
        const startTime = performance.now();

        const updateCounter = (currentTime) => {

            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing
            const easedProgress =
                1 - Math.pow(1 - progress, 3);

            current = target * easedProgress;

            element.textContent =
                Math.floor(current) + suffix;

            if (progress < 1) {

                requestAnimationFrame(updateCounter);

            } else {

                element.textContent =
                    target + suffix;

            }

        };

        requestAnimationFrame(updateCounter);

    };


    if ("IntersectionObserver" in window && stats.length > 0) {

        const statsObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        stats.forEach(stat => {
                            animateCounter(stat);
                        });

                        observer.disconnect();

                    }

                });

            },
            {
                threshold: 0.5
            }
        );

        statsObserver.observe(stats[0]);

    }


    /* =====================================================
       7. HERO PARALLAX EFFECT
    ===================================================== */

    const hero = document.querySelector(".hero");
    const heroContent = document.querySelector(".hero-content");

    if (hero && heroContent) {

        hero.addEventListener("mousemove", (event) => {

            const x =
                event.clientX / window.innerWidth - 0.5;

            const y =
                event.clientY / window.innerHeight - 0.5;

            heroContent.style.transform =
                `translate(${x * 12}px, ${y * 12}px)`;

        });

        hero.addEventListener("mouseleave", () => {

            heroContent.style.transform =
                "translate(0, 0)";

        });

    }


    /* =====================================================
       8. BUTTON RIPPLE EFFECT
    ===================================================== */

    const buttons = document.querySelectorAll(
        ".primary-button, .secondary-button, .nav-button, .plan-button"
    );

    buttons.forEach(button => {

        button.addEventListener("click", function (event) {

            const ripple = document.createElement("span");

            const rect =
                button.getBoundingClientRect();

            const size =
                Math.max(rect.width, rect.height);

            const x =
                event.clientX - rect.left - size / 2;

            const y =
                event.clientY - rect.top - size / 2;

            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;

            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            ripple.classList.add("ripple");

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);

        });

    });


    /* =====================================================
       9. CURRENT YEAR IN FOOTER
    ===================================================== */

    const footerText =
        document.querySelector(".footer-bottom p");

    if (footerText) {

        const currentYear =
            new Date().getFullYear();

        footerText.textContent =
            `© ${currentYear} RedRocks Fitness. All rights reserved.`;

    }


    /* =====================================================
       10. FAQ ACCORDION
    ===================================================== */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        if (!question) {
            return;
        }

        question.addEventListener("click", () => {

            const isOpen =
                item.classList.contains("active");

            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove("active");
            });

            // Open clicked item if it was closed
            if (!isOpen) {
                item.classList.add("active");
            }

        });

    });


    /* =====================================================
       11. CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById("contactForm");

    const formStatus =
        document.getElementById("formStatus");

    if (contactForm) {

        contactForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const formData = {

                name:
                    document.getElementById("name").value.trim(),

                email:
                    document.getElementById("email").value.trim(),

                phone:
                    document.getElementById("phone").value.trim(),

                subject:
                    document.getElementById("subject").value,

                message:
                    document.getElementById("message").value.trim()

            };

            try {

                const response = await fetch("/api/contact", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(formData)

                });

                const data = await response.json();

                if (!response.ok) {

                    formStatus.textContent =
                        data.message;

                    return;

                }

                formStatus.textContent =
                    data.message;

                contactForm.reset();

            } catch (error) {

                console.error("Contact error:", error);

                formStatus.textContent =
                    "Unable to contact the server. Please try again.";

            }

        });

    }


    /* =====================================================
       12. LOAD MEMBERSHIPS FROM DATABASE
    ===================================================== */

    async function loadMemberships() {

    const cards = document.querySelectorAll(".pricing-card");

    // No membership cards on this page
    if (cards.length === 0) {
        return;
    }

    try {

        // --------------------------------
        // 1. Load membership plans
        // --------------------------------
        const response =
            await fetch("/api/memberships");

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            throw new Error("Failed to load memberships.");
        }


        // --------------------------------
        // 2. Check logged-in user
        // --------------------------------
        const loggedInUser =
            JSON.parse(localStorage.getItem("loggedInUser"));

        let currentMembershipId = null;


        if (loggedInUser) {

            try {

                const accountResponse =
                    await fetch(`/api/account/${loggedInUser.id}`);

                const accountData =
                    await accountResponse.json();

                if (
                    accountResponse.ok &&
                    accountData.success &&
                    accountData.account &&
                    accountData.account.membership_id
                ) {

                    currentMembershipId =
                        Number(accountData.account.membership_id);

                }

            } catch (error) {

                console.error(
                    "Failed to check current membership:",
                    error
                );

            }

        }


        // --------------------------------
        // 3. Update membership cards
        // --------------------------------
        data.memberships.forEach((plan, index) => {

            const card = cards[index];

            if (!card) {
                return;
            }


            // Plan name
            const planName =
                card.querySelector(".plan-name");

            if (planName) {
                planName.textContent = plan.name;
            }


            // Price + duration
            const price =
                card.querySelector("h3");

            if (price) {

                price.innerHTML =
                    `₹${plan.price} <span>/ ${plan.duration}</span>`;

            }


            // Description
            const description =
                card.querySelector(".plan-description");

            if (description) {

                description.textContent =
                    plan.description;

            }


            // Features
            const featureList =
                card.querySelector("ul");

            if (
                featureList &&
                Array.isArray(plan.features)
            ) {

                featureList.innerHTML = "";

                plan.features.forEach(feature => {

                    const li =
                        document.createElement("li");

                    li.textContent =
                        `✓ ${feature}`;

                    featureList.appendChild(li);

                });

            }


            // --------------------------------
            // 4. Smart button
            // --------------------------------
            const button =
                card.querySelector(".get-started");

            if (button) {

                const planId =
                    Number(button.dataset.membershipId);


                // User's current plan
                if (
                    currentMembershipId &&
                    currentMembershipId === planId
                ) {

                    button.textContent = "CURRENT PLAN";

                    button.disabled = true;

                    button.classList.add("current-plan");

                }

                // Other plans
                else {

                    button.textContent = "GET STARTED";

                    button.disabled = false;

                    button.classList.remove("current-plan");

                }

            }

        });

    } catch (error) {

        console.error(
            "Failed to load memberships:",
            error
        );

    }

}

loadMemberships();


    /* =====================================================
       13. SIGN UP
    ===================================================== */

    const signupForm =
        document.getElementById("signupForm");

    const signupStatus =
        document.getElementById("signupStatus");

    if (signupForm) {

        signupForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const formData = {

                name:
                    document.getElementById("signupName").value.trim(),

                email:
                    document.getElementById("signupEmail").value.trim(),

                phone:
                    document.getElementById("signupPhone").value.trim(),

                password:
                    document.getElementById("signupPassword").value

            };

            try {

                const response =
                    await fetch("/api/signup", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify(formData)

                    });

                const data =
                    await response.json();

                if (!response.ok) {

                    signupStatus.textContent =
                        data.message;

                    return;

                }

                signupStatus.textContent =
                    data.message;

                signupForm.reset();

                setTimeout(() => {

                    window.location.href =
                        "login.html";

                }, 1000);

            } catch (error) {

                console.error(
                    "Signup error:",
                    error
                );

                signupStatus.textContent =
                    "Unable to connect to the server.";

            }

        });

    }


    /* =====================================================
       14. LOGIN
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const loginStatus =
        document.getElementById("loginStatus");

    if (loginForm) {

        loginForm.addEventListener("submit", async (event) => {

            event.preventDefault();

            const email =
                document.getElementById("loginEmail")
                    .value
                    .trim();

            const password =
                document.getElementById("loginPassword")
                    .value;

            try {

                const response =
                    await fetch("/api/login", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password
                        })

                    });

                const data =
                    await response.json();

                if (!response.ok) {

                    loginStatus.textContent =
                        data.message;

                    return;

                }

                loginStatus.textContent =
                    data.message;


                // Save logged-in user
                localStorage.setItem(
                    "loggedInUser",
                    JSON.stringify(data.user)
                );


                console.log(
                    "Logged in user:",
                    data.user
                );


                // Go to account page
                setTimeout(() => {

                    window.location.href =
                        "account.html";

                }, 1000);

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                loginStatus.textContent =
                    "Unable to connect to the server.";

            }

        });

    }


    /* =====================================================
       15. GET STARTED / MEMBERSHIP SELECTION
    ===================================================== */

    const getStartedButtons =
        document.querySelectorAll(".get-started");

    getStartedButtons.forEach(button => {

        button.addEventListener("click", async (event) => {

            event.preventDefault();

            const loggedInUser =
                localStorage.getItem("loggedInUser");


            // Not logged in
            if (!loggedInUser) {

                window.location.href =
                    "login.html";

                return;

            }


            const user =
                JSON.parse(loggedInUser);

            const membershipId =
                button.dataset.membershipId;


            try {

                const response =
                    await fetch("/api/subscriptions", {

                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            user_id: user.id,
                            membership_id: membershipId
                        })

                    });

                const data =
                    await response.json();


                if (!response.ok) {

                    alert(data.message);

                    return;

                }

                alert(data.message);


                // Refresh account page after selecting membership
                window.location.href =
                    "account.html";

            } catch (error) {

                console.error(
                    "Subscription error:",
                    error
                );

                alert(
                    "Unable to connect to the server."
                );

            }

        });

    });


    /* =====================================================
       16. ACCOUNT PAGE
    ===================================================== */

    const accountContent =
        document.getElementById("accountContent");

    if (accountContent) {

        const loggedInUser =
            localStorage.getItem("loggedInUser");


        // Not logged in
        if (!loggedInUser) {

            window.location.href =
                "login.html";

        } else {

            const user =
                JSON.parse(loggedInUser);


            async function loadAccount() {

                try {

                    const response =
                        await fetch(
                            `/api/account/${user.id}`
                        );

                    const data =
                        await response.json();


                    if (!response.ok) {
                        throw new Error(
                            data.message ||
                            "Failed to load account."
                        );
                    }


                    console.log(
                        "Account data:",
                        data
                    );


                    const account =
                        data.account;
                    const cancelButton =
                        document.getElementById("cancelMembershipButton");

                    if (cancelButton && account.subscription_id) {

                        cancelButton.style.display = "inline-block";

                        cancelButton.onclick = async () => {

                            const confirmCancel = confirm(
                                "Are you sure you want to cancel your membership?"
                            );

                            if (!confirmCancel) {
                                return;
                            }

                            try {

                                const response = await fetch(
                                    `/api/subscriptions/${account.subscription_id}/cancel`,
                                    {
                                        method: "PATCH",

                                        headers: {
                                            "Content-Type": "application/json"
                                        },

                                        body: JSON.stringify({
                                            user_id: user.id
                                        })
                                    }
                                );

                                const data = await response.json();

                                if (!response.ok) {
                                    alert(data.message);
                                    return;
                                }

                                alert(data.message);

                                window.location.reload();

                            } catch (error) {

                                console.error(
                                    "Cancel membership error:",
                                    error
                                );

                                alert("Unable to cancel membership.");

                            }
                        };
                    }


                    accountContent.innerHTML = `

                        <div class="account-info">

                            <p>
                                <strong>Name:</strong>
                                ${account.name}
                            </p>

                            <p>
                                <strong>Email:</strong>
                                ${account.email}
                            </p>

                            <p>
                                <strong>Phone:</strong>
                                ${account.phone || "Not provided"}
                            </p>

                            <p>
                                <strong>Membership:</strong>
                                ${account.membership_name || "No membership"}
                            </p>

                            <p>
                                <strong>Price:</strong>
                                ${account.price
                            ? "₹" + account.price
                            : "-"
                        }
                            </p>

                            <p>
                                <strong>Duration:</strong>
                                ${account.duration || "-"}
                            </p>

                            <p>
                                <strong>Status:</strong>
                                ${account.status || "-"}
                            </p>

                        </div>

                    `;

                } catch (error) {

                    console.error(
                        "Account error:",
                        error
                    );

                    accountContent.textContent =
                        "Unable to load account.";

                }

            }


            loadAccount();

        }

    }


    /* =====================================================
       17. LOGOUT
    ===================================================== */

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener("click", () => {

            localStorage.removeItem(
                "loggedInUser"
            );

            window.location.href =
                "login.html";

        });

    }


    /* =====================================================
       18. AUTH NAVIGATION
    ===================================================== */

    function updateAuthNavigation() {

        const loggedInUser =
            localStorage.getItem("loggedInUser");


        const signInLinks =
            document.querySelectorAll(
                'a[href="login.html"]'
            );

        const signUpLinks =
            document.querySelectorAll(
                'a[href="signup.html"]'
            );


        if (loggedInUser) {

            // Change SIGN IN → MY ACCOUNT
            signInLinks.forEach(link => {

                link.textContent =
                    "MY ACCOUNT";

                link.href =
                    "account.html";

            });


            // Change SIGN UP → LOG OUT
            signUpLinks.forEach(link => {

                link.textContent =
                    "LOG OUT";

                link.href =
                    "#";

                link.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        localStorage.removeItem(
                            "loggedInUser"
                        );

                        window.location.href =
                            "login.html";

                    },
                    { once: true }
                );

            });

        }

    }

    updateAuthNavigation();

});

async function updateJoinButton() {

    const joinButtons =
        document.querySelectorAll(".join-now");

    if (joinButtons.length === 0) {
        return;
    }

    const loggedInUser =
        localStorage.getItem("loggedInUser");

    if (!loggedInUser) {
        return;
    }

    const user =
        JSON.parse(loggedInUser);

    try {

        const response =
            await fetch(`/api/account/${user.id}`);

        const data =
            await response.json();

        if (
            response.ok &&
            data.success &&
            data.account.membership_name
        ) {

            joinButtons.forEach(button => {
                button.style.display = "none";
            });

        }

    } catch (error) {

        console.error(
            "Membership status error:",
            error
        );

    }
}

updateJoinButton();