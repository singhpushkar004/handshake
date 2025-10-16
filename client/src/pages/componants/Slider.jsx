import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css"; // Default theme (can be changed)
import img from "../../assets/images/aktu.jpg"
import img2 from "../../assets/images/DTE.jpg"
import img3 from "../../assets/images/VMSB.jpg"

export default function SingleSlideSlider() {
  return (
    <Splide
      options={{
        type: "loop",       // loop through slides
        perPage: 1,         // show 1 slide at a time
        autoplay: true,     // auto play
        interval: 4000,     // 4 seconds
        pauseOnHover: true, // stop autoplay on hover
        arrows: true,       // prev/next arrows
        pagination: true,   // dots navigation
        speed: 800,         // slide transition speed
      }}
      aria-label="Single Slide Carousel"
    >
      <SplideSlide>
        <div className="row">
            <div className="col-sm-11 my-auto mx-auto">
                <div className="row">
                    <div className="col-sm-4">
                        <img src={img} alt="Slide 1" className="img-fluid rounded shadow sp-image"/>
                    </div>
                    <div className="col-sm-8">
                        <h1 className="heading2 mt-3">
                            {" MoU with Dr. A.P.J. Abdul Kalam Technical University, Lucknow".split("").map((char, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.05}s` }} className="fade-char">
                                {char === " " ? "\u00A0" : char}
                            </span>
                            ))}
                        </h1>
                        <p>Softpro India has signed a Memorandum of Understanding (MoU) with Dr. A.P.J. Abdul Kalam Technical University (AKTU) to foster academic collaboration. This partnership aims to bridge the gap between industry and academia by promoting skill development, knowledge sharing, and joint initiatives that enhance students' employability and practical learning experiences.</p>
                    </div>
                </div>
            </div>
        </div>
      </SplideSlide>
      <SplideSlide>
         <div className="row">
            <div className="col-sm-11 my-auto mx-auto">
                <div className="row">
                    <div className="col-sm-4">
                        <img src={img2} alt="Slide 1" className="img-fluid rounded shadow sp-image"/>
                    </div>
                    <div className="col-sm-8">
                        <h1 className="heading2 mt-3">
                            {" MoU with Department of Technical Education, Government of Uttar Pradesh".split("").map((char, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.05}s` }} className="fade-char">
                                {char === " " ? "\u00A0" : char}
                            </span>
                            ))}
                        </h1>
                        <p className="my-auto">Softpro India has signed a Memorandum of Understanding (MoU) with the Department of Technical Education, Government of Uttar Pradesh, to foster academic collaboration. This initiative aims to empower Diploma students through skill development, hands-on training, and industry exposure, enhancing their employability and bridging the gap between education and industry.</p>
                    </div>
                </div>
            </div>
        </div>
      </SplideSlide>
      <SplideSlide>
         <div className="row">
            <div className="col-sm-11 my-auto mx-auto">
                <div className="row">
                    <div className="col-sm-4">
                        <img src={img3} alt="Slide 1" className="img-fluid rounded shadow sp-image"/>
                    </div>
                    <div className="col-sm-8">
                        <h1 className="heading2 mt-3">
                            {" MoU with VMSB Uttarakhand Technical University, Dehradun, Uttarakhand".split("").map((char, i) => (
                            <span key={i} style={{ animationDelay: `${i * 0.05}s` }} className="fade-char">
                                {char === " " ? "\u00A0" : char}
                            </span>
                            ))}
                        </h1>
                        <p>Softpro India has signed a Memorandum of Understanding (MoU) with VMSB Uttarakhand Technical University, Dehradun to foster academic collaboration. This partnership aims to bridge the gap between industry and academia by promoting skill development, knowledge sharing, and joint initiatives that enhance students' employability and practical learning experiences.</p>
                    </div>
                </div>
            </div>
        </div>
      </SplideSlide>
    </Splide>
  );
}
