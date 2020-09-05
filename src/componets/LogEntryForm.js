import React, { useState } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";

import "../index.css";

const LogEntryForm = ({ location, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      data.latitude = location.latitude;
      data.longitude = location.longitude;
      await Axios.post("https://travel-logo-app.herokuapp.com/api/logs", data, {
        headers: {
          "content-type": "application/json",
        },
      });
      onClose();
    } catch (error) {
      console.error(error);
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="entry-form">
      {error ? <h3 className="error">{error}</h3> : null}
      <label htmlFor="title">Title</label>
      <input type="text" name="title" required ref={register} />
      <label htmlFor="comments">Comments</label>
      <textarea name="comments" rows={3} ref={register}></textarea>
      <label htmlFor="description">Description</label>
      <textarea name="description" rows={3} ref={register}></textarea>
      <label htmlFor="image">Image</label>
      <input type="text" name="image" ref={register} />
      <label htmlFor="visitDate">Visit Date</label>
      <input type="date" name="visitDate" required ref={register} />
      <button disabled={loading}>
        {loading ? "Loading..." : "Create Entry"}
      </button>
    </form>
  );
};

export default LogEntryForm;
