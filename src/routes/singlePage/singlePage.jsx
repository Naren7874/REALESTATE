import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import 'react-loading-skeleton/dist/skeleton.css';  // Import Skeleton CSS

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post?.isSaved || false);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleMessage = async (receiverId) => {
    if (!currentUser) {
      return navigate("/login");
    }

    setLoading(true);

    try {
      const response = await apiRequest.post("/chats", { receiverId });
      navigate(`/profile`);
    } catch (err) {
      console.error("Error while creating chat:", err);
      alert("Failed to initiate chat. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      return navigate("/login");
    }
    setSaved((prev) => !prev);
    setLoading(true); // Set loading state
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    } finally {
      setLoading(false); // Reset loading state after request completes
    }
  };

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          {/* Render Skeleton while data is loading */}
          {post ? (
            <Slider images={post.images} />
          ) : (
            <Skeleton height={400} />
          )}

          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post ? post.title : <Skeleton width={200} />}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post ? post.address : <Skeleton width={150} />}</span>
                </div>
                <div className="price">
                  {post ? `$ ${post.price}` : <Skeleton width={100} />}
                </div>
              </div>
              <div className="user">
                {post ? (
                  <img src={post.user.avatar} alt="" />
                ) : (
                  <Skeleton circle={true} height={50} width={50} />
                )}
                <span>{post ? post.user.username : <Skeleton width={100} />}</span>
              </div>
            </div>
            <div className="bottom">
              {post ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(post.postDetail.desc),
                  }}
                />
              ) : (
                <Skeleton count={3} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post ? (
                  post.postDetail.utilities === "owner" ? (
                    <p>Owner is responsible</p>
                  ) : (
                    <p>Tenant is responsible</p>
                  )
                ) : (
                  <Skeleton width={150} />
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post ? (
                  post.postDetail.pet === "allowed" ? (
                    <p>Pets Allowed</p>
                  ) : (
                    <p>Pets not Allowed</p>
                  )
                ) : (
                  <Skeleton width={150} />
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post ? post.postDetail.income : <Skeleton width={150} />}</p>
              </div>
            </div>
          </div>

          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post ? `${post.postDetail.size} sqft` : <Skeleton width={100} />}</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post ? `${post.bedroom} beds` : <Skeleton width={80} />}</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post ? `${post.bathroom} bathroom` : <Skeleton width={80} />}</span>
            </div>
          </div>

          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post ? (
                    post.postDetail.school > 999
                      ? `${post.postDetail.school / 1000} km`
                      : `${post.postDetail.school} m`
                  ) : (
                    <Skeleton width={100} />
                  )}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post ? `${post.postDetail.bus} m away` : <Skeleton width={100} />}</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post ? `${post.postDetail.restaurant} m away` : <Skeleton width={100} />}</p>
              </div>
            </div>
          </div>

          <p className="title">Location</p>
          <div className="mapContainer">
            {post ? <Map items={[post]} /> : <Skeleton height={200} />}
          </div>

          <div className="buttons">
            <button onClick={() => handleMessage(post?.userId)} disabled={!post}>
              <img src="/chat.png" alt="" />
              Send a Message
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !post}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {loading ? "Saving..." : saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
