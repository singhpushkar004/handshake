import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules"; // ✅ Autoplay added

// Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./VideoCardSlider.css"; // custom CSS
import vid1 from "../../assets/videos/alumni1.mp4";
import vid2 from "../../assets/videos/alumni2.mp4";
import vid3 from "../../assets/videos/alumni3.mp4";
import vid4 from "../../assets/videos/alumni4.mp4";
import vid5 from "../../assets/videos/alumni5.mp4";

export default function VideoCardSlider() {
  const cards = [
    {
      name: "Arish Iqbal Siddiqui",
      sentence:
        "R.R Group of Institutuins, Lucknow ⭐️ | 𝐒𝐨𝐟𝐭𝐩𝐫𝐨 𝐈𝐧𝐝𝐢𝐚 𝐒𝐮𝐦𝐦𝐞𝐫 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝟐𝟎𝟐𝟓",
      video: vid1,
    },
    {
      name: "Akriti Gupta",
      sentence:
        "Teerthanker Mahaveer University (TMU), Moradabad ⭐️ | 𝐒𝐨𝐟𝐭𝐩𝐫𝐨 𝐈𝐧𝐝𝐢𝐚 𝐒𝐮𝐦𝐦𝐞𝐫 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝟐𝟎𝟐𝟓",
      video: vid2,
    },
    {
      name: "Kajal Prajapati",
      sentence:
        "IIMT Group of Colleges, Greater Noida ⭐️ | 𝐒𝐨𝐟𝐭𝐩𝐫𝐨 𝐈𝐧𝐝𝐢𝐚 𝐒𝐮𝐦𝐦𝐞𝐫 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝟐𝟎𝟐𝟓",
      video: vid3,
    },
    {
      name: "Tanaya Singh",
      sentence:
        "GL Bajaj Institute of Technology and Management ⭐️ | 𝐒𝐨𝐟𝐭𝐩𝐫𝐨 𝐈𝐧𝐝𝐢𝐚 𝐒𝐮𝐦𝐦𝐞𝐫 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝟐𝟎𝟐𝟓",
      video: vid4,
    },
    {
      name: "Vikash Kashyap",
      sentence:
        "Quantum University, Roorkee ⭐️ | 𝐒𝐨𝐟𝐭𝐩𝐫𝐨 𝐈𝐧𝐝𝐢𝐚 𝐒𝐮𝐦𝐦𝐞𝐫 𝐓𝐫𝐚𝐢𝐧𝐢𝐧𝐠 𝟐𝟎𝟐𝟓",
      video: vid5,
    },
  ];

  return (
    <div className="video-slider-section py-5">
      <div className="container">
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false, // ✅ keep autoplay even after user interaction
          }}
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination, Autoplay]} // ✅ Autoplay added here
          className="video-slider"
          breakpoints={{
            320: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="video-card">
                {/* Background Video */}
                <video autoPlay loop muted playsInline className="video-bg">
                  <source src={card.video} type="video/mp4" />
                </video>

                {/* Overlay */}
                <div className="overlay"></div>

                {/* Content */}
                <div className="content">
                  <h3>{card.name}</h3>
                  <p>{card.sentence}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
