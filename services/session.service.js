class SessionService{
    constructor(httpClient){
        this.httpClient = httpClient;
    };
    

    keepAlive(server, sessionId){
        let url = `/${sessionId}?maxev=5`
        this.httpClient.get(url)

    }

}