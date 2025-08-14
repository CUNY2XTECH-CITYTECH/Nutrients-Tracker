import { Outlet } from "react-router-dom";
import { HeaderLogin } from "./src/Componets/HeaderLogin";
import { SideBar } from "./src/Componets/Sidebar";

export function Layout () {
    return (
        <>
            <HeaderLogin/>
            <div className="content-container">
                <main>
                    <Outlet/>
                </main>
            </div>
        </>
    )
}