const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Listing = require("../models/listing");
const { listingSchema } = require("../schema");
const { isLoggedIn, isOwner } = require("../middlewire.js");
const listingControler = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Joi error validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//NOTE Main route - list all listings
router
  .route("/")
  .get(wrapAsync(listingControler.indexrout))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControler.createListing)
  );

//NOTE New route - serve the form to create a new listing
router.get("/new", isLoggedIn, wrapAsync(listingControler.newrout));

//NOTE Show route - display a specific listing delete
router
  .route("/:id")
  .get(wrapAsync(listingControler.showrout))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingControler.updateListing)
  )
  .delete(isLoggedIn, isOwner, wrapAsync(listingControler.deleteListing));

//NOTE Edit route - serve the form to edit a listing
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingControler.editrout)
);

module.exports = router;
