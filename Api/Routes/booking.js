const express = require("express");
const Booking = require("../Models/Booking.model");
const verifyToken = require("../Helper/verifyToken");
const throwError = require("../Helper/error"); 
const post = require("../Models/Post.model");
const to12Hour = require("../Helper/12Hr");
const router = express.Router();

router.post("/create", verifyToken, async (req, res, next) => {
  try {
    const { type, venueId, serviceId, startTime, endTime, notes,userId } = req.body;

    if (!type || !["venue", "service"].includes(type)) {
      return next(throwError(400, "Invalid or missing booking type."));
    }

    if (type === "venue" && !venueId) {
      return next(throwError(400, "venueId is required for venue bookings."));
    }

    if (type === "service" && !serviceId) {
      return next(throwError(400, "serviceId is required for service bookings."));
    }

    const postId = type === "venue" ? venueId : serviceId;
    const postDoc = await post.findOne({ _id: postId, type });

    if (!postDoc) {
      return next(throwError(404, `${type} not found.`));
    }

    const { operationHours } = postDoc;
    if (!operationHours?.open || !operationHours?.close) {
      return next(throwError(500, "Operational hours not configured."));
    }

    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (end <= start) {
      return next(throwError(400, "End time must be after start time."));
    }

    // Extract UTC hours and minutes for booking
  const startBookingMinutes = start.getHours() * 60 + start.getMinutes();
const endBookingMinutes = end.getHours() * 60 + end.getMinutes();
    // Convert operation hours to minutes
    const openMinutes = toMinutes(operationHours.open);
    const closeMinutes = toMinutes(operationHours.close);

    // Validate booking is within operational hours
    const isValidTime =
      endBookingMinutes <= closeMinutes &&
      startBookingMinutes >= openMinutes;

    if (!isValidTime) {
      return next(
        throwError(
          400,
          `Booking time must be within operational hours: ${to12Hour(
            operationHours.open
          )} - ${to12Hour(operationHours.close)}`
        )
      );
    }

    // Check for overlapping bookings
    const filter = {
      type,
      ...(type === "venue" ? { venueId } : { serviceId }),
      startTime: { $lt: end },
      endTime: { $gt: start },
    };

    const conflict = await Booking.findOne(filter);
    if (conflict) {
      return next(throwError(409, `This ${type} is already booked for the selected time.`));
    }

    // Save booking
    const booking = new Booking({
      userId,
      type,
      venueId: type === "venue" ? venueId : undefined,
      serviceId: type === "service" ? serviceId : undefined,
      startTime,
      endTime,
      notes,
    });

    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});


router.get("/calendar", async (req, res, next) => {
  try {
    const { type, id } = req.query;

    if (!type || !["venue", "service"].includes(type)) {
      return next(throwError(400, "Invalid or missing 'type' query parameter."));
    }

    if (!id) {
      return next(throwError(400, "Missing 'id' query parameter."));
    }

    const postDoc = await post.findOne({ _id: id, type });

    if (!postDoc) {
      return next(throwError(404, `${type} not found in posts collection.`));
    }

    const { operationHours, operationDays } = postDoc;

    if (!operationHours || !operationHours.open || !operationHours.close) {
      return next(throwError(500, `Operational hours not configured for this ${type}`));
    }

    const filter = {
      type,
      ...(type === "venue" ? { venueId: id } : { serviceId: id }),
    };

    const bookingsRaw = await Booking.find(filter)
      .select("startTime endTime notes")
      .sort("startTime");

    const events = bookingsRaw.map(b => ({
      id: b._id.toString(),
      title: b.notes || "Booked",
      start: b.startTime.toISOString(),
      end: b.endTime.toISOString(),
    }));

    res.status(200).json({
      operationDays,      
      operationHours,     
      events,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/by-user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(throwError(400, "Missing userId parameter"));
    }

    const bookings = await Booking.find({ userId })
      .populate("venueId")
      .populate("serviceId");

    const formatted = bookings.map((booking) => {
      const obj = booking.toObject();

      const post = obj.venueId || obj.serviceId;


      delete obj.venueId;
      delete obj.serviceId;

      return { ...obj, post };
    });

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
});

router.get("/by-date", async (req, res, next) => {
  try {
    const { date, postId, type } = req.query;

    if (!date || !postId || !type) {
      return next(throwError(400, "Missing date, postId, or type"));
    }

    // Validate type
    if (!["venue", "service"].includes(type)) {
      return next(throwError(400, "Invalid type. Must be 'venue' or 'service'"));
    }

    // Parse date in YYYY-MM-DD (local)
    const [year, month, day] = date.split("-").map(Number);
    const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0);       // Local 00:00
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999);   // Local 23:59

    // Dynamic filter key
    const filter = {
      [type === "venue" ? "venueId" : "serviceId"]: postId,
      startTime: { $gte: dayStart, $lte: dayEnd }
    };

    const bookings = await Booking.find(filter)
      .populate("userId", "-password -__v")
      .populate("venueId")
      .populate("serviceId");

    const formatted = bookings.map((b) => {
      const booking = b.toObject();
      const user = booking.userId;
      delete booking.userId;
      return { ...booking, user };
    });

    res.status(200).json(formatted);
  } catch (err) {
    next(err);
  }
});



router.put("/:id", async (req, res, next) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedBooking) {
      return next(throwError(404, "Booking not found"));
    }

    res.status(200).json(updatedBooking);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return next(throwError(404, "Booking not found"));
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (err) {
    next(err);
  }
});



module.exports = router;
