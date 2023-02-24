import React, { useEffect } from "react";

function HateSpeech() {
  useEffect(() => {
    document.title = `Hate Speech Detection`;
    // eslint-disable-next-line
  }, []);
  return (
    <h1>HateSpeech Home Page</h1>
  )
}

export default HateSpeech