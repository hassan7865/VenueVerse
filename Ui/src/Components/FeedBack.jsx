import Slider from 'react-slick'
import FeedBackCard from './FeedBackCard'
import { feedbackData } from '../lib/data'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'

// Custom Arrow Components
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className='absolute -left-6 top-1/2 -translate-y-1/2 z-10 bg-brand-blue text-white p-2 rounded-full shadow-md hidden md:block'
  >
    <FaArrowLeft />
  </button>
)

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className='absolute -right-6 top-1/2 -translate-y-1/2 z-10 bg-brand-blue text-white p-2 rounded-full shadow-md hidden md:block'
  >
    <FaArrowRight />
  </button>
)

const FeedBack = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          autoplay: true,
          infinite: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: false,
          autoplay: true,
          infinite: true
        }
      }
    ]
  }

  return (
    <section id='feedbacks' className='w-full bg-white py-16 px-4 md:px-8'>
      <div className='max-w-[1100px] mx-auto'>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 leading-tight relative inline-block">
          <span className="relative z-10">
            Customer <span className="text-amber-500">Reviews</span>
          </span>
          <span className="absolute inset-x-0 bottom-1 w-1/2 h-1 bg-amber-300 opacity-30 rounded-full mx-auto z-0"></span>
        </h2>
        <p className='text-black'>
          Hear what our customers have to say about our venues and services.
        </p>
        <div className="relative">
          <Slider
            {...settings}
            className="feedback-slider [&_.slick-dots>li>button::before]:text-brand-blue"
          >
            {feedbackData.map((item, index) => (
              <FeedBackCard key={index} {...item} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

export default FeedBack
