import React from 'react'
import { FaExchangeAlt } from "react-icons/fa";
const Menu = ({togglePageFunction}) => {
  return (
    <div onClick={togglePageFunction} className='fixed z-50 bg-blue-900 p-2 rounded-2xl text-cyan-300 text-2xl left-2 top-2'>
      <FaExchangeAlt  />
    </div>
  )
}

export default Menu
