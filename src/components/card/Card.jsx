import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import 'react-loading-skeleton/dist/skeleton.css'; // Import Skeleton CSS
import "./card.scss";

function Card({ item }) {
  return (
    <div className="card">
      <Link to={item ? `/${item.id}` : "#"} className="imageContainer">
        {item ? (
          <img src={item.images[0]} alt="" />
        ) : (
          <Skeleton height={200} borderRadius={10} />
        )}
      </Link>

      <div className="textContainer">
        <h2 className="title">
          {item ? (
            <Link to={`/${item.id}`}>{item.title}</Link>
          ) : (
            <Skeleton width={150} height={24} />
          )}
        </h2>

        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item ? item.address : <Skeleton width={120} />}</span>
        </p>

        <p className="price">
          {item ? `$ ${item.price}` : <Skeleton width={80} height={24} />}
        </p>

        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item ? `${item.bedroom} bedroom` : <Skeleton width={80} />}</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item ? `${item.bathroom} bathroom` : <Skeleton width={80} />}</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              {item ? <img src="/save.png" alt="" /> : <Skeleton circle={true} width={24} height={24} />}
            </div>
            <div className="icon">
              {item ? <img src="/chat.png" alt="" /> : <Skeleton circle={true} width={24} height={24} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
