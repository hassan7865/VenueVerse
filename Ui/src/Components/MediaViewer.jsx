import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const MediaViewer = ({ urls, children, startIndex = 0 ,type}) => {
  console.log(urls)
  const [isOpen, setIsOpen] = useState(false);
  const sliderRef = useRef(null);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const isVideo = (url) => /\.(mp4|webm|mov|avi)$/i.test(url);
  const isImage = (url) => /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

  const NextArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 right-4 z-20 transform -translate-y-1/2 cursor-pointer text-white bg-black/50 p-2 rounded-full hover:bg-black"
      onClick={onClick}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );

  const PrevArrow = ({ onClick }) => (
    <div
      className="absolute top-1/2 left-4 z-20 transform -translate-y-1/2 cursor-pointer text-white bg-black/50 p-2 rounded-full hover:bg-black"
      onClick={onClick}
    >
      <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </div>
  );

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    adaptiveHeight: true,
    initialSlide: startIndex, // Set initial slide here
  };

  // Alternative approach: Use setTimeout to ensure slider is ready
  useEffect(() => {
    if (isOpen && sliderRef.current && urls?.length > 0) {
      // Add a small delay to ensure slider is fully initialized
      const timer = setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(startIndex);
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isOpen, startIndex, urls]);

  // Alternative: Listen for slider initialization

  const settingsWithCallback = {
    ...settings,
   

    onInit: () => {
      if (startIndex > 0 && sliderRef.current) {
        sliderRef.current.slickGoTo(startIndex);
      }
    },
  };

  return (
    <>
      <div onClick={openModal} className="cursor-pointer">
        {children}
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50" onClose={closeModal}>
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/90" />
          </Transition.Child>

          {/* Modal content */}
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-screen-xl mx-auto">
                <Slider ref={sliderRef} {...settingsWithCallback}>
                  {urls?.map((url, index) => (
                    <div
                      key={index}
                      className="flex justify-center items-center"
                    >
                      {isVideo(type == "product" ? url.url :url.path) ? (
                        <video
                          src={type == "product" ? url.url :url.path}
                          autoPlay
                          muted
                          controls={false}
                          loop
                          playsInline
                          className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                        />
                      ) : isImage(type == "product" ? url.url :url.path) ? (
                        <img
                          src={type == "product" ? url.url :url.path}
                          alt={`Media ${index + 1}`}
                          className="w-full h-auto max-h-[80vh] object-contain rounded-md"
                        />
                      ) : (
                        <div className="p-8 bg-gray-800 text-white rounded-lg">
                          <p>Unsupported media type</p>
                        </div>
                      )}
                    </div>
                  ))}
                </Slider>
              </Dialog.Panel>
            </Transition.Child>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close media viewer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 sm:h-10 sm:w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default MediaViewer;
