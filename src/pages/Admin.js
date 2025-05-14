import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import fetchAuthorizedPage from "../services/fetchAuthorizedPage";
import BASE_URL from "../config";  // BASE_URL을 import

const Admin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [data, setData] = useState("");

    fetchAuthorizedPage(`${BASE_URL}/admin`, navigate, location)
        .then(result => setData(result));

    return data && <h2>{data}</h2>;
}

export default Admin;