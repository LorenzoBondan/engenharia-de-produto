import { Outlet } from "react-router-dom";

const ComponentCategories = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
}

export default ComponentCategories;