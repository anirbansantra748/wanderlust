const Listing = require("./models/listing");
const Review = require("./models/review");


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Log in to create listings or make any changes!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  //find the listing first
  let listing = await Listing.findById(id);
  console.log('Listing:', listing);
console.log('Current User:', res.locals.currUser);
  if ( listing.owner && !listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "only user can edit the listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  //find the listing first
  let review = await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "only user can edit the review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
