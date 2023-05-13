import {Navigate, useNavigate, useParams} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {

    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);
    const {setNotification} = useStateContext();
    const [user, setUser] = useState({
        id: null, name: '', email: '', password: '', password_confirmation: ''
    });

    const onSubmit = (evt) => {
        evt.preventDefault();
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated');
                    return navigate('/users');
                })
                .catch(errors => {
                    const response = errors.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setLoading(false);
                });
        } else {
            axiosClient.post(`/users`, user)
                .then(() => {
                    setNotification('User was successfully created');
                    return navigate('/users');
                })
                .catch(errors => {
                    const response = errors.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setLoading(false);
                });
        }
    };

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({data}) => {
                    setUser(data);
                    setLoading(false);
                })
                .catch(errors => {
                    const response = errors.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors);
                    }
                    setLoading(false);
                });
        }, []);
    }

    return (<>
        {user.id && <h1>Update user {user.name}</h1>}
        {!user.id && <h1>New user</h1>}
        <div className={'card animated fadeInDown'}>
            {loading && (<div className={'text-center'}>Loading...</div>)}
            {errors && <div className={'alert'}>
                {Object.keys(errors).map(key => (<p key={key}>{errors[key][0]}</p>))}
            </div>}
            {!loading && <form onSubmit={onSubmit}>
                <input type={"text"} onChange={evt => setUser({...user, name: evt.target.value})} value={user.name}
                       placeholder={'Name'}/>
                <input type={"email"} onChange={evt => setUser({...user, email: evt.target.value})} value={user.email}
                       placeholder={'Email'}/>
                <input type={"password"} onChange={evt => setUser({...user, password: evt.target.value})}
                       placeholder={'Password'}/>
                <input type={"password"} onChange={evt => setUser({...user, password_confirmation: evt.target.value})}
                       placeholder={'Password Confirmation'}/>
                <button className={'btn'}>Save</button>
            </form>}
        </div>
    </>);
}
