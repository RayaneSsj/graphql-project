import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import './Dashboard.css'; // N'oublie pas d'ajouter le fichier CSS pour le style

// GraphQL queries et mutations
const GET_ARTICLES = gql`
  query {
    articles {
      id
      title
      content
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
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DeleteComment($commentId: String!) {
    deleteComment(id: $commentId) {
      id
    }
  }
`;

const ADD_LIKE = gql`
  mutation LikeArticle($articleId: String!, $userId: String!) {
    likeArticle(articleId: $articleId, userId: $userId) {
      id
    }
  }
`;

const REMOVE_LIKE = gql`
  mutation UnlikeArticle($articleId: String!, $userId: String!) {
    unlikeArticle(articleId: $articleId, userId: $userId) {
      id
    }
  }
`;

const GET_LIKES = gql`
  query GetLikes($articleId: String!) {
    likes(articleId: $articleId)
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const [articles, setArticles] = useState([]);
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [userId] = useState("user123"); // Remplace avec l'ID de l'utilisateur authentifié

  // Mutations
  const [addComment] = useMutation(ADD_COMMENT);
  const [deleteComment] = useMutation(DELETE_COMMENT);
  const [addLike] = useMutation(ADD_LIKE);
  const [removeLike] = useMutation(REMOVE_LIKE);
  const { data: likesData } = useQuery(GET_LIKES, {
    variables: { articleId: selectedArticleId },
    skip: !selectedArticleId,
  });

  const { data: commentsData, loading: commentsLoading, error: commentsError } = useQuery(GET_COMMENTS, {
    variables: { articleId: selectedArticleId },
    skip: !selectedArticleId,
  });

  useEffect(() => {
    if (data) {
      setArticles(data.articles);
    }
  }, [data]);

  useEffect(() => {
    if (commentsData) {
      setComments(commentsData.comments);
    }
  }, [commentsData]);

  useEffect(() => {
    if (likesData) {
      setLikes(likesData.likes);
    }
  }, [likesData]);

  const handleShowComments = (articleId) => {
    setSelectedArticleId(articleId);
  };

  const handleAddComment = (articleId, content) => {
    addComment({
      variables: { articleId, content, userId },
      refetchQueries: [{ query: GET_COMMENTS, variables: { articleId } }]
    });
  };

  const handleDeleteComment = (commentId) => {
    deleteComment({
      variables: { commentId },
      refetchQueries: [{ query: GET_COMMENTS, variables: { articleId: selectedArticleId } }]
    });
  };

  const handleAddLike = (articleId) => {
    addLike({
      variables: { articleId, userId },
      refetchQueries: [{ query: GET_LIKES, variables: { articleId } }]
    });
  };

  const handleRemoveLike = (articleId) => {
    removeLike({
      variables: { articleId, userId },
      refetchQueries: [{ query: GET_LIKES, variables: { articleId } }]
    });
  };

  if (loading) return <div className="loading">Loading articles...</div>;
  if (error) return <div className="error">Error loading articles: {error.message}</div>;

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard - Articles</h1>
      <div className="articles-container">
        <table className="articles-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Content</th>
              <th>Comments</th>
              <th>Likes</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article) => (
              <tr key={article.id}>
                <td>{article.id}</td>
                <td>{article.title}</td>
                <td>{article.content}</td>
                <td>
                  <button className="show-comments-btn" onClick={() => handleShowComments(article.id)}>
                    Show Comments
                  </button>
                  {selectedArticleId === article.id && (
                    <div className="comments-section">
                      {commentsLoading ? (
                        <div className="loading-comments">Loading comments...</div>
                      ) : commentsError ? (
                        <div className="error">Error loading comments: {commentsError.message}</div>
                      ) : comments.length === 0 ? (
                        <div className="no-comments">Il n'y a pas de commentaire.</div>
                      ) : (
                        <ul className="comments-list">
                          {comments.map((comment) => (
                            <li key={comment.id} className="comment-item">
                              {comment.content} (User ID: {comment.userId})
                              <button onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
                            </li>
                          ))}
                        </ul>
                      )}
                      <input 
                        type="text" 
                        placeholder="Ajouter un commentaire..." 
                        onKeyPress={(e) => {
                          if (e.key === "Enter" && e.target.value) {
                            handleAddComment(article.id, e.target.value);
                            e.target.value = ''; // Clear input after submitting
                          }
                        }}
                      />
                    </div>
                  )}
                </td>
                <td>
                  <button onClick={() => handleAddLike(article.id)}>
                    Like ({likes})
                  </button>
                  <button onClick={() => handleRemoveLike(article.id)}>
                    Unlike
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
