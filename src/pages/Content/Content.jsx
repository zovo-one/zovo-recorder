import React, { useState, useContext, useEffect, useRef } from "react";

import Wrapper from "./Wrapper";

import ContentState from "./context/ContentState";

const Content = () => {
  return (
    <div className="zvrrec-shadow-dom">
      <ContentState>
        <Wrapper />
      </ContentState>
      <style type="text/css">{`
			#zvrrec-ui, #zvrrec-ui div {
				background-color: unset;
				padding: unset;
				width: unset;
				box-shadow: unset;
				display: unset;
				margin: unset;
				border-radius: unset;
			}
			.zvrrec-outline {
				position: absolute;
				z-index: 99999999999;
				border: 2px solid #635BFF;
				outline-offset: -2px;
				pointer-events: none;
				border-radius: 5px!important;
			}
		.zvrrec-blur {
			filter: blur(10px)!important;
		}
			.zvrrec-shadow-dom * {
				transition: unset;
			}
			.zvrrec-shadow-dom .TooltipContent {
  border-radius: 30px!important;
	background-color: #29292F!important;
  padding: 10px 15px!important;
  font-size: 12px;
	margin-bottom: 10px!important;
	bottom: 100px;
  line-height: 1;
	font-family: 'Satoshi-Medium', sans-serif;
	z-index: 99999999!important;
  color: #FFF;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px!important;
  user-select: none;
	transition: opacity 0.3 ease-in-out;
  will-change: transform, opacity;
	animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}

.zvrrec-shadow-dom .hide-tooltip {
	display: none!important;
}

.zvrrec-shadow-dom .tooltip-tall {
	margin-bottom: 20px;
}

.zvrrec-shadow-dom .tooltip-small {
	margin-bottom: 5px;
}

.zvrrec-shadow-dom .TooltipContent[data-state='delayed-open'][data-side='top'] {
	animation-name: zvrrec-slideDownAndFade;
}
.zvrrec-shadow-dom .TooltipContent[data-state='delayed-open'][data-side='right'] {
  animation-name: zvrrec-slideLeftAndFade;
}
.zvrrec-shadow-dom.TooltipContent[data-state='delayed-open'][data-side='bottom'] {
  animation-name: zvrrec-slideUpAndFade;
}
.zvrrec-shadow-dom.TooltipContent[data-state='delayed-open'][data-side='left'] {
  animation-name: zvrrec-slideRightAndFade;
}

@keyframes zvrrec-slideUpAndFade {
  from { opacity: 0; transform: translateY(2px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes zvrrec-slideRightAndFade {
  from { opacity: 0; transform: translateX(-2px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes zvrrec-slideDownAndFade {
  from { opacity: 0; transform: translateY(-2px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes zvrrec-slideLeftAndFade {
  from { opacity: 0; transform: translateX(2px); }
  to   { opacity: 1; transform: translateX(0); }
}

#zvrrec-ui [data-radix-popper-content-wrapper] { z-index: 999999999999!important; }

.zvrrec-shadow-dom .CanvasContainer {
	position: fixed;
	pointer-events: all!important;
	top: 0px!important;
	left: 0px!important;
	z-index: 99999999999!important;
}
.zvrrec-shadow-dom .canvas {
	position: fixed;
	top: 0px!important;
	left: 0px!important;
	z-index: 99999999999!important;
	background: transparent!important;
}
.zvrrec-shadow-dom .canvas-container {
	top: 0px!important;
	left: 0px!important;
	z-index: 99999999999;
	position: fixed!important;
	background: transparent!important;
}

.ZovoRecorderDropdownMenuContent {
	z-index: 99999999999!important;
  min-width: 200px;
  background-color: white;
  margin-top: 4px;
  margin-right: 8px;
  padding-top: 12px;
  padding-bottom: 12px;
  border-radius: 15px;
  font-family: 'Satoshi-Medium', sans-serif;
  color: #29292F;
  box-shadow: 0px 10px 38px -10px rgba(22, 23, 24, 0.35),
    0px 10px 20px -15px rgba(22, 23, 24, 0.2);
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.ZovoRecorderDropdownMenuContent[data-side="top"] {
  animation-name: zvrrec-slideDownAndFade;
}
.ZovoRecorderDropdownMenuContent[data-side="right"] {
  animation-name: zvrrec-slideLeftAndFade;
}
.ZovoRecorderDropdownMenuContent[data-side="bottom"] {
  animation-name: zvrrec-slideUpAndFade;
}
.ZovoRecorderDropdownMenuContent[data-side="left"] {
  animation-name: zvrrec-slideRightAndFade;
}
.ZovoRecorderItemIndicator {
  position: absolute;
  right: 12px;
  width: 18px;
  height: 18px;
  background: #635BFF;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.ZovoRecorderDropdownMenuItem,
.ZovoRecorderDropdownMenuRadioItem {
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 5px;
  position: relative;
  padding-left: 22px;
  padding-right: 22px;
  user-select: none;
  outline: none;
}
.ZovoRecorderDropdownMenuItem:hover {
    background-color: #F6F7FB !important;
    cursor: pointer;
}
.ZovoRecorderDropdownMenuItem[data-disabled] {
  color: #6E7684 !important;
  cursor: not-allowed;
  background-color: #F6F7FB !important;
}

`}</style>
    </div>
  );
};

export default Content;
