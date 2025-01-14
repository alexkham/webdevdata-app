// // // pages/disclaimer.js
// // const Disclaimer = () => {
// //     return (
// //       <div>
// //         <h1>Legal Disclaimer</h1>
// //         <p></p>
// //         {/* Add more content as needed */}
// //       </div>
// //     );
// //   };
  
// //   export default Disclaimer;

// // pages/disclaimer.js
// import './pages.css'
// const Disclaimer = () => {
//   return (
//     <div className="disclaimer">
//       <h1>LEGAL DISCLAIMER</h1>
//       <p>Last updated June 15, 2024</p>

//       <h2>WEBSITE DISCLAIMER</h2>
//       <p>
//         The information provided by Webdevdata ("we", "us", or "our") on https://www.webdevdata.net (the "Site") and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application. 
//         <br></br>
//         UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
//       </p>

//       <h2>EXTERNAL LINKS DISCLAIMER</h2>
//       <p>
//         The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. 
//         <br></br>
//         WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
//       </p>

//       <h2>PROFESSIONAL DISCLAIMER</h2>
//       <p>
//         The Site cannot and does not contain computer programming advice. The computer programming information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of computer programming advice. 
//         <br></br>
//         THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE OR OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
//       </p>

//       <h2>AFFILIATES DISCLAIMER</h2>
//       <p>
//         The Site and our mobile application may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates include the following:
//       </p>
//       <ul>
//         <li>AvantLink</li>
//         <li>Awin (Affiliate Window)</li>
//         <li>CJ Affiliate by Conversant</li>
//         <li>Clickbank</li>
//         <li>eBay Partner Network</li>
//         <li>FlexOffers</li>
//         <li>iDevAffiliate</li>
//         <li>MaxBounty</li>
//         <li>Rakuten Affiliate Network</li>
//         <li>RevenueWire</li>
//         <li>ShareASale</li>
//       </ul>
//       <p>
//         We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to Amazon.com and affiliated websites.
//       </p>
//     </div>
//   );
// };

// export default Disclaimer;
import MyNavbar from '@/app/components/nav-bar/MyNavbar';
import './pages.css';

const Disclaimer = () => {
  return (
    <>
    <MyNavbar></MyNavbar>
    <div  style={{ padding: '100px' }}>
      <div className='title'>
      <h1>LEGAL DISCLAIMER</h1>
      <p>Last updated June 15, 2024</p>
      </div>

      <h2>WEBSITE DISCLAIMER</h2>
      <p>
        The information provided by Webdevdata (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) on https://www.webdevdata.net (the &quot;Site&quot;) and our mobile application is for general informational purposes only. All information on the Site and our mobile application is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site or our mobile application. 
        <br />
        UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE SITE OR OUR MOBILE APPLICATION OR RELIANCE ON ANY INFORMATION PROVIDED ON THE SITE AND OUR MOBILE APPLICATION. YOUR USE OF THE SITE AND OUR MOBILE APPLICATION AND YOUR RELIANCE ON ANY INFORMATION ON THE SITE AND OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
      </p>

      <h2>EXTERNAL LINKS DISCLAIMER</h2>
      <p>
        The Site and our mobile application may contain (or you may be sent through the Site or our mobile application) links to other websites or content belonging to or originating from third parties or links to websites and features in banners or other advertising. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. 
        <br />
        WE DO NOT WARRANT, ENDORSE, GUARANTEE, OR ASSUME RESPONSIBILITY FOR THE ACCURACY OR RELIABILITY OF ANY INFORMATION OFFERED BY THIRD-PARTY WEBSITES LINKED THROUGH THE SITE OR ANY WEBSITE OR FEATURE LINKED IN ANY BANNER OR OTHER ADVERTISING. WE WILL NOT BE A PARTY TO OR IN ANY WAY BE RESPONSIBLE FOR MONITORING ANY TRANSACTION BETWEEN YOU AND THIRD-PARTY PROVIDERS OF PRODUCTS OR SERVICES.
      </p>

      <h2>PROFESSIONAL DISCLAIMER</h2>
      <p>
        The Site cannot and does not contain computer programming advice. The computer programming information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals. We do not provide any kind of computer programming advice. 
        <br />
        THE USE OR RELIANCE OF ANY INFORMATION CONTAINED ON THE SITE OR OUR MOBILE APPLICATION IS SOLELY AT YOUR OWN RISK.
      </p>

      <h2>AFFILIATES DISCLAIMER</h2>
      <p>
        The Site and our mobile application may contain links to affiliate websites, and we receive an affiliate commission for any purchases made by you on the affiliate website using such links. Our affiliates include the following:
      </p>
      <ul>
        <li>AvantLink</li>
        <li>Awin (Affiliate Window)</li>
        <li>CJ Affiliate by Conversant</li>
        <li>Clickbank</li>
        <li>eBay Partner Network</li>
        <li>FlexOffers</li>
        <li>iDevAffiliate</li>
        <li>MaxBounty</li>
        <li>Rakuten Affiliate Network</li>
        <li>RevenueWire</li>
        <li>ShareASale</li>
      </ul>
      <p>
        We are a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for us to earn advertising fees by linking to Amazon.com and affiliated websites.
      </p>
    </div>
    </>
  );
};

export default Disclaimer;
