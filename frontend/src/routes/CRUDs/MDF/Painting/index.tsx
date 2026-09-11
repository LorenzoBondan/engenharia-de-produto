import { Outlet } from "react-router-dom";

const Paintings = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
}

export default Paintings;
