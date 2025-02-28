import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";

// GraphQL mutations
const CREATE_ARTICLE = gql`
  mutation CreateArticle($title: String!, $content: String!, $authorId: String!) {
    createArticle(title: $title, content: $content, authorId: $authorId) {
      id
      title
      content
    }
  }
`;

const UPDATE_ARTICLE = gql`
  mutation UpdateArticle($id: String!, $title: String, $content: String) {
    updateArticle(id: $id, title: $title, content: $content) {
      id
      title
      content
    }
  }
`;

const DELETE_ARTICLE = gql`
  mutation DeleteArticle($id: String!) {
    deleteArticle(id: $id)
  }
`;

const CreateArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [createArticle] = useMutation(CREATE_ARTICLE);
  const [updateArticle] = useMutation(UPDATE_ARTICLE);
  const [deleteArticle] = useMutation(DELETE_ARTICLE);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId); // Assurez-vous que 'userId' est dans votre token
      } catch (error) {
        console.error("Erreur de décodage du token :", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!userId) {
      console.error("User not authenticated");
      return;
    }

    if (id) {
      // Mise à jour d'un article existant
      await updateArticle({ variables: { id, title, content } });
    } else {
      // Création d'un nouvel article
      await createArticle({ variables: { title, content, authorId: userId } }); // Utilisation de userId
    }
    navigate("/dashboard");

  };

  const handleDelete = async () => {
    if (id) {
      await deleteArticle({ variables: { id } });
      navigate("/dashboard");
    }
  };

  return (
    <div className="create-article">
      <h1>{id ? "Edit" : "Create"} Article</h1>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      ></textarea>
      <button onClick={handleSubmit}>Submit</button>
      {id && <button onClick={handleDelete}>Delete</button>}
    </div>
  );
};


export default CreateArticle;