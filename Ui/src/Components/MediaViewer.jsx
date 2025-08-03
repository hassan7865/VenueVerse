import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

const MediaViewer = ({ url, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  
  const isVideo = /\.(mp4|webm|mov|avi)$/i.test(url);
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

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
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-6xl">
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    autoPlay
                    className="w-full max-h-[90vh] object-contain"
                  />
                ) : isImage ? (
                  <img
                    src={url}
                    alt="Fullscreen media"
                    className="w-full max-h-[90vh] object-contain"
                  />
                ) : (
                  <div className="p-8 bg-gray-800 text-white rounded-lg">
                    <p>Unsupported media type</p>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>

            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-gray-300 focus:outline-none"
              aria-label="Close media viewer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
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