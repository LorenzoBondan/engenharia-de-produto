import { Outlet } from "react-router-dom";

const CornerBrackets = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
}

export default CornerBrackets;