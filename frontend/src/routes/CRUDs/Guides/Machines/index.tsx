import { Outlet } from "react-router-dom";

const Machines = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    );
}

export default Machines;