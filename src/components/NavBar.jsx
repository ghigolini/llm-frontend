import { Button, Switch, Typography } from "@material-tailwind/react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
const logo = require("../assets/logo_cb.png");

function NavBar({ set_chat }) {
	const fileInputRef = useRef(null);
	const [fileNames, setFileNames] = useState([]);

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

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event) => {
    const files = event.target.files;
    if (files) {
      const names = Array.from(files).map(file => file.name);
      setFileNames(names);
    } else {
      setFileNames([]);
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
				<ul className="flex flex-col gap-5">
					<li>
						<Button className="bg-red-500 text-white font-bold px-10 py-2 rounded hover:bg-red-700" onClick={reset_chat}>
							Reset
						</Button>
					</li>
					<li>
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
					<li>
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
					<li>
						<form>
							<input multiple type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
							<Button className={`mb-5 ${fileInputRef !== null ? "bg-green-600" : "bg-black"}`} disabled={rag ? false : true} onClick={handleClick}>
								Select RAG files
							</Button>
							<div className="text-gray-50">
								{fileInputRef !== null ? "File uploaded" : "No file uploaded"}
							</div>
							{fileNames.length > 0 && (
								<ul className="space-y-1">
									{fileNames.map((name, index) => (
										<li key={index} className="break-words">
											<div className="bg-gray-700 p-2 rounded text-sm text-gray-50">
												{index+1}. {name}
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
