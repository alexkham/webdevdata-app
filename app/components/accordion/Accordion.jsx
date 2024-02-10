import React from 'react'
import './Accordion.css'

function Accordion() {
  return (
    <>
   <div className="accordion">
  <div>
    <input type="radio" name="example_accordion" id="section1" className="accordion__input" />
    <label htmlFor="section1" className="accordion__label">Section #1</label>
    <div className="accordion__content">
      <p>Section #1</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam sit reiciendis, ipsam quaerat,
        aperiam perspiciatis ad ullam architecto impedit natus illo nostrum molestias voluptas earum a
        voluptatibus fugiat fuga facere!
      </p>
    </div>
  </div>
  <div>
    <input type="radio" name="example_accordion" id="section2" className="accordion__input" />
    <label htmlFor="section2" className="accordion__label">Section #2</label>
    <div className="accordion__content">
      <p>Section #2</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam sit reiciendis, ipsam quaerat,
        aperiam perspiciatis ad ullam architecto impedit natus illo nostrum molestias voluptas earum a
        voluptatibus fugiat fuga facere!
      </p>
    </div>
  </div>
  <div>
    <input type="radio" name="example_accordion" id="section3" className="accordion__input" />
    <label htmlFor="section3" className="accordion__label">Section #3</label>
    <div className="accordion__content">
      <p>Section #3</p>
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam sit reiciendis, ipsam quaerat,
        aperiam perspiciatis ad ullam architecto impedit natus illo nostrum molestias voluptas earum a
        voluptatibus fugiat fuga facere!
      </p>
    </div>
  </div>
</div>

    </>
  )
}

export default Accordion