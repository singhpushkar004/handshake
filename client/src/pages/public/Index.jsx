import React from 'react'
import Header from '../componants/header'
import img1 from '../../assets/images/house1.jpg'
import SingleSlideSlider from '../componants/Slider'
import VideoCardSlider from '../componants/VideoCardSlider'
import news1 from '../../assets/images/news1.jpg'
import news2 from '../../assets/images/news2.jpg'
import news3 from '../../assets/images/news3.jpg' 
import Footer from '../componants/Footer'

const Index = () => {
   
  return (
    <div>
        <div className="container-fluid">
            <div className="row index-header" >
                <div className="col-sm-12">
                    <Header/>
                </div>
                <div className="text-center text-white" style={{ paddingTop: "150px" }}>
                    <h1 className="hero-heading">
                        {"Welcome to Handshake".split("").map((char, i) => (
                        <span key={i} style={{ animationDelay: `${i * 0.1}s` }} className="fade-char">
                            {char === " " ? "\u00A0" : char}
                        </span>
                        ))}
                    </h1>

                    <p className="hero-subheading">
                        {"Your gateway to endless opportunities".split("").map((char, i) => (
                        <span key={i} style={{ animationDelay: `${i * 0.05 + 2}s` }} className="fade-char">
                            {char === " " ? "\u00A0" : char}
                        </span>
                        ))}
                    </p>
                </div>

            </div>
            {/* row2 start */}
            <div className="row my-5 ">
              <div className="col-sm-10 slider bg-light  rounded shadow " style={{margin:"0x auto !important"}}>
                <SingleSlideSlider />
              </div>
            </div>
            {/* row2 end */}
            <div className="row " style={{marginTop:"150px"}}></div>
            {/* about section start */}
              <div className="row my-5 abanner">
                <div className="col-sm-10 mx-auto py-4">
                  <div className="row">
                    <div className="col-sm-6 text-justify">
                      <h1 className='heading'>About <span className='sub-heading'>Softpro</span></h1>
                      <p>
                     Softpro India Computer Technologies (P) Ltd. is a leading IT education and training company based in Lucknow, Uttar Pradesh. Since its inception in 2004, we have been committed to empowering students and professionals with industry-relevant IT skills.
                      </p>
                      <p>Founded by Er. Ajay Chaudhary (IET Lucknow) and Er. S. K. Verma (IIT Kanpur), Softpro India has consistently bridged the gap between academics and industry by offering:</p>
                      <ul>
                      <li> Expert-led training programs in cutting-edge technologies</li>
                        <li>Live project experiences</li>
                        <li>Career-oriented learning solutions</li>
                      </ul>
                       <p>
                      Softpro India Computer Technologies (P) Ltd., is a complete Technology Services and Solutions provider. Incorporated in 2004 and ISO 9001:2015 Certified, the company is dedicated to delivering reliable software solutions across diverse sectors, including:
                     </p>
                      <p>
                      Our vision is to create skilled IT professionals who are equipped to meet global industry standards and contribute effectively to the digital ecosystem.
                      </p>
                    
                    </div>
                    <div className="col-sm-6">
                      <div className="about-image">
                        <img src={img1} alt="About Softpro" className="img-fluid rounded aimage" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            {/* about section end */}
            <div className="row my-5">
              <div className="col-sm-10 mx-auto">
                <h1 className='heading'>Our Success <span className='sub-heading'>Story</span> </h1>
                <VideoCardSlider/>
              </div>
            </div>
            {/* news , event section start */}
            <div className="row">
              <div className="col-sm-10 mx-auto">
              <div className="row">
                <div className="col-sm-4 mx-auto my-3 ">
                  <h5 className="card-title  heading2 mb-3">Latest News</h5>
                  <div className="card border-0 shadow-lg" style={{height:"400px",overflowY:"auto"}}>
                    <div className="card-body">
                      
                    <div className="row my-3">
                    <div className="col-sm-3">
                      <img src={news1} alt="News Icon" className="img-fluid h-100"/>
                    </div>
                    <div className="col-sm-9">
                      <h5 className='medium '><a href="#" className='text-muted text-decoration-none'>Objectives Should Be Stated Clearly</a></h5>
                      Stay updated with the latest news and announcements from Softpro India. 
                    </div>
                    </div>
                    {/* row 2 */}
                    <hr />
                    <div className="row my-3">
                    <div className="col-sm-3">
                      <img src={news2} alt="News Icon" className="img-fluid h-100"/>
                    </div>
                    <div className="col-sm-9">
                      <h5 className='medium '><a href="#" className='text-muted text-decoration-none'>
                        Lorem ipsum dolor sit amet.
                        </a></h5>
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Distinctio saepe laboriosam nostrum obcaecati minus est?
                    </div>
                    </div>
                    {/* row 2 */}
                    <hr />
                    <div className="row my-3">
                    <div className="col-sm-3">
                      <img src={news3} alt="News Icon" className="img-fluid h-100"/>
                    </div>
                    <div className="col-sm-9">
                      <h5 className='medium '><a href="#" className='text-muted text-decoration-none'>Objectives Should Be Stated Clearly</a></h5>
                      Stay updated with the latest news and announcements from Softpro India. 
                    </div>
                    </div>
                    {/* row 2 */}
                    <hr />
                    <div className="row">
                    <div className="col-sm-3">
                      <img src="https://img.icons8.com/ios-filled/50/000000/news.png" alt="News Icon" className="img-fluid h-100"/>
                    </div>
                    <div className="col-sm-9">
                      <p className="card-text">Stay updated with the latest news and announcements from Softpro India. From new course launches to industry partnerships, find all the important updates here.</p>
                      
                    </div>
                    </div>
                  </div>
                  </div>
                </div>
                  <div className="col-sm-4 mx-auto my-3">
                    <h5 className="card-title heading2 mb-3">Career Opportunity</h5>
                    <div
                      className="card border-0 shadow-lg"
                      style={{ height: "400px", overflowY: "auto" }}
                    >
                      <div className="card-body">

                        {/* Row 1 */}
                        <div className="row align-items-center mb-3">
                          <div className="col-3 text-center">
                            <img
                              src="https://seeklogo.com/images/P/procera-logo-0E8D2C.svg"
                              alt="Procera"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: "60px" }}
                            />
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Technical Director</h6>
                            <p className="text-muted small mb-0">
                              Claritas est etiam processus dynamicus, qui sequitur mutationem[…]
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Row 2 */}
                        <div className="row align-items-center mb-3">
                          <div className="col-3 text-center">
                            <img
                              src="https://cdn.worldvectorlogo.com/logos/salsify.svg"
                              alt="Salsify"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: "60px" }}
                            />
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Assistant</h6>
                            <p className="text-muted small mb-0">
                              Claritas est etiam processus dynamicus, qui sequitur mutationem[…]
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Row 3 */}
                        <div className="row align-items-center mb-3">
                          <div className="col-3 text-center">
                            <img
                              src="https://cdn.worldvectorlogo.com/logos/navia.svg"
                              alt="Navia"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: "60px" }}
                            />
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Developer</h6>
                            <p className="text-muted small mb-0">
                              Claritas est etiam processus dynamicus, qui sequitur mutationem[…]
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Row 4 */}
                        <div className="row align-items-center mb-3">
                          <div className="col-3 text-center">
                            <img
                              src="https://cdn.worldvectorlogo.com/logos/chargify.svg"
                              alt="Chargify"
                              className="img-fluid rounded-circle"
                              style={{ maxWidth: "60px" }}
                            />
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Manager</h6>
                            <p className="text-muted small mb-0">
                              Claritas est etiam processus dynamicus, qui sequitur mutationem[…]
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                  <div className="col-sm-4 mx-auto my-3">
                    <h5 className="card-title heading2 mb-3">Event Calendar</h5>
                    <div
                      className="card border-0 shadow-lg"
                      style={{ height: "400px", overflowY: "auto" }}
                    >
                      <div className="card-body">

                        {/* Event 1 */}
                        <div className="row mb-4">
                          <div className="col-3 text-center">
                            <div className="d-flex flex-column align-items-center">
                              <span className="text-uppercase small fw-bold">Sun</span>
                              <span className="fw-bold fs-3 text-warning">31</span>
                              <span className="small text-muted">Dec</span>
                            </div>
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Alumni Association White Hall Exhibition</h6>
                            <p className="text-muted small mb-1">
                              Duis autem vel eum iriure dolor in hendrerit[…]
                            </p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                              Findlancer Terrace, Gondosuli, California
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Event 2 */}
                        <div className="row mb-4">
                          <div className="col-3 text-center">
                            <div className="d-flex flex-column align-items-center">
                              <span className="text-uppercase small fw-bold">Mon</span>
                              <span className="fw-bold fs-3 text-warning">04</span>
                              <span className="small text-muted">Dec</span>
                            </div>
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Annual Meet Up And Scholarship</h6>
                            <p className="text-muted small mb-1">
                              Duis autem vel eum iriure dolor in hendrerit[…]
                            </p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                              Sayidan Street, Gondomanan, 8993, San Francisco, CA
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Event 3 */}
                        <div className="row mb-4">
                          <div className="col-3 text-center">
                            <div className="d-flex flex-column align-items-center">
                              <span className="text-uppercase small fw-bold">Tue</span>
                              <span className="fw-bold fs-3 text-warning">07</span>
                              <span className="small text-muted">Nov</span>
                            </div>
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Annual Meetup and Scholarship Presentation</h6>
                            <p className="text-muted small mb-1">
                              Duis autem vel eum iriure dolor in hendrerit[…]
                            </p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                              363 Oakwood Avenue Irmo, SC 29063
                            </p>
                          </div>
                        </div>
                        <hr />

                        {/* Event 4 */}
                        <div className="row mb-4">
                          <div className="col-3 text-center">
                            <div className="d-flex flex-column align-items-center">
                              <span className="text-uppercase small fw-bold">Thu</span>
                              <span className="fw-bold fs-3 text-warning">17</span>
                              <span className="small text-muted">Nov</span>
                            </div>
                          </div>
                          <div className="col-9">
                            <h6 className="fw-bold mb-1">Club Sponsorship 2022-2023</h6>
                            <p className="text-muted small mb-1">
                              Duis autem vel eum iriure dolor in hendrerit[…]
                            </p>
                            <p className="text-muted small mb-0">
                              <i className="bi bi-geo-alt-fill me-1 text-warning"></i>
                              Location Not Specified
                            </p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

              </div>
              </div>
            </div>
            {/* news , event section end */}
        {/* footer start */}
        <div className="row">
          <div className="col-sm-12 p-0">
            <Footer/>
          </div>
        </div>
        {/* footer end */}
        </div>
    </div>
           
  )
}

export default Index