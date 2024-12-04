import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { FaChevronLeft } from "react-icons/fa";
import axios from "axios";
import { UtilContext } from "../context/utilContext";
import Loading from "../components/Loading";

const BlogNewsItem = () => {
  const { id: itemId } = useParams();
  const { getDateTime } = useContext(UtilContext);

  //----------------------- Fetch post/article info -------------------------

  const [itemInfo, setItemInfos] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get(
          `/server/global/get-post-article/${itemId}`
        );
        setItemInfos(response.data);
      } catch (error) {
        console.error(
          "Error fetching item Info.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading(false);
    };
    fetchSessionDetails();
  }, [itemId]);

  //------------------------------------------------------------------------

  return (
    <main>
      <div className="container flex flex-col justify-between pt-12 pb-16 min-h-[86vh]">
        <Link to="/blog-news">
          <FaChevronLeft
            className="absolute -top-6 left-0 dropdown-icon text-light-cta
                      text-lg cursor-pointer hover:-left-0.5 transition-all duration-100"
          />
        </Link>
        {loading ? (
          <Loading />
        ) : !itemInfo ? (
          <p className="text-gray text-lg text-center font-bold">
            Item info not found.
          </p>
        ) : (
          // Item Info
          <div className="flex flex-col">
            <h1 className="text-dark-cta text-xl text-center font-bold m-4">
              {itemInfo.title}
            </h1>
            <div className="flex-1 flex flex-col gap-8 shadow-lg rounded p-8">
              <div>
                <div className="text-end text-gray mb-2">
                  {getDateTime(itemInfo.published_at)}
                </div>
                <img
                  src={`${itemInfo.image_url}`}
                  alt={itemInfo.title}
                  className="w-full rounded-lg"
                />
              </div>
              <div className="flex flex-col gap-4">
                <div className="text-gray font-bold max-w-[600px] leading-6">
                  {itemInfo.description}
                </div>
                <hr />
                <div className="text-gray max-w-[600px] leading-8">
                  {itemInfo.content}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogNewsItem;
