import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/Url";
import UserProfile from "../../UserProfile";
import Loading from "../Components/Loading";
import ListingDetails from "../Components/ListingDetail";

const ListingPage = () => {
  const [listings, setListings] = useState({});
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [operationalDays, setOperationalDays] = useState([]);
  const [operationalHours, setOperationalHours] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({ user: null, notes: "" });

  const navigate = useNavigate();
  const params = useParams();
  const currentUser = UserProfile.GetUserData();
  const calendarRef = useRef();

  const fetchData = async () => {
    setLoading(true);
    try {
      const listingRes = await api.get(`/post/${params.id}`);
      const listingData = listingRes.data;
      setListings(listingData);
      setOwner(listingData.user);

      try {
        const eventsRes = await api.get(
          `/booking/calendar?type=${listingData.type}&id=${listingData._id}`
        );
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

      } catch {
        // Optionally handle events fetch errors here, or just ignore
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

 

  const handlePostDelete = async () => {
    const isVerified = window.confirm(
      "Are you sure you want to delete this listing?"
    );
    if (isVerified) {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/${listings._id}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          toast.error("Error occurred while deleting");
        } else {
          toast.success("Listing deleted successfully");
          navigate("/profile");
        }
      } catch (error) {
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
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
  );
};

export default ListingPage;