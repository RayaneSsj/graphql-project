import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

// GraphQL queries et mutations
const GET_POPULAR_ARTICLES = gql`
  query GetPopularArticles($limit: Int!) {
    filterArticlesByPopularity(limit: $limit) {
      id
      title
      content
      likeCount
    }
  }
`;

const LIKE_ARTICLE = gql`
  mutation LikeArticle($articleId: String!, $userId: String!) {
    likeArticle(articleId: $articleId, userId: $userId)
  }
`;

const UNLIKE_ARTICLE = gql`
  mutation UnlikeArticle($articleId: String!, $userId: String!) {
    unlikeArticle(articleId: $articleId, userId: $userId)
  }
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [limit] = useState(10);
  const [likedArticles, setLikedArticles] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId);
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Récupération des articles
  const { loading, error, data, refetch } = useQuery(GET_POPULAR_ARTICLES, {
    variables: { limit },
  });

  const [likeArticle] = useMutation(LIKE_ARTICLE, {
    onCompleted: () => {
      console.log("Article liked!");
      refetch(); // Rafraîchit les articles après un like
    },
  });

  const [unlikeArticle] = useMutation(UNLIKE_ARTICLE, {
    onCompleted: () => {
      console.log("Article unliked!");
      refetch(); // Rafraîchit les articles après un unlike
    },
  });

  const handleLike = async (articleId: string) => {
    if (!userId) return;

    const isLiked = likedArticles[articleId];
    try {
      if (isLiked) {
        // Dislike the article
        await unlikeArticle({ variables: { articleId, userId } });
        setLikedArticles((prev) => ({ ...prev, [articleId]: false }));
      } else {
        // Like the article
        await likeArticle({ variables: { articleId, userId } });
        setLikedArticles((prev) => ({ ...prev, [articleId]: true }));
      }
    } catch (error) {
      console.error("Error handling like/unlike:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading popular articles...</div>;
  if (error) return <div className="error">Error loading articles: {error.message}</div>;

  return (
    <div className="dashboard">
              <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
      <h1 className="dashboard-title">Popular Articles</h1>

      <div className="articles-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {data.filterArticlesByPopularity.map((article: any) => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td>{article.title}</td>
                <td>{article.content}</td>
                <td>
                  <span className="like-count">{article.likeCount}</span> {/* Affichage du nombre de likes */}
                  <button
                    onClick={() => handleLike(article.id)}
                    className="like-btn"
                  >
                    {likedArticles[article.id] ? "Unlike" : "Like"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
