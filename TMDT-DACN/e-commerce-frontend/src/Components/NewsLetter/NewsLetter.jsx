import React from 'react';
import './NewsLetter.css'; // Import the CSS file here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function NewsLetter() {
  return (
    <div className="newsletter-container">
      <h2>Subscribe to our newsletter</h2>
      <p>Get daily news on upcoming offers from many suppliers all over the world</p>
      <form action="/subscribe" method="post">
        <div className="input-group">
          <span className="input-group-icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <input type="email" name="email" placeholder="Email" required />
        </div>
        <button type="submit">Subscribe</button>
      </form>
    </div>
  );
}

export default NewsLetter;

// import React from 'react';
// import './NewsLetter.css';

// function NewsLetter() {
//   return (
//     <div className="newsletter">
//       <div className="newsletter-content">
//         <h2>Subscribe to our newsletter</h2>
//         <p>Get daily news on upcoming offers from many suppliers all over the world</p>
//         <form className="newsletter-form" action="#" method="POST">
//           <div className="form-group">
//             <span className="input-icon">
//               <img src="path-to-your-email-icon.png" alt="Email Icon" />
//             </span>
//             <input type="email" placeholder="Email" required />
//           </div>
//           <button type="submit">Subscribe</button>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default NewsLetter;
