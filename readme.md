##SECTION - steps 1 to n

//SECTION - important

1.  to take image as a empty set as a default or user image use unery operator -
    set: (v) => v === "" ? "something" : v,

2.  min maximum set in the schema
    rating:{
    type:Number,
    min:1,
    max:5,
    },

3.  when we need to create user like the username and password autometicaly handel by passport local mongoose --

    1.  require the passport local mongoose
        const passportLocalMongoose = require("passport-local-mongoose");
    2.  plugged in it
        userSchema.plugin(passportLocalMongoose);

4.  using routes we need to
5.  require routes - const router = express.Router();
6. to find all data in databace we write - 
   1. const allListings = await Listing.find({});
   2. to extract id - const { id } = req.params;
   3. to find the data - const listing = await Listing.findById(id)
   4. find and update - await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   
7. to set owner whn come request to create a new thing in data bace -
   newListing.owner = req.user._id;

8. To flash a messege - req.flash("success", "New Listing added");



//TODO -
