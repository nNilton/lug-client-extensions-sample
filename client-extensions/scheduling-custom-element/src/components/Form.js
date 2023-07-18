import axios from "axios";
import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import { baseURL } from "../Start";

const FormContainer = styled.form`
	align-items: flex-end;
	background-color: #fff;
	border-radius: 5px;
	box-shadow: 0px 0px 5px #ccc;
	display: flex;
	flex-wrap: wrap;
	gap: 60px;
	max-width: 900px;
	padding: 20px;
	width: 100%;
	justify-content: space-between;
`;

const InputArea = styled.div`
	display: flex;
	flex-direction: column;
	width: 200px;
`;

const Input = styled.input`
	border-radius: 5px;
	border: 1px solid #bbb;
	height: 40px;
	padding: 0 10px;
`;

const Select = styled.select`
	background-color: white;
	border-radius: 5px;
	border: 1px solid #bbb;
	height: 40px;
	padding: 0 10px;
`;

const Label = styled.label``;

const Button = styled.button`
	background-color: #2c73d2;
	border-radius: 5px;
	border: none;
	color: white;
	cursor: pointer;
	height: 42px;
	padding: 10px;
`;

const Form = ({ getExams, onEdit, setOnEdit }) => {
	const ref = useRef();

	useEffect(() => {
		if (onEdit) {
			const exam = ref.current;

			exam.exame.value = onEdit.exame;
			exam.numeroDaCarteirinha.value = onEdit.numeroDaCarteirinha;
		}
	}, [onEdit]);

	const handleSubmit = async (item) => {
		item.preventDefault();

		const exam = ref.current;

		if (!exam.examName.value) {
			return toast.warn("Fill up all fields");
		}

		await axios
			.post(
				baseURL,
				{
					examName: {
						key: exam.examName.value,
					},
					number: exam.number.value,
					examStatus: {
						key: "pendente",
					},
					examDate: exam.date.value,
				},
				{
					headers: { Authorization: "Basic " + btoa("test@liferay.com:test") },
				},
			)
			.catch(({ data }) => console.log(data));

		exam.examName.value = "";
		exam.number.value = "";
		exam.date.value = "";

		setOnEdit(null);
		getExams();
	};

	return (
		<FormContainer ref={ref} onSubmit={handleSubmit}>
			<InputArea>
				<Label>Exame</Label>
				<Select name="examName">
					<option key="1" value="covid">
						Covid
					</option>
					<option key="2" value="hemograma">
						Hemograma
					</option>
					<option key="3" value="glicemia">
						Glicemia
					</option>
					<option key="4" value="colesterol">
						Colesterol
					</option>
					<option key="5" value="eletrocardiograma">
						Eletrocardiograma
					</option>
					<option key="6" value="ecocardiograma">
						Ecocardiograma
					</option>
				</Select>
			</InputArea>

			<InputArea>
				<Label>Numero do Plano</Label>
				<Input name="number" />
			</InputArea>

			<InputArea>
				<Label>Data de Realização</Label>
				<Input name="date" type="date" />
			</InputArea>

			<Button type="submit">Save</Button>
		</FormContainer>
	);
};

export default Form;