'use client'
import React,{useEffect} from 'react'
import './MyNavbar.css'
import Link from 'next/link';
import GoBackButton from '../buttons/GoBackButton';

function MyNavbar() {

  useEffect(()=>{
    const nav = document.querySelector('.nav');

window.addEventListener('scroll', fixNav);

function fixNav(){
  if(window.scrollY > nav.offsetHeight + 150){
    nav.classList.add('active');
  }else{
    nav.classList.remove('active');
  }
}

  },[]);

  const navigateBack = () => {
    window.history.back();
  };
  return (
    <>
    <nav className="nav">
  <div className="container">
    {/* <h1 class="logo"><a href="#">My website</a></h1> */}
    <ul>
      <li><Link href="/">Home</Link></li>
      {/* <li><Link href="/tables">Tables</Link></li> */}
      <li onClick={navigateBack} style={{cursor:'pointer'}}><a>GoBack</a></li>
     
      

    </ul>
  </div>
</nav>

{/* <div class="hero">
  <div class="container">
    <h1>Welcome to our website</h1>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magni, repudiandae.</p>
  </div>
</div>

<section class="container content">
  <h2>content 1</h2>
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque, animi sunt! Libero optio, asperiores quis ipsa eum eveniet labore nihil expedita nostrum laborum dicta at deleniti sapiente atque assumenda quo corrupti exercitationem animi minus nemo vero soluta alias perspiciatis! Aspernatur, laborum consectetur repellat repellendus aliquam sed. Cupiditate accusantium porro at quae, maxime itaque accusamus! Ipsam tempore, illo similique officia neque asperiores eveniet omnis rem veritatis cumque quos amet placeat dignissimos quisquam nesciunt quas. Adipisci perspiciatis veniam, voluptatibus dolores doloremque quisquam qui possimus, vero ab dolorum temporibus soluta libero similique assumenda debitis dolorem ut perferendis incidunt nobis facere eaque. Enim, nemo?</p>
  <h3>content 2</h3>
  <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Atque, animi sunt! Libero optio, asperiores quis ipsa eum eveniet labore nihil expedita nostrum laborum dicta at deleniti sapiente atque assumenda quo corrupti exercitationem animi minus nemo vero soluta alias perspiciatis! Aspernatur, laborum consectetur repellat repellendus aliquam sed. Cupiditate accusantium porro at quae, maxime itaque accusamus! Ipsam tempore, illo similique officia neque asperiores eveniet omnis rem veritatis cumque quos amet placeat dignissimos quisquam nesciunt quas. Adipisci perspiciatis veniam, voluptatibus dolores doloremque quisquam qui possimus, vero ab dolorum temporibus soluta libero similique assumenda debitis dolorem ut perferendis incidunt nobis facere eaque. Enim, nemo?</p>
</section> */}
    </>
  )
}

export default MyNavbar