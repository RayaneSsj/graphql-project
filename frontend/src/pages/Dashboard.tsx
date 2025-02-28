import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Dashboard.css";

// Définition des types
interface Article {
  id: string;
  title: string;
  content: string;
  likeCount: number;
}

interface Comment {
  id: string;
  content: string;
  userId: string;
}

interface DecodedToken {
  userId: string;
  exp: number;
}

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

const GET_COMMENTS = gql`
  query GetComments($articleId: String!) {
    comments(articleId: $articleId) {
      id
      content
      userId
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($articleId: String!, $content: String!, $userId: String!) {
    addComment(articleId: $articleId, content: $content, userId: $userId) {
      id
      content
      articleId
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: ID!) {
    deleteComment(id: $commentId) {
      id
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [limit] = useState<number>(100);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [likedArticles, setLikedArticles] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        setUserId(decoded.userId);
        console.log("Token décodé :", decoded);
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const { loading, error, data } = useQuery<{ filterArticlesByPopularity: Article[] }>(GET_POPULAR_ARTICLES, {
    variables: { limit },
  });

  const { data: commentsData, refetch: refetchComments } = useQuery<{ comments: Comment[] }>(GET_COMMENTS, {
    variables: { articleId: selectedArticleId },
    skip: !selectedArticleId,
  });

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData.comments);
    }
  }, [commentsData]);

  const [addComment] = useMutation(ADD_COMMENT, {
    onCompleted: () => {
      refetchComments();
      setNewComment("");
    },
  });

  const [deleteComment] = useMutation(DELETE_COMMENT, {
    onCompleted: () => refetchComments(),
  });

  const [likeArticle] = useMutation(LIKE_ARTICLE, {
    onCompleted: () => console.log("Article liked!"),
  });

  const [unlikeArticle] = useMutation(UNLIKE_ARTICLE, {
    onCompleted: () => console.log("Article unliked!"),
  });

  const handleShowComments = (articleId: string) => {
    setSelectedArticleId(articleId === selectedArticleId ? null : articleId);
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedArticleId || !userId) return;

    addComment({
      variables: { articleId: selectedArticleId, content: newComment, userId },
    });
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment({
      variables: { commentId }
    })
    .then(() => {
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    })
    .catch((error) => {
      console.error("Erreur lors de la suppression du commentaire : ", error);
    });
  };

  const handleLike = async (articleId: string) => {
    if (!userId) return;

    const isLiked = likedArticles[articleId];
    try {
      if (isLiked) {
        await unlikeArticle({ variables: { articleId, userId } });
        setLikedArticles((prev) => ({ ...prev, [articleId]: false }));
      } else {
        await likeArticle({ variables: { articleId, userId } });
        setLikedArticles((prev) => ({ ...prev, [articleId]: true }));
      }
    } catch (error) {
      console.error("Error handling like/unlike:", error);
    }
  };

  const handleCreateArticle = () => {
    navigate("/create-article");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div className="loading">Loading popular articles...</div>;
  if (error) return <div className="error">Error loading articles: {error.message}</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Popular Articles</h1>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
      <button onClick={handleCreateArticle} className="create-article-btn">Create Article</button>

      <div className="articles-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Likes</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {data?.filterArticlesByPopularity.map((article) => (
              <React.Fragment key={article.id}>
                <tr>
                  <td>{article.id}</td>
                  <td>{article.title}</td>
                  <td>{article.content}</td>
                  <td>
                    <button onClick={() => handleLike(article.id)}>
                      {likedArticles[article.id] ? "Unlike" : "Like"} ({article.likeCount})
                    </button>
                  </td>
                  <td>
                    <button className="show-comments-btn" onClick={() => handleShowComments(article.id)}>
                      {selectedArticleId === article.id ? "Hide Comments" : "Show Comments"}
                    </button>
                  </td>
                </tr>
                {selectedArticleId === article.id && (
                  <tr>
                    <td colSpan={5}>
                      <div className="comments-section">
                        <h3>Comments</h3>
                        {comments.length === 0 ? (
                          <div className="no-comments">No comments yet.</div>
                        ) : (
                          <ul className="comments-list">
                            {comments.map((comment) => (
                              <li key={comment.id} className="comment-item">
                                {comment.content} (User: {comment.userId})
                                {comment.userId === userId && (
                                  <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                        <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment..." />
                        <button onClick={handleAddComment}>Submit</button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
