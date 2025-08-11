import { Outlet } from "react-router-dom";
import { HeaderLogin } from "./src/Componets/HeaderLogin";

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