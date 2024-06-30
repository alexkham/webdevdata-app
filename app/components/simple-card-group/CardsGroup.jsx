// // // // import React from 'react';
// // // // import './CardsGroup.css';

// // // // function Card({ title, content, link, image, color }) {
// // // //   return (
// // // //     <div className="card" style={{ backgroundColor: color }}>
// // // //       {image && <img src={image} alt={title} className="card-image" />}
// // // //       <h2>{title}</h2>
// // // //       <p>{content}</p>
// // // //       {link && (
// // // //         <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">
// // // //           Learn More
// // // //         </a>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // function CardsGroup({ cards }) {
// // // //   return (
// // // //     <div className="cards-group">
// // // //       {cards.map((card, index) => (
// // // //         <Card key={index} {...card} />
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // }

// // // // export default CardsGroup;
// // // import React from 'react';
// // // import './CardsGroup.css';

// // // function Card({ title, content, link, image, color }) {
// // //   return (
// // //     <div className="card-wrapper">
// // //       <div className="card" style={{ backgroundColor: color }}>
// // //         {image && <img src={image} alt={title} className="card-image" />}
// // //         <h2>{title}</h2>
// // //         <p>{content}</p>
// // //         <div className="link-wrapper">
// // //           {link && (
// // //             <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">
// // //               Learn More
// // //             </a>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // function CardsGroup({ cards }) {
// // //   return (
// // //     <div className="row">
// // //       {cards.map((card, index) => (
// // //         <Card key={index} {...card} />
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // // export default CardsGroup;
// // import React from 'react';
// // import './CardsGroup.css';

// // function Card({ title, content, color, link }) {
// //   return (
// //     <div className="row">
// //       <div className="card" style={{ backgroundColor: color }}>
// //         <h2 style={{ fontWeight: 'bold' }}>{title}</h2>
// //         <p>{content}</p>
// //         {link && (
// //           <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">
// //             Learn More
// //           </a>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// // function CardsGroup({ cards }) {
// //   return (
// //     <div className="cards-group">
// //       {cards.map((card, index) => (
// //         <Card key={index} {...card} />
// //       ))}
// //     </div>
// //   );
// // }

// // export default CardsGroup;
// import React from 'react';
// import './CardsGroup.css';

// function Card({ title, content, color, link }) {
//   return (
//     <div className="card" style={{ backgroundColor: color }}>
//       <h2>{title}</h2>
//       <p>{content}</p>
//       {link && (
//         <a href={link} className="card-link"  rel="noopener noreferrer">
//           Learn More
//         </a>
//       )}
//     </div>
//   );
// }

// function CardsGroup({ cards }) {
//   return (
//     <div className="row">
//       {cards.map((card, index) => (
//         <Card key={index} {...card} />
//       ))}
//     </div>
//   );
// }

// export default CardsGroup;
import React from 'react';
import './CardsGroup.css';

function Card({ title, content, color, link }) {
  return (
    <div className="card" style={{ backgroundColor: color }}>
      <h2>{title}</h2>
      <p>{content}</p>
      {link && (
        <a href={link} className="card-link" target="_blank" rel="noopener noreferrer">
          Learn More
        </a>
      )}
    </div>
  );
}

function CardsGroup({ cards }) {
  if (!cards || !Array.isArray(cards) || cards.length === 0) {
    return null;
  }

  return (
    <div className="row">
      {cards.map((card, index) => (
        <Card key={index} {...card} />
      ))}
    </div>
  );
}

export default CardsGroup;