import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";

export default function DefaultLayout() {
    const {user, token, notification, setUser, setToken} = useStateContext();

    if (!token) {
        return <Navigate to={'/login'} />
    }

    const onLogout = (evt) => {
        evt.preventDefault();
        axiosClient.post('/logout')
            .then((response) => {
                setUser({});
                setToken(null);
            })
            .catch((response) => {
                console.log(response.data.errors)
            })
    };

    useEffect(() => {
        axiosClient.get('/user')
            .then(({data}) => {
                setUser(data);
            })
    }, []);

    return (
        <div id={'defaultLayout'}>
            <aside>
                <Link to={'/dashboard'}>Dashboard</Link>
                <Link to={'/users '}>Users</Link>
            </aside>
            <div className={'content'}>
                <header>
                    <div>
                        Header
                    </div>
                    <div>
                        {user.name}
                        <a href={'#'} onClick={onLogout} className={'btn-logout'}>Logout</a>
                    </div>
                </header>
                <main>
                    <Outlet />
                </main>
            </div>
            {notification && <div className={'notification'}>
                {notification}
            </div>}
        </div>
    );
}
