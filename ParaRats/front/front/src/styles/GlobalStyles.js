import { createGlobalStyle } from "styled-components";

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background: #f4f4f4;
    color: #333;
    font-family: "Poppins", sans-serif;
  }

  input, button {
    font-family: inherit;
  }

  h2 {
    color: #007bff;
  }
`;
