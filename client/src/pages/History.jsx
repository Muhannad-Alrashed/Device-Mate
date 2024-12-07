import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios2 from "../axios2";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import { UtilContext } from "../context/utilContext";
import Loading from "../components/Loading";

const HistoryPage = () => {
  const { currentUser } = useContext(AuthContext);
  const { getDateTime } = useContext(UtilContext);

  // ------------------------ Fetch all sessions ----------------------

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      const userId = currentUser.user_id;
      try {
        const response = await axios2.get(
          `/history/get-sessions/${userId}/all`
        );
        setSessions(response.data);
      } catch (error) {
        console.error(
          "Error fetching completed sessions.",
          error.response ? error.response.data : error.message
        );
      }
      setLoading(false);
    };
    fetchSessions();
  }, [currentUser]);

  // -------------------------------------------------------------------

  return (
    <main>
      <div className="container flex flex-col py-12">
        <Link to="/dashboard">
          <FaChevronLeft
            className="absolute -top-8 left-0 dropdown-icon text-light-cta
                text-lg cursor-pointer hover:-left-0.5 transition-all duration-100"
          />
        </Link>
        <h1 className="text-2xl text-dark-cta font-bold mb-4 ">
          Completed Sessions.
        </h1>
        {loading ? (
          <Loading label="loading sessions"></Loading>
        ) : sessions.length === 0 ? (
          <div className="text-lg text-gray text-center font-bold">
            No Completed Sessions.
          </div>
        ) : (
          <table className="min-w-full bg-white shadow-lg mt-4">
            <thead>
              <tr className="text-gray bg-light">
                <th className="px-6 py-4 text-left">Client Name</th>
                <th className="px-6 py-4 text-left">Session Date</th>
                <th className="px-6 py-4 text-left">Connection Code</th>
                <th className="px-6 py-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{session.client_name}</td>
                  <td className="px-6 py-4">
                    {getDateTime(session.start_time)}
                  </td>
                  <td className="px-6 py-4">
                    {session.session_connection_code}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to={`./session/${session.session_id}`}
                      className="flex items-center gap-2 link-button
                      translate-x-0 hover:translate-x-1 transition-all"
                    >
                      View
                      <FaChevronRight className="text-xs" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default HistoryPage;
