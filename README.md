aggregus
========

The heart and soul of Aggregus.com. Tread with sweet fear.

/// Overview

  Aggregus is Node application utilizing Backbone.js for view rendering, MongoDB and Mongoose for model rendering, as well as the usual hashmash of .js's for everything in between. See the package.json for relevant dependencies.

/// Central Components

  There are six central components within the Aggregus MVP. A user could cycle through these six views and, in so doing, effectively use our MVP. Informational and supplemental usage pages are planned, but the above six must necessarily be the most functional and well thought-out. The following sections will deal with each view in depth and explain the relevant components, as well as Express endpoints. These sections are:
  
  1. User Dashboard
    
    The user dashboard allows users to create and manage experiences, respond to messages and notifications, as well as edit profile and account settings. 

  2. Experience View
  
    The experience view displays the details relevant to a particular experience 
    
  3. User View
  4. Experience Creation Form
  5. Experience Pinboard
  6. Homepage
  
  The Aggregus homepage is intended to advertise featured experiences from a users community in a rotating jQuery sidepanel, as well as provided basic login/signup features and access to additional information about Aggregus as a company and a website. Remember that all relevant models have their own section below, as a reference.
  
  ENDPOINTS -
  
  /Login - GET: Basic login function. Checks provided credentials against those in the MongoDB database, and if the hashes match, load the relevant user model into a dashboard view.

  /Signup - POST: Basic signup function. Checks that all form elements have been filled in, then saves the user to the database. Also sends a confirmation email. Users will be able to attend experiences without confirming their email, but cannot create experiences without doing so. The email sent contains a URL of the form https://www.aggregus.com/confirmaccount/ [USERNAME] / [CODE]. The code is created at the time of account creation and is meant to be a verfication check to see that the users actual account is being confirmed. The /confirmaccount endpoint is described in more detail below.
  
  /ForgotPassword - GET: Users will be prompted to enter the email of the account whose password they have forgot. Upon submission, a random key is generated and appended to the "passwordreset" section of their account model in MongoDB. This code is then appended to a URL of the form https://www.aggregus.com/resetpassword/ [USERNAME] / [CODE]. The reset password endpoint is discussed in detail below.
  
  /ResetPassword - GET: This endpoint checks if the matched username and code are actually contained in the relevant user model. If so, sends a 200 and the user is allowed to reset his or her password in a new screen. If not, sends a 404 and permission is denied.
  
  /UpdatePassword - PUT: This endpoint simply updates the password in a users account, and, if there is a code in the "resetpassword" field, clears it. This endpoint will also be used by the dashboard to update the password, hence by the code need not be mandatory for this endpoint.
  
  /ConfirmAccount - GET: Confirms that the incoming user and code are contained within the same usermodel. If so, updates the account's "confirmaccount" to "yes" instead of the code that was previously stored there. Sends a user to a page confirming that their account has been confirmed and provides a link back to the homepage or dashboard if they are logged in.
  
/// Models

  // User Model
  
    name: {
      fname: String,
      lname: String,
      }
    age: Number,
    description: String,
    email: String,
    blocked: String,
    aggID: String,
    password: String,
    location: {
      actual: {
        lat: Number,
        lng: Number,
        }
      address: String,
      city: String,
      state: String,
      zip: Number,
      }
    termsconf: String,
    emailconf: String,
    resetpass: String,
    accounttype: String,
    experienceHost: [String],
    experienceGuest: [String]
    commentsFor: [String],
    commentsBy: [String],
    ratings: [String],
    notifications: [String],
    messages: [String]
    
  // Rating Model
  
    aggID: String,
    creator: String,
    recipient: String,
    rating: {
      overall: Number,
      value: Number,
      host: Number,
      experience: Number,
      },
    date: String
  
  // Comment Model
  
    aggID: String,
    creator: {
      profileimg: String,
      aggID: String,
      name: {
        fname: String,
        lname: String,
      }
    recipient: String,
    message: String,
    date: String
    
  // Notification Model
  
    aggID: String,
    type: String,
    message: String
  
  // Experience Model
  
  // Message Model

  
  
  
  
  

