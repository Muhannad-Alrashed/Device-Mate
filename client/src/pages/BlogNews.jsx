import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";

const BlogNews = () => {
  const navigate = useNavigate();

  //----------------------- Fetch newsArticles -------------------------

  const [newsArticles, setNewsArticles] = useState([]);
  const [loading1, setLoading1] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get("/server/global/get-articles");
        setNewsArticles(response.data);
      } catch (error) {
        console.error(
          "Error fetching articles.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading1(false);
    };
    fetchSessionDetails();
  }, []);

  //----------------------- Fetch blogPosts -------------------------

  const [blogPosts, setBlogPosts] = useState([]);
  const [loading2, setLoading2] = useState(true);

  useEffect(() => {
    const fetchSessionDetails = async () => {
      try {
        const response = await axios.get("/server/global/get-posts");
        setBlogPosts(response.data);
      } catch (error) {
        console.error(
          "Error fetching articles.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading2(false);
    };
    fetchSessionDetails();
  }, []);

  //----------------------------------------------------------------------

  return (
    <main>
      <div className="container blog py-8">
        <div className="">
          {/* News Section */}
          <section className="mb-16">
            <h2 className="text-3xl text-gray text-center font-semibold my-8">
              News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading1 ? (
                <Loading label="loading news" />
              ) : (
                newsArticles.map((article) => (
                  <div
                    key={article.item_id}
                    className="flex flex-col bg-white shadow rounded-lg overflow-hidden"
                  >
                    <img
                      src={`${article.image_url}`}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="flex-1 flex flex-col items-start justify-between p-6">
                      <h3 className="text-2xl text-dark-gray font-semibold mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray mb-4 text-sm">
                        {article.description}
                      </p>
                      <button
                        onClick={() =>
                          navigate(`./blog-news-item/${article.item_id}`)
                        }
                        className="link-button hover:underline"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
          {/* Blog Section */}
          <section className="mb-16">
            <h2 className="text-3xl text-gray text-center font-semibold my-8">
              Blogs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading2 ? (
                <Loading label="loading blogs" />
              ) : (
                blogPosts.map((post) => (
                  <div
                    key={post.item_id}
                    className="flex flex-col bg-white shadow rounded-lg overflow-hidden"
                  >
                    <img
                      src={`${post.image_url}`}
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="flex-1 flex flex-col items-start justify-between p-6">
                      <h3 className="text-2xl text-dark-gray font-semibold mb-2">
                        {post.title}
                      </h3>
                      <p className="text-gray mb-4 text-sm">
                        {post.description}
                      </p>
                      <button
                        onClick={() =>
                          navigate(`./blog-news-item/${post.item_id}`)
                        }
                        className="link-button hover:underline"
                      >
                        Read More
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default BlogNews;
