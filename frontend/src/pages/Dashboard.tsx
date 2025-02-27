import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

// GraphQL query pour récupérer les articles
const GET_ARTICLES = gql`
  query {
    articles {
      id
      title
      content
    }
  }
`;

// GraphQL query pour récupérer les commentaires pour chaque article
const GET_COMMENTS = gql`
  query GetComments($articleId: String!) {
    comments(articleId: $articleId) {
      id
      content
      userId
    }
  }
`;

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const [articles, setArticles] = useState([]);
  const [comments, setComments] = useState({}); // Pour stocker les commentaires des articles

  // Récupérer les commentaires pour chaque article une fois les articles chargés
  useEffect(() => {
    if (data) {
      setArticles(data.articles);
      data.articles.forEach((article) => {
        // Récupérer les commentaires pour chaque article
        fetchComments(article.id);
      });
    }
  }, [data]);

  const fetchComments = (articleId) => {
    const { loading, error, data } = useQuery(GET_COMMENTS, {
      variables: { articleId },
      skip: !articleId, // Empêche la requête si articleId est vide
    });

    useEffect(() => {
      if (data) {
        setComments((prevState) => ({
          ...prevState,
          [articleId]: data.comments,
        }));
      }
    }, [data]);
  };

  if (loading) return <div>Loading articles...</div>;
  if (error) return <div>Error loading articles: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard - Articles</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
            <th>Comments</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.content}</td>
              <td>
                {comments[article.id] && (
                  <ul>
                    {comments[article.id].map((comment) => (
                      <li key={comment.id}>
                        {comment.content} (User ID: {comment.userId})
                      </li>
                    ))}
                  </ul>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
