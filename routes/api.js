module.exports = function(app, mongoose, crypto, User, Notifications, Experience, Booking, Review, Heart, Message, email) {
  require('./api/user')(app, mongoose, email, User)
  require('./api/experience')(app, mongoose, email, Experience)
  require('./api/booking')(app, mongoose, email, Booking)
  require('./api/notifications')(app, mongoose, email, Notifications)
  require('./api/review')(app, mongoose, email, Review)
  require('./api/heart')(app, mongoose, email, Heart)
  require('./api/message')(app, mongoose, email, Message)
}