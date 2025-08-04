const express = require("express");
const Booking = require("../Models/Booking.model");
const verifyToken = require("../Helper/verifyToken");
const throwError = require("../Helper/error");
const post = require("../Models/Post.model");
const to12Hour = require("../Helper/12Hr");
const generateInvoice = require("../Constants/generateInvoice");
const sendEmail = require("../Helper/email");
const {
  bookingSuccessTemplate,
  venueBookedByUserTemplate,
} = require("../Constants/emailbody");
const User = require("../Models/User.model");
const router = express.Router();

const { DateTime } = require("luxon");

const TIMEZONE = "Asia/Karachi";

// Your route definition
router.post("/create", verifyToken, async (req, res, next) => {
  try {
    const {
      type,
      venueId,
      serviceId,
      startTime,
      endTime,
      notes,
      userId,
      price,
    } = req.body;

    // Validation
    if (!type || !["venue", "service"].includes(type)) {
      return next(throwError(400, "Invalid or missing booking type."));
    }

    if (type === "venue" && !venueId) {
      return next(throwError(400, "venueId is required for venue bookings."));
    }

    if (type === "service" && !serviceId) {
      return next(
        throwError(400, "serviceId is required for service bookings.")
      );
    }

    if (!userId) {
      return next(throwError(400, "userId is required."));
    }

    if (!price || price <= 0) {
      return next(throwError(400, "Valid price is required."));
    }

    // Find the post (venue or service)
    const postId = type === "venue" ? venueId : serviceId;
    const postDoc = await post
      .findOne({ _id: postId, type })

    if (!postDoc) {
      return next(throwError(404, `${type} not found.`));
    }

    const { operationHours } = postDoc;
    if (!operationHours?.open || !operationHours?.close) {
      return next(throwError(500, "Operational hours not configured."));
    }

    // Parse booking times
    let start, end;
    try {
      start = DateTime.fromISO(startTime, { zone: TIMEZONE });
      end = DateTime.fromISO(endTime, { zone: TIMEZONE });

      if (!start.isValid || !end.isValid) {
        throw new Error("Invalid date format");
      }
    } catch (error) {
      return next(throwError(400, "Invalid date/time format. Use ISO format."));
    }

    if (end <= start) {
      return next(throwError(400, "End time must be after start time."));
    }

    // Validate operational hours
    const toMinutes = (timeStr) => {
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const openMinutes = toMinutes(operationHours.open);
    const closeMinutes = toMinutes(operationHours.close);
    const startMinutes = start.hour * 60 + start.minute;
    const endMinutes = end.hour * 60 + end.minute;

    const isValidTime =
      startMinutes >= openMinutes && endMinutes <= closeMinutes;

    const to12Hour = (timeStr) => {
      const [hour, minute] = timeStr.split(":").map(Number);
      const suffix = hour >= 12 ? "PM" : "AM";
      const h = ((hour + 11) % 12) + 1;
      return `${h}:${minute.toString().padStart(2, "0")} ${suffix}`;
    };

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

    // Check for conflicts
    const conflict = await Booking.findOne({
      type,
      ...(type === "venue" ? { venueId } : { serviceId }),
      startTime: { $lt: end.toJSDate() },
      endTime: { $gt: start.toJSDate() },
    });

    if (conflict) {
      return next(
        throwError(409, `This ${type} is already booked for the selected time.`)
      );
    }

    // Verify user exists
    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return next(throwError(404, "User not found."));
    }

    // Create booking
    const booking = new Booking({
      userId,
      type,
      venueId: type === "venue" ? venueId : undefined,
      serviceId: type === "service" ? serviceId : undefined,
      startTime: start.toJSDate(),
      endTime: end.toJSDate(),
      price,
      notes,
    });

    const saved = await booking.save();

    // Format dates for invoice
    const formatForInvoice = (dateObj) => {
      return DateTime.fromJSDate(dateObj, { zone: TIMEZONE }).toFormat(
        "dd/MM/yyyy hh:mm a"
      );
    };

    const currentDateTime = DateTime.now().setZone(TIMEZONE);
    const venueName = postDoc.title || postDoc.name || "Unknown";

    // Generate and send invoice (with error handling)
    try {
      const pdfBuffer = await generateInvoice({
        bookingId: saved._id.toString(),
        customerName: userDoc.username || "N/A",
        customerEmail: userDoc.email || "N/A",
        customerPhone: userDoc.phone || "N/A",
        venueName,
        startTime: formatForInvoice(saved.startTime),
        endTime: formatForInvoice(saved.endTime),
        totalPrice: saved.price,
        bookingDate: currentDateTime.toFormat("dd/MM/yyyy hh:mm a"),
      });

      // Send confirmation email to customer
      await sendEmail({
        to: userDoc.email,
        subject: `Booking Confirmation`,
        html: bookingSuccessTemplate(userDoc.username, booking._id),
        attachments: [
          {
            filename: `invoice-${booking._id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });

      const postUser = await User.findById(postDoc.userId)
      if(!postUser){
        return next(throwError(404,"Owner not found"))
      }

      await sendEmail({
        to: postUser.email,
        subject: "Booking Notification",
        html: venueBookedByUserTemplate(
          userDoc.username,
          postUser.username,
          saved._id.toString(),
          venueName,
          formatForInvoice(saved.startTime),
          formatForInvoice(saved.endTime),
          saved.notes
        ),
      });
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail the booking creation due to email issues
      // You might want to log this error or handle it differently
    }

    res.status(201).json({
      booking: saved,
      message: "Booking created successfully",
    });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/invoice", async (req, res, next) => {
  try {
    const bookingId = req.params.id;

    // 1. Fetch booking from DB
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return next(throwError(404, "Booking not found"));
    }

    // 2. Fetch user data
    const userDoc = await User.findById(booking.userId);
    if (!userDoc) {
      return next(throwError(404, "User not found"));
    }

    const formatForInvoice = (dateObj) => {
      return DateTime.fromJSDate(dateObj, { zone: TIMEZONE }).toFormat(
        "dd/MM/yyyy hh:mm a"
      );
    };

    const currentDateTime = DateTime.now().setZone(TIMEZONE);

    const pdfBuffer = await generateInvoice({
      bookingId: booking._id.toString(),
      customerName: userDoc.username || "N/A",
      customerEmail: userDoc.email || "N/A",
      customerPhone: userDoc.phone || "N/A",
      venueName: booking.venueName,
      startTime: formatForInvoice(booking.startTime),
      endTime: formatForInvoice(booking.endTime),
      totalPrice: booking.price,
      bookingDate: currentDateTime.toFormat("dd/MM/yyyy hh:mm a"),
    });

    // 4. Return PDF as a download
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${booking._id}.pdf"`,
    });

    return res.send(pdfBuffer);
  } catch (error) {
    next(error);
  }
});

router.get("/calendar", async (req, res, next) => {
  try {
    const { type, id } = req.query;

    if (!type || !["venue", "service"].includes(type)) {
      return next(
        throwError(400, "Invalid or missing 'type' query parameter.")
      );
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
      return next(
        throwError(500, `Operational hours not configured for this ${type}`)
      );
    }

    const filter = {
      type,
      ...(type === "venue" ? { venueId: id } : { serviceId: id }),
    };

    const bookingsRaw = await Booking.find(filter)
      .select("startTime endTime notes")
      .sort("startTime");

    const events = bookingsRaw.map((b) => ({
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
      return next(
        throwError(400, "Invalid type. Must be 'venue' or 'service'")
      );
    }

    // Parse date in YYYY-MM-DD (local)
    const [year, month, day] = date.split("-").map(Number);
    const dayStart = new Date(year, month - 1, day, 0, 0, 0, 0); // Local 00:00
    const dayEnd = new Date(year, month - 1, day, 23, 59, 59, 999); // Local 23:59

    // Dynamic filter key
    const filter = {
      [type === "venue" ? "venueId" : "serviceId"]: postId,
      startTime: { $gte: dayStart, $lte: dayEnd },
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

    const userDoc = await User.findById(updatedBooking.userId);
    if (!userDoc) return next(throwError(404, "User not found."));

    const venueName = updatedBooking.title || updatedBooking.name || "Unknown";

    // Generate invoice PDF
    const formatForInvoice = (dateObj) => {
      return DateTime.fromJSDate(dateObj, { zone: TIMEZONE }).toFormat(
        "dd/MM/yyyy hh:mm a"
      );
    };

    const currentDateTime = DateTime.now().setZone(TIMEZONE);

    try {
      const pdfBuffer = await generateInvoice({
        bookingId: updatedBooking._id.toString(),
        customerName: userDoc.username || "N/A",
        customerEmail: userDoc.email || "N/A",
        customerPhone: userDoc.phone || "N/A",
        venueName,
        startTime: formatForInvoice(updatedBooking.startTime),
        endTime: formatForInvoice(updatedBooking.endTime),
        totalPrice: updatedBooking.price,
        bookingDate: currentDateTime.toFormat("dd/MM/yyyy hh:mm a"),
      });
      await sendEmail({
        to: userDoc.email,
        subject: "Venue Booking Confirmation",
        html: bookingSuccessTemplate(
          userDoc.username,
          updatedBooking._id,
          true
        ),
        attachments: [
          {
            filename: `invoice-${updatedBooking._id}.pdf`,
            content: pdfBuffer,
            contentType: "application/pdf",
          },
        ],
      });
    } catch {}

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
