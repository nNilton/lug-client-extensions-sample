import GlobalStyle from "./styles/global";
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styled from "styled-components";
import Form from "./components/Form";

const Container = styled.div`
  width:100%;
  max-width:800px;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

`;

const Title = styled.h2``;


function Start() {
  return (
    <div className="App">
      <Container>
        <Title>
          Usuários
        </Title>
        <Form/>
      </Container>
      <ToastContainer autoClose={3000} position={toast.POSITION.TOP_CENTER} />
      {/* <GlobalStyle /> */}
    </div>
  );
}

export default Start;