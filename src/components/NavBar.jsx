import axios from "axios";
const logo = require("../assets/logo_cb.png")

function NavBar({set_chat}) {
    const reset_chat = async (e) => {
        await axios({
            method: 'get',
            url: 'http://127.0.0.1:5000/api/chat/reset',
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((response) => {
            console.log(response.data.answer);
            set_chat([]);
        })
        .catch((error) => {
            console.error("Error: " + error);
        });

    }
    return (
        <div className="bg-neutral-800 border-r-2 p-10 border-r-neutral-700 text-center h-full bg-neutral-800">
            <div>
                <img src={logo}></img>
            </div>
            <button className="bg-red-500 text-white font-bold py-2 px-10 rounded hover:bg-red-700" onClick={reset_chat}>Reset</button>
        </div>
    );
}

export default NavBar;