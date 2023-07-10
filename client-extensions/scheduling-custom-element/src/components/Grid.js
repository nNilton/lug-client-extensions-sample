import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FaTrash, FaEdit } from "react-icons/fa";
import { baseURL } from "../Start";

const Table = styled.table`
    width: 100%;
    background-color: #fff;
    padding: 20px;
    box-shadow: 0px 0px 5px #ccc;
    border-radius: 5px;
    max-width: 800px;
    margin: 20px auto;
    word-break: break-all;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr``;

export const Th = styled.th`
    text-align: start;
    border-bottom: inset;
    padding-bottom: 5px;

    @media (max-width: 500px){
        ${(props) => props.onlyWeb && "display: none"}
    }
`;

export const Td = styled.td`
  padding-top: 15px;
  text-align: ${(props) => (props.alignCenter ? "center" : "start")};
  width: ${(props) => (props.width ? props.width : "auto")};

  @media (max-width: 500px) {
    ${(props) => props.onlyWeb && "display: none"}
  }
`;

const Grid = ({exams, setExams, setOnEdit}) =>{

    const handleEdit = (item) => {
        setOnEdit(item);
    }

    const handleDelete = async (id) => {
        axios
        .delete(baseURL + id, 
            {headers: { Authorization: 'Basic ' + btoa("test@liferay.com:test") }}
            )
        .then(({data}) => {
            const newArray = exams.filter((exam) => exam.id !== id);

            setExams(newArray);
        })
        .catch(({data}) => toast.error(data));

        setOnEdit(null);
    }

    console.log(exams);

    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>
                        Exame
                    </Th>
                    <Th>Numero da Carteirinha</Th>
                    <Th></Th>
                    <Th></Th>
                </Tr>
            </Thead>
            <Tbody>
                {exams.map(exam => (
                    <Tr key={exam.id}>
                        <Td width="30%">{exam.exame.name}</Td>
                        <Td width="30%">{exam.numeroDaCarteirinha}</Td>
                        <Td alignCenter width="5%">
                            <FaEdit onClick={() => handleEdit(exam)} />
                        </Td>
                        <Td alignCenter width="5%">
                            <FaTrash onClick={() => handleDelete(exam.id)} />
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
}

export default Grid;