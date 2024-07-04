import { Button, Input } from 'antd'
import React, { useState } from 'react'

const PracFire = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        number: ""

    })
    let name, value;

    const getUserData = (e) => {
        name = e.target.name;
        value = e.target.value;
        setUser({ ...user, [name]: value })
        console.log(user)
    }
    const postData = async (e) => {
        e.preventDefault()
        const { name,email, phone, number } = user;
        const res = await fetch(
            "https://fir-prac-2a2b5-default-rtdb.firebaseio.com/fire.json",
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    number,
                })
            }
        )
        if(res){
            setUser({
                name: "",
                email: "",
                phone: "",
                number: ""
            });
            alert("Data Posted Successfully")
        }
    }

return (
    <>
        <form method='post'>
            <div>
                <Input
                    type="name"
                    name="name"
                    placeholder="name"
                    required
                    value={user.name}
                    onChange={getUserData}
                />
            </div>
            <div>
                <Input
                    type="email"
                    name="email"
                    placeholder="name"
                    value={user.email}
                    onChange={getUserData}
                />
            </div>
            <div>
                <Input
                    type="number"
                    name="number"
                    placeholder="number"
                    value={user.number}
                    onChange={getUserData}
                />
            </div >
            <div>
                <Input
                    type="phone"
                    name="phone"
                    placeholder="phone"
                    value={user.phone}
                    onChange={getUserData}
                />
            </div >
            <div>
                <button onClick={postData}>
                    Submit
                </button>
            </div>
        </form >
    </>
)
}

export default PracFire
