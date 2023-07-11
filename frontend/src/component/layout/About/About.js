import React from "react";
import "./aboutSection.css";
import { Typography, Avatar } from "@mui/material";

const About = () => {
//   const visitLinkedIn = () => {
//     window.location = "";
//   };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: window.innerWidth < 600 ? "20vmax" : "10vmax", height: window.innerWidth < 600 ? "20vmax" :"10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dkkegunsq/image/upload/v1688922756/avatars/wnvvg61eqjppnf8zjtqt.jpg"
              alt="Owner"
            />
            <Typography>Anirudh Rautela</Typography>
            {/* <Button onClick={visitLinkedIn} color="primary">
              Visit LinkedIn
            </Button> */}
            <span>
              This is a sample Full Stack ECommerce wesbite made by Anirudh Rautela. 
            </span>
          </div>
          <div className="aboutSectionContainer2">
            {/* <Typography component="h2">Our Brands</Typography> */}
            {/* <a
              href=""
              target="blank"
            >
              <YouTubeIcon className="youtubeSvgIcon" />
            </a>

            <a href="" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
