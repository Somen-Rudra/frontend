import { useEffect, useState } from "react";
import { API } from "../config/axios";

export const useDashboard = () => {
  const [stats, setStats]               = useState(null);
  const [recentSubs, setRecentSubs]     = useState([]);
  const [recommended, setRecommended]   = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, subsRes, recRes] = await Promise.all([
          API.get("/user/stats"),
          API.get("/user/submissions/recent"),
          API.get("/problemSet/recommended"),
        ]);
        setStats(statsRes.data.stats);
        setRecentSubs(subsRes.data.submissions);
        setRecommended(recRes.data.problems);
      } catch (err) {
        console.error("Dashboard fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { stats, recentSubs, recommended, loading };
};
