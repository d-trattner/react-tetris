import React from 'react'

import Button from './Button'

import Logo from './Logo'

import { Colors } from './Colors';

export default function Start(props) {
  


    return (
        <div style={{
            position: 'absolute',
            zIndex: 100,
            width: '100%',
            height: '100%',
            backgroundColor: Colors.Dark,
        }}>

            <Logo/>

            <div style={{
                margin: "0",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
            }}>
                <Button text="start game" textOver="START GAME" onClick={props.onStartClick}/>
            </div>
            
        </div>
    )
}
