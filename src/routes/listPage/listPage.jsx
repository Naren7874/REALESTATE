import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import { Await, useLoaderData } from "react-router-dom";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton"; // Import Skeleton component
import 'react-loading-skeleton/dist/skeleton.css';  // Import Skeleton CSS

function ListPage() {
  const data = useLoaderData();

  // Helper function to render skeletons for cards
  const renderCardSkeletons = () => {
    return Array(6) // Show 6 skeleton cards
      .fill(0)
      .map((_, index) => (
        <div key={index} className="card">
          <Skeleton height={200} borderRadius={10} className="imageContainer" />
          <div className="textContainer">
            <Skeleton width={150} height={24} />
            <Skeleton width={120} />
            <Skeleton width={80} height={24} />
            <div className="bottom">
              <div className="features">
                <Skeleton width={80} />
                <Skeleton width={80} />
              </div>
              <div className="icons">
                <Skeleton circle={true} width={24} height={24} />
                <Skeleton circle={true} width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
      ));
  };

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />

          <Suspense fallback={<div className="cardSkeletons">{renderCardSkeletons()}</div>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} item={post} />
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>

      <div className="mapContainer">
        <Suspense fallback={<Skeleton height={400} borderRadius={10} />}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading map!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
