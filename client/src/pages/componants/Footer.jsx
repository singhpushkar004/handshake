import React from 'react'
import { Link } from 'react-router'
import img from "../../assets/images/logo.png"
const Footer = () => {
  return (
    <div className="container-fluid">
        <div className="row mt-5 bg-dark text-white py-3">
            <div className="col-sm-10 mx-auto">
            <div className="row">
                <div className="col-sm-4 py-5 ">
                    <p><img src={img} className='img-fluid' alt="" style={{height:"50px"}}/> <span className='fs-4 fw-semibold' style={{fontFamily:"cursive"}} >Softpro India</span></p>

                    <p className="small fw-bolder">Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi debitis hic dolores provident quia dolorum laudantium nihil aspernatur cupiditate quam.</p>
                    <p className="small fw-bolder mb-0">Email : hr.softpro@gmail.com</p>
                    <p className="small fw-bolder m-0">Phone : +91 639-588-1234</p>

                </div>
                <div className="col-sm-4 py-5 ">
                    <h4 className='heading'>Quick Links</h4>
                    <ul className='list-unstyled'>
                        <li className='my-2'><Link to="/" className='text-decoration-none text-white'>Home</Link></li>
                        <li className='my-2'><Link to="/about" className='text-decoration-none text-white'>About Us</Link></li>
                        <li className='my-2'><Link to="/services" className='text-decoration-none text-white'>Services</Link></li>
                        <li className='my-2'><Link to="/contact" className='text-decoration-none text-white'>Contact Us</Link></li>
                    </ul>
                </div>
                <div className="col-sm-4 py-5 ">
                    <h4 className='heading'>Get In Touch</h4>
                    <p>we are legend Lorem ipsum dolor sit.</p>
                    <div className="input-group my-2">
                    <input type="text" className="form-control rounded-0 py-2" placeholder="Your email" aria-label="Recipient's username" aria-describedby="button-addon2"/>
                    <button className="btn btn-primary rounded-0 border-0" style={{backgroundColor:"orangered"}} type="button" id="button-addon2"><i className="fa-solid fa-paper-plane"></i></button>
                    </div>
                    <div className="d-flex">
                        <div className="me-3">
                            <i className="fa-brands fa-facebook-f"></i>
                        </div>
                        <div className="me-3">
                            <i className="fa-brands fa-twitter"></i>
                        </div>
                        <div className="me-3">
                            <i className="fa-brands fa-linkedin-in"></i>
                        </div>
                        <div className="me-3">
                            <i className="fa-brands fa-instagram"></i>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Footer