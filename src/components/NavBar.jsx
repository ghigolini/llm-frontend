import { Button, Switch, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
const logo = require("../assets/logo_cb.png");

function NavBar({ set_chat }) {
	const fileInputRef = useRef(null);
	const [files, setFiles] = useState([]);
	const [fileNames, setFileNames] = useState([]);
	const [fileUploaded, setFileUploaded] = useState(false);
	const [fileUploading, setFileUploading] = useState(false);

	const reset_chat = async (e) => {
		await axios({
			method: "get",
			url: "http://127.0.0.1:5000/api/chat/reset",
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				console.log(response.data);
				set_chat([]);
			})
			.catch((error) => {
				console.error("Error: " + error);
			});
	};

	const handleClick = async (e) => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e) => {
		setFileUploaded(false);
		setFileUploading(true);
		const selectedFiles = e.target.files;
		if (selectedFiles.length > 0) {
			setFiles(selectedFiles);
			const names = Array.from(selectedFiles).map((file) => file.name);
			setFileNames(names);

			const formData = new FormData();
			for (let i = 0; i < selectedFiles.length; i++) {
				formData.append("files", selectedFiles[i]);
			}

			axios
				.post("http://127.0.0.1:5000/api/chat/set-rag-files", formData)
				.then((response) => {
					setFileUploaded(true);
					setFileUploading(false);
					setFileUploaded(response.data.uploaded);
				})
				.catch((error) => {
					console.error(error);
					setFileUploading(false);
					setFileUploaded(false);
				});
		}
	};

	const [guardrails, setGuardrails] = useState(false);
	const [rag, setRag] = useState(false);

	useEffect(() => {
		axios({
			method: "post",
			url: "http://127.0.0.1:5000/api/chat/guardrails",
			data: { value: guardrails },
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error: " + error);
			});
	}, [guardrails]);

	useEffect(() => {
		axios({
			method: "post",
			url: "http://127.0.0.1:5000/api/chat/rag",
			data: { value: rag },
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				console.log(response.data);
			})
			.catch((error) => {
				console.error("Error: " + error);
			});
	}, [rag]);

	const ragApiCall = (e) => {
		e.preventDefault();

		axios({
			method: "post",
			url: "http://127.0.0.1:5000/api/chat/rag",
			data: { value: rag },
			headers: { "Content-Type": "multipart/form-data" },
		})
			.then((response) => {
				console.log(response.data.answer);
			})
			.catch((error) => {
				console.error("Error: " + error);
			});
	};

	return (
		<div className="bg-gray-800 border-r-2 p-10 border-r-gray-700 h-full bg-gray-800">
			<div>
				<img src={logo} alt="Logo"></img>
			</div>
			<div className="flex justify-center min-h-screen">
				<ul className="flex flex-col space-y-4 w-full">
					<li className="mb-5 flex justify-center">
						<Button className="bg-red-500 text-white font-bold px-10 py-2 rounded hover:bg-red-700" onClick={reset_chat}>
							Reset
						</Button>
					</li>
					<li className="ml-10">
						<Switch
							color="green"
							label={
								<div>
									<Typography className="text-gray-50 font-xl">Guardrails</Typography>
								</div>
							}
							onClick={() => {
								setGuardrails(!guardrails);
							}}
						/>
					</li>
					<li className="ml-10">
						<Switch
							color="green"
							label={
								<div>
									<Typography className="text-gray-50 font-xl" onClick={ragApiCall}>
										RAG
									</Typography>
								</div>
							}
							onClick={() => {
								setRag(!rag);
							}}
						/>
					</li>
					<li className="flex justify-center">
						<form className="mt-5">
							<input multiple type="file" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
							<div className="flex justify-center">
								<Button className={`mb-5 ${fileUploaded ? "bg-green-600" : "bg-black"}`} disabled={rag ? false : true} type="button" onClick={handleClick}>
									Select RAG files
								</Button>
							</div>

							<div className="text-gray-50 flex justify-center mb-3">{fileUploading ? "File uploading..." : fileUploaded ? "File uploaded!" : "No file uploaded"}</div>
							{fileNames.length > 0 && (
								<ul className="space-y-1 max-h-96 overflow-y-auto w-full max-w-md px-2 rounded">
									{fileNames.map((name, index) => (
										<li key={index}>
											<div className={`bg-gray-700 p-2 rounded text-sm text-gray-50 break-words whitespace-pre-wrap ${fileUploaded ? "bg-green-600" : "bg-black"}`}>
												{name}
											</div>
										</li>
									))}
								</ul>
							)}
						</form>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default NavBar;
