import React, { useEffect, useState } from "react";
import "./App.css";
import { api } from "./config/api";

function App() {
	const [data, setData] = useState<number>(0);
	const [text, setText] = useState<string>("");

	const sendReq = (count: number) => {
		api.post("/fizzbuzz", { count }).then((res: any) => {
			setText(res.message);
		});
	};

	useEffect(() => {
		sendReq(data);
	}, [data]);

	const handleClick = () => {
		const newData = data + 1;
		setData(newData);
	};

	return (
		<div className="app">
			<div className="content">
				Your count <br />
				<span className="count">{data}</span>
				<button className="btn" onClick={handleClick}>
					Push me!
				</button>
				<div className="text">{text}</div>
			</div>
		</div>
	);
}

export default App;
