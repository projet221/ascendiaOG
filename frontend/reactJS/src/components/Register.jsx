
function Login(){

    return (
        <>
            <div className="card bg-light">
                <div className="card-title">
                    <h2 className="text-gradient"> Inscription </h2>
                </div>
                <div className="card-body">
                    <input type={"text"} className="form-control my-3" placeholder="Nom"/>
                    <input type={"text"} className="form-control my-3" placeholder="Prenom"/>
                    <input type={"email"} className="form-control my-3" placeholder="Mail"/>
                    <input type={"number"} className="form-control my-3" placeholder="Numero mobile"/>
                    <input type={"password"} className={"form-control my-3"} placeholder="Password"/>
                    <input type={"password"} className={"form-control my-3"} placeholder="Password"/>
                    <button className={"btn btn-primary"} type="submit"> S'enregistrer</button>
                </div>
            </div>
        </>
    )
}

export default Login