import React, { useEffect } from "react";

function Homepage(props) {
  useEffect(() => {
    document.title = `FakeNews & HateSpeech Detection`;
  }, []);
  return (
    <h1>Homepage</h1>
  )
}

export default Homepage