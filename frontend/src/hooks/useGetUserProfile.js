import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import useShowToast from "./useShowToast";

const useGetUserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  const getUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/users/profile/${username}`);
      const data = await res.json();
      // const res = await axios.get(`/api/users/profile/${username}`);
      console.log("1", data);
      if (data.error) {
        console.log(data.error);
        showToast("Error", data.error, "error");
      } else {
        setUser(data);
      }
    } catch (error) {
      console.log(error);
      showToast("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [username, showToast]);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return { loading, user, refetch: getUser };
};

export default useGetUserProfile;
