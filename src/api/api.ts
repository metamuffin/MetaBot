

type HTTPMethod = "GET"|"POST"|"DELETE"|"UPDATE"|"PUT"


export class API {
    public static endpoint:string = "https://discord.com/api/v6"

    static postBody(body:{[key:string]: string}){
        var s = ""
        for (const k in body) {
            if (s) s+="&"
            s += `${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`
        }
        return s;
    }

    static async apiRequest(path:string,method:HTTPMethod,body:{[key:string]: string}){
        var params = API.postBody(body);
        var resp = await fetch(API.endpoint + path, {
            method: method,
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }

        })
        return await resp.json()
    }
}
