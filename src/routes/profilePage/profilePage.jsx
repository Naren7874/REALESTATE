import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';  // Import skeleton CSS

function ProfilePage() {
  const data = useLoaderData();
  const { updateUser, currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  // Loading Skeleton component for profile info
  const ProfileInfoSkeleton = () => (
    <div className="info">
      <span>
        Avatar: <Skeleton circle={true} height={50} width={50} />
      </span>
      <span>
        Username: <Skeleton width={120} />
      </span>
      <span>
        E-mail: <Skeleton width={180} />
      </span>
    </div>
  );

  // Loading Skeleton for lists and chat
  const ListSkeleton = () => (
    <div>
      <Skeleton count={5} height={30} style={{ marginBottom: "10px" }} />
    </div>
  );

  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>User Information</h1>
            <Link to="/profile/update">
              <button>Update Profile</button>
            </Link>
          </div>

          {/* Render loading skeleton if currentUser is undefined */}
          {currentUser ? (
            <div className="info">
              <span>
                Avatar:
                <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
              </span>
              <span>
                Username: <b>{currentUser.username}</b>
              </span>
              <span>
                E-mail: <b>{currentUser.email}</b>
              </span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <ProfileInfoSkeleton />
          )}

          <div className="title">
            <h1>My List</h1>
            <Link to="/add">
              <button>Create New Post</button>
            </Link>
          </div>

          {/* Suspense for My List with skeleton fallback */}
          <Suspense fallback={<ListSkeleton />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>

          <div className="title">
            <h1>Saved List</h1>
          </div>

          {/* Suspense for Saved List with skeleton fallback */}
          <Suspense fallback={<ListSkeleton />}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="chatContainer">
        <div className="wrapper">
          {/* Suspense for Chat with skeleton fallback */}
          <Suspense fallback={<ListSkeleton />}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Error loading chats!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data} />}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
