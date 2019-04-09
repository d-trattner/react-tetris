import React from 'react'

import bg_jpg from "../assets/v.jpg"
import bg_mp4 from "../assets/v.mp4"
import bg_ogv from "../assets/v.ogv"
import bg_webm from "../assets/v.webm"

export default function Bg() {
  return (
    <div className="fullscreen-bg">
        <video
        loop
        muted
        autoPlay
        poster={bg_jpg}
        className="fullscreen-bg__video"
        >
        <source src={bg_webm} type="video/webm" />
        <source src={bg_mp4} type="video/mp4" />
        <source src={bg_ogv} type="video/ogv" />
        </video>
    </div>
  )
}
