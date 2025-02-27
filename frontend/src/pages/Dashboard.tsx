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

const Dashboard = () => {
  const { loading, error, data } = useQuery(GET_ARTICLES);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    if (data) {
      setArticles(data.articles);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Dashboard - Articles</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Content</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
