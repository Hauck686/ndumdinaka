import React from 'react'

export default function Productdetails () {
  return (
    <div className='product-page'>
      {/* Left: Scrollable Image */}
      <div className='product-image'>
        <img src='/home_img.png' alt='Column smock dress' />
      </div>

      {/* Right: Fixed Description */}
      <div className='product-description'>
        <h2>Column smock dress</h2>
        <p className='price'>1.890$</p>
        <p className='color'>Deep Black</p>
        <p className='details'>
          Long high-neck smock dress in black double wool. The dress features a
          scarf that drapes in the back and a low belt, cinching the generous
          volume.
        </p>

        <div className='sizes'>
          <span>34</span>
          <span>36</span>
          <span>38</span>
          <span className='disabled'>40</span>
          <span className='disabled'>42</span>
        </div>

        <button className='notify-btn'>Notify me when available</button>
      </div>
    </div>
  )
}
