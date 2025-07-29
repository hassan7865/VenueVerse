import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import Loading from "../Components/Loading";
import ListingDetails from "../Components/ListingDetail";
import { showConfirmationToast } from "../Components/DeleteComponent";
import ReviewComponent from "../Components/Reviews";

const ListingPage = () => {
  const [listings, setListings] = useState({});
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [operationalDays, setOperationalDays] = useState([]);
  const [operationalHours, setOperationalHours] = useState([]);
  const [reviews, setreviews] = useState([]);

  const navigate = useNavigate();
  const params = useParams();
  const currentUser = UserProfile.GetUserData();
  const calendarRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Step 1: Fetch listing
        const listingRes = await api.get(`/post/${params.id}`);
        const listingData = listingRes.data;
        setListings(listingData);
        setOwner(listingData.user);

        // Step 2: Fetch calendar & reviews in parallel using type from listing
        const [eventsRes, reviewsRes] = await Promise.all([
          api.get(
            `/booking/calendar?type=${listingData.type}&id=${listingData._id}`
          ),
          api.get(
            `/review?type=${listingData.type}&sourceId=${listingData._id}`
          ),
        ]);

        // Step 3: Set calendar data
        const { operationDays, operationHours, events } = eventsRes.data;
        const formattedEvents = events.map((event) => ({
          id: event.id,
          title: event.title || "Booked",
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: false,
        }));
        setEvents(formattedEvents);
        setOperationalDays(operationDays);
        setOperationalHours(operationHours);

        // Step 4: Set reviews
        setreviews(reviewsRes.data.reviews);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleUrlShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handlePostDelete = async (venueId, type) => {
    const isConfirmed = await showConfirmationToast({
      title: "Delete Confirmation",
      message: `Are you sure you want to delete this ${type}? This action cannot be undone.`,
      variant: "danger",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      onConfirm: () => console.log(`Confirmed deletion of ${type}`),
      onCancel: () => console.log(`Cancelled deletion of ${type}`),
    });

    if (!isConfirmed) return;

    setLoading(true);
    const toastId = toast.loading(`Deleting ${type}...`);

    try {
      await api.delete(`/post/${venueId}`);
      toast.success(`${type} deleted successfully`);
      navigate("/listing");
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      const message =
        error.response?.data?.message || `Failed to delete ${type}`;
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = () => {
    if (!currentUser) {
      toast.error("Please login to start a chat");
      navigate("/login");
      return;
    }
    navigate(`/chat/${owner._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loading />
        <p className="mt-4 text-brand-blue font-medium">
          Loading your listing...
        </p>
      </div>
    );
  }

  return (
    <>
      <ListingDetails
        listings={listings}
        owner={owner}
        currentUser={currentUser}
        events={events}
        operationalDays={operationalDays}
        operationalHours={operationalHours}
        calendarRef={calendarRef}
        handleUrlShare={handleUrlShare}
        handlePostDelete={handlePostDelete}
        handleStartChat={handleStartChat}
        navigate={navigate}
        params={params}
      />
      <ReviewComponent
        existingReviews={reviews}
        type={listings.type}
        sourceId={params.id}
      />
    </>
  );
};

export default ListingPage;
